package matching

import (
	"district-blood-matching/internal/models"
	"testing"
	"time"
)

func TestBloodCompatibility(t *testing.T) {
	tests := []struct {
		donor      string
		recipient  string
		component  string
		compatible bool
	}{
		{"O-", "A+", "Whole Blood", true},
		{"O-", "O-", "Whole Blood", true},
		{"O+", "O-", "Whole Blood", false},
		{"O+", "B+", "Whole Blood", true},
		{"B+", "A+", "Whole Blood", false},
		{"AB+", "AB+", "Whole Blood", true},
		{"AB+", "O+", "Whole Blood", false},
		{"A-", "AB+", "Whole Blood", true},
		{"AB+", "O+", "Platelets", true},
		{"B-", "A+", "Platelets", false},
	}

	for _, tt := range tests {
		got := IsBloodCompatible(tt.donor, tt.recipient, tt.component)
		if got != tt.compatible {
			t.Errorf("IsBloodCompatible(%s, %s, %s) = %v; want %v", tt.donor, tt.recipient, tt.component, got, tt.compatible)
		}
	}
}

func TestEvaluateEligibilityInterval(t *testing.T) {
	refTime, _ := time.Parse("2006-01-02", "2026-09-17")

	// Donor 1: Male who donated 89 days ago (cooldown is 90 days) -> should be ineligible
	d1 := models.Donor{
		Gender:                "M",
		LastDonationDate:      "2026-06-20", // 89 days ago
		LastDonationComponent: "Whole Blood",
		DateOfBirth:           "1995-05-10",
		WeightKg:              68,
	}
	isEligible1, _, _, remaining1, _ := EvaluateEligibility(d1, refTime)
	if isEligible1 {
		t.Errorf("Expected donor 1 to be ineligible due to 89-day interval, but got eligible")
	}
	if remaining1 != 1 {
		t.Errorf("Expected remaining cooldown of 1 day, got %d", remaining1)
	}

	// Donor 2: Male who donated 95 days ago -> should be eligible
	d2 := models.Donor{
		Gender:                "M",
		LastDonationDate:      "2026-06-14", // 95 days ago
		LastDonationComponent: "Whole Blood",
		DateOfBirth:           "1995-05-10",
		WeightKg:              68,
	}
	isEligible2, _, _, remaining2, _ := EvaluateEligibility(d2, refTime)
	if !isEligible2 {
		t.Errorf("Expected donor 2 to be eligible after 95 days, got ineligible")
	}
	if remaining2 != 0 {
		t.Errorf("Expected remaining cooldown of 0 days, got %d", remaining2)
	}

	// Donor 3: Female who donated 100 days ago (female cooldown is 120 days) -> should be ineligible
	d3 := models.Donor{
		Gender:                "F",
		LastDonationDate:      "2026-06-09", // 100 days ago
		LastDonationComponent: "Whole Blood",
		DateOfBirth:           "1998-02-15",
		WeightKg:              55,
	}
	isEligible3, _, _, remaining3, _ := EvaluateEligibility(d3, refTime)
	if isEligible3 {
		t.Errorf("Expected female donor 3 to be ineligible (100 < 120), got eligible")
	}
	if remaining3 != 20 {
		t.Errorf("Expected remaining cooldown of 20 days, got %d", remaining3)
	}
}

func TestCalculateDistanceKm(t *testing.T) {
	// Ernakulam General Hospital (9.9816, 76.2810) to Aluva Taluk Hospital (10.1076, 76.3533)
	// Known approximate distance ~ 16 km
	dist := CalculateDistanceKm(9.9816, 76.2810, 10.1076, 76.3533)
	if dist < 14.0 || dist > 18.0 {
		t.Errorf("Calculated distance between Kochi and Aluva unexpected: got %v km", dist)
	}
}
