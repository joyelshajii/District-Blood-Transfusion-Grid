import React, { useState, useEffect } from 'react';
import {
  Activity,
  Sliders,
  ShieldCheck,
  Users,
  Presentation,
  FileCode2,
  Plus,
  Compass,
  Info,
  Menu,
  X
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
    { id: 'hospital', label: 'Hospital Dispatch', icon: Sliders, badge: activeRequestsCount > 0 ? `${activeRequestsCount}` : undefined },
    { id: 'donor', label: 'Volunteer Simulator', icon: ShieldCheck },
    { id: 'registry', label: 'District Registry', icon: Users },
    { id: 'deck', label: '8-Slide Pitch Deck', icon: Presentation, highlight: true },
    { id: 'architecture', label: 'Architecture & API', icon: FileCode2 },
  ];

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-40">
      
      {/* Top Sector Utility Bar */}
      <div className="bg-slate-900 text-slate-400 text-[11px] font-mono border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-7 flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-white uppercase tracking-wider text-[10px]">GRID ACTIVE</span>
            </span>
            <span className="hidden sm:inline text-slate-600">/</span>
            <span className="hidden sm:inline text-slate-400">
              Sector: Ernakulam (9.98° N, 76.28° E) &bull; NBTC Cooldown Rule Active
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-slate-300">{currentTime || '18:30:00 IST'}</span>
            <span className="text-slate-600">/</span>
            <button
              onClick={onToggleEvaluationDrawer}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                evaluationDrawerOpen
                  ? 'bg-red-700 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Info className="w-3 h-3" />
              <span>{evaluationDrawerOpen ? 'Close Guide' : 'Evaluation Guide'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Operations Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Mark */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={() => setCurrentTab('hospital')}
          >
            <div className="w-9 h-9 bg-red-700 text-white rounded flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold tracking-tight text-slate-900 uppercase">
                  District Transfusion Coordinator
                </span>
                <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  SC-12
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Kerala Public Health Pilot &bull; Direct Matching &amp; Consent Unmasking
              </p>
            </div>
          </div>

          {/* Desktop Navigation Segmented Controls */}
          <nav className="hidden lg:flex items-center bg-slate-100/90 p-1 rounded border border-slate-200/80 space-x-0.5 text-xs font-medium">
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
                        ? 'bg-red-700 text-white shadow-xs font-semibold'
                        : 'bg-white text-slate-900 shadow-xs font-semibold'
                      : item.highlight
                      ? 'text-red-700 hover:text-red-800 hover:bg-red-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive && !item.highlight ? 'text-slate-900' : ''}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                        isActive ? 'bg-red-800 text-white' : 'bg-red-100 text-red-800'
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
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={onOpenNewRequestModal}
              className="btn-primary text-xs py-1.5 px-3 flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>New Requisition</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={onOpenNewRequestModal}
              className="btn-primary text-xs py-1.5 px-2.5 flex items-center space-x-1"
            >
              <Plus className="w-3 h-3" />
              <span>Request</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
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
                      ? 'bg-red-700 text-white font-semibold'
                      : 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-100 text-red-800 font-bold">
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
