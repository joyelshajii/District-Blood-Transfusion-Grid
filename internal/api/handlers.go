package api

import (
	"crypto/rand"
	"district-blood-matching/internal/matching"
	"district-blood-matching/internal/models"
	"district-blood-matching/internal/store"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type Handler struct {
	store *store.Store
}

func NewHandler(s *store.Store) *Handler {
	return &Handler{store: s}
}

// EnableCORS sets standard headers for cross-origin requests
func EnableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func generateToken(length int) string {
	b := make([]byte, length)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}

// Health checks system operational readiness
func (h *Handler) Health(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{
		"status":    "healthy",
		"service":   "District Blood Donor Coordination API",
		"district":  "Ernakulam",
		"version":   "1.0.0",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// GetStats returns district-wide donor and spam-prevention metrics
func (h *Handler) GetStats(w http.ResponseWriter, r *http.Request) {
	now := time.Now()
	stats, err := h.store.GetDistrictStats(now)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, stats)
}

// GetRequests lists all blood requests
func (h *Handler) GetRequests(w http.ResponseWriter, r *http.Request) {
	requests, err := h.store.GetAllRequests()
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, requests)
}

// GetRequest returns a single blood request by ID
func (h *Handler) GetRequest(w http.ResponseWriter, r *http.Request) {
	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) < 3 {
		http.Error(w, "invalid request path", http.StatusBadRequest)
		return
	}
	reqID := pathParts[2]

	req, err := h.store.GetRequestByID(reqID)
	if err != nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "request not found"})
		return
	}
	writeJSON(w, http.StatusOK, req)
}

// CreateRequest creates a new hospital blood requisition
func (h *Handler) CreateRequest(w http.ResponseWriter, r *http.Request) {
	var input models.BloodRequest
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload: " + err.Error()})
		return
	}

	if input.HospitalName == "" || input.BloodGroup == "" || input.UnitsRequired <= 0 {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "hospital_name, blood_group, and units_required are mandatory"})
		return
	}

	now := time.Now()
	idToken := generateToken(4)
	input.ID = "req-" + idToken
	if input.CaseNumber == "" {
		input.CaseNumber = fmt.Sprintf("REQ-EKM-2026-%s", strings.ToUpper(idToken))
	}
	if input.HospitalDistrict == "" {
		input.HospitalDistrict = "Ernakulam"
	}
	if input.Component == "" {
		input.Component = "Whole Blood"
	}
	if input.UrgencyLevel == "" {
		input.UrgencyLevel = "Urgent"
	}
	if input.Latitude == 0 && input.Longitude == 0 {
		// Default to Ernakulam Central coordinates
		input.Latitude = 9.9816
		input.Longitude = 76.2810
	}
	input.Status = "OPEN"
	input.CreatedAt = now.Format(time.RFC3339)
	if input.RequiredBy == "" {
		input.RequiredBy = now.Add(6 * time.Hour).Format(time.RFC3339)
	}

	if err := h.store.CreateRequest(input); err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	_ = h.store.RecordAudit(models.AuditLog{
		ID:          "audit-" + generateToken(4),
		Timestamp:   now.Format(time.RFC3339),
		Action:      "REQUEST_CREATED",
		TargetID:    input.ID,
		PerformedBy: input.HospitalName,
		Details:     fmt.Sprintf("Created case %s for %d units of %s %s", input.CaseNumber, input.UnitsRequired, input.BloodGroup, input.Component),
	})

	writeJSON(w, http.StatusCreated, input)
}

// MatchRequest evaluates registered donors against hospital request
func (h *Handler) MatchRequest(w http.ResponseWriter, r *http.Request) {
	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) < 4 {
		http.Error(w, "invalid request path", http.StatusBadRequest)
		return
	}
	reqID := pathParts[2]

	req, err := h.store.GetRequestByID(reqID)
	if err != nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "request not found"})
		return
	}

	// Optional radius query parameter
	radiusKm := 25.0
	if rQuery := r.URL.Query().Get("radius"); rQuery != "" {
		if val, err := strconv.ParseFloat(rQuery, 64); err == nil && val > 0 {
			radiusKm = val
		}
	}

	donors, err := h.store.GetAllDonors()
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	analysis := matching.FilterAndRankCandidates(*req, donors, radiusKm, time.Now())

	// Fetch any existing dispatches for this request to annotate status
	dispatches, _ := h.store.GetDispatchesByRequestID(reqID)
	dispatchMap := make(map[string]models.DispatchRecord)
	for _, dp := range dispatches {
		dispatchMap[dp.DonorID] = dp
	}

	for i := range analysis.EligibleCandidates {
		donorID := analysis.EligibleCandidates[i].DonorID
		if dp, exists := dispatchMap[donorID]; exists {
			analysis.EligibleCandidates[i].DispatchStatus = dp.Status
			analysis.EligibleCandidates[i].DispatchToken = dp.Token
		}
	}

	writeJSON(w, http.StatusOK, analysis)
}

// DispatchCandidate sends an anonymized notification token to selected candidate(s)
func (h *Handler) DispatchCandidate(w http.ResponseWriter, r *http.Request) {
	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) < 4 {
		http.Error(w, "invalid request path", http.StatusBadRequest)
		return
	}
	reqID := pathParts[2]

	var body struct {
		DonorIDs []string `json:"donor_ids"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}

	if len(body.DonorIDs) == 0 {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "donor_ids list cannot be empty"})
		return
	}

	req, err := h.store.GetRequestByID(reqID)
	if err != nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "request not found"})
		return
	}

	now := time.Now()
	dispatchedTokens := make([]map[string]string, 0)

	for _, donorID := range body.DonorIDs {
		donor, err := h.store.GetDonorByID(donorID)
		if err != nil {
			continue
		}

		token := generateToken(16)
		dispatchID := "disp-" + generateToken(6)

		rec := models.DispatchRecord{
			ID:              dispatchID,
			RequestID:       req.ID,
			DonorID:         donor.ID,
			Token:           token,
			Status:          "NOTIFIED",
			NotifiedAt:      now.Format(time.RFC3339),
			ContactRevealed: false,
		}

		if err := h.store.SaveDispatch(rec); err != nil {
			continue
		}

		_ = h.store.RecordAudit(models.AuditLog{
			ID:          "audit-" + generateToken(4),
			Timestamp:   now.Format(time.RFC3339),
			Action:      "ANONYMOUS_DISPATCH",
			TargetID:    donor.CodeName,
			PerformedBy: req.HospitalName,
			Details:     fmt.Sprintf("Dispatched private notification to %s for case %s (contact remains locked)", donor.CodeName, req.CaseNumber),
		})

		dispatchedTokens = append(dispatchedTokens, map[string]string{
			"donor_id":   donor.ID,
			"code_name":  donor.CodeName,
			"token":      token,
			"portal_url": fmt.Sprintf("/donor-portal?token=%s", token),
		})
	}

	_ = h.store.UpdateRequestStatus(req.ID, "DISPATCHED")

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"message":    fmt.Sprintf("Dispatched private notifications to %d eligible candidates", len(dispatchedTokens)),
		"request_id": req.ID,
		"dispatches": dispatchedTokens,
	})
}

// GetDonorDispatch returns the donor's view of an invitation.
// Crucially, the donor's contact is NOT revealed yet; donor sees the hospital urgency details.
func (h *Handler) GetDonorDispatch(w http.ResponseWriter, r *http.Request) {
	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) < 4 {
		http.Error(w, "invalid path", http.StatusBadRequest)
		return
	}
	token := pathParts[3]

	dispatch, err := h.store.GetDispatchByToken(token)
	if err != nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "dispatch token invalid or expired"})
		return
	}

	req, err := h.store.GetRequestByID(dispatch.RequestID)
	if err != nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "associated request not found"})
		return
	}

	donor, err := h.store.GetDonorByID(dispatch.DonorID)
	if err != nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "donor profile not found"})
		return
	}

	distanceKm := matching.CalculateDistanceKm(req.Latitude, req.Longitude, donor.Latitude, donor.Longitude)
	isEligible, daysSince, reqInterval, remainingCooldown, _ := matching.EvaluateEligibility(*donor, time.Now())

	response := map[string]interface{}{
		"dispatch_id":             dispatch.ID,
		"token":                   dispatch.Token,
		"status":                  dispatch.Status,
		"notified_at":             dispatch.NotifiedAt,
		"responded_at":            dispatch.RespondedAt,
		"hospital_name":           req.HospitalName,
		"hospital_district":       req.HospitalDistrict,
		"hospital_taluk":          req.HospitalTaluk,
		"blood_group_required":    req.BloodGroup,
		"component":               req.Component,
		"units_required":          req.UnitsRequired,
		"urgency_level":           req.UrgencyLevel,
		"doctor_notes":            req.DoctorNotes,
		"required_by":             req.RequiredBy,
		"distance_km":             distanceKm,
		"donor_code_name":         donor.CodeName,
		"donor_blood_group":       donor.BloodGroup,
		"days_since_last":         daysSince,
		"required_interval_days":  reqInterval,
		"remaining_cooldown_days": remainingCooldown,
		"is_interval_eligible":    isEligible,
		"privacy_protection":      "Your full name, phone number, and address are strictly masked from the hospital coordinator until you click Accept.",
	}

	writeJSON(w, http.StatusOK, response)
}

// RespondToDispatch allows the donor to accept or decline the private request
func (h *Handler) RespondToDispatch(w http.ResponseWriter, r *http.Request) {
	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) < 4 {
		http.Error(w, "invalid path", http.StatusBadRequest)
		return
	}
	token := pathParts[3]

	dispatch, err := h.store.GetDispatchByToken(token)
	if err != nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "dispatch token not found"})
		return
	}

	var body struct {
		Action    string `json:"action"` // "ACCEPT" or "DECLINE"
		DonorNote string `json:"donor_note"`
		ETA       string `json:"estimated_eta"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}

	action := strings.ToUpper(strings.TrimSpace(body.Action))
	if action != "ACCEPT" && action != "DECLINE" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "action must be either ACCEPT or DECLINE"})
		return
	}

	now := time.Now()
	dispatch.RespondedAt = now.Format(time.RFC3339)
	dispatch.DonorNote = body.DonorNote

	donor, _ := h.store.GetDonorByID(dispatch.DonorID)
	req, _ := h.store.GetRequestByID(dispatch.RequestID)

	if action == "ACCEPT" {
		dispatch.Status = "ACCEPTED"
		// Unmask contact details exclusively upon acceptance
		dispatch.ContactRevealed = true
		_ = h.store.SaveDispatch(*dispatch)
		_ = h.store.UpdateRequestStatus(dispatch.RequestID, "ACCEPTED")

		_ = h.store.RecordAudit(models.AuditLog{
			ID:          "audit-" + generateToken(4),
			Timestamp:   now.Format(time.RFC3339),
			Action:      "DONOR_ACCEPTED_UNMASK",
			TargetID:    dispatch.DonorID,
			PerformedBy: donor.CodeName,
			Details:     fmt.Sprintf("Donor %s voluntarily accepted requisition %s. Contact unmasked to %s.", donor.CodeName, req.CaseNumber, req.HospitalName),
		})

		writeJSON(w, http.StatusOK, map[string]interface{}{
			"message":          "Donation accepted. Contact details shared securely with hospital coordinator.",
			"status":           "ACCEPTED",
			"case_number":      req.CaseNumber,
			"hospital_name":    req.HospitalName,
			"contact_revealed": true,
			"hospital_desk":    "+91 484 2361250 (Blood Bank Desk, Ernakulam)",
			"instructions":     "Please report to Blood Bank counter with government photo ID.",
		})
		return
	}

	// Declined: strictly preserve donor privacy
	dispatch.Status = "DECLINED"
	dispatch.ContactRevealed = false
	_ = h.store.SaveDispatch(*dispatch)

	_ = h.store.RecordAudit(models.AuditLog{
		ID:          "audit-" + generateToken(4),
		Timestamp:   now.Format(time.RFC3339),
		Action:      "DONOR_DECLINED_PRIVATE",
		TargetID:    donor.CodeName,
		PerformedBy: donor.CodeName,
		Details:     fmt.Sprintf("Donor %s declined request %s. Contact remained 100%% private. Auto-cascading to next candidate.", donor.CodeName, req.CaseNumber),
	})

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"message":          "Request declined. Your contact information was kept completely private.",
		"status":           "DECLINED",
		"contact_revealed": false,
	})
}

// GetAcceptedDonors returns unmasked contact details exclusively for donors who accepted
func (h *Handler) GetAcceptedDonors(w http.ResponseWriter, r *http.Request) {
	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) < 4 {
		http.Error(w, "invalid path", http.StatusBadRequest)
		return
	}
	reqID := pathParts[2]

	contacts, err := h.store.GetAcceptedContactsForRequest(reqID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	writeJSON(w, http.StatusOK, contacts)
}

// GetDonors returns registered donors. Personal contact fields are stripped for public inspection.
func (h *Handler) GetDonors(w http.ResponseWriter, r *http.Request) {
	donors, err := h.store.GetAllDonors()
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	// Always mask sensitive personal phone and email in public listing
	masked := make([]models.Donor, len(donors))
	for i, d := range donors {
		m := d
		m.FullName = maskName(d.FullName)
		m.Phone = maskPhone(d.Phone)
		m.Email = maskEmail(d.Email)
		masked[i] = m
	}

	writeJSON(w, http.StatusOK, masked)
}

// CreateDonor registers a new community donor with strict privacy defaults
func (h *Handler) CreateDonor(w http.ResponseWriter, r *http.Request) {
	var d models.Donor
	if err := json.NewDecoder(r.Body).Decode(&d); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload: " + err.Error()})
		return
	}

	if d.FullName == "" || d.Phone == "" || d.BloodGroup == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "full_name, phone, and blood_group are required"})
		return
	}

	now := time.Now()
	code := fmt.Sprintf("DONOR-EKM-%d", 200+now.Nanosecond()%800)
	d.ID = "donor-" + generateToken(4)
	d.CodeName = code
	if d.District == "" {
		d.District = "Ernakulam"
	}
	if d.Taluk == "" {
		d.Taluk = "Kanayannur"
	}
	if d.Latitude == 0 && d.Longitude == 0 {
		d.Latitude = 9.9816
		d.Longitude = 76.2810
	}
	if d.LastDonationComponent == "" {
		d.LastDonationComponent = "Whole Blood"
	}
	d.IsActive = true
	d.CreatedAt = now.Format(time.RFC3339)

	if err := h.store.CreateDonor(d); err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	_ = h.store.RecordAudit(models.AuditLog{
		ID:          "audit-" + generateToken(4),
		Timestamp:   now.Format(time.RFC3339),
		Action:      "DONOR_REGISTERED",
		TargetID:    d.CodeName,
		PerformedBy: "Donor Portal",
		Details:     fmt.Sprintf("Registered new donor with private contact token %s (%s)", d.CodeName, d.BloodGroup),
	})

	writeJSON(w, http.StatusCreated, map[string]interface{}{
		"message":   "Donor profile created successfully. Contact details are secured by default.",
		"code_name": d.CodeName,
		"id":        d.ID,
	})
}

// GetAuditLogs returns privacy audit events
func (h *Handler) GetAuditLogs(w http.ResponseWriter, r *http.Request) {
	limit := 30
	if lQuery := r.URL.Query().Get("limit"); lQuery != "" {
		if val, err := strconv.Atoi(lQuery); err == nil {
			limit = val
		}
	}

	logs, err := h.store.GetRecentAuditLogs(limit)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, logs)
}

func maskName(name string) string {
	parts := strings.Split(name, " ")
	if len(parts) == 0 {
		return "Volunteer Donor"
	}
	first := parts[0]
	if len(first) <= 2 {
		return first + " ***"
	}
	return first[:2] + strings.Repeat("*", len(first)-2) + " " + strings.Repeat("*", 4)
}

func maskPhone(phone string) string {
	if len(phone) < 6 {
		return "+91 *******"
	}
	return phone[:6] + " **** " + phone[len(phone)-2:]
}

func maskEmail(email string) string {
	atIdx := strings.Index(email, "@")
	if atIdx <= 1 {
		return "***@***.com"
	}
	return email[:2] + "***" + email[atIdx:]
}
