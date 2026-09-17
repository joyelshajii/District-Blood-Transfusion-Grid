import React, { useState, useEffect } from 'react';
import { api, BloodRequest, MatchingAnalysis, DistrictStats, AcceptedDonorContact } from '../services/api';
import {
  Activity,
  MapPin,
  ShieldCheck,
  Send,
  Phone,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  ArrowRight,
  Filter,
  Search,
  Lock,
  UserCheck,
  Clock,
  ChevronRight,
  Check,
  Building2,
  FileSpreadsheet,
  X
} from 'lucide-react';

interface HospitalDashboardProps {
  onNavigateToDonorSimulator: (token?: string) => void;
  showNewRequestModal: boolean;
  setShowNewRequestModal: (open: boolean) => void;
  evaluationDrawerOpen: boolean;
  setEvaluationDrawerOpen: (open: boolean) => void;
}

export const HospitalDashboard: React.FC<HospitalDashboardProps> = ({
  onNavigateToDonorSimulator,
  showNewRequestModal,
  setShowNewRequestModal,
  evaluationDrawerOpen,
  setEvaluationDrawerOpen,
}) => {
  const [stats, setStats] = useState<DistrictStats | null>(null);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string>('');
  const [analysis, setAnalysis] = useState<MatchingAnalysis | null>(null);
  const [acceptedContacts, setAcceptedContacts] = useState<AcceptedDonorContact[]>([]);
  const [radiusKm, setRadiusKm] = useState<number>(25);
  const [loading, setLoading] = useState<boolean>(false);
  const [dispatching, setDispatching] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [showIneligibleTable, setShowIneligibleTable] = useState(false);

  // New request form state
  const [newReq, setNewReq] = useState({
    hospital_name: 'General Hospital Ernakulam',
    hospital_district: 'Ernakulam',
    hospital_taluk: 'Kanayannur',
    blood_group: 'B+',
    component: 'Whole Blood',
    units_required: 2,
    urgency_level: 'Emergency',
    patient_code: 'PT-ER-904',
    doctor_notes: 'Urgent replacement for acute gastrointestinal bleed. Cross-match requested.',
  });

  const loadData = async () => {
    try {
      const [s, reqs] = await Promise.all([api.getStats(), api.getRequests()]);
      setStats(s);
      setRequests(reqs);
      if (reqs.length > 0 && !selectedRequestId) {
        setSelectedRequestId(reqs[0].id);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedRequestId) {
      runMatch(selectedRequestId, radiusKm);
      loadAcceptedContacts(selectedRequestId);
    }
  }, [selectedRequestId, radiusKm]);

  const loadAcceptedContacts = async (reqId: string) => {
    try {
      const contacts = await api.getAcceptedDonors(reqId);
      setAcceptedContacts(contacts);
    } catch (err) {
      console.error('Failed to load accepted donors:', err);
    }
  };

  const runMatch = async (reqId: string, radius: number) => {
    setLoading(true);
    try {
      const res = await api.matchRequest(reqId, radius);
      setAnalysis(res);
    } catch (err) {
      console.error('Error running match:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDispatch = async (donorIds: string[]) => {
    if (!selectedRequestId || donorIds.length === 0) return;
    setDispatching(true);
    try {
      const res = await api.dispatchCandidates(selectedRequestId, donorIds);
      setActionMessage({
        text: `Anonymous notification dispatched to ${donorIds.length} candidate(s). Personal contact remains locked.`,
        type: 'success',
      });
      await runMatch(selectedRequestId, radiusKm);
      await loadData();

      if (res.dispatches && res.dispatches.length > 0) {
        setActionMessage({
          text: 'Anonymous notification dispatched. Switch to the Volunteer Simulator to review and accept.',
          type: 'success',
        });
      }
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Dispatch failed', type: 'error' });
    } finally {
      setDispatching(false);
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createRequest(newReq);
      setShowNewRequestModal(false);
      await loadData();
      setSelectedRequestId(created.id);
      setActionMessage({ text: `Case ${created.case_number} created successfully.`, type: 'success' });
    } catch (err: any) {
      alert(err.message || 'Failed to create request');
    }
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.case_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.hospital_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.blood_group.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUrgency = urgencyFilter === 'ALL' || r.urgency_level.toUpperCase() === urgencyFilter;
    return matchesSearch && matchesUrgency;
  });

  const selectedRequest = requests.find((r) => r.id === selectedRequestId);

  return (
    <div className="space-y-5">
      
      {/* Retractable Evaluation & Examiner Drawer */}
      {evaluationDrawerOpen && (
        <div className="bg-slate-900 text-slate-200 border border-slate-800 rounded p-4 shadow-sm transition-all">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 max-w-4xl">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-700 text-white uppercase tracking-wider">
                  ANAVANDI 2026 Evaluation Protocol
                </span>
                <span className="text-xs font-semibold text-white">Challenge SC-12: District Blood Donor Matching</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>The Core Problem Solved:</strong> Broad WhatsApp broadcast chains cause severe donor fatigue, disturb volunteers who donated only weeks ago, and expose phone numbers to scraping. This system solves SC-12 by running an algorithmic compatibility filter that strictly enforces 90-day (male) and 120-day (female) clinical recovery intervals, radial proximity, and keeps volunteer contact details 100% locked until explicit acceptance.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1. Hospital Creates Requisition</span>
                </span>
                <span className="text-slate-600">&bull;</span>
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>2. Multi-Factor Interval Filter</span>
                </span>
                <span className="text-slate-600">&bull;</span>
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>3. Anonymized Dispatch Token</span>
                </span>
                <span className="text-slate-600">&bull;</span>
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>4. Donor Accepts on Portal</span>
                </span>
                <span className="text-slate-600">&bull;</span>
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>5. Contact Unmasks Exclusively to Desk</span>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => onNavigateToDonorSimulator()}
                className="btn-primary text-xs py-1.5 px-3 flex items-center space-x-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Test Volunteer Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setEvaluationDrawerOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                title="Dismiss guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Integrated Operations HUD Bar */}
      {stats && (
        <div className="workbench-panel grid grid-cols-2 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          
          <div className="hud-cell">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Active Requisitions
            </div>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {stats.active_requests}
              </span>
              <span className="text-[11px] text-red-700 font-semibold flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block mr-1 animate-pulse"></span>
                In Triage
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Hospital urgent cases</div>
          </div>

          <div className="hud-cell">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              District Registry
            </div>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {stats.total_registered_donors}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Volunteers</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Ernakulam sector database</div>
          </div>

          <div className="hud-cell">
            <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
              Clinically Eligible Today
            </div>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-bold font-mono text-emerald-800 tabular-nums">
                {stats.eligible_today_donors}
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">Post-Interval</span>
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5">Cleared 90d/120d cooldown</div>
          </div>

          <div className="hud-cell">
            <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
              Protected Cooldown
            </div>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-bold font-mono text-amber-800 tabular-nums">
                {stats.active_cooldown_donors}
              </span>
              <span className="text-[11px] text-amber-700 font-medium">Protected</span>
            </div>
            <div className="text-[11px] text-amber-700 mt-0.5">Excluded from notifications</div>
          </div>

          <div className="hud-cell col-span-2 lg:col-span-1">
            <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
              Spam Messages Prevented
            </div>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {stats.prevented_spam_alerts}
              </span>
              <span className="text-[11px] text-slate-600 font-medium">Blocked</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Zero WhatsApp broadcast blast</div>
          </div>

        </div>
      )}

      {/* Action Notification Toast */}
      {actionMessage && (
        <div
          className={`p-3 rounded border text-xs font-medium flex items-center justify-between shadow-xs ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : actionMessage.type === 'error'
              ? 'bg-red-50 text-red-900 border-red-200'
              : 'bg-slate-100 text-slate-900 border-slate-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-slate-600 hover:text-slate-900 text-xs font-semibold ml-4 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Split Operations Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Requisitions Triage Feed (4 Cols) */}
        <div className="lg:col-span-4 workbench-panel flex flex-col h-[780px] overflow-hidden">
          
          {/* Triage Search & Urgency Chips Bar */}
          <div className="p-3.5 border-b border-slate-200 bg-slate-50/70 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-red-700" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Requisitions Queue ({requests.length})
                </span>
              </div>
              <button
                onClick={() => setShowNewRequestModal(true)}
                className="btn-primary text-xs py-1 px-2.5 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Case</span>
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filter by case, hospital, group..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* Urgency Filter Chips */}
            <div className="flex items-center space-x-1 text-[11px]">
              {['ALL', 'EMERGENCY', 'CRITICAL', 'ELECTIVE'].map((u) => (
                <button
                  key={u}
                  onClick={() => setUrgencyFilter(u)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                    urgencyFilter === u
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Requisitions Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-1">
            {filteredRequests.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No requisitions matching current filters.
              </div>
            ) : (
              filteredRequests.map((req) => {
                const isSelected = req.id === selectedRequestId;
                const isAccepted = req.status === 'ACCEPTED';
                const isDispatched = req.status === 'DISPATCHED';

                return (
                  <div
                    key={req.id}
                    onClick={() => setSelectedRequestId(req.id)}
                    className={`p-3 rounded transition-all cursor-pointer m-1 ${
                      isSelected
                        ? 'bg-slate-50 border border-slate-900 ring-1 ring-slate-900 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border border-transparent hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-slate-900">
                            {req.case_number}
                          </span>
                          <span
                            className={`badge ${
                              req.urgency_level === 'Emergency'
                                ? 'badge-emergency'
                                : req.urgency_level === 'Critical'
                                ? 'badge-critical'
                                : 'badge-elective'
                            }`}
                          >
                            {req.urgency_level}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-slate-800 mt-1 line-clamp-1">
                          {req.hospital_name}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{req.hospital_taluk}, {req.hospital_district}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="px-2 py-0.5 bg-red-50 text-red-800 border border-red-200 rounded text-xs font-bold">
                          {req.blood_group}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 mt-1">
                          {req.units_required} Unit{req.units_required > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">{req.component}</span>
                      <span
                        className={`font-mono font-semibold flex items-center space-x-1 ${
                          isAccepted
                            ? 'text-emerald-700'
                            : isDispatched
                            ? 'text-amber-700'
                            : 'text-slate-600'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isAccepted
                              ? 'bg-emerald-600'
                              : isDispatched
                              ? 'bg-amber-500 animate-pulse'
                              : 'bg-slate-400'
                          }`}
                        ></span>
                        <span>{req.status}</span>
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Column: Case Dispatch Desk & Algorithmic Audit (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          {selectedRequest ? (
            <>
              {/* Selected Case Dossier */}
              <div className="workbench-panel p-4 sm:p-5 space-y-4">
                
                {/* Dossier Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                        {selectedRequest.case_number}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">
                        {selectedRequest.hospital_name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      <strong>Clinical Indication:</strong> {selectedRequest.doctor_notes}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="p-2.5 bg-red-50/80 border border-red-200 rounded text-right">
                      <span className="text-[10px] text-red-800 uppercase tracking-wider block font-semibold">
                        Requisition Demand
                      </span>
                      <span className="text-base font-bold text-red-800 font-mono">
                        {selectedRequest.units_required} Units of {selectedRequest.blood_group}
                      </span>
                      <span className="text-[11px] text-slate-600 block">
                        {selectedRequest.component}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Search Perimeter & Engine Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-semibold text-slate-700">Dispatch Perimeter:</span>
                    <select
                      value={radiusKm}
                      onChange={(e) => setRadiusKm(Number(e.target.value))}
                      className="border border-slate-300 rounded px-2.5 py-1 bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    >
                      <option value={10}>Within 10 km (Urban Kochi Core)</option>
                      <option value={20}>Within 20 km (Suburban Taluks)</option>
                      <option value={30}>Within 30 km (District Perimeter)</option>
                      <option value={50}>Within 50 km (Inter-District)</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => runMatch(selectedRequest.id, radiusKm)}
                      disabled={loading}
                      className="btn-secondary text-xs py-1 px-2.5 flex items-center space-x-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                      <span>Recalculate Matches</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* UNMASKED CONTACT AUTHORIZATION SLIP (Renders when volunteer accepts!) */}
              {acceptedContacts.length > 0 && (
                <div className="workbench-panel border-emerald-300 bg-emerald-50/40 p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                    <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                      <span>Volunteer Consent Confirmed &bull; Contact Unmasked</span>
                    </div>
                    <span className="badge badge-eligible">
                      Statutory Consent Granted
                    </span>
                  </div>

                  <p className="text-xs text-emerald-950">
                    The matched volunteer has explicitly confirmed acceptance. Contact information is now authorized and unlocked exclusively for the hospital desk:
                  </p>

                  <div className="space-y-3">
                    {acceptedContacts.map((c) => (
                      <div
                        key={c.dispatch_id}
                        className="bg-white p-4 rounded border border-emerald-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-slate-900">{c.full_name}</span>
                            <span className="font-mono text-xs px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                              {c.donor_code}
                            </span>
                            <span className="text-xs font-bold text-red-700 font-mono">{c.blood_group}</span>
                          </div>

                          <div className="text-xs text-slate-700 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                            <span className="flex items-center space-x-1 font-mono font-bold text-emerald-800 text-sm">
                              <Phone className="w-3.5 h-3.5 text-emerald-700" />
                              <a href={`tel:${c.phone}`} className="hover:underline">
                                {c.phone}
                              </a>
                            </span>
                            <span className="text-slate-500 font-mono">{c.email}</span>
                            <span className="text-slate-600 font-medium">ETA: {c.estimated_eta}</span>
                          </div>

                          {c.donor_note && (
                            <div className="text-xs text-slate-600 italic pt-1">
                              Volunteer note: "{c.donor_note}"
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <a
                            href={`tel:${c.phone}`}
                            className="btn-success text-xs py-1.5 px-3 flex items-center space-x-1.5"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call Volunteer</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Algorithmic Audit Rail & Funnel Breakdown */}
              {analysis && (
                <div className="workbench-panel p-4 sm:p-5 space-y-4">
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Multi-Factor Algorithmic Audit Rail
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        How the matching engine filtered the registry to eliminate WhatsApp broadcast spam:
                      </p>
                    </div>
                  </div>

                  {/* Multi-Stage Step Tracker */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                      <div className="text-[11px] font-semibold text-slate-500">1. District Pool</div>
                      <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                        {analysis.total_district_donors}
                      </div>
                      <div className="text-[10px] text-slate-500">Registered donors</div>
                    </div>

                    <div className="p-3 bg-red-50/70 rounded border border-red-200">
                      <div className="text-[11px] font-semibold text-red-800">2. Incompatible ABO/Rh</div>
                      <div className="text-xl font-bold font-mono text-red-800 mt-0.5">
                        -{analysis.blood_incompatible}
                      </div>
                      <div className="text-[10px] text-red-700">Mismatch deferred</div>
                    </div>

                    <div className="p-3 bg-amber-50/70 rounded border border-amber-200">
                      <div className="text-[11px] font-semibold text-amber-800">3. Cooldown Guard</div>
                      <div className="text-xl font-bold font-mono text-amber-800 mt-0.5">
                        -{analysis.cooldown_active}
                      </div>
                      <div className="text-[10px] text-amber-700">90d/120d rules enforced</div>
                    </div>

                    <div className="p-3 bg-emerald-50/70 rounded border border-emerald-200">
                      <div className="text-[11px] font-semibold text-emerald-800">4. Qualified Match</div>
                      <div className="text-xl font-bold font-mono text-emerald-800 mt-0.5">
                        {analysis.eligible_candidates.length}
                      </div>
                      <div className="text-[10px] text-emerald-700">Within {radiusKm} km radius</div>
                    </div>
                  </div>

                  {/* Qualified Candidates Roster Table */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Qualified Candidates ({analysis.eligible_candidates.length})
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Ranked by ABO affinity and distance
                        </span>
                      </div>

                      {analysis.eligible_candidates.length > 0 && (
                        <button
                          onClick={() => {
                            const topIds = analysis.eligible_candidates.slice(0, 3).map((c) => c.donor_id);
                            handleDispatch(topIds);
                          }}
                          disabled={dispatching}
                          className="btn-primary text-xs py-1 px-3 flex items-center space-x-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Dispatch Top 3 Candidates</span>
                        </button>
                      )}
                    </div>

                    <div className="overflow-x-auto border border-slate-200 rounded">
                      <table className="min-w-full divide-y divide-slate-200 text-xs">
                        <thead className="bg-slate-50 text-slate-700 font-semibold">
                          <tr>
                            <th className="py-2.5 px-3 text-left">Donor Token</th>
                            <th className="py-2.5 px-2 text-left">Blood</th>
                            <th className="py-2.5 px-2 text-left">Radial Proximity</th>
                            <th className="py-2.5 px-2 text-left">Interval History</th>
                            <th className="py-2.5 px-2 text-left">Affinity Score</th>
                            <th className="py-2.5 px-2 text-left">Status</th>
                            <th className="py-2.5 px-3 text-right">Dispatch Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {analysis.eligible_candidates.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-8 text-center text-slate-500">
                                No eligible donors currently within {radiusKm} km. Try expanding the search perimeter above.
                              </td>
                            </tr>
                          ) : (
                            analysis.eligible_candidates.map((c) => {
                              const isDispatched = c.dispatch_status && c.dispatch_status !== 'NOT_NOTIFIED';
                              return (
                                <tr key={c.donor_id} className="hover:bg-slate-50/70">
                                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">
                                    <div className="flex items-center space-x-1.5">
                                      <Lock className="w-3 h-3 text-slate-400" />
                                      <span>{c.code_name}</span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-sans block">
                                      Identity locked
                                    </span>
                                  </td>

                                  <td className="py-2.5 px-2 font-mono font-bold text-red-700 text-xs">
                                    {c.blood_group}
                                  </td>

                                  <td className="py-2.5 px-2 text-slate-700 font-medium">
                                    <span className="font-mono">{c.distance_km}</span> km
                                  </td>

                                  <td className="py-2.5 px-2 text-slate-600">
                                    <div className="font-mono text-[11px]">{c.days_since_last_donation}d ago</div>
                                    <span className="badge badge-eligible mt-0.5">
                                      {c.required_interval_days}d rule cleared
                                    </span>
                                  </td>

                                  <td className="py-2.5 px-2 font-mono font-semibold text-slate-900">
                                    {c.match_score}
                                  </td>

                                  <td className="py-2.5 px-2">
                                    <span
                                      className={`badge ${
                                        c.dispatch_status === 'ACCEPTED'
                                          ? 'badge-eligible'
                                          : c.dispatch_status === 'NOTIFIED'
                                          ? 'badge-cooldown'
                                          : 'badge-neutral'
                                      }`}
                                    >
                                      {c.dispatch_status === 'NOTIFIED'
                                        ? 'Alert Sent'
                                        : c.dispatch_status === 'ACCEPTED'
                                        ? 'Accepted'
                                        : 'Queued'}
                                    </span>
                                  </td>

                                  <td className="py-2.5 px-3 text-right">
                                    {isDispatched ? (
                                      <button
                                        onClick={() => onNavigateToDonorSimulator(c.dispatch_token)}
                                        className="btn-secondary text-[11px] py-0.5 px-2"
                                      >
                                        Inspect Alert
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleDispatch([c.donor_id])}
                                        disabled={dispatching}
                                        className="btn-primary text-[11px] py-0.5 px-2.5"
                                      >
                                        Notify
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Deferral Rationale & Spam Prevention Proof (Expandable) */}
                  <div className="pt-3 border-t border-slate-200">
                    <button
                      onClick={() => setShowIneligibleTable(!showIneligibleTable)}
                      className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 select-none"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>
                        Spam Prevention Proof: {analysis.ineligible_candidates.length} Ineligible Donors Filtered Out
                      </span>
                      <span className="text-[11px] text-slate-500 font-normal">
                        ({showIneligibleTable ? 'Hide details' : 'Show audit breakdown'})
                      </span>
                    </button>

                    {showIneligibleTable && (
                      <div className="mt-3 overflow-x-auto border border-slate-200 rounded max-h-56 overflow-y-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-[11px]">
                          <thead className="bg-slate-50 text-slate-600 font-semibold sticky top-0">
                            <tr>
                              <th className="py-1.5 px-3 text-left">Code</th>
                              <th className="py-1.5 px-2 text-left">Blood</th>
                              <th className="py-1.5 px-2 text-left">Distance</th>
                              <th className="py-1.5 px-3 text-left">Reason Filtered Out (WhatsApp Spam Prevented)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {analysis.ineligible_candidates.map((c) => (
                              <tr key={c.donor_id} className="text-slate-600">
                                <td className="py-1.5 px-3 font-mono text-slate-800">{c.code_name}</td>
                                <td className="py-1.5 px-2 font-mono font-bold">{c.blood_group}</td>
                                <td className="py-1.5 px-2 font-mono">{c.distance_km} km</td>
                                <td className="py-1.5 px-3 text-red-700">
                                  {c.ineligibility_reason || 'Clinical cooldown active'}
                                  {c.remaining_cooldown_days > 0 && ` (${c.remaining_cooldown_days} days cooldown remaining)`}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </>
          ) : (
            <div className="workbench-panel text-center py-16 text-slate-500 text-xs">
              Select an emergency requisition from the queue on the left.
            </div>
          )}
        </div>

      </div>

      {/* New Requisition Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded border border-slate-200 shadow-xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-red-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Issue Hospital Blood Requisition
                </h3>
              </div>
              <button
                onClick={() => setShowNewRequestModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Requesting Healthcare Facility</label>
                <select
                  value={newReq.hospital_name}
                  onChange={(e) => setNewReq({ ...newReq, hospital_name: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-900"
                >
                  <option value="General Hospital Ernakulam">General Hospital Ernakulam</option>
                  <option value="Government Medical College Kalamassery">Government Medical College Kalamassery</option>
                  <option value="Aluva Taluk Headquarters Hospital">Aluva Taluk Headquarters Hospital</option>
                  <option value="Muvattupuzha General Hospital">Muvattupuzha General Hospital</option>
                  <option value="Amrita Institute of Medical Sciences (AIMS)">Amrita Institute of Medical Sciences (AIMS)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Group Required</label>
                  <select
                    value={newReq.blood_group}
                    onChange={(e) => setNewReq({ ...newReq, blood_group: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white font-mono font-bold text-red-700"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Required Component</label>
                  <select
                    value={newReq.component}
                    onChange={(e) => setNewReq({ ...newReq, component: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-900"
                  >
                    <option value="Whole Blood">Whole Blood</option>
                    <option value="PRBC">Packed Red Blood Cells (PRBC)</option>
                    <option value="Platelets">Platelets / Apheresis (SDP)</option>
                    <option value="FFP">Fresh Frozen Plasma (FFP)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Units Required</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newReq.units_required}
                    onChange={(e) => setNewReq({ ...newReq, units_required: parseInt(e.target.value) || 1 })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Clinical Urgency</label>
                  <select
                    value={newReq.urgency_level}
                    onChange={(e) => setNewReq({ ...newReq, urgency_level: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-900"
                  >
                    <option value="Emergency">Emergency (Immediate)</option>
                    <option value="Critical">Critical (Within 6 hours)</option>
                    <option value="Elective">Elective (Within 24 hours)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Patient ID / Case Code</label>
                <input
                  type="text"
                  value={newReq.patient_code}
                  onChange={(e) => setNewReq({ ...newReq, patient_code: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                  placeholder="e.g. PT-ICU-882"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Indication & Notes</label>
                <textarea
                  rows={2}
                  value={newReq.doctor_notes}
                  onChange={(e) => setNewReq({ ...newReq, doctor_notes: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowNewRequestModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Issue Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
