# Multi-stage Dockerfile for District Blood Donor Matching System

# Stage 1: Build the React TypeScript frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Go backend binary
FROM golang:1.24-alpine AS backend-builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . ./
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /app/server .

# Stage 3: Minimal production container
FROM alpine:3.21
RUN apk --no-cache add ca-certificates tzdata
WORKDIR /app
COPY --from=backend-builder /app/server /app/server
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

ENV PORT=8080
ENV DATABASE_PATH=/app/data/blood_matching.db
ENV FRONTEND_DIR=/app/frontend/dist

RUN mkdir -p /app/data

EXPOSE 8080

VOLUME ["/app/data"]

CMD ["/app/server"]
