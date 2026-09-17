package main

import (
	"context"
	"district-blood-matching/internal/api"
	"district-blood-matching/internal/store"
	"errors"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"
	"time"
)

func main() {
	portFlag := flag.String("port", "8080", "Server HTTP port")
	dbFlag := flag.String("db", "blood_matching.db", "Path to SQLite database file")
	frontendFlag := flag.String("frontend", "frontend/dist", "Path to frontend static assets")
	flag.Parse()

	port := os.Getenv("PORT")
	if port == "" {
		port = *portFlag
	}

	dbPath := os.Getenv("DATABASE_PATH")
	if dbPath == "" {
		dbPath = *dbFlag
	}

	frontendDir := os.Getenv("FRONTEND_DIR")
	if frontendDir == "" {
		frontendDir = *frontendFlag
	}

	log.Printf("Starting District Blood Donor Matching Service on port %s", port)
	log.Printf("Opening SQLite storage at %s", dbPath)

	st, err := store.NewStore(dbPath)
	if err != nil {
		log.Fatalf("Fatal: failed to initialize storage: %v", err)
	}
	defer st.Close()

	handler := api.NewHandler(st)
	mux := http.NewServeMux()

	// REST API Routes
	mux.HandleFunc("/api/health", handler.Health)
	mux.HandleFunc("/api/stats", handler.GetStats)
	mux.HandleFunc("/api/donors", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			handler.CreateDonor(w, r)
			return
		}
		handler.GetDonors(w, r)
	})
	mux.HandleFunc("/api/audit-logs", handler.GetAuditLogs)

	// Blood Requests endpoints
	mux.HandleFunc("/api/requests", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			handler.CreateRequest(w, r)
			return
		}
		handler.GetRequests(w, r)
	})

	// Subroutes under /api/requests/
	mux.HandleFunc("/api/requests/", func(w http.ResponseWriter, r *http.Request) {
		trimmed := strings.TrimPrefix(r.URL.Path, "/api/requests/")
		parts := strings.Split(trimmed, "/")

		if len(parts) == 1 && parts[0] != "" {
			handler.GetRequest(w, r)
			return
		}

		if len(parts) >= 2 {
			action := parts[1]
			switch action {
			case "match":
				if r.Method == http.MethodPost {
					handler.MatchRequest(w, r)
					return
				}
			case "dispatch":
				if r.Method == http.MethodPost {
					handler.DispatchCandidate(w, r)
					return
				}
			case "accepted-donors":
				handler.GetAcceptedDonors(w, r)
				return
			}
		}

		http.NotFound(w, r)
	})

	// Donor response portal routes
	mux.HandleFunc("/api/donor/dispatch/", func(w http.ResponseWriter, r *http.Request) {
		trimmed := strings.TrimPrefix(r.URL.Path, "/api/donor/dispatch/")
		parts := strings.Split(trimmed, "/")

		if len(parts) == 1 && parts[0] != "" {
			handler.GetDonorDispatch(w, r)
			return
		}

		if len(parts) >= 2 && parts[1] == "respond" {
			if r.Method == http.MethodPost {
				handler.RespondToDispatch(w, r)
				return
			}
		}

		http.NotFound(w, r)
	})

	// Frontend SPA Serving
	serveStaticSPA(mux, frontendDir)

	// Wrap with CORS & Logging
	server := &http.Server{
		Addr:         ":" + port,
		Handler:      api.EnableCORS(mux),
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("Server listening on http://localhost:%s", port)
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("HTTP server error: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server gracefully...")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Printf("Server forced shutdown error: %v", err)
	}

	log.Println("Server stopped cleanly.")
}

func serveStaticSPA(mux *http.ServeMux, distDir string) {
	absDist, err := filepath.Abs(distDir)
	if err != nil {
		absDist = distDir
	}

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Do not interfere with API routes
		if strings.HasPrefix(r.URL.Path, "/api/") {
			http.NotFound(w, r)
			return
		}

		cleanPath := filepath.Clean(r.URL.Path)
		requestedFile := filepath.Join(absDist, cleanPath)

		info, err := os.Stat(requestedFile)
		if err == nil && !info.IsDir() {
			http.ServeFile(w, r, requestedFile)
			return
		}

		// Fallback to index.html for Single Page Application client-side routing
		indexFile := filepath.Join(absDist, "index.html")
		if _, err := os.Stat(indexFile); err == nil {
			http.ServeFile(w, r, indexFile)
			return
		}

		// If frontend is not built yet, output a helpful status page
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		fmt.Fprintf(w, `<!DOCTYPE html>
<html>
<head><title>District Blood Donor Matching API</title></head>
<body style="font-family: sans-serif; padding: 40px; line-height: 1.6;">
  <h2>District Blood Donor Matching Service (SC-12)</h2>
  <p>The backend API is running successfully on port 8080.</p>
  <p>To access the complete frontend UI, build the frontend or run the Vite development server.</p>
  <p>Available endpoints: <a href="/api/health">/api/health</a> | <a href="/api/requests">/api/requests</a> | <a href="/api/stats">/api/stats</a> | <a href="/api/donors">/api/donors</a></p>
</body>
</html>`)
	})
}
