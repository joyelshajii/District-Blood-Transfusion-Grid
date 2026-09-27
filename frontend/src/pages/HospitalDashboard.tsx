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

      {/* New Requisition / Urgent Intake Modal (Design: 1._urgent_request_matching_intake_1) */}
      {showNewRequestModal && (
        <div className="fixed inset-0 bg-[#0d1c2f]/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-lg border border-[#cbd5e1] shadow-2xl max-w-2xl w-full my-6 overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-[#0d1c2f] text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded bg-[#991b1b] flex items-center justify-center text-white border border-[#760009]">
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    emergency_heat
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      FORM-204 // INTAKE
                    </span>
                    <h3 className="font-headline font-bold text-sm text-white tracking-tight">
                      Initiate Targeted Donor Match
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    District 04 Verified Phlebotomy Network &bull; Cold-Chain &amp; Cooldown Enforced
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewRequestModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleCreateRequest} className="p-5 space-y-4 max-h-[82vh] overflow-y-auto">
              
              {/* Urgency Level Triage Bar */}
              <div className="bg-[#eff4ff] border border-[#cbd5e1] p-3 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <span className="text-xs font-semibold text-[#0d1c2f] block">
                    Clinical Urgency Triage
                  </span>
                  <span className="text-[11px] text-[#565e74]">
                    Determines dispatch propagation and notification priority
                  </span>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-center">
                  {[
                    { key: 'Elective', label: 'Routine (24h)', icon: null },
                    { key: 'Critical', label: 'Critical (<6h)', icon: null },
                    { key: 'Emergency', label: 'STAT Emergency', icon: 'priority_high' },
                  ].map((lvl) => {
                    const isSelected = newReq.urgency_level === lvl.key;
                    return (
                      <button
                        key={lvl.key}
                        type="button"
                        onClick={() => setNewReq({ ...newReq, urgency_level: lvl.key })}
                        className={`px-2.5 py-1 text-xs font-semibold rounded transition-all flex items-center gap-1 ${
                          isSelected
                            ? lvl.key === 'Emergency'
                              ? 'bg-[#991b1b] text-white shadow-xs border border-[#760009]'
                              : lvl.key === 'Critical'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-[#0d1c2f] text-white shadow-xs'
                            : 'bg-white text-[#565e74] border border-[#cbd5e1] hover:border-slate-400'
                        }`}
                      >
                        {lvl.icon && (
                          <span className="material-symbols-outlined text-xs">
                            {lvl.icon}
                          </span>
                        )}
                        <span>{lvl.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Safe Interval Rule Notice */}
              <div className="bg-[#f8f9ff] border-l-4 border-[#991b1b] p-3 rounded-r border-y border-r border-[#cbd5e1] text-xs">
                <div className="flex items-center space-x-1.5 font-bold text-[#991b1b]">
                  <span className="material-symbols-outlined text-sm">verified_user</span>
                  <span>Mandatory Safe Interval Protocol Active</span>
                </div>
                <p className="text-[11px] text-[#565e74] mt-0.5 leading-relaxed">
                  Only donors who have passed their statutory recovery interval (90 days for Whole Blood, 120 days for females, 14 days for Platelets) will be notified. Personal phone numbers remain masked.
                </p>
              </div>

              {/* Section 1: Facility & Patient Details */}
              <div className="space-y-3 pt-1">
                <div className="text-xs font-bold text-[#0d1c2f] uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-[#cbd5e1]">
                  <Building2 className="w-3.5 h-3.5 text-[#991b1b]" />
                  <span>1. Facility &amp; Clinical Authentication</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-[#0d1c2f] mb-1">
                      Requesting Healthcare Facility
                    </label>
                    <select
                      value={newReq.hospital_name}
                      onChange={(e) => {
                        const h = e.target.value;
                        let taluk = 'Kanayannur';
                        if (h.includes('Kalamassery') || h.includes('Aluva')) taluk = 'Aluva';
                        if (h.includes('Muvattupuzha')) taluk = 'Muvattupuzha';
                        setNewReq({ ...newReq, hospital_name: h, hospital_taluk: taluk });
                      }}
                      className="w-full border border-[#cbd5e1] rounded px-3 py-1.5 bg-white text-xs text-[#0d1c2f] focus:border-[#991b1b] focus:ring-1 focus:ring-[#991b1b]"
                    >
                      <option value="General Hospital Ernakulam">General Hospital Ernakulam (Kanayannur)</option>
                      <option value="Government Medical College Kalamassery">Government Medical College Kalamassery (Aluva)</option>
                      <option value="Aluva Taluk Headquarters Hospital">Aluva Taluk Headquarters Hospital (Aluva)</option>
                      <option value="Muvattupuzha General Hospital">Muvattupuzha General Hospital (Muvattupuzha)</option>
                      <option value="Amrita Institute of Medical Sciences (AIMS)">Amrita Institute of Medical Sciences - AIMS (Kanayannur)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#0d1c2f] mb-1">
                      Patient Code / Token
                    </label>
                    <input
                      type="text"
                      required
                      value={newReq.patient_code}
                      onChange={(e) => setNewReq({ ...newReq, patient_code: e.target.value })}
                      className="w-full border border-[#cbd5e1] rounded px-3 py-1.5 bg-white text-xs font-mono font-bold text-[#0d1c2f] focus:border-[#991b1b] focus:ring-1 focus:ring-[#991b1b]"
                      placeholder="e.g. PT-ER-904"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Blood Phenotype & Component */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-[#0d1c2f] uppercase tracking-wider flex items-center justify-between pb-1 border-b border-[#cbd5e1]">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#991b1b]">bloodtype</span>
                    <span>2. Target Blood Phenotype &amp; Component</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#991b1b] font-semibold">
                    Selected: {newReq.blood_group} &bull; {newReq.component}
                  </span>
                </div>

                {/* Blood Group Pill Grid */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#565e74] mb-1.5 uppercase tracking-wider">
                    Select Target ABO / Rh Factor:
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => {
                      const isSelected = newReq.blood_group === bg;
                      const isUniversal = bg === 'O-';
                      return (
                        <button
                          key={bg}
                          type="button"
                          onClick={() => setNewReq({ ...newReq, blood_group: bg })}
                          className={`p-2 rounded border text-center transition-all relative ${
                            isSelected
                              ? 'bg-[#991b1b] text-white border-[#760009] shadow-xs'
                              : 'bg-white text-[#0d1c2f] border-[#cbd5e1] hover:border-[#991b1b] hover:bg-[#eff4ff]'
                          }`}
                        >
                          {isUniversal && (
                            <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-[#0d1c2f] text-white text-[7px] font-bold px-1 rounded uppercase tracking-wider">
                              Univ
                            </span>
                          )}
                          <span className="font-headline font-bold text-sm block">
                            {bg}
                          </span>
                          <span className={`text-[9px] font-mono block ${isSelected ? 'text-red-200' : 'text-[#565e74]'}`}>
                            {bg.includes('-') ? 'Rh Neg' : 'Rh Pos'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Component Type Cards */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#565e74] mb-1.5 uppercase tracking-wider">
                    Component Type:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { key: 'Whole Blood', sub: 'CPDA-1 // 35d Shelf', icon: 'water_drop' },
                      { key: 'PRBC', sub: 'Packed Cells // 42d', icon: 'science' },
                      { key: 'Platelets', sub: 'Agitated 22°C // 5d', icon: 'grain' },
                      { key: 'FFP', sub: '-18°C Deep Frost', icon: 'ac_unit' },
                    ].map((comp) => {
                      const isSelected = newReq.component === comp.key;
                      return (
                        <button
                          key={comp.key}
                          type="button"
                          onClick={() => setNewReq({ ...newReq, component: comp.key })}
                          className={`p-2.5 rounded border text-left transition-all ${
                            isSelected
                              ? 'bg-[#eff4ff] border-[#991b1b] ring-1 ring-[#991b1b]'
                              : 'bg-white border-[#cbd5e1] hover:border-slate-400'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[#991b1b]">
                            <span className="material-symbols-outlined text-base">
                              {comp.icon}
                            </span>
                            <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#991b1b]' : 'bg-slate-300'}`}></span>
                          </div>
                          <div className="font-semibold text-xs text-[#0d1c2f] mt-1">
                            {comp.key}
                          </div>
                          <div className="text-[10px] text-[#565e74] font-mono mt-0.5">
                            {comp.sub}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Units Counter & Stepper */}
                <div className="bg-[#eff4ff] p-3 rounded border border-[#cbd5e1] flex items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold text-xs text-[#0d1c2f] block">
                      Units Required (Units / Pints)
                    </span>
                    <span className="text-[11px] text-[#565e74]">
                      Emergency initial trauma draw typically 2–4 units
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white border border-[#cbd5e1] rounded p-1">
                    <button
                      type="button"
                      onClick={() => setNewReq({ ...newReq, units_required: Math.max(1, newReq.units_required - 1) })}
                      className="w-7 h-7 rounded flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-mono font-bold text-base text-[#991b1b]">
                      {newReq.units_required}
                    </span>
                    <button
                      type="button"
                      onClick={() => setNewReq({ ...newReq, units_required: Math.min(10, newReq.units_required + 1) })}
                      className="w-7 h-7 rounded flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 3: Clinical Diagnosis & Doctor's Notes */}
              <div className="space-y-2 pt-2">
                <label className="block text-[11px] font-semibold text-[#0d1c2f]">
                  Clinical Diagnosis &amp; Transfusion Indication Notes
                </label>
                <textarea
                  rows={2}
                  required
                  value={newReq.doctor_notes}
                  onChange={(e) => setNewReq({ ...newReq, doctor_notes: e.target.value })}
                  placeholder="e.g. Acute gastrointestinal bleed. Emergency bedside uncrossmatched O- transfusion requested."
                  className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-xs text-[#0d1c2f] focus:border-[#991b1b] focus:ring-1 focus:ring-[#991b1b]"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-[#cbd5e1] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewRequestModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-4 shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">
                    send
                  </span>
                  <span>Issue Requisition &amp; Run Match</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
