import React from 'react';
import { ShieldCheck, HeartHandshake, CheckCircle2, Lock, Terminal } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 mt-20 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: System Identification */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-sm">
              <div className="w-6 h-6 bg-red-700 flex items-center justify-center rounded text-white">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <span className="tracking-tight">District Transfusion Grid</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Algorithmic donor matching infrastructure connecting verified hospital requisitions with eligible nearby donors while strictly locking contact details behind donor consent.
            </p>
            <div className="flex items-center space-x-1.5 text-slate-300 text-[11px] font-mono">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cryptographic Contact Vault Active</span>
            </div>
          </div>

          {/* Column 2: Clinical Interval Standards */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">
              NBTC Clinical Protocols
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>90-Day Male Whole Blood Interval</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>120-Day Female Whole Blood Interval</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>14-Day Platelet Apheresis Cooldown</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Haversine Spatial Proximity Matching</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Governance & Statutory Policy */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Statutory Governance
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <button
                  onClick={() => setCurrentTab('privacy')}
                  className="hover:text-white transition-colors underline-offset-2 hover:underline text-left"
                >
                  Privacy Policy &amp; Data Protection (DPDPA)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('terms')}
                  className="hover:text-white transition-colors underline-offset-2 hover:underline text-left"
                >
                  Terms &amp; Conditions (Drugs &amp; Cosmetics Rules)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('architecture')}
                  className="hover:text-white transition-colors underline-offset-2 hover:underline text-left"
                >
                  System Architecture &amp; Security Ledger
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Hackathon Selection Context */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Selection Round Submission
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Engineered for <strong className="text-white">ANAVANDI 2026</strong> Selection Challenge SC-12 (Track 3: Public Welfare).
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentTab('deck')}
                className="btn-primary text-xs py-1.5 px-3 flex items-center space-x-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Open 8-Slide Pitch Deck</span>
              </button>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] font-mono">
          <div>
            &copy; 2026 District Blood Coordination Cell &bull; Ernakulam Sector Health Pilot
          </div>
          <div className="mt-2 sm:mt-0 flex items-center space-x-4">
            <span>Pure Go Backend</span>
            <span>&bull;</span>
            <span>ACID SQLite Store</span>
            <span>&bull;</span>
            <span>Production V1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
