package matching

import (
	"district-blood-matching/internal/models"
	"math"
	"sort"
	"strconv"
	"strings"
	"time"
)

const (
	EarthRadiusKm = 6371.0

	// Indian National Blood Transfusion Council (NBTC) clinical intervals
	MaleWholeBloodCooldownDays   = 90
	FemaleWholeBloodCooldownDays = 120
	PlateletApheresisCooldownDays = 14
	PlasmaCooldownDays           = 28

	MinimumAgeYears  = 18
	MaximumAgeYears  = 65
	MinimumWeightKg  = 45.0
	ApheresisWeightKg = 50.0
)

// CalculateDistanceKm computes the great-circle distance between two coordinates in kilometers.
func CalculateDistanceKm(lat1, lon1, lat2, lon2 float64) float64 {
	dLat := (lat2 - lat1) * (math.Pi / 180.0)
	dLon := (lon2 - lon1) * (math.Pi / 180.0)

	rLat1 := lat1 * (math.Pi / 180.0)
	rLat2 := lat2 * (math.Pi / 180.0)

	a := math.Sin(dLat/2)*math.Sin(dLat/2) +
		math.Cos(rLat1)*math.Cos(rLat2)*math.Sin(dLon/2)*math.Sin(dLon/2)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	distance := EarthRadiusKm * c
	// Round to one decimal place
	return math.Round(distance*10) / 10
}

// IsBloodCompatible checks if a donor blood group is compatible for a recipient request.
func IsBloodCompatible(donorGroup, recipientGroup, component string) bool {
	donorGroup = strings.TrimSpace(strings.ToUpper(donorGroup))
	recipientGroup = strings.TrimSpace(strings.ToUpper(recipientGroup))

	// Exact match is always valid
	if donorGroup == recipientGroup {
		return true
	}

	// Platelets / Plasma vs Whole Blood / PRBC compatibility
	switch strings.ToLower(component) {
	case "platelets", "plasma", "ffp":
		// Plasma compatibility: AB is universal donor
		switch recipientGroup {
		case "O+", "O-":
			return true // O recipients can receive plasma from O, A, B, AB
		case "A+", "A-":
			return donorGroup == "A+" || donorGroup == "A-" || donorGroup == "AB+" || donorGroup == "AB-"
		case "B+", "B-":
			return donorGroup == "B+" || donorGroup == "B-" || donorGroup == "AB+" || donorGroup == "AB-"
		case "AB+", "AB-":
			return donorGroup == "AB+" || donorGroup == "AB-"
		}
	default:
		// Red Blood Cell / Whole Blood compatibility: O- is universal donor
		switch recipientGroup {
		case "O-":
			return donorGroup == "O-"
		case "O+":
			return donorGroup == "O+" || donorGroup == "O-"
		case "A-":
			return donorGroup == "A-" || donorGroup == "O-"
		case "A+":
			return donorGroup == "A+" || donorGroup == "A-" || donorGroup == "O+" || donorGroup == "O-"
		case "B-":
			return donorGroup == "B-" || donorGroup == "O-"
		case "B+":
			return donorGroup == "B+" || donorGroup == "B-" || donorGroup == "O+" || donorGroup == "O-"
		case "AB-":
			return donorGroup == "AB-" || donorGroup == "A-" || donorGroup == "B-" || donorGroup == "O-"
		case "AB+":
			return true // Universal recipient
		}
	}

	return false
}

// EvaluateEligibility inspects clinical intervals, age, weight, and cooldown days.
func EvaluateEligibility(donor models.Donor, targetDate time.Time) (isEligible bool, daysSince int, requiredInterval int, remainingCooldown int, reason string) {
	// 1. Age verification
	if donor.DateOfBirth != "" {
		dob, err := time.Parse("2006-01-02", donor.DateOfBirth)
		if err == nil {
			ageYears := int(targetDate.Sub(dob).Hours() / (24 * 365.25))
			if ageYears < MinimumAgeYears {
				return false, 0, 0, 0, "Donor age is below minimum statutory threshold (18 years)"
			}
			if ageYears > MaximumAgeYears {
				return false, 0, 0, 0, "Donor age exceeds maximum statutory safety limit (65 years)"
			}
		}
	}

	// 2. Weight verification
	if donor.WeightKg > 0 && donor.WeightKg < MinimumWeightKg {
		return false, 0, 0, 0, "Donor weight below 45 kg clinical safety threshold"
	}

	// 3. Donation interval check
	requiredInterval = MaleWholeBloodCooldownDays
	if strings.ToUpper(donor.Gender) == "F" {
		requiredInterval = FemaleWholeBloodCooldownDays
	}
	if strings.EqualFold(donor.LastDonationComponent, "Platelets") {
		requiredInterval = PlateletApheresisCooldownDays
	} else if strings.EqualFold(donor.LastDonationComponent, "FFP") || strings.EqualFold(donor.LastDonationComponent, "Plasma") {
		requiredInterval = PlasmaCooldownDays
	}

	if donor.LastDonationDate == "" {
		// First-time donor or no previous donation recorded
		return true, 9999, requiredInterval, 0, ""
	}

	lastDate, err := time.Parse("2006-01-02", donor.LastDonationDate)
	if err != nil {
		// Fallback if date is unparseable
		return true, 9999, requiredInterval, 0, ""
	}

	daysSince = int(targetDate.Sub(lastDate).Hours() / 24)
	if daysSince < 0 {
		daysSince = 0
	}

	if daysSince < requiredInterval {
		remainingCooldown = requiredInterval - daysSince
		reason = "Mandatory clinical cooldown active: donated " + strings.ToLower(donor.LastDonationComponent) + " recently"
		return false, daysSince, requiredInterval, remainingCooldown, reason
	}

	return true, daysSince, requiredInterval, 0, ""
}

// FilterAndRankCandidates executes the multi-factor matching pipeline.
// MaxRadiusKm filters out donors beyond practical transport time.
func FilterAndRankCandidates(req models.BloodRequest, donors []models.Donor, maxRadiusKm float64, referenceTime time.Time) models.MatchingAnalysis {
	if maxRadiusKm <= 0 {
		maxRadiusKm = 25.0
	}

	analysis := models.MatchingAnalysis{
		TotalDistrictDonors:  len(donors),
		EligibleCandidates:   make([]models.MatchCandidate, 0),
		IneligibleCandidates: make([]models.MatchCandidate, 0),
	}

	for _, donor := range donors {
		if !donor.IsActive {
			continue
		}

		distKm := CalculateDistanceKm(req.Latitude, req.Longitude, donor.Latitude, donor.Longitude)
		isCompatible := IsBloodCompatible(donor.BloodGroup, req.BloodGroup, req.Component)
		isEligible, daysSince, reqInterval, remainingCooldown, ineligibilityReason := EvaluateEligibility(donor, referenceTime)

		candidate := models.MatchCandidate{
			DonorID:               donor.ID,
			CodeName:              donor.CodeName,
			BloodGroup:            donor.BloodGroup,
			DistanceKm:            distKm,
			DaysSinceLastDonation: daysSince,
			RequiredIntervalDays:  reqInterval,
			RemainingCooldownDays: remainingCooldown,
			IsIntervalEligible:    isEligible,
			IsCompatible:          isCompatible,
			IneligibilityReason:   ineligibilityReason,
			DispatchStatus:        "NOT_NOTIFIED",
		}

		if !isCompatible {
			analysis.BloodIncompatible++
			candidate.IneligibilityReason = "Incompatible blood group (" + donor.BloodGroup + " cannot supply " + req.BloodGroup + " " + req.Component + ")"
			analysis.IneligibleCandidates = append(analysis.IneligibleCandidates, candidate)
			continue
		}

		if !isEligible {
			analysis.CooldownActive++
			analysis.IneligibleCandidates = append(analysis.IneligibleCandidates, candidate)
			continue
		}

		if distKm > maxRadiusKm {
			analysis.OutOfRadius++
			candidate.IneligibilityReason = "Outside selected search perimeter (" + formatFloat(distKm) + " km > " + formatFloat(maxRadiusKm) + " km)"
			analysis.IneligibleCandidates = append(analysis.IneligibleCandidates, candidate)
			continue
		}

		// Calculate Match Score
		score := 50.0

		// Exact group match preference
		if strings.EqualFold(donor.BloodGroup, req.BloodGroup) {
			score += 30.0
		} else {
			score += 15.0
		}

		// Proximity score (closer gets higher points)
		proximityBonus := (maxRadiusKm - distKm) / maxRadiusKm * 30.0
		if proximityBonus > 0 {
			score += proximityBonus
		}

		// Donor reliability / past completions
		if donor.TotalDonations > 0 {
			score += math.Min(float64(donor.TotalDonations)*2, 10.0)
		}

		candidate.MatchScore = math.Round(score*10) / 10
		analysis.EligibleCandidates = append(analysis.EligibleCandidates, candidate)
	}

	// Sort eligible candidates by match score descending
	sort.Slice(analysis.EligibleCandidates, func(i, j int) bool {
		return analysis.EligibleCandidates[i].MatchScore > analysis.EligibleCandidates[j].MatchScore
	})

	return analysis
}

func formatFloat(val float64) string {
	return strconv.FormatFloat(math.Round(val*10)/10, 'f', 1, 64)
}
