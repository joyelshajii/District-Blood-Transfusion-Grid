package store

import (
	"district-blood-matching/internal/models"
	"os"
	"testing"
	"time"
)

func TestStoreWorkflow(t *testing.T) {
	testDb := "test_blood.db"
	_ = os.Remove(testDb)
	defer os.Remove(testDb)

	st, err := NewStore(testDb)
	if err != nil {
		t.Fatalf("Failed to create store: %v", err)
	}
	defer st.Close()

	// Verify seed requests
	requests, err := st.GetAllRequests()
	if err != nil {
		t.Fatalf("Failed to get requests: %v", err)
	}
	if len(requests) == 0 {
		t.Fatalf("Expected seed requests, got 0")
	}

	reqID := requests[0].ID

	// Create dispatch
	disp := models.DispatchRecord{
		ID:              "disp-test-1",
		RequestID:       reqID,
		DonorID:         "donor-001",
		Token:           "test-token-123",
		Status:          "NOTIFIED",
		NotifiedAt:      time.Now().Format(time.RFC3339),
		ContactRevealed: false,
	}
	if err := st.SaveDispatch(disp); err != nil {
		t.Fatalf("SaveDispatch failed: %v", err)
	}

	// Fetch dispatch
	d, err := st.GetDispatchByToken("test-token-123")
	if err != nil {
		t.Fatalf("GetDispatchByToken failed: %v", err)
	}
	if d.Status != "NOTIFIED" {
		t.Errorf("Expected status NOTIFIED, got %s", d.Status)
	}

	// Update to ACCEPTED
	d.Status = "ACCEPTED"
	d.ContactRevealed = true
	d.RespondedAt = time.Now().Format(time.RFC3339)
	d.DonorNote = "Arriving soon"
	if err := st.SaveDispatch(*d); err != nil {
		t.Fatalf("Update SaveDispatch failed: %v", err)
	}

	// Fetch accepted contacts
	contacts, err := st.GetAcceptedContactsForRequest(reqID)
	if err != nil {
		t.Fatalf("GetAcceptedContactsForRequest failed: %v", err)
	}
	if len(contacts) == 0 {
		t.Fatalf("Expected 1 accepted contact, got 0")
	}
	if contacts[0].FullName != "Arun Narayanan" {
		t.Errorf("Expected Arun Narayanan, got %s", contacts[0].FullName)
	}
	if contacts[0].Phone != "+91 94471 23891" {
		t.Errorf("Expected phone +91 94471 23891, got %s", contacts[0].Phone)
	}
}
