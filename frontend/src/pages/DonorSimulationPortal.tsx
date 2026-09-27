import React, { useState, useEffect } from 'react';
import { api, DonorDispatchView, DonorProfile } from '../services/api';
import {
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Phone,
  User,
  ArrowRight,
  Sparkles,
  Smartphone,
  QrCode,
  Heart,
  Navigation
} from 'lucide-react';

interface DonorSimulationPortalProps {
  initialToken?: string;
  onNavigateToHospital: () => void;
}

export const DonorSimulationPortal: React.FC<DonorSimulationPortalProps> = ({
  initialToken,
  onNavigateToHospital,
}) => {
  const [donors, setDonors] = useState<DonorProfile[]>([]);
  const [selectedDonorId, setSelectedDonorId] = useState<string>('donor-001');
  const [tokenInput, setTokenInput] = useState<string>(initialToken || '');
  const [dispatchData, setDispatchData] = useState<DonorDispatchView | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<string>('');
  const [donorNote, setDonorNote] = useState<string>('Can reach hospital in 25 minutes.');
  const [selectedEta, setSelectedEta] = useState<string>('25 mins');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    loadDonors();
  }, []);

  useEffect(() => {
    if (initialToken) {
      setTokenInput(initialToken);
      fetchDispatch(initialToken);
    }
  }, [initialToken]);

  const loadDonors = async () => {
    try {
      const list = await api.getDonors();
      setDonors(list);
    } catch (err) {
      console.error('Failed to load donors:', err);
    }
  };

  const fetchDispatch = async (token: string) => {
    if (!token.trim()) return;
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await api.getDonorDispatch(token.trim());
      setDispatchData(data);
      setResponseStatus(data.status);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid or expired dispatch token');
      setDispatchData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (action: 'ACCEPT' | 'DECLINE') => {
    if (!dispatchData) return;
    setLoading(true);
    try {
      const res = await api.respondToDispatch(dispatchData.token, action, `${donorNote} (ETA: ${selectedEta})`);
      setResponseStatus(res.status);
      setDispatchData({ ...dispatchData, status: res.status });
    } catch (err: any) {
      alert(err.message || 'Failed to submit response');
    } finally {
      setLoading(false);
    }
  };

  const selectedDonor = donors.find((d) => d.id === selectedDonorId);

  // Calculate days since last donation for selected donor persona
  let daysSinceLast = 0;
  let cooldownRemaining = 0;
  let isEligible = true;
  let requiredInterval = 90;

  if (selectedDonor) {
    requiredInterval = selectedDonor.gender === 'F' ? 120 : 90;
    if (selectedDonor.last_donation_component === 'Platelets') {
      requiredInterval = 14;
    }
    if (selectedDonor.last_donation_date) {
      const lastDate = new Date(selectedDonor.last_donation_date);
      const today = new Date('2026-09-17');
      const diffTime = Math.abs(today.getTime() - lastDate.getTime());
      daysSinceLast = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (daysSinceLast < requiredInterval) {
        isEligible = false;
        cooldownRemaining = requiredInterval - daysSinceLast;
      }
    }
  }

  const intervalPercent = Math.min(100, Math.round((daysSinceLast / requiredInterval) * 100));

  return (
    <div className="space-y-5">
      
      {/* Simulation Context Ribbon */}
      <div className="workbench-panel p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-white uppercase tracking-wider">
              Volunteer Mobile Simulator
            </span>
            <span className="text-xs text-slate-500 font-semibold">Privacy Protection &amp; Consent Unmasking</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 mt-1">
            Experience the Volunteer Perspective &bull; Challenge SC-12
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 max-w-3xl">
            Volunteers receive tokenized alerts without their personal telephone number or legal name exposed to the hospital. Contact details are unmasked exclusively upon explicit confirmation.
          </p>
        </div>

        <button
          onClick={onNavigateToHospital}
          className="btn-secondary text-xs self-start sm:self-auto flex items-center space-x-1.5"
        >
          <span>Return to Hospital Command</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Volunteer Health & Deferral Passport (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Persona Selection Panel */}
          <div className="workbench-panel p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Simulated Volunteer Personas
              </span>
              <span className="text-[10px] font-mono text-slate-500">Select persona</span>
            </div>

            <div className="space-y-2">
              <div
                onClick={() => {
                  setSelectedDonorId('donor-001');
                  setDispatchData(null);
                }}
                className={`p-3 rounded border transition-all cursor-pointer ${
                  selectedDonorId === 'donor-001'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs">Arun Narayanan</div>
                  <span
                    className={`badge ${
                      selectedDonorId === 'donor-001'
                        ? 'bg-slate-800 text-emerald-300 border-slate-700'
                        : 'badge-eligible'
                    }`}
                  >
                    B+ Eligible
                  </span>
                </div>
                <div
                  className={`text-[11px] mt-1 ${
                    selectedDonorId === 'donor-001' ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  Male &bull; Last donated 130 days ago (90-day cooldown cleared)
                </div>
              </div>

              <div
                onClick={() => {
                  setSelectedDonorId('donor-002');
                  setDispatchData(null);
                }}
                className={`p-3 rounded border transition-all cursor-pointer ${
                  selectedDonorId === 'donor-002'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs">Fathima Basheer</div>
                  <span
                    className={`badge ${
                      selectedDonorId === 'donor-002'
                        ? 'bg-slate-800 text-amber-300 border-slate-700'
                        : 'badge-cooldown'
                    }`}
                  >
                    B+ Cooldown Active
                  </span>
                </div>
                <div
                  className={`text-[11px] mt-1 ${
                    selectedDonorId === 'donor-002' ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  Female &bull; Last donated 28 days ago (92 days remaining &bull; protected from spam)
                </div>
              </div>

              <div
                onClick={() => {
                  setSelectedDonorId('donor-004');
                  setDispatchData(null);
                }}
                className={`p-3 rounded border transition-all cursor-pointer ${
                  selectedDonorId === 'donor-004'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs">Sneha Kurian</div>
                  <span
                    className={`badge ${
                      selectedDonorId === 'donor-004'
                        ? 'bg-slate-800 text-emerald-300 border-slate-700'
                        : 'badge-eligible'
                    }`}
                  >
                    O- Universal Red Cell
                  </span>
                </div>
                <div
                  className={`text-[11px] mt-1 ${
                    selectedDonorId === 'donor-004' ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  Female &bull; Last donated 165 days ago (Cleared 120-day interval)
                </div>
              </div>
            </div>
          </div>

          {/* Volunteer Clinical Passport & Interval Gauge */}
          {selectedDonor && (
            <div className="workbench-panel p-4 space-y-3.5">
              
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-slate-700" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Digital Health Passport
                  </span>
                </div>
                <span className="font-mono text-xs text-slate-500">{selectedDonor.code_name}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">Blood Group</span>
                  <span className="font-bold text-base text-red-700 font-mono">{selectedDonor.blood_group}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Registered Taluk</span>
                  <span className="font-semibold text-slate-800">{selectedDonor.taluk}, Ernakulam</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Demographics</span>
                  <span className="font-medium text-slate-700">
                    {selectedDonor.gender === 'M' ? 'Male' : 'Female'} &bull; {selectedDonor.weight_kg} kg
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Previous Donation</span>
                  <span className="font-mono font-medium text-slate-700">{selectedDonor.last_donation_date}</span>
                </div>
              </div>

              {/* Progress Recovery Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">Interval Recovery Progress:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {daysSinceLast} / {requiredInterval} Days ({intervalPercent}%)
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded h-2 overflow-hidden border border-slate-200">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isEligible ? 'bg-emerald-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${intervalPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Eligibility Verification Card */}
              <div
                className={`p-3 rounded border text-xs ${
                  isEligible
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50/70 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {isEligible ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold">
                      {isEligible ? 'Clinically Eligible to Donate' : 'Clinical Recovery Cooldown Active'}
                    </div>
                    <div className="text-[11px] mt-0.5 leading-relaxed">
                      {isEligible ? (
                        <>
                          {daysSinceLast} days have elapsed. You meet the NBTC clinical safety interval ({requiredInterval} days for whole blood) and can accept hospital requests.
                        </>
                      ) : (
                        <>
                          Donated whole blood {daysSinceLast} days ago. Mandatory recovery interval requires {requiredInterval}{' '}
                          days ({cooldownRemaining} days remaining). You are protected from hospital alerts to preserve ferritin levels.
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cryptographic Protection Guarantee */}
              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-slate-600 text-[11px] space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                  <span>Privacy Guarantee (DPDPA 2023)</span>
                </div>
                <p>
                  Your phone number (<code>{selectedDonor.phone}</code>) is stored in an encrypted table and is never exposed in hospital candidate tables or public registries.
                </p>
              </div>

            </div>
          )}

          {/* Quick Dispatch Token Inspector */}
          <div className="workbench-panel p-4 space-y-2 text-xs">
            <span className="font-bold text-slate-900 uppercase tracking-wider block text-[11px]">
              Inspect Alert by Cryptographic Token
            </span>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Paste 32-char token..."
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="flex-1 text-xs border border-slate-300 rounded px-2.5 py-1.5 font-mono"
              />
              <button
                onClick={() => fetchDispatch(tokenInput)}
                disabled={loading || !tokenInput}
                className="btn-primary text-xs py-1.5 px-3"
              >
                Inspect
              </button>
            </div>
            {errorMessage && (
              <p className="text-[11px] text-red-600 font-medium">{errorMessage}</p>
            )}
          </div>

        </div>

        {/* Right Column: Simulated Volunteer Mobile Screen (Design: 3._donor_alert_decision_portal) */}
        <div className="lg:col-span-7 space-y-4">
          
          {dispatchData ? (
            <div className="workbench-panel p-5 sm:p-6 space-y-5 border border-[#cbd5e1] relative overflow-hidden">
              
              {/* STAT Requisition Protocol Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#cbd5e1] gap-3">
                <div className="flex items-start sm:items-center space-x-3">
                  <div className="p-2.5 bg-[#fef2f2] text-[#991b1b] rounded-lg border border-[#fecaca] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">priority_high</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-headline font-bold text-sm sm:text-base text-[#0d1c2f] tracking-tight">
                        STAT Blood Requisition Protocol
                      </span>
                      <span className="px-2 py-0.5 bg-[#991b1b] text-white font-mono text-[10px] font-bold rounded uppercase tracking-wider">
                        Priority 1 Active
                      </span>
                    </div>
                    <p className="text-[11px] text-[#565e74] mt-0.5 font-mono">
                      Token: {dispatchData.token.slice(0, 16)}... &bull; District Registry 04
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-[#f8f9ff] px-3 py-1.5 rounded-lg border border-[#cbd5e1] self-start sm:self-center">
                  <div className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#991b1b] font-headline font-bold text-xs">
                    {dispatchData.blood_group_required}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-[#0d1c2f] block font-mono">{dispatchData.donor_code_name}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      Interval Cleared
                    </span>
                  </div>
                </div>
              </div>

              {/* District Verified Match Alert Notice */}
              <div className="bg-[#eff4ff] border-l-4 border-[#991b1b] rounded-r-lg p-3.5 border-y border-r border-[#cbd5e1] text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#991b1b] text-lg mt-0.5">verified_user</span>
                  <div>
                    <h4 className="font-bold text-[#991b1b]">District Verified Match Alert</h4>
                    <p className="text-[#0d1c2f] text-[11px] mt-0.5 leading-relaxed">
                      You are receiving this alert because your <strong className="text-[#991b1b]">{dispatchData.blood_group_required}</strong> blood group matches an urgent clinical demand and you have completed your mandatory statutory donation interval.
                    </p>
                  </div>
                </div>
              </div>

              {/* Emergency Requisition Details Bento Grid */}
              <div className="bg-[#f8f9ff] rounded-lg border border-[#cbd5e1] p-4 space-y-3 relative overflow-hidden">
                <div className="flex items-center gap-2 pb-2 border-b border-[#cbd5e1]">
                  <span className="material-symbols-outlined text-[#991b1b] text-lg">local_hospital</span>
                  <h3 className="font-headline font-bold text-xs text-[#0d1c2f] uppercase tracking-wider">
                    Emergency Requisition Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Facility Card */}
                  <div className="sm:col-span-2 bg-white p-3 rounded border border-[#cbd5e1]">
                    <span className="text-[10px] font-mono font-bold text-[#565e74] uppercase tracking-wider block">
                      Receiving Facility &amp; Unit
                    </span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-headline font-bold text-sm text-[#0d1c2f]">{dispatchData.hospital_name}</span>
                      <span className="px-2 py-0.5 bg-[#991b1b] text-white text-[10px] font-bold rounded">
                        Trauma Wing
                      </span>
                    </div>
                    <p className="text-[11px] text-[#565e74] mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#565e74]" />
                      <span>{dispatchData.hospital_taluk}, Ernakulam Sector</span>
                    </p>
                  </div>

                  {/* Proximity Card */}
                  <div className="bg-white p-3 rounded border border-[#cbd5e1]">
                    <span className="text-[10px] font-mono font-bold text-[#565e74] uppercase tracking-wider block">
                      Proximity / Travel
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="font-headline font-bold text-xl text-[#0d1c2f] font-mono">{dispatchData.distance_km}</span>
                      <span className="text-xs text-[#565e74]">km away</span>
                    </div>
                    <p className="text-[11px] text-[#565e74] mt-1 flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-[#991b1b]" />
                      <span>Estimated ~15–25m drive</span>
                    </p>
                  </div>

                  {/* Urgency Card */}
                  <div className="bg-white p-3 rounded border border-[#cbd5e1]">
                    <span className="text-[10px] font-mono font-bold text-[#565e74] uppercase tracking-wider block">
                      Time Sensitivity
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="font-headline font-bold text-xl text-[#991b1b]">{dispatchData.urgency_level}</span>
                    </div>
                    <p className="text-[11px] text-[#991b1b] font-medium mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Required for immediate transfusion</span>
                    </p>
                  </div>

                  {/* Blood Group Matrix Card */}
                  <div className="bg-white p-3 rounded border border-[#cbd5e1] flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-[#991b1b] text-white flex flex-col items-center justify-center font-bold shrink-0 shadow-2xs">
                      <span className="text-base leading-none font-headline">{dispatchData.blood_group_required}</span>
                      <span className="text-[8px] uppercase tracking-tighter">Match</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#565e74] uppercase tracking-wider block">Target Specimen</span>
                      <span className="font-bold text-xs text-[#0d1c2f] block">{dispatchData.component}</span>
                      <span className="text-[10px] text-[#565e74]">Direct crossmatch candidate</span>
                    </div>
                  </div>

                  {/* Units Required Card */}
                  <div className="bg-white p-3 rounded border border-[#cbd5e1] flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-[#eff4ff] border border-[#cbd5e1] text-[#0d1c2f] flex flex-col items-center justify-center font-bold shrink-0">
                      <span className="text-lg leading-none font-mono text-[#991b1b]">{dispatchData.units_required}</span>
                      <span className="text-[8px] uppercase tracking-wider text-[#565e74]">Units</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#565e74] uppercase tracking-wider block">Volume Required</span>
                      <span className="font-bold text-xs text-[#0d1c2f] block">{dispatchData.units_required} Units Requested</span>
                      <span className="text-[10px] text-[#565e74]">For emergency clinical reserve</span>
                    </div>
                  </div>
                </div>

                {/* Doctor's Case Indication */}
                <div className="bg-white p-3 rounded border border-[#cbd5e1] text-xs">
                  <span className="font-semibold text-[#0d1c2f]">Attending Physician Note:</span>{' '}
                  <span className="text-[#565e74] italic">{dispatchData.doctor_notes}</span>
                </div>
              </div>

              {/* Simulated Route & Priority Parking Schematic Widget */}
              <div className="bg-white rounded-lg border border-[#cbd5e1] overflow-hidden shadow-2xs text-xs">
                <div className="p-3 bg-[#eff4ff] border-b border-[#cbd5e1] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-[#0d1c2f]">
                    <span className="material-symbols-outlined text-sm text-[#991b1b]">explore</span>
                    <span>Arrival &amp; STAT Fast-Track Protocol</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#565e74]">TRAUMA BAY 104-B</span>
                </div>
                <div className="relative h-28 bg-[#0d1c2f] overflow-hidden flex items-center justify-between px-6">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-2.5 py-1.5 rounded border border-white/20 text-white font-mono text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Your Location</span>
                  </div>
                  <div className="h-0.5 flex-1 mx-4 bg-gradient-to-r from-emerald-400 via-amber-300 to-[#991b1b] border-dashed"></div>
                  <div className="flex items-center gap-2 bg-[#991b1b] text-white px-3 py-1.5 rounded-lg border border-white/20 font-mono text-[11px] shadow-sm">
                    <span className="material-symbols-outlined text-sm">local_hospital</span>
                    <span>{dispatchData.hospital_name.split(' ')[0]} ETU</span>
                  </div>
                </div>
                <div className="p-3 bg-[#f8f9ff] text-[11px] text-[#565e74] flex items-center justify-between">
                  <span>Fast-Track Intercom PIN: <strong className="font-mono text-[#0d1c2f]">#4082</strong></span>
                  <span className="text-emerald-700 font-semibold">Priority Ambulance Gate Clearance</span>
                </div>
              </div>

              {/* Strict Medical Privacy Masking Card (HIPAA / DPDPA) */}
              <div className="bg-[#eff4ff] rounded-lg border border-[#cbd5e1] p-3.5 space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white rounded text-[#0d1c2f] border border-[#cbd5e1]">
                    <Lock className="w-3.5 h-3.5 text-[#047857]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0d1c2f] flex items-center gap-2">
                      Strict Cryptographic Privacy Masking Active
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white text-[#565e74] border border-[#cbd5e1]">
                        DPDPA 2023 TIER-3
                      </span>
                    </h4>
                    <p className="text-[11px] text-[#565e74] leading-relaxed">
                      Your phone number and identity remain <strong className="text-[#0d1c2f]">COMPLETELY HIDDEN</strong> from the hospital. Contact details are only transmitted to the verified transfusion desk if you explicitly click <strong className="text-[#991b1b]">Accept &amp; Commit to Donate</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Decision Protocol Hub */}
              {responseStatus === 'ACCEPTED' ? (
                <div className="p-5 bg-[#f0fdf4] rounded-lg border-2 border-[#047857] text-xs space-y-3.5 shadow-sm">
                  <div className="flex items-center space-x-2.5 text-[#00402d] font-bold">
                    <div className="w-8 h-8 rounded-full bg-[#047857] text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-sm">Commitment Authenticated &bull; Fast-Track Issued</h4>
                      <p className="text-[11px] text-[#00402d] font-normal">
                        Contact unmasked exclusively to the Blood Bank Desk at <strong>{dispatchData.hospital_name}</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded border border-emerald-200 text-xs space-y-1.5 font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Fast-Track Pass Token:</span>
                      <span className="font-bold text-[#991b1b]">#PASS-{dispatchData.token.slice(0, 8).toUpperCase()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Confirmed Window:</span>
                      <span className="font-bold text-emerald-800">{selectedEta}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Gate Intercom Access PIN:</span>
                      <span className="font-bold text-[#0d1c2f]">4082</span>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center space-x-3">
                    <button
                      onClick={onNavigateToHospital}
                      className="btn-primary text-xs py-2 px-4 flex items-center space-x-1.5 shadow-xs"
                    >
                      <span>Return to Hospital View to verify unmasked contact</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : responseStatus === 'DECLINED' ? (
                <div className="p-4 bg-[#f8f9ff] rounded-lg border border-[#cbd5e1] text-xs space-y-2">
                  <div className="flex items-center space-x-2 text-[#0d1c2f] font-bold">
                    <XCircle className="w-5 h-5 text-slate-500" />
                    <span>Request Safely Deferred</span>
                  </div>
                  <p className="text-[#565e74] text-xs leading-relaxed">
                    Your contact information remained strictly confidential. The dispatch engine has re-routed the notification to the next qualified candidate without penalty.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 pt-1">
                  
                  {/* Response Window Timer */}
                  <div className="p-2.5 bg-[#fef2f2] border border-[#fecaca] rounded flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[#991b1b] font-semibold">
                      <Clock className="w-4 h-4 animate-pulse" />
                      <span>Response Window Closing:</span>
                    </div>
                    <span className="font-mono font-bold text-[#991b1b] text-sm">
                      00:18:42 STAT
                    </span>
                  </div>

                  {/* ETA Selector & Donor Note */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-[#0d1c2f] mb-1">
                        Select Estimated Arrival Window:
                      </label>
                      <select
                        value={selectedEta}
                        onChange={(e) => setSelectedEta(e.target.value)}
                        className="w-full border border-[#cbd5e1] rounded px-3 py-2 bg-white text-[#0d1c2f] font-medium focus:border-[#991b1b]"
                      >
                        <option value="15 to 25 mins">Within 15 to 25 mins</option>
                        <option value="25 to 35 mins">Within 25 to 35 mins</option>
                        <option value="35 to 50 mins">Within 35 to 50 mins</option>
                        <option value="60 mins">Within 60 mins</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#0d1c2f] mb-1">
                        Transit Note for Receiving Bay:
                      </label>
                      <input
                        type="text"
                        value={donorNote}
                        onChange={(e) => setDonorNote(e.target.value)}
                        placeholder="e.g. Can arrive in 20 mins by car"
                        className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-xs focus:border-[#991b1b]"
                      />
                    </div>
                  </div>

                  {/* Accept / Decline Triggers */}
                  <div className="space-y-2.5 pt-1">
                    <button
                      onClick={() => handleRespond('ACCEPT')}
                      disabled={loading}
                      className="w-full py-3 px-4 bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-headline font-bold text-sm rounded-lg shadow-sm hover:shadow active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Accept &amp; Commit to Donate (Unmask Contact)</span>
                    </button>

                    <div className="relative py-1 flex items-center justify-center">
                      <div className="w-full border-t border-[#cbd5e1]"></div>
                      <span className="absolute bg-white px-2 text-[10px] font-mono text-[#565e74]">OR</span>
                    </div>

                    <button
                      onClick={() => handleRespond('DECLINE')}
                      disabled={loading}
                      className="w-full py-2 px-3 bg-white hover:bg-[#f8f9ff] text-[#565e74] hover:text-[#0d1c2f] text-xs font-semibold rounded border border-[#cbd5e1] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4 text-slate-400" />
                      <span>Decline (Not Available Today &bull; Keep Private)</span>
                    </button>
                  </div>

                </div>
              )}

            </div>
          ) : (
            /* Empty State Explaining How to Test */
            <div className="workbench-panel text-center py-16 px-4 space-y-3">
              <div className="w-12 h-12 bg-[#eff4ff] text-[#991b1b] rounded-lg flex items-center justify-center mx-auto border border-[#cbd5e1]">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="font-headline font-bold text-sm text-[#0d1c2f]">
                  No Active Invitation Selected
                </h3>
                <p className="text-xs text-[#565e74] leading-relaxed">
                  To test the interactive invitation loop, open the <strong>Command Console</strong> tab, run the matching engine on any open requisition, and click <strong>Notify</strong> on an eligible candidate.
                </p>
                <div className="pt-3">
                  <button
                    onClick={onNavigateToHospital}
                    className="btn-primary text-xs py-2 px-4 shadow-sm"
                  >
                    Go to Command Console
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
