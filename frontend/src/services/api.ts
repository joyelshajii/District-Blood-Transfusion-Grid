// API Client for District Blood Donor Coordination System

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export interface DistrictStats {
  total_registered_donors: number;
  eligible_today_donors: number;
  active_cooldown_donors: number;
  active_requests: number;
  fulfilled_requests: number;
  prevented_spam_alerts: number;
}

export interface BloodRequest {
  id: string;
  case_number: string;
  hospital_name: string;
  hospital_district: string;
  hospital_taluk: string;
  latitude: number;
  longitude: number;
  blood_group: string;
  component: string;
  units_required: number;
  urgency_level: string;
  patient_code: string;
  doctor_notes: string;
  status: string;
  required_by: string;
  created_at: string;
}

export interface MatchCandidate {
  donor_id: string;
  code_name: string;
  blood_group: string;
  distance_km: number;
  days_since_last_donation: number;
  required_interval_days: number;
  remaining_cooldown_days: number;
  is_interval_eligible: boolean;
  is_compatible: boolean;
  ineligibility_reason?: string;
  match_score: number;
  dispatch_status: string;
  dispatch_token?: string;
}

export interface MatchingAnalysis {
  total_district_donors: number;
  blood_incompatible: number;
  cooldown_active: number;
  out_of_radius: number;
  eligible_candidates: MatchCandidate[];
  ineligible_candidates: MatchCandidate[];
}

export interface AcceptedDonorContact {
  dispatch_id: string;
  case_number: string;
  hospital_name: string;
  donor_code: string;
  full_name: string;
  phone: string;
  email: string;
  blood_group: string;
  distance_km: number;
  accepted_at: string;
  donor_note: string;
  estimated_eta: string;
}

export interface DonorProfile {
  id: string;
  code_name: string;
  full_name?: string;
  phone?: string;
  email?: string;
  blood_group: string;
  gender: string;
  date_of_birth: string;
  weight_kg: number;
  district: string;
  taluk: string;
  latitude: number;
  longitude: number;
  last_donation_date: string;
  last_donation_component: string;
  is_active: boolean;
  total_donations: number;
  created_at: string;
}

export interface DonorDispatchView {
  dispatch_id: string;
  token: string;
  status: string;
  notified_at: string;
  responded_at?: string;
  hospital_name: string;
  hospital_district: string;
  hospital_taluk: string;
  blood_group_required: string;
  component: string;
  units_required: number;
  urgency_level: string;
  doctor_notes: string;
  required_by: string;
  distance_km: number;
  donor_code_name: string;
  donor_blood_group: string;
  days_since_last: number;
  required_interval_days: number;
  remaining_cooldown_days: number;
  is_interval_eligible: boolean;
  privacy_protection: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  target_id: string;
  performed_by: string;
  details: string;
}

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Failed to fetch health');
    return res.json();
  },

  async getStats(): Promise<DistrictStats> {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  async getRequests(): Promise<BloodRequest[]> {
    const res = await fetch(`${API_BASE}/requests`);
    if (!res.ok) throw new Error('Failed to fetch requests');
    return res.json();
  },

  async getRequest(id: string): Promise<BloodRequest> {
    const res = await fetch(`${API_BASE}/requests/${id}`);
    if (!res.ok) throw new Error('Failed to fetch request details');
    return res.json();
  },

  async createRequest(req: Partial<BloodRequest>): Promise<BloodRequest> {
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error('Failed to create request');
    return res.json();
  },

  async matchRequest(id: string, radiusKm: number = 25): Promise<MatchingAnalysis> {
    const res = await fetch(`${API_BASE}/requests/${id}/match?radius=${radiusKm}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to run matching engine');
    return res.json();
  },

  async dispatchCandidates(requestId: string, donorIds: string[]) {
    const res = await fetch(`${API_BASE}/requests/${requestId}/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ donor_ids: donorIds }),
    });
    if (!res.ok) throw new Error('Failed to dispatch notifications');
    return res.json();
  },

  async getAcceptedDonors(requestId: string): Promise<AcceptedDonorContact[]> {
    const res = await fetch(`${API_BASE}/requests/${requestId}/accepted-donors`);
    if (!res.ok) throw new Error('Failed to fetch accepted donor contacts');
    return res.json();
  },

  async getDonorDispatch(token: string): Promise<DonorDispatchView> {
    const res = await fetch(`${API_BASE}/donor/dispatch/${token}`);
    if (!res.ok) throw new Error('Invalid or expired dispatch token');
    return res.json();
  },

  async respondToDispatch(token: string, action: 'ACCEPT' | 'DECLINE', donorNote: string = '') {
    const res = await fetch(`${API_BASE}/donor/dispatch/${token}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, donor_note: donorNote }),
    });
    if (!res.ok) throw new Error('Failed to submit response');
    return res.json();
  },

  async getDonors(): Promise<DonorProfile[]> {
    const res = await fetch(`${API_BASE}/donors`);
    if (!res.ok) throw new Error('Failed to fetch donors');
    return res.json();
  },

  async createDonor(donor: Partial<DonorProfile>): Promise<any> {
    const res = await fetch(`${API_BASE}/donors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donor),
    });
    if (!res.ok) throw new Error('Failed to register donor');
    return res.json();
  },

  async getAuditLogs(limit: number = 25): Promise<AuditLog[]> {
    const res = await fetch(`${API_BASE}/audit-logs?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },
};
