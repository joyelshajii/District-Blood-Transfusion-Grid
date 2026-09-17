package store

import (
	"database/sql"
	"district-blood-matching/internal/models"
	"fmt"
	"sync"
	"time"

	_ "modernc.org/sqlite"
)

type Store struct {
	db *sql.DB
	mu sync.RWMutex
}

func NewStore(dbPath string) (*Store, error) {
	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return nil, fmt.Errorf("failed to open sqlite database: %w", err)
	}

	// Configure connection pool for SQLite
	db.SetMaxOpenConns(1)

	s := &Store{db: db}
	if err := s.initSchema(); err != nil {
		return nil, fmt.Errorf("failed to initialize schema: %w", err)
	}

	if err := s.seedInitialData(); err != nil {
		return nil, fmt.Errorf("failed to seed initial data: %w", err)
	}

	return s, nil
}

func (s *Store) Close() error {
	return s.db.Close()
}

func (s *Store) initSchema() error {
	schema := `
	CREATE TABLE IF NOT EXISTS donors (
		id TEXT PRIMARY KEY,
		code_name TEXT UNIQUE NOT NULL,
		full_name TEXT NOT NULL,
		phone TEXT NOT NULL,
		email TEXT NOT NULL,
		blood_group TEXT NOT NULL,
		gender TEXT NOT NULL,
		date_of_birth TEXT NOT NULL,
		weight_kg REAL NOT NULL,
		district TEXT NOT NULL,
		taluk TEXT NOT NULL,
		latitude REAL NOT NULL,
		longitude REAL NOT NULL,
		last_donation_date TEXT NOT NULL,
		last_donation_component TEXT NOT NULL,
		is_active INTEGER NOT NULL DEFAULT 1,
		total_donations INTEGER NOT NULL DEFAULT 0,
		created_at TEXT NOT NULL
	);

	CREATE TABLE IF NOT EXISTS blood_requests (
		id TEXT PRIMARY KEY,
		case_number TEXT UNIQUE NOT NULL,
		hospital_name TEXT NOT NULL,
		hospital_district TEXT NOT NULL,
		hospital_taluk TEXT NOT NULL,
		latitude REAL NOT NULL,
		longitude REAL NOT NULL,
		blood_group TEXT NOT NULL,
		component TEXT NOT NULL,
		units_required INTEGER NOT NULL,
		urgency_level TEXT NOT NULL,
		patient_code TEXT NOT NULL,
		doctor_notes TEXT NOT NULL,
		status TEXT NOT NULL,
		required_by TEXT NOT NULL,
		created_at TEXT NOT NULL
	);

	CREATE TABLE IF NOT EXISTS dispatches (
		id TEXT PRIMARY KEY,
		request_id TEXT NOT NULL,
		donor_id TEXT NOT NULL,
		token TEXT UNIQUE NOT NULL,
		status TEXT NOT NULL,
		notified_at TEXT NOT NULL,
		responded_at TEXT,
		contact_revealed INTEGER NOT NULL DEFAULT 0,
		donor_note TEXT,
		FOREIGN KEY(request_id) REFERENCES blood_requests(id),
		FOREIGN KEY(donor_id) REFERENCES donors(id)
	);

	CREATE TABLE IF NOT EXISTS audit_logs (
		id TEXT PRIMARY KEY,
		timestamp TEXT NOT NULL,
		action TEXT NOT NULL,
		target_id TEXT NOT NULL,
		performed_by TEXT NOT NULL,
		details TEXT NOT NULL
	);

	CREATE INDEX IF NOT EXISTS idx_donors_blood_group ON donors(blood_group);
	CREATE INDEX IF NOT EXISTS idx_donors_district ON donors(district);
	CREATE INDEX IF NOT EXISTS idx_dispatches_request ON dispatches(request_id);
	CREATE INDEX IF NOT EXISTS idx_dispatches_token ON dispatches(token);
	`
	_, err := s.db.Exec(schema)
	return err
}

func (s *Store) seedInitialData() error {
	var count int
	err := s.db.QueryRow("SELECT COUNT(*) FROM donors").Scan(&count)
	if err != nil {
		return err
	}
	if count > 0 {
		return nil
	}

	// Seed realistic donors across Ernakulam District
	// Reference date: September 2026
	donors := []models.Donor{
		{
			ID:                    "donor-001",
			CodeName:              "DONOR-EKM-101",
			FullName:              "Arun Narayanan",
			Phone:                 "+91 94471 23891",
			Email:                 "arun.n@example.com",
			BloodGroup:            "B+",
			Gender:                "M",
			DateOfBirth:           "1994-06-12",
			WeightKg:              71.5,
			District:              "Ernakulam",
			Taluk:                 "Kanayannur",
			Latitude:              9.9720,
			Longitude:             76.2950,
			LastDonationDate:      "2026-05-10", // ~130 days ago (Eligible)
			LastDonationComponent: "Whole Blood",
			IsActive:              true,
			TotalDonations:        4,
			CreatedAt:             "2025-01-10T10:00:00Z",
		},
		{
			ID:                    "donor-002",
			CodeName:              "DONOR-EKM-102",
			FullName:              "Fathima Basheer",
			Phone:                 "+91 98460 77124",
			Email:                 "fathima.b@example.com",
			BloodGroup:            "B+",
			Gender:                "F",
			DateOfBirth:           "1998-11-22",
			WeightKg:              56.0,
			District:              "Ernakulam",
			Taluk:                 "Kakkanad",
			Latitude:              10.0150,
			Longitude:             76.3420,
			LastDonationDate:      "2026-08-20", // 28 days ago -> Male or Female cooldown active!
			LastDonationComponent: "Whole Blood",
			IsActive:              true,
			TotalDonations:        2,
			CreatedAt:             "2025-03-15T11:30:00Z",
		},
		{
			ID:                    "donor-003",
			CodeName:              "DONOR-EKM-103",
			FullName:              "Rahul Varma",
			Phone:                 "+91 94002 91823",
			Email:                 "rahul.v@example.com",
			BloodGroup:            "O+",
			Gender:                "M",
			DateOfBirth:           "1991-03-08",
			WeightKg:              69.0,
			District:              "Ernakulam",
			Taluk:                 "Aluva",
			Latitude:              10.1080,
			Longitude:             76.3540,
			LastDonationDate:      "2026-04-18", // 152 days ago (Eligible)
			LastDonationComponent: "Whole Blood",
			IsActive:              true,
			TotalDonations:        6,
			CreatedAt:             "2024-11-01T09:15:00Z",
		},
		{
			ID:                    "donor-004",
			CodeName:              "DONOR-EKM-104",
			FullName:              "Sneha Kurian",
			Phone:                 "+91 97451 88231",
			Email:                 "sneha.k@example.com",
			BloodGroup:            "O-",
			Gender:                "F",
			DateOfBirth:           "1996-08-19",
			WeightKg:              54.5,
			District:              "Ernakulam",
			Taluk:                 "Edappally",
			Latitude:              10.0260,
			Longitude:             76.3080,
			LastDonationDate:      "2026-04-05", // 165 days ago (Universal Eligible)
			LastDonationComponent: "Whole Blood",
			IsActive:              true,
			TotalDonations:        5,
			CreatedAt:             "2024-09-12T14:00:00Z",
		},
		{
			ID:                    "donor-005",
			CodeName:              "DONOR-EKM-105",
			FullName:              "Deepak Menon",
			Phone:                 "+91 99954 66120",
			Email:                 "deepak.m@example.com",
			BloodGroup:            "B+",
			Gender:                "M",
			DateOfBirth:           "1990-12-04",
			WeightKg:              74.0,
			District:              "Ernakulam",
			Taluk:                 "Kalamassery",
			Latitude:              10.0450,
			Longitude:             76.3210,
			LastDonationDate:      "2026-06-01", // 108 days ago (Eligible)
			LastDonationComponent: "Whole Blood",
			IsActive:              true,
			TotalDonations:        3,
			CreatedAt:             "2025-02-18T16:20:00Z",
		},
		{
			ID:                    "donor-006",
			CodeName:              "DONOR-EKM-106",
			FullName:              "Ancy Mathew",
			Phone:                 "+91 94463 11982",
			Email:                 "ancy.m@example.com",
			BloodGroup:            "A+",
			Gender:                "F",
			DateOfBirth:           "1997-04-25",
			WeightKg:              58.0,
			District:              "Ernakulam",
			Taluk:                 "Tripunithura",
			Latitude:              9.9480,
			Longitude:             76.3480,
			LastDonationDate:      "2026-07-28", // 51 days ago -> Female cooldown active!
			LastDonationComponent: "Whole Blood",
			IsActive:              true,
			TotalDonations:        1,
			CreatedAt:             "2025-05-10T12:00:00Z",
		},
		{
			ID:                    "donor-007",
			CodeName:              "DONOR-EKM-107",
			FullName:              "Vishnu Prasad",
			Phone:                 "+91 98471 55621",
			Email:                 "vishnu.p@example.com",
			BloodGroup:            "AB+",
			Gender:                "M",
			DateOfBirth:           "1993-09-14",
			WeightKg:              80.0,
			District:              "Ernakulam",
			Taluk:                 "Angamaly",
			Latitude:              10.1850,
			Longitude:             76.3860,
			LastDonationDate:      "2026-09-02", // 15 days ago -> Cooldown active
			LastDonationComponent: "Whole Blood",
			IsActive:              true,
			TotalDonations:        7,
			CreatedAt:             "2024-06-01T10:00:00Z",
		},
		{
			ID:                    "donor-008",
			CodeName:              "DONOR-EKM-108",
			FullName:              "Roshni George",
			Phone:                 "+91 97460 33819",
			Email:                 "roshni.g@example.com",
			BloodGroup:            "A+",
			Gender:                "F",
			DateOfBirth:           "1995-10-30",
			WeightKg:              52.0,
			District:              "Ernakulam",
			Taluk:                 "Kochi",
			Latitude:              9.9650,
			Longitude:             76.2620,
			LastDonationDate:      "2026-03-20", // 181 days ago (Eligible)
			LastDonationComponent: "Whole Blood",
			IsActive:              true,
			TotalDonations:        3,
			CreatedAt:             "2024-10-14T11:00:00Z",
		},
		{
			ID:                    "donor-009",
			CodeName:              "DONOR-EKM-109",
			FullName:              "Muhammed Riyas",
			Phone:                 "+91 99462 77015",
			Email:                 "riyas.m@example.com",
			BloodGroup:            "B+",
			Gender:                "M",
			DateOfBirth:           "1992-01-17",
			WeightKg:              66.0,
			District:              "Ernakulam",
			Taluk:                 "Muvattupuzha",
			Latitude:              9.9880,
			Longitude:             76.5780, // Far (~32 km from Kochi city)
			LastDonationDate:      "2026-02-14", // 215 days ago (Eligible, but out of radius for city emergency)
			LastDonationComponent: "Whole Blood",
			IsActive:              true,
			TotalDonations:        4,
			CreatedAt:             "2025-01-05T09:00:00Z",
		},
		{
			ID:                    "donor-010",
			CodeName:              "DONOR-EKM-110",
			FullName:              "Kavya Pillai",
			Phone:                 "+91 94951 88402",
			Email:                 "kavya.p@example.com",
			BloodGroup:            "O+",
			Gender:                "F",
			DateOfBirth:           "2000-07-09",
			WeightKg:              59.0,
			District:              "Ernakulam",
			Taluk:                 "Kanayannur",
			Latitude:              9.9790,
			Longitude:             76.2890,
			LastDonationDate:      "2026-01-10", // 250 days ago (Eligible)
			LastDonationComponent: "Whole Blood",
			IsActive:              true,
			TotalDonations:        2,
			CreatedAt:             "2025-04-12T15:30:00Z",
		},
		{
			ID:                    "donor-011",
			CodeName:              "DONOR-EKM-111",
			FullName:              "Gokul Suresh",
			Phone:                 "+91 98462 90112",
			Email:                 "gokul.s@example.com",
			BloodGroup:            "A-",
			Gender:                "M",
			DateOfBirth:           "1996-12-18",
			WeightKg:              72.0,
			District:              "Ernakulam",
			Taluk:                 "Kalamassery",
			Latitude:              10.0510,
			Longitude:             76.3530,
			LastDonationDate:      "2026-05-15", // 125 days ago (Eligible)
			LastDonationComponent: "Whole Blood",
			IsActive:              true,
			TotalDonations:        5,
			CreatedAt:             "2024-08-20T10:00:00Z",
		},
		{
			ID:                    "donor-012",
			CodeName:              "DONOR-EKM-112",
			FullName:              "Meera Nambiar",
			Phone:                 "+91 97455 22099",
			Email:                 "meera.n@example.com",
			BloodGroup:            "B+",
			Gender:                "F",
			DateOfBirth:           "1999-03-22",
			WeightKg:              53.0,
			District:              "Ernakulam",
			Taluk:                 "Palarivattom",
			Latitude:              10.0050,
			Longitude:             76.3050,
			LastDonationDate:      "2026-04-10", // 160 days ago (Eligible)
			LastDonationComponent: "Whole Blood",
			IsActive:              true,
			TotalDonations:        3,
			CreatedAt:             "2025-02-01T14:45:00Z",
		},
	}

	for _, d := range donors {
		_, err := s.db.Exec(`
			INSERT INTO donors (
				id, code_name, full_name, phone, email, blood_group, gender,
				date_of_birth, weight_kg, district, taluk, latitude, longitude,
				last_donation_date, last_donation_component, is_active, total_donations, created_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`, d.ID, d.CodeName, d.FullName, d.Phone, d.Email, d.BloodGroup, d.Gender,
			d.DateOfBirth, d.WeightKg, d.District, d.Taluk, d.Latitude, d.Longitude,
			d.LastDonationDate, d.LastDonationComponent, 1, d.TotalDonations, d.CreatedAt)
		if err != nil {
			return err
		}
	}

	// Seed standard demonstration requests
	requests := []models.BloodRequest{
		{
			ID:               "req-001",
			CaseNumber:       "REQ-EKM-2026-01",
			HospitalName:     "General Hospital Ernakulam",
			HospitalDistrict: "Ernakulam",
			HospitalTaluk:    "Kanayannur",
			Latitude:         9.9816,
			Longitude:        76.2810,
			BloodGroup:       "B+",
			Component:        "Whole Blood",
			UnitsRequired:    2,
			UrgencyLevel:     "Emergency",
			PatientCode:      "PT-SURG-84",
			DoctorNotes:      "Emergency vascular repair following road accident. Cross-matching in progress.",
			Status:           "OPEN",
			RequiredBy:       "2026-09-18T04:00:00Z",
			CreatedAt:        "2026-09-17T21:00:00Z",
		},
		{
			ID:               "req-002",
			CaseNumber:       "REQ-EKM-2026-02",
			HospitalName:     "Government Medical College Kalamassery",
			HospitalDistrict: "Ernakulam",
			HospitalTaluk:    "Kalamassery",
			Latitude:         10.0520,
			Longitude:        76.3537,
			BloodGroup:       "O-",
			Component:        "PRBC",
			UnitsRequired:    1,
			UrgencyLevel:     "Critical",
			PatientCode:      "PT-PED-19",
			DoctorNotes:      "Pediatric oncology scheduled transfusion. Universal red cell required.",
			Status:           "OPEN",
			RequiredBy:       "2026-09-18T10:00:00Z",
			CreatedAt:        "2026-09-17T20:15:00Z",
		},
	}

	for _, r := range requests {
		_, err := s.db.Exec(`
			INSERT INTO blood_requests (
				id, case_number, hospital_name, hospital_district, hospital_taluk,
				latitude, longitude, blood_group, component, units_required,
				urgency_level, patient_code, doctor_notes, status, required_by, created_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`, r.ID, r.CaseNumber, r.HospitalName, r.HospitalDistrict, r.HospitalTaluk,
			r.Latitude, r.Longitude, r.BloodGroup, r.Component, r.UnitsRequired,
			r.UrgencyLevel, r.PatientCode, r.DoctorNotes, r.Status, r.RequiredBy, r.CreatedAt)
		if err != nil {
			return err
		}
	}

	return nil
}

// GetAllDonors returns all donors. Note: for public endpoints, contact fields must be masked.
func (s *Store) GetAllDonors() ([]models.Donor, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	rows, err := s.db.Query(`
		SELECT id, code_name, full_name, phone, email, blood_group, gender,
		       date_of_birth, weight_kg, district, taluk, latitude, longitude,
		       last_donation_date, last_donation_component, is_active, total_donations, created_at
		FROM donors ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.Donor
	for rows.Next() {
		var d models.Donor
		var activeInt int
		err := rows.Scan(
			&d.ID, &d.CodeName, &d.FullName, &d.Phone, &d.Email, &d.BloodGroup, &d.Gender,
			&d.DateOfBirth, &d.WeightKg, &d.District, &d.Taluk, &d.Latitude, &d.Longitude,
			&d.LastDonationDate, &d.LastDonationComponent, &activeInt, &d.TotalDonations, &d.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		d.IsActive = activeInt == 1
		list = append(list, d)
	}

	return list, nil
}

func (s *Store) GetDonorByID(id string) (*models.Donor, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var d models.Donor
	var activeInt int
	err := s.db.QueryRow(`
		SELECT id, code_name, full_name, phone, email, blood_group, gender,
		       date_of_birth, weight_kg, district, taluk, latitude, longitude,
		       last_donation_date, last_donation_component, is_active, total_donations, created_at
		FROM donors WHERE id = ?
	`, id).Scan(
		&d.ID, &d.CodeName, &d.FullName, &d.Phone, &d.Email, &d.BloodGroup, &d.Gender,
		&d.DateOfBirth, &d.WeightKg, &d.District, &d.Taluk, &d.Latitude, &d.Longitude,
		&d.LastDonationDate, &d.LastDonationComponent, &activeInt, &d.TotalDonations, &d.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	d.IsActive = activeInt == 1
	return &d, nil
}

func (s *Store) CreateDonor(d models.Donor) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	activeInt := 0
	if d.IsActive {
		activeInt = 1
	}

	_, err := s.db.Exec(`
		INSERT INTO donors (
			id, code_name, full_name, phone, email, blood_group, gender,
			date_of_birth, weight_kg, district, taluk, latitude, longitude,
			last_donation_date, last_donation_component, is_active, total_donations, created_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, d.ID, d.CodeName, d.FullName, d.Phone, d.Email, d.BloodGroup, d.Gender,
		d.DateOfBirth, d.WeightKg, d.District, d.Taluk, d.Latitude, d.Longitude,
		d.LastDonationDate, d.LastDonationComponent, activeInt, d.TotalDonations, d.CreatedAt)
	return err
}

func (s *Store) GetAllRequests() ([]models.BloodRequest, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	rows, err := s.db.Query(`
		SELECT id, case_number, hospital_name, hospital_district, hospital_taluk,
		       latitude, longitude, blood_group, component, units_required,
		       urgency_level, patient_code, doctor_notes, status, required_by, created_at
		FROM blood_requests ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.BloodRequest
	for rows.Next() {
		var r models.BloodRequest
		err := rows.Scan(
			&r.ID, &r.CaseNumber, &r.HospitalName, &r.HospitalDistrict, &r.HospitalTaluk,
			&r.Latitude, &r.Longitude, &r.BloodGroup, &r.Component, &r.UnitsRequired,
			&r.UrgencyLevel, &r.PatientCode, &r.DoctorNotes, &r.Status, &r.RequiredBy, &r.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		list = append(list, r)
	}

	return list, nil
}

func (s *Store) GetRequestByID(id string) (*models.BloodRequest, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var r models.BloodRequest
	err := s.db.QueryRow(`
		SELECT id, case_number, hospital_name, hospital_district, hospital_taluk,
		       latitude, longitude, blood_group, component, units_required,
		       urgency_level, patient_code, doctor_notes, status, required_by, created_at
		FROM blood_requests WHERE id = ?
	`, id).Scan(
		&r.ID, &r.CaseNumber, &r.HospitalName, &r.HospitalDistrict, &r.HospitalTaluk,
		&r.Latitude, &r.Longitude, &r.BloodGroup, &r.Component, &r.UnitsRequired,
		&r.UrgencyLevel, &r.PatientCode, &r.DoctorNotes, &r.Status, &r.RequiredBy, &r.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &r, nil
}

func (s *Store) CreateRequest(r models.BloodRequest) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	_, err := s.db.Exec(`
		INSERT INTO blood_requests (
			id, case_number, hospital_name, hospital_district, hospital_taluk,
			latitude, longitude, blood_group, component, units_required,
			urgency_level, patient_code, doctor_notes, status, required_by, created_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, r.ID, r.CaseNumber, r.HospitalName, r.HospitalDistrict, r.HospitalTaluk,
		r.Latitude, r.Longitude, r.BloodGroup, r.Component, r.UnitsRequired,
		r.UrgencyLevel, r.PatientCode, r.DoctorNotes, r.Status, r.RequiredBy, r.CreatedAt)
	return err
}

func (s *Store) UpdateRequestStatus(requestID, status string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	_, err := s.db.Exec("UPDATE blood_requests SET status = ? WHERE id = ?", status, requestID)
	return err
}

func (s *Store) SaveDispatch(d models.DispatchRecord) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	revealedInt := 0
	if d.ContactRevealed {
		revealedInt = 1
	}

	_, err := s.db.Exec(`
		INSERT OR REPLACE INTO dispatches (
			id, request_id, donor_id, token, status, notified_at, responded_at, contact_revealed, donor_note
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, d.ID, d.RequestID, d.DonorID, d.Token, d.Status, d.NotifiedAt, d.RespondedAt, revealedInt, d.DonorNote)
	return err
}

func (s *Store) GetDispatchesByRequestID(requestID string) ([]models.DispatchRecord, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	rows, err := s.db.Query(`
		SELECT id, request_id, donor_id, token, status, notified_at, responded_at, contact_revealed, donor_note
		FROM dispatches WHERE request_id = ?
	`, requestID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.DispatchRecord
	for rows.Next() {
		var d models.DispatchRecord
		var revealedInt int
		var respAt, note sql.NullString
		err := rows.Scan(
			&d.ID, &d.RequestID, &d.DonorID, &d.Token, &d.Status,
			&d.NotifiedAt, &respAt, &revealedInt, &note,
		)
		if err != nil {
			return nil, err
		}
		if respAt.Valid {
			d.RespondedAt = respAt.String
		}
		if note.Valid {
			d.DonorNote = note.String
		}
		d.ContactRevealed = revealedInt == 1
		list = append(list, d)
	}

	return list, nil
}

func (s *Store) GetDispatchByToken(token string) (*models.DispatchRecord, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var d models.DispatchRecord
	var revealedInt int
	var respAt, note sql.NullString
	err := s.db.QueryRow(`
		SELECT id, request_id, donor_id, token, status, notified_at, responded_at, contact_revealed, donor_note
		FROM dispatches WHERE token = ?
	`, token).Scan(
		&d.ID, &d.RequestID, &d.DonorID, &d.Token, &d.Status,
		&d.NotifiedAt, &respAt, &revealedInt, &note,
	)
	if err != nil {
		return nil, err
	}
	if respAt.Valid {
		d.RespondedAt = respAt.String
	}
	if note.Valid {
		d.DonorNote = note.String
	}
	d.ContactRevealed = revealedInt == 1
	return &d, nil
}

func (s *Store) GetAcceptedContactsForRequest(requestID string) ([]models.AcceptedDonorContact, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	rows, err := s.db.Query(`
		SELECT dp.id, req.case_number, req.hospital_name, d.code_name, d.full_name, d.phone, d.email,
		       d.blood_group, COALESCE(dp.responded_at, ''), COALESCE(dp.donor_note, '')
		FROM dispatches dp
		JOIN blood_requests req ON dp.request_id = req.id
		JOIN donors d ON dp.donor_id = d.id
		WHERE dp.request_id = ? AND dp.status = 'ACCEPTED' AND dp.contact_revealed = 1
	`, requestID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	list := make([]models.AcceptedDonorContact, 0)
	for rows.Next() {
		var c models.AcceptedDonorContact
		err := rows.Scan(
			&c.DispatchID, &c.CaseNumber, &c.HospitalName, &c.DonorCode,
			&c.FullName, &c.Phone, &c.Email, &c.BloodGroup,
			&c.AcceptedAt, &c.DonorNote,
		)
		if err != nil {
			return nil, err
		}
		c.EstimatedETA = "25 to 35 mins"
		list = append(list, c)
	}

	return list, nil
}

func (s *Store) RecordAudit(log models.AuditLog) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	_, err := s.db.Exec(`
		INSERT INTO audit_logs (id, timestamp, action, target_id, performed_by, details)
		VALUES (?, ?, ?, ?, ?, ?)
	`, log.ID, log.Timestamp, log.Action, log.TargetID, log.PerformedBy, log.Details)
	return err
}

func (s *Store) GetRecentAuditLogs(limit int) ([]models.AuditLog, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if limit <= 0 {
		limit = 20
	}

	rows, err := s.db.Query(`
		SELECT id, timestamp, action, target_id, performed_by, details
		FROM audit_logs ORDER BY timestamp DESC LIMIT ?
	`, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.AuditLog
	for rows.Next() {
		var l models.AuditLog
		err := rows.Scan(&l.ID, &l.Timestamp, &l.Action, &l.TargetID, &l.PerformedBy, &l.Details)
		if err != nil {
			return nil, err
		}
		list = append(list, l)
	}

	return list, nil
}

func (s *Store) GetDistrictStats(targetDate time.Time) (models.DistrictStats, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var stats models.DistrictStats

	err := s.db.QueryRow("SELECT COUNT(*) FROM donors WHERE is_active = 1").Scan(&stats.TotalRegisteredDonors)
	if err != nil {
		return stats, err
	}

	err = s.db.QueryRow("SELECT COUNT(*) FROM blood_requests WHERE status IN ('OPEN', 'MATCHING', 'DISPATCHED')").Scan(&stats.ActiveRequests)
	if err != nil {
		return stats, err
	}

	err = s.db.QueryRow("SELECT COUNT(*) FROM blood_requests WHERE status IN ('ACCEPTED', 'FULFILLED')").Scan(&stats.FulfilledRequests)
	if err != nil {
		return stats, err
	}

	// Calculate eligible vs cooldown donors
	rows, err := s.db.Query("SELECT gender, last_donation_date, last_donation_component FROM donors WHERE is_active = 1")
	if err != nil {
		return stats, err
	}
	defer rows.Close()

	eligibleCount := 0
	cooldownCount := 0

	for rows.Next() {
		var gender, lastDate, lastComp string
		if err := rows.Scan(&gender, &lastDate, &lastComp); err != nil {
			continue
		}

		reqDays := 90
		if gender == "F" {
			reqDays = 120
		}
		if lastComp == "Platelets" {
			reqDays = 14
		}

		if lastDate == "" {
			eligibleCount++
			continue
		}

		t, err := time.Parse("2006-01-02", lastDate)
		if err != nil {
			eligibleCount++
			continue
		}

		days := int(targetDate.Sub(t).Hours() / 24)
		if days < reqDays {
			cooldownCount++
		} else {
			eligibleCount++
		}
	}

	stats.EligibleTodayDonors = eligibleCount
	stats.ActiveCooldownDonors = cooldownCount
	// Prevented spam alerts: the number of active cooldown donors * average WhatsApp forwards
	stats.PreventedSpamAlerts = cooldownCount * 14

	return stats, nil
}
