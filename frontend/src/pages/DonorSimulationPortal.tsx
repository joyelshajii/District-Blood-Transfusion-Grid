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
  Navigation,
  Printer,
  Download,
  Bell,
  Volume2
} from 'lucide-react';
import { QRCodeSVG } from '../utils/qrCode';
import { BarcodeSVG } from '../utils/barcode';
import { pushNotifications } from '../utils/pushNotification';
import { soundEngine } from '../utils/soundEngine';

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
  const [pushPerm, setPushPerm] = useState<string>(pushNotifications.getPermission());

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
      if (data.status === 'PENDING') {
        soundEngine.playCodeCrimsonAlert();
      }
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
      if (action === 'ACCEPT') {
        soundEngine.playAcceptanceSuccessChime();
      }
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
      <div className="workbench-panel p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#cbd5e1]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#991b1b] text-white uppercase tracking-wider">
              DONOR HUB // MOBILE SIMULATOR
            </span>
            <span className="text-xs text-[#565e74] font-semibold">Challenge SC-12: Volunteer Privacy &amp; Cooldown</span>
          </div>
          <h2 className="font-headline font-bold text-base text-[#0d1c2f] mt-1">
            Volunteer Identity &amp; Biological Recovery Dashboard
          </h2>
          <p className="text-xs text-[#565e74] mt-0.5 max-w-3xl">
            Volunteers receive direct tokenized alerts without their personal telephone number or legal identity exposed to hospital staff. Contact details are unmasked exclusively upon explicit confirmation.
          </p>
        </div>

        <button
          onClick={onNavigateToHospital}
          className="btn-secondary text-xs self-start sm:self-auto flex items-center space-x-1.5 shadow-xs"
        >
          <span>Return to Command Console</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Volunteer Health & Deferral Passport (Design: 5._donor_profile_health_dashboard) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Persona Selection Panel */}
          <div className="workbench-panel p-4 space-y-3 border border-[#cbd5e1]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0d1c2f] uppercase tracking-wider font-headline">
                Simulated Volunteer Personas
              </span>
              <span className="text-[10px] font-mono text-[#565e74]">Switch persona</span>
            </div>

            <div className="space-y-2">
              <div
                onClick={() => {
                  setSelectedDonorId('donor-001');
                  setDispatchData(null);
                }}
                className={`p-3 rounded-md border transition-all cursor-pointer relative overflow-hidden ${
                  selectedDonorId === 'donor-001'
                    ? 'bg-[#eff4ff] border-2 border-[#991b1b] shadow-xs'
                    : 'bg-white hover:bg-[#f8f9ff] border-[#cbd5e1]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-[#0d1c2f] font-headline">Arun Narayanan</div>
                  <span className="badge badge-eligible">
                    B+ Cleared ✓
                  </span>
                </div>
                <div className="text-[11px] mt-1 text-[#565e74]">
                  Male &bull; Last donated 130 days ago (90-day cooldown cleared)
                </div>
              </div>

              <div
                onClick={() => {
                  setSelectedDonorId('donor-002');
                  setDispatchData(null);
                }}
                className={`p-3 rounded-md border transition-all cursor-pointer relative overflow-hidden ${
                  selectedDonorId === 'donor-002'
                    ? 'bg-[#eff4ff] border-2 border-[#991b1b] shadow-xs'
                    : 'bg-white hover:bg-[#f8f9ff] border-[#cbd5e1]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-[#0d1c2f] font-headline">Fathima Basheer</div>
                  <span className="badge badge-cooldown">
                    B+ Cooldown Active
                  </span>
                </div>
                <div className="text-[11px] mt-1 text-[#565e74]">
                  Female &bull; Last donated 28 days ago (92 days remaining &bull; protected from spam)
                </div>
              </div>

              <div
                onClick={() => {
                  setSelectedDonorId('donor-004');
                  setDispatchData(null);
                }}
                className={`p-3 rounded-md border transition-all cursor-pointer relative overflow-hidden ${
                  selectedDonorId === 'donor-004'
                    ? 'bg-[#eff4ff] border-2 border-[#991b1b] shadow-xs'
                    : 'bg-white hover:bg-[#f8f9ff] border-[#cbd5e1]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-[#0d1c2f] font-headline">Sneha Kurian</div>
                  <span className="badge badge-eligible">
                    O- Universal Red Cell
                  </span>
                </div>
                <div className="text-[11px] mt-1 text-[#565e74]">
                  Female &bull; Last donated 165 days ago (Cleared 120-day interval)
                </div>
              </div>
            </div>
          </div>

          {/* Volunteer Clinical Passport & Radial Interval Gauge */}
          {selectedDonor && (
            <div className="workbench-panel p-4 sm:p-5 space-y-4 border border-[#cbd5e1]">
              
              {/* Header Profile Identity Capsule */}
              <div className="flex items-center justify-between pb-3 border-b border-[#cbd5e1]">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded bg-[#991b1b] text-white flex items-center justify-center font-headline font-bold text-base shadow-xs">
                      {selectedDonor.code_name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="absolute -bottom-1 -right-1 bg-[#0d1c2f] text-white text-[9px] font-bold px-1 rounded font-mono">
                      {selectedDonor.blood_group}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-sm text-[#0d1c2f]">
                      {selectedDonor.code_name}
                    </h3>
                    <span className="text-[11px] font-mono text-[#565e74]">
                      ID: {selectedDonor.id} &bull; {selectedDonor.taluk}
                    </span>
                  </div>
                </div>

                <span
                  className={`badge ${isEligible ? 'badge-eligible' : 'badge-cooldown'}`}
                >
                  {isEligible ? 'Dispatch Ready' : 'Cooldown Restraint'}
                </span>
              </div>

              {/* Radial Progress Gauge & Summary */}
              <div className="bg-[#f8f9ff] p-4 rounded-lg border border-[#cbd5e1] flex flex-col sm:flex-row items-center gap-4">
                {/* SVG Radial Gauge */}
                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      className="stroke-[#dde9ff]"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      className={isEligible ? 'stroke-emerald-600' : 'stroke-amber-500'}
                      strokeWidth="10"
                      strokeDasharray="314.159"
                      strokeDashoffset={314.159 - (314.159 * intervalPercent) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-headline font-extrabold text-xl text-[#0d1c2f] leading-none">
                      {isEligible ? '0' : cooldownRemaining}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#565e74]">
                      {isEligible ? 'Days Left' : 'Days Rest'}
                    </span>
                  </div>
                </div>

                {/* Gauge Summary Text */}
                <div className="space-y-1.5 flex-1 text-center sm:text-left text-xs">
                  <div className={`font-bold ${isEligible ? 'text-[#047857]' : 'text-amber-800'}`}>
                    {isEligible ? 'Smart Interval: 100% Cleared ✓' : 'Biological Cooldown Active'}
                  </div>
                  <p className="text-[11px] text-[#565e74] leading-relaxed">
                    {isEligible
                      ? `${daysSinceLast} days since last donation. Ferritin and hemodynamic thresholds fully restored.`
                      : `Donated ${daysSinceLast} days ago. Mandatory recovery interval requires ${requiredInterval} days.`}
                  </p>

                  {/* Telemetry bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] font-mono text-[#565e74]">
                      <span>{requiredInterval}-Day Interval:</span>
                      <span className="font-bold text-[#0d1c2f]">{daysSinceLast} / {requiredInterval}d</span>
                    </div>
                    <div className="w-full bg-[#dde9ff] rounded h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${isEligible ? 'bg-emerald-600' : 'bg-amber-500'}`}
                        style={{ width: `${intervalPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modality Clinical Eligibility Matrix */}
              <div className="space-y-2 pt-1 text-xs">
                <span className="text-[11px] font-bold text-[#0d1c2f] uppercase tracking-wider block font-headline">
                  Modality Clinical Eligibility Matrix
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 bg-white rounded border border-[#cbd5e1] text-center">
                    <span className="text-[10px] text-[#565e74] block font-medium">Whole Blood</span>
                    <span className="font-mono text-xs font-bold text-[#0d1c2f] mt-0.5 block">{requiredInterval}d</span>
                    <span className={`text-[10px] font-bold block mt-0.5 ${isEligible ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {isEligible ? 'Cleared ✓' : 'Resting'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded border border-[#cbd5e1] text-center">
                    <span className="text-[10px] text-[#565e74] block font-medium">Platelets</span>
                    <span className="font-mono text-xs font-bold text-[#0d1c2f] mt-0.5 block">14d</span>
                    <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">Cleared ✓</span>
                  </div>

                  <div className="p-2.5 bg-white rounded border border-[#cbd5e1] text-center">
                    <span className="text-[10px] text-[#565e74] block font-medium">Plasma</span>
                    <span className="font-mono text-xs font-bold text-[#0d1c2f] mt-0.5 block">28d</span>
                    <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">Cleared ✓</span>
                  </div>
                </div>
              </div>

              {/* Spam Protection Guarantee Notice */}
              <div className="p-3 bg-[#eff4ff] border-l-4 border-[#991b1b] rounded-r text-xs space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-[#991b1b]">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  <span>Zero Broadcast Fatigue Guarantee</span>
                </div>
                <p className="text-[11px] text-[#565e74] leading-relaxed">
                  Your phone number (<code>{selectedDonor.phone}</code>) is permanently encrypted. You only receive direct alerts when your exact blood group is in STAT need within your taluk.
                </p>
              </div>

            </div>
          )}

          {/* Quick Dispatch Token Inspector */}
          <div className="workbench-panel p-4 space-y-2.5 text-xs border border-[#cbd5e1]">
            <span className="font-bold text-[#0d1c2f] uppercase tracking-wider block text-[11px] font-headline">
              Inspect Alert by Cryptographic Token
            </span>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Paste 32-char token..."
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="flex-1 text-xs border border-[#cbd5e1] rounded px-3 py-1.5 font-mono focus:border-[#991b1b]"
              />
              <button
                onClick={() => fetchDispatch(tokenInput)}
                disabled={loading || !tokenInput}
                className="btn-primary text-xs py-1.5 px-3 shadow-xs"
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

              {/* Browser Push & Acoustic Notification Telemetry Bar */}
              <div className="bg-white rounded-lg border border-[#cbd5e1] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
                <div className="flex items-center space-x-2.5">
                  <span className="w-7 h-7 rounded-lg bg-red-100 text-[#991b1b] flex items-center justify-center shrink-0 border border-red-200">
                    <Bell className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <span className="font-bold text-[#0d1c2f] block text-[11px]">Emergency Dispatch Push Telemetry</span>
                    <span className="text-[10px] text-[#565e74]">Status: {pushPerm === 'granted' ? 'Native OS Push Active' : 'Browser Pings Not Authorized'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {pushPerm !== 'granted' ? (
                    <button
                      type="button"
                      onClick={async () => {
                        const perm = await pushNotifications.requestPermission();
                        setPushPerm(perm);
                      }}
                      className="btn-primary text-xs py-1 px-2.5 flex items-center space-x-1 cursor-pointer"
                    >
                      <Bell className="w-3 h-3" />
                      <span>Authorize Pings</span>
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-bold text-[11px] font-mono flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>PUSH ACTIVE</span>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      pushNotifications.triggerEmergencyAlert({
                        caseNumber: `REQ-EKM-2026-${dispatchData.token.slice(0, 4).toUpperCase()}`,
                        bloodGroup: dispatchData.blood_group_required,
                        hospitalName: dispatchData.hospital_name,
                        hospitalTaluk: dispatchData.hospital_taluk,
                        distanceKm: dispatchData.distance_km,
                      });
                    }}
                    className="btn-secondary text-xs py-1 px-2.5 flex items-center space-x-1 cursor-pointer"
                    title="Test emergency browser push ping and acoustic chime"
                  >
                    <Volume2 className="w-3 h-3 text-[#991b1b]" />
                    <span>Test Ping</span>
                  </button>
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
                <div className="p-5 bg-[#f0fdf4] rounded-xl border-2 border-[#047857] text-xs space-y-4 shadow-sm animate-in zoom-in-95 duration-200">
                  <div className="flex items-center space-x-2.5 text-[#00402d] font-bold">
                    <div className="w-8 h-8 rounded-full bg-[#047857] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-sm">Commitment Authenticated &bull; Fast-Track Voucher Issued</h4>
                      <p className="text-[11px] text-[#00402d] font-normal">
                        Contact unmasked exclusively to the Blood Bank Desk at <strong>{dispatchData.hospital_name}</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Optical Voucher Card with Real SVG QR Code & Barcode */}
                  <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Scalable Vector QR Code */}
                      <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs shrink-0 flex flex-col items-center">
                        <QRCodeSVG
                          value={`district-blood://voucher/${dispatchData.token}?donor=${dispatchData.donor_code_name}&hosp=${encodeURIComponent(dispatchData.hospital_name)}&bg=${encodeURIComponent(dispatchData.blood_group_required)}&ts=${Date.now()}`}
                          size={130}
                          fgColor="#0d1c2f"
                        />
                        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-1">
                          DESK SCANNER QR
                        </span>
                      </div>

                      {/* Optical Barcode and Key Credentials */}
                      <div className="flex-1 w-full space-y-2.5 text-xs">
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                          <div className="bg-slate-50 p-2 rounded border border-slate-200">
                            <span className="text-slate-400 block text-[9px] uppercase">Pass Token</span>
                            <span className="font-bold text-[#991b1b]">#PASS-{dispatchData.token.slice(0, 8).toUpperCase()}</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded border border-slate-200">
                            <span className="text-slate-400 block text-[9px] uppercase">Arrival ETA</span>
                            <span className="font-bold text-emerald-800">{selectedEta}</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded border border-slate-200">
                            <span className="text-slate-400 block text-[9px] uppercase">Gate Clearance PIN</span>
                            <span className="font-bold text-[#0d1c2f]">4082</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded border border-slate-200">
                            <span className="text-slate-400 block text-[9px] uppercase">Parking Access</span>
                            <span className="font-bold text-emerald-800">BAY #02 RESERVED</span>
                          </div>
                        </div>

                        {/* Optical Code 128 Barcode */}
                        <div className="overflow-x-auto pt-1 flex justify-center sm:justify-start">
                          <BarcodeSVG
                            value={`VOUCH-${dispatchData.token.slice(0, 8).toUpperCase()}`}
                            type="code128"
                            height={32}
                            barWidth={1.3}
                            captionTitle="TRANSIT PASS CODE 128"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
                      <span>Present this digital pass at Hospital Security Gate #1</span>
                      <span className="font-mono text-emerald-800 font-bold">LEVEL-1 PRIORITY CLEARANCE</span>
                    </div>
                  </div>

                  <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => window.print()}
                      className="btn-secondary text-xs py-2 px-3 flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Admission Pass</span>
                    </button>

                    <button
                      onClick={onNavigateToHospital}
                      className="btn-primary text-xs py-2 px-4 flex items-center space-x-1.5 shadow-xs cursor-pointer"
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
