import React, { useState, useEffect } from 'react';
import { api, DonorProfile } from '../services/api';
import {
  Users,
  Search,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  X,
  MapPin,
  Calendar,
  HeartPulse,
  Clock,
  Filter
} from 'lucide-react';

export const DonorDirectory: React.FC = () => {
  const [donors, setDonors] = useState<DonorProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodFilter, setBloodFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  const [newDonor, setNewDonor] = useState({
    full_name: '',
    phone: '',
    email: '',
    blood_group: 'O+',
    gender: 'M',
    date_of_birth: '1998-05-15',
    weight_kg: 68,
    district: 'Ernakulam',
    taluk: 'Kanayannur',
    last_donation_date: '2026-05-01',
    last_donation_component: 'Whole Blood',
  });

  const loadDonors = async () => {
    try {
      const list = await api.getDonors();
      setDonors(list);
    } catch (err) {
      console.error('Failed to load donors:', err);
    }
  };

  useEffect(() => {
    loadDonors();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createDonor(newDonor);
      setShowRegisterModal(false);
      await loadDonors();
      alert('Donor registered successfully with default privacy protection.');
    } catch (err: any) {
      alert(err.message || 'Failed to register donor');
    }
  };

  // Helper to determine clinical eligibility
  const checkEligibility = (d: DonorProfile) => {
    const reqDays = d.gender === 'F' ? 120 : 90;
    let diffDays = 0;
    let isEligible = true;
    let cooldownDays = 0;
    if (d.last_donation_date) {
      const lastDate = new Date(d.last_donation_date);
      diffDays = Math.floor((new Date('2026-09-17').getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays < reqDays) {
        isEligible = false;
        cooldownDays = reqDays - diffDays;
      }
    }
    return { isEligible, diffDays, cooldownDays, reqDays };
  };

  const eligibleCount = donors.filter((d) => checkEligibility(d).isEligible).length;
  const cooldownCount = donors.length - eligibleCount;

  const filteredDonors = donors.filter((d) => {
    const matchesSearch =
      d.code_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.taluk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlood = !bloodFilter || d.blood_group === bloodFilter;
    
    const { isEligible } = checkEligibility(d);

    const matchesStatus =
      !statusFilter ||
      (statusFilter === 'eligible' && isEligible) ||
      (statusFilter === 'cooldown' && !isEligible);

    return matchesSearch && matchesBlood && matchesStatus;
  });

  return (
    <div className="space-y-5">
      
      {/* Registry Header Toolbar */}
      <div className="workbench-panel p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Users className="w-4 h-4" />
              </span>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest uppercase bg-primary/10 text-primary border border-primary/20">
                    DISTRICT DIRECTORY
                  </span>
                  <span className="text-[11px] font-mono text-outline">ERNAKULAM GRID SECTOR</span>
                </div>
                <h1 className="text-lg font-extrabold text-on-surface tracking-tight mt-0.5">
                  District Volunteer Donor Registry
                </h1>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant mt-1.5 max-w-3xl leading-relaxed">
              Public audit registry verifying clinical cooldown compliance. Personal telephone numbers are isolated behind cryptographic tokens to eliminate scraping, telemarketing harassment, and broadcast spam.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRegisterModal(true)}
              className="btn-primary text-xs py-2 px-3.5 flex items-center space-x-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register Volunteer Donor</span>
            </button>
          </div>
        </div>

        {/* Quick Registry Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-outline-variant/20">
          <div className="bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/20 flex items-center justify-between">
            <span className="text-[11px] font-medium text-outline">Registered Donors</span>
            <span className="font-mono text-sm font-bold text-on-surface">{donors.length}</span>
          </div>
          <div className="bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/20 flex items-center justify-between">
            <span className="text-[11px] font-medium text-emerald-800">Clinically Eligible Today</span>
            <span className="font-mono text-sm font-bold text-emerald-800">{eligibleCount}</span>
          </div>
          <div className="bg-amber-500/5 p-2.5 rounded-lg border border-amber-500/20 flex items-center justify-between">
            <span className="text-[11px] font-medium text-amber-800">In Active Cooldown</span>
            <span className="font-mono text-sm font-bold text-amber-800">{cooldownCount}</span>
          </div>
          <div className="bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/20 flex items-center justify-between">
            <span className="text-[11px] font-medium text-outline">Privacy Mask Status</span>
            <span className="inline-flex items-center space-x-1 text-[11px] font-mono font-bold text-primary">
              <Lock className="w-3 h-3" />
              <span>100% Locked</span>
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-outline absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by token code, taluk, or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-bright border border-outline-variant/30 rounded-lg pl-8.5 pr-3 py-1.5 text-xs text-on-surface placeholder:text-outline/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          <div>
            <select
              value={bloodFilter}
              onChange={(e) => setBloodFilter(e.target.value)}
              className="w-full bg-surface-bright border border-outline-variant/30 rounded-lg px-3 py-1.5 text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="">All Blood Groups ({donors.length})</option>
              <option value="A+">A+ (Positive)</option>
              <option value="A-">A- (Negative)</option>
              <option value="B+">B+ (Positive)</option>
              <option value="B-">B- (Negative)</option>
              <option value="AB+">AB+ (Positive)</option>
              <option value="AB-">AB- (Negative)</option>
              <option value="O+">O+ (Universal RBC Recipient Safe)</option>
              <option value="O-">O- (Universal RBC Donor)</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-surface-bright border border-outline-variant/30 rounded-lg px-3 py-1.5 text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="">All Interval Statuses ({donors.length})</option>
              <option value="eligible">Clinically Eligible Today ({eligibleCount})</option>
              <option value="cooldown">Active Recovery Cooldown ({cooldownCount})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registry Data Table */}
      <div className="workbench-panel overflow-hidden border border-outline-variant/20 rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-outline-variant/20 text-xs">
            <thead className="bg-surface-container-low text-on-surface-variant font-bold">
              <tr>
                <th className="py-3 px-4 text-left font-mono tracking-wider uppercase text-[10px]">Donor Token</th>
                <th className="py-3 px-3 text-left font-mono tracking-wider uppercase text-[10px]">Blood</th>
                <th className="py-3 px-3 text-left font-mono tracking-wider uppercase text-[10px]">Taluk &amp; District</th>
                <th className="py-3 px-3 text-left font-mono tracking-wider uppercase text-[10px]">Demographics</th>
                <th className="py-3 px-3 text-left font-mono tracking-wider uppercase text-[10px]">Previous Donation</th>
                <th className="py-3 px-3 text-left font-mono tracking-wider uppercase text-[10px]">Recovery Interval Audit</th>
                <th className="py-3 px-4 text-right font-mono tracking-wider uppercase text-[10px]">Privacy Seal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 bg-surface-bright">
              {filteredDonors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-outline">
                    <Users className="w-8 h-8 text-outline/40 mx-auto mb-2" />
                    <p className="font-semibold text-on-surface">No volunteer donors found</p>
                    <p className="text-[11px] text-outline mt-0.5">Try relaxing your search query or blood group filter.</p>
                  </td>
                </tr>
              ) : (
                filteredDonors.map((d) => {
                  const { isEligible, diffDays, cooldownDays, reqDays } = checkEligibility(d);

                  return (
                    <tr key={d.id} className="hover:bg-primary/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-xs text-on-surface bg-surface-container px-2 py-0.5 rounded border border-outline-variant/30">
                            {d.code_name}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                          {d.blood_group}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-1.5 text-on-surface font-semibold text-xs">
                          <MapPin className="w-3 h-3 text-primary shrink-0" />
                          <span>{d.taluk}</span>
                        </div>
                        <div className="text-[10px] text-outline font-mono pl-4.5">{d.district} Sector</div>
                      </td>

                      <td className="py-3 px-3 text-on-surface-variant">
                        <div className="font-medium text-xs">
                          {d.gender === 'M' ? 'Male (90d)' : 'Female (120d)'}
                        </div>
                        <div className="text-[10px] text-outline font-mono">{d.weight_kg} kg body weight</div>
                      </td>

                      <td className="py-3 px-3 text-on-surface-variant">
                        <div className="font-mono text-xs flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-outline" />
                          <span>{d.last_donation_date || 'N/A'}</span>
                        </div>
                        <div className="text-[10px] text-outline font-mono pl-4">
                          {d.last_donation_date ? `${diffDays} days elapsed` : 'Initial Registration'}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        {isEligible ? (
                          <span className="badge badge-eligible inline-flex items-center space-x-1.5 text-[11px] py-0.5 px-2 rounded-md">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700 shrink-0" />
                            <span>Eligible ({reqDays}d rule cleared)</span>
                          </span>
                        ) : (
                          <span className="badge badge-cooldown inline-flex items-center space-x-1.5 text-[11px] py-0.5 px-2 rounded-md">
                            <AlertTriangle className="w-3 h-3 text-amber-700 shrink-0" />
                            <span>Cooldown ({cooldownDays}d remaining)</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center space-x-1 text-[11px] text-outline font-mono font-semibold bg-surface-container-low px-2 py-0.5 rounded border border-outline-variant/30">
                          <Lock className="w-3 h-3 text-outline" />
                          <span>SECURE</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Donor Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-bright rounded-2xl border border-outline-variant/30 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-4 bg-surface-container-low border-b border-outline-variant/20">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Plus className="w-3.5 h-3.5" />
                </span>
                <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                  Register Volunteer Donor Dossier
                </h3>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-on-surface-variant mb-1 text-xs">
                  Full Legal Name (Confidential Audit Record)
                </label>
                <input
                  type="text"
                  required
                  value={newDonor.full_name}
                  onChange={(e) => setNewDonor({ ...newDonor, full_name: e.target.value })}
                  placeholder="e.g. Sreekumar Nair"
                  className="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1 text-xs">
                    Mobile Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={newDonor.phone}
                    onChange={(e) => setNewDonor({ ...newDonor, phone: e.target.value })}
                    placeholder="+91 98470 12345"
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-mono text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1 text-xs">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newDonor.email}
                    onChange={(e) => setNewDonor({ ...newDonor, email: e.target.value })}
                    placeholder="sree@example.com"
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-mono text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1 text-xs">Blood Group</label>
                  <select
                    value={newDonor.blood_group}
                    onChange={(e) => setNewDonor({ ...newDonor, blood_group: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-2.5 py-2 font-mono font-bold text-primary text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
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
                  <label className="block font-semibold text-on-surface-variant mb-1 text-xs">Gender</label>
                  <select
                    value={newDonor.gender}
                    onChange={(e) => setNewDonor({ ...newDonor, gender: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-2.5 py-2 text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    <option value="M">Male (90d)</option>
                    <option value="F">Female (120d)</option>
                    <option value="Other">Other (90d)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1 text-xs">Weight (kg)</label>
                  <input
                    type="number"
                    min="45"
                    max="150"
                    value={newDonor.weight_kg}
                    onChange={(e) => setNewDonor({ ...newDonor, weight_kg: parseFloat(e.target.value) || 50 })}
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 font-mono text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1 text-xs">Taluk in Ernakulam</label>
                  <select
                    value={newDonor.taluk}
                    onChange={(e) => setNewDonor({ ...newDonor, taluk: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-2.5 py-2 text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    <option value="Kanayannur">Kanayannur (Ernakulam City)</option>
                    <option value="Aluva">Aluva</option>
                    <option value="Kalamassery">Kalamassery</option>
                    <option value="Kochi">Kochi (Fort Kochi / Mattancherry)</option>
                    <option value="Kunnathunad">Kunnathunad (Perumbavoor)</option>
                    <option value="Muvattupuzha">Muvattupuzha</option>
                    <option value="Kothamangalam">Kothamangalam</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1 text-xs">Previous Donation Date</label>
                  <input
                    type="date"
                    value={newDonor.last_donation_date}
                    onChange={(e) => setNewDonor({ ...newDonor, last_donation_date: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 font-mono text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[11px] text-emerald-900 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Cryptographic Privacy Guard:</strong> By registering, your phone number remains encrypted and locked. It is never broadcast, scraped, or shared without your explicit case-by-case confirmation.
                </span>
              </div>

              <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="btn-secondary text-xs py-2 px-3 cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs py-2 px-4 shadow-xs cursor-pointer">
                  Save Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
