import React, { useState, useEffect } from 'react';
import { api, DonorProfile } from '../services/api';
import { Users, Search, Plus, ShieldCheck, CheckCircle2, AlertTriangle, Lock, X, Filter } from 'lucide-react';

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

  const filteredDonors = donors.filter((d) => {
    const matchesSearch =
      d.code_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.taluk.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlood = !bloodFilter || d.blood_group === bloodFilter;
    
    // Calculate eligibility
    let isEligible = true;
    const reqDays = d.gender === 'F' ? 120 : 90;
    if (d.last_donation_date) {
      const lastDate = new Date(d.last_donation_date);
      const diffDays = Math.floor((new Date('2026-09-17').getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays < reqDays) {
        isEligible = false;
      }
    }

    const matchesStatus =
      !statusFilter ||
      (statusFilter === 'eligible' && isEligible) ||
      (statusFilter === 'cooldown' && !isEligible);

    return matchesSearch && matchesBlood && matchesStatus;
  });

  return (
    <div className="space-y-5">
      
      {/* Registry Header Toolbar */}
      <div className="workbench-panel p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-red-700" />
              <h2 className="text-base font-bold text-slate-900">
                District Volunteer Donor Registry &bull; Ernakulam Sector
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
              Public audit registry verifying clinical cooldown compliance. Personal telephone numbers are isolated behind cryptographic tokens to eliminate scraping and broadcast spam.
            </p>
          </div>

          <button
            onClick={() => setShowRegisterModal(true)}
            className="btn-primary text-xs py-1.5 px-3 flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Register Volunteer Donor</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search by code or taluk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-slate-300 rounded pl-8 pr-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <select
              value={bloodFilter}
              onChange={(e) => setBloodFilter(e.target.value)}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-800 text-xs font-medium"
            >
              <option value="">All Blood Groups</option>
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
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-800 text-xs font-medium"
            >
              <option value="">All Interval Statuses</option>
              <option value="eligible">Clinically Eligible Today</option>
              <option value="cooldown">Active Recovery Cooldown</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registry Data Table */}
      <div className="workbench-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4 text-left">Donor Token</th>
                <th className="py-3 px-3 text-left">Blood</th>
                <th className="py-3 px-3 text-left">Taluk &amp; District</th>
                <th className="py-3 px-3 text-left">Demographics</th>
                <th className="py-3 px-3 text-left">Previous Donation</th>
                <th className="py-3 px-3 text-left">Recovery Interval Audit</th>
                <th className="py-3 px-4 text-right">Privacy Seal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredDonors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No donors matching the specified filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDonors.map((d) => {
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

                  return (
                    <tr key={d.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                        {d.code_name}
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-red-700 text-xs">
                        {d.blood_group}
                      </td>

                      <td className="py-3 px-3 text-slate-800 font-medium">
                        {d.taluk}, {d.district}
                      </td>

                      <td className="py-3 px-3 text-slate-600">
                        {d.gender === 'M' ? 'Male' : 'Female'} ({d.weight_kg} kg)
                      </td>

                      <td className="py-3 px-3 text-slate-600">
                        <div className="font-mono">{d.last_donation_date}</div>
                        <div className="text-[10px] text-slate-400 font-mono">({diffDays}d elapsed)</div>
                      </td>

                      <td className="py-3 px-3">
                        {isEligible ? (
                          <span className="badge badge-eligible flex items-center space-x-1 w-fit">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            <span>Eligible ({reqDays}d rule cleared)</span>
                          </span>
                        ) : (
                          <span className="badge badge-cooldown flex items-center space-x-1 w-fit">
                            <AlertTriangle className="w-3 h-3 text-amber-700" />
                            <span>Cooldown ({cooldownDays}d remaining)</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center space-x-1 text-[11px] text-slate-600 font-medium">
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span>Protected</span>
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
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Register Volunteer Donor Profile
              </h3>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Legal Name (Confidential)
                </label>
                <input
                  type="text"
                  required
                  value={newDonor.full_name}
                  onChange={(e) => setNewDonor({ ...newDonor, full_name: e.target.value })}
                  placeholder="e.g. Sreekumar Nair"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mobile Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={newDonor.phone}
                    onChange={(e) => setNewDonor({ ...newDonor, phone: e.target.value })}
                    placeholder="+91 98470 12345"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newDonor.email}
                    onChange={(e) => setNewDonor({ ...newDonor, email: e.target.value })}
                    placeholder="sree@example.com"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={newDonor.blood_group}
                    onChange={(e) => setNewDonor({ ...newDonor, blood_group: e.target.value })}
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
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={newDonor.gender}
                    onChange={(e) => setNewDonor({ ...newDonor, gender: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                  >
                    <option value="M">Male (90d)</option>
                    <option value="F">Female (120d)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    min="45"
                    max="150"
                    value={newDonor.weight_kg}
                    onChange={(e) => setNewDonor({ ...newDonor, weight_kg: parseFloat(e.target.value) || 50 })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Taluk in Ernakulam</label>
                  <select
                    value={newDonor.taluk}
                    onChange={(e) => setNewDonor({ ...newDonor, taluk: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white"
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
                  <label className="block font-semibold text-slate-700 mb-1">Previous Donation Date</label>
                  <input
                    type="date"
                    value={newDonor.last_donation_date}
                    onChange={(e) => setNewDonor({ ...newDonor, last_donation_date: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  By registering, your phone number remains encrypted and locked. It is never broadcast or scraped.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
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
