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

        {/* Right Column: Simulated Volunteer Mobile Screen (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {dispatchData ? (
            <div className="workbench-panel border-red-200/90 p-5 space-y-5">
              
              {/* Alert Envelope Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-700 text-white rounded flex items-center justify-center font-bold font-mono text-sm shadow-xs">
                    {dispatchData.blood_group_required}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Emergency Blood Donation Request
                    </h3>
                    <div className="text-xs text-slate-500 font-mono">
                      Token: {dispatchData.token.slice(0, 16)}...
                    </div>
                  </div>
                </div>

                <span
                  className={`badge ${
                    dispatchData.urgency_level === 'Emergency' ? 'badge-emergency' : 'badge-critical'
                  }`}
                >
                  {dispatchData.urgency_level}
                </span>
              </div>

              {/* Case Medical Need Details */}
              <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Requesting Hospital:</span>
                  <span className="font-bold text-slate-900">{dispatchData.hospital_name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Location &amp; Distance:</span>
                  <span className="text-slate-800 font-medium flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{dispatchData.hospital_taluk} ({dispatchData.distance_km} km away)</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Component &amp; Units:</span>
                  <span className="font-bold text-red-700 font-mono">
                    {dispatchData.units_required} Unit(s) of {dispatchData.blood_group_required} ({dispatchData.component})
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 text-slate-700 text-[11px] leading-relaxed">
                  <strong>Clinical Case Note:</strong> {dispatchData.doctor_notes}
                </div>
              </div>

              {/* TOKENIZED PRIVACY SEAL BANNER */}
              <div className="bg-slate-900 text-white p-4 rounded border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Tokenized Privacy Lock Active (SC-12 Requirement)</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  The hospital coordinator only sees your anonymized identifier{' '}
                  <span className="font-mono text-white bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                    {dispatchData.donor_code_name}
                  </span>
                  . Your telephone number and legal identity are completely concealed until you tap "Accept &amp; Share Contact". If you decline, zero data is ever shared.
                </p>
              </div>

              {/* Response Decision Flow */}
              {responseStatus === 'ACCEPTED' ? (
                <div className="p-4 bg-emerald-50/80 rounded border border-emerald-300 text-xs space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-950 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    <span>Donation Accepted &bull; Digital Transfusion Voucher Issued</span>
                  </div>
                  <p className="text-slate-700 text-xs">
                    Your contact number has been securely unmasked to the Blood Bank coordinator at{' '}
                    <strong>{dispatchData.hospital_name}</strong>.
                  </p>

                  <div className="bg-white p-3.5 rounded border border-emerald-200 text-xs space-y-1.5 font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Hospital Coordinator Desk:</span>
                      <span className="font-bold text-slate-900">+91 484 2361250</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Expected Arrival Window:</span>
                      <span className="font-bold text-emerald-800">{selectedEta}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Pass Reference:</span>
                      <span className="text-slate-700">{dispatchData.token.slice(0, 8).toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center space-x-3">
                    <button
                      onClick={onNavigateToHospital}
                      className="btn-primary text-xs flex items-center space-x-1.5"
                    >
                      <span>Return to Hospital View to verify unmasked contact</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : responseStatus === 'DECLINED' ? (
                <div className="p-4 bg-slate-100 rounded border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center space-x-2 text-slate-800 font-bold">
                    <XCircle className="w-5 h-5 text-slate-600" />
                    <span>Request Declined</span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Your contact information was kept completely private. The dispatch engine has automatically routed the alert to the next qualified candidate in the district.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Estimated Arrival Window
                      </label>
                      <select
                        value={selectedEta}
                        onChange={(e) => setSelectedEta(e.target.value)}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-900 font-medium"
                      >
                        <option value="15 to 25 mins">Within 15 to 25 mins</option>
                        <option value="25 to 35 mins">Within 25 to 35 mins</option>
                        <option value="35 to 50 mins">Within 35 to 50 mins</option>
                        <option value="60 mins">Within 60 mins</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Optional Note for Blood Bank
                      </label>
                      <input
                        type="text"
                        value={donorNote}
                        onChange={(e) => setDonorNote(e.target.value)}
                        placeholder="e.g. Taking private vehicle"
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      onClick={() => handleRespond('ACCEPT')}
                      disabled={loading}
                      className="btn-success text-xs py-2 px-4 flex items-center space-x-1.5 flex-1"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept &amp; Share Contact</span>
                    </button>

                    <button
                      onClick={() => handleRespond('DECLINE')}
                      disabled={loading}
                      className="btn-danger text-xs py-2 px-3 flex items-center space-x-1"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Decline</span>
                    </button>
                  </div>

                </div>
              )}

            </div>
          ) : (
            /* Empty State Explaining How to Test */
            <div className="workbench-panel text-center py-16 px-4 space-y-3">
              <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded flex items-center justify-center mx-auto">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-sm font-bold text-slate-900">
                  No Active Invitation Selected
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  To test the interactive cycle, open the <strong>Hospital Dispatch</strong> tab, run the matching engine on any open requisition, and click <strong>Notify</strong> on an eligible candidate.
                </p>
                <div className="pt-3">
                  <button
                    onClick={onNavigateToHospital}
                    className="btn-primary text-xs py-1.5 px-3"
                  >
                    Go to Hospital Dispatch
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
