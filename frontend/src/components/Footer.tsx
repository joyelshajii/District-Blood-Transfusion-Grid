import React from 'react';
import {
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  Lock,
  Terminal,
  Activity,
  PhoneCall,
  Clock,
  Radio,
  FileText,
  ExternalLink
} from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 mt-20 text-xs">
      
      {/* Tactical Status Ribbon */}
      <div className="border-b border-slate-900/80 bg-slate-950/60 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold">GRID STATUS: ALL SECTORS NOMINAL</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">LATENCY: 8ms</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">SYS-VER: 4.19.2-TACTICAL</span>
          </div>

          <div className="flex items-center space-x-2 text-slate-300">
            <PhoneCall className="w-3.5 h-3.5 text-primary" />
            <span className="font-bold tracking-wider text-slate-200">
              EMERGENCY TRANSFUSION HOTLINE: <span className="text-white font-mono">1-800-HEMO-04</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: System Identification */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5 text-white font-bold text-sm">
              <div className="w-7 h-7 bg-primary flex items-center justify-center rounded-lg text-white shadow-xs">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <span className="tracking-tight block leading-tight font-extrabold">District Transfusion Grid</span>
                <span className="text-[10px] font-mono text-slate-400 font-medium tracking-wider">CLINICAL DISPATCH NETWORK</span>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Civic healthcare coordination infrastructure connecting emergency hospital requisitions with verified nearby donors while locking phone numbers behind cryptographic donor consent.
            </p>
            <div className="flex items-center space-x-2 text-slate-300 text-[11px] font-mono bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800 w-fit">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cryptographic Vault Active</span>
            </div>
          </div>

          {/* Column 2: Clinical Interval Standards */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>NBTC Clinical Protocols</span>
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>90-Day Male Whole Blood Cooldown</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>120-Day Female Whole Blood Cooldown</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>14-Day Platelet Apheresis Interval</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Haversine Spatial Proximity Sorting</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Governance & Statutory Policy */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" />
              <span>Statutory Governance</span>
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <button
                  onClick={() => setCurrentTab('privacy')}
                  className="hover:text-white transition-colors underline-offset-2 hover:underline text-left cursor-pointer flex items-center space-x-1"
                >
                  <span>&bull; Privacy Policy &amp; DPDPA 2023</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('terms')}
                  className="hover:text-white transition-colors underline-offset-2 hover:underline text-left cursor-pointer flex items-center space-x-1"
                >
                  <span>&bull; Terms &amp; Drugs &amp; Cosmetics Rules</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('architecture')}
                  className="hover:text-white transition-colors underline-offset-2 hover:underline text-left cursor-pointer flex items-center space-x-1"
                >
                  <span>&bull; System Architecture &amp; Audit Ledger</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('registry')}
                  className="hover:text-white transition-colors underline-offset-2 hover:underline text-left cursor-pointer flex items-center space-x-1"
                >
                  <span>&bull; Public District Donor Registry</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Hackathon Selection Context */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-primary" />
              <span>Selection Round Credentials</span>
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Engineered for <strong className="text-white font-semibold">AANAVANDITHON 2026</strong> Selection Challenge SC-12 (Track 3: Public Welfare).
            </p>
            <div className="pt-1">
              <button
                onClick={() => setCurrentTab('deck')}
                className="btn-primary text-xs py-2 px-3.5 flex items-center space-x-2 shadow-xs cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Open 8-Slide Pitch Deck</span>
              </button>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] font-mono gap-3">
          <div>
            &copy; 2026 District Transfusion Coordination Cell &bull; Ernakulam Sector Health Pilot &bull; AJCE
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <span>Pure Go API</span>
            <span>&bull;</span>
            <span>Zero CGO</span>
            <span>&bull;</span>
            <span>ACID SQLite</span>
            <span>&bull;</span>
            <span className="text-emerald-400">Production Deployed</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
