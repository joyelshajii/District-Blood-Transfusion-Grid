import React, { useState, useEffect } from 'react';
import {
  Activity,
  Sliders,
  ShieldCheck,
  Users,
  Presentation,
  FileCode2,
  Plus,
  Info,
  Menu,
  X,
  Search,
  Flame,
  Radio,
  FileText
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenNewRequestModal: () => void;
  onToggleEvaluationDrawer: () => void;
  evaluationDrawerOpen: boolean;
  activeRequestsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenNewRequestModal,
  onToggleEvaluationDrawer,
  evaluationDrawerOpen,
  activeRequestsCount = 0,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'hospital', label: 'Command Console', icon: Sliders, badge: activeRequestsCount > 0 ? `${activeRequestsCount}` : undefined },
    { id: 'donor', label: 'Donor Alerts & Hub', icon: ShieldCheck },
    { id: 'registry', label: 'District Registry', icon: Users },
    { id: 'deck', label: '8-Slide Pitch Deck', icon: Presentation, highlight: true },
    { id: 'architecture', label: 'Architecture & API', icon: FileCode2 },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-white border-b border-[#cbd5e1] shadow-xs">
      
      {/* Top Sector Utility Bar - Tactical Dispatch Telemetry */}
      <div className="bg-[#0d1c2f] text-slate-300 text-[11px] font-mono border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-7 flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5 text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-white uppercase tracking-wider text-[10px]">GRID ACTIVE</span>
            </span>
            <span className="text-slate-600">/</span>
            <span className="hidden sm:inline text-slate-300">
              Sector: Ernakulam (9.98° N, 76.28° E)
            </span>
            <span className="hidden md:inline text-slate-600">&bull;</span>
            <span className="hidden md:inline text-slate-400">
              NBTC Cooldown Strict Rule (90d M / 120d F)
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-slate-200">{currentTime || '18:30:00 IST'}</span>
            <span className="text-slate-600">/</span>
            <button
              onClick={onToggleEvaluationDrawer}
              className={`flex items-center space-x-1 px-2.5 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                evaluationDrawerOpen
                  ? 'bg-[#991b1b] text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Info className="w-3 h-3" />
              <span>{evaluationDrawerOpen ? 'Close Briefing' : 'Evaluation Guide'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Operations Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Mark Cluster */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={() => setCurrentTab('hospital')}
          >
            <div className="w-9 h-9 bg-[#991b1b] text-white rounded flex items-center justify-center shadow-xs border border-[#760009]">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                emergency_heat
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-headline font-bold text-sm sm:text-base tracking-tight text-[#0d1c2f] uppercase">
                  HEMO-DISPATCH // DISTRICT 04
                </span>
                <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#eff4ff] text-[#0d1c2f] border border-[#cbd5e1]">
                  SC-12
                </span>
              </div>
              <p className="text-[11px] text-[#565e74] font-medium hidden sm:block">
                Kerala Public Health Pilot &bull; Direct Matching &amp; Consent Unmasking
              </p>
            </div>
          </div>

          {/* Quick Search on Desktop */}
          <div className="hidden xl:flex items-center bg-[#eff4ff] border border-[#cbd5e1] px-2.5 py-1 rounded text-xs w-64 focus-within:border-[#991b1b] focus-within:bg-white transition-colors">
            <Search className="w-3.5 h-3.5 text-[#565e74] mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search case, donor token, unit..."
              className="bg-transparent border-none text-xs text-[#0d1c2f] focus:outline-none w-full placeholder:text-[#565e74]"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <span className="font-mono text-[10px] text-[#565e74] bg-[#dde9ff] px-1 py-0.2 rounded border border-[#cbd5e1]">⌘K</span>
          </div>

          {/* Desktop Navigation Segmented Controls */}
          <nav className="hidden lg:flex items-center bg-[#eff4ff] p-1 rounded border border-[#cbd5e1] space-x-0.5 text-xs font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`px-3 py-1.5 rounded transition-all flex items-center space-x-1.5 ${
                    isActive
                      ? item.highlight
                        ? 'bg-[#991b1b] text-white shadow-xs font-semibold'
                        : 'bg-white text-[#0d1c2f] shadow-xs font-semibold border border-[#cbd5e1]'
                      : item.highlight
                      ? 'text-[#991b1b] hover:text-[#760009] hover:bg-red-50'
                      : 'text-[#565e74] hover:text-[#0d1c2f] hover:bg-white/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive && !item.highlight ? 'text-[#991b1b]' : ''}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                        isActive ? 'bg-[#760009] text-white' : 'bg-red-100 text-[#991b1b]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Action Controls */}
          <div className="hidden md:flex items-center space-x-2.5">
            <button
              onClick={onOpenNewRequestModal}
              className="btn-primary text-xs py-1.5 px-3 flex items-center space-x-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
                emergency_heat
              </span>
              <span>Emergency STAT Request</span>
            </button>
            <div className="hidden 2xl:flex items-center text-xs font-mono text-[#565e74] pl-2 border-l border-[#cbd5e1]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
              <span>DISP-4082</span>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={onOpenNewRequestModal}
              className="btn-primary text-xs py-1.5 px-2.5 flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>STAT Req</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded text-[#0d1c2f] hover:bg-[#eff4ff] border border-[#cbd5e1]"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#cbd5e1] bg-[#f8f9ff] px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-3 py-2 rounded text-xs font-medium flex items-center justify-between ${
                  isActive
                    ? item.highlight
                      ? 'bg-[#991b1b] text-white font-semibold'
                      : 'bg-[#0d1c2f] text-white font-semibold'
                    : 'text-[#0d1c2f] hover:bg-[#eff4ff]'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-100 text-[#991b1b] font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

    </header>
  );
};
