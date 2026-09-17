import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Printer,
  ShieldCheck,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';

export const SlideDeck: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalSlides = 8;

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Presentation Control Ribbon */}
      <div className="workbench-panel p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-700 text-white uppercase tracking-wider">
            ANAVANDI 2026 Submission
          </span>
          <span className="text-xs font-semibold text-slate-800">
            Slide {currentSlide + 1} of {totalSlides}
          </span>
          <span className="hidden sm:inline text-[11px] text-slate-400 font-mono">
            (Use Arrow Keys or Space to Navigate)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="btn-secondary text-xs py-1 px-2.5 flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentSlide === totalSlides - 1}
            className="btn-primary text-xs py-1 px-2.5 flex items-center space-x-1"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="btn-secondary text-xs py-1 px-2.5 hidden sm:flex items-center space-x-1"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Exit' : 'Present'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="btn-secondary text-xs py-1 px-2.5 hidden md:flex items-center space-x-1"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Deck</span>
          </button>
        </div>
      </div>

      {/* Slide Canvas Viewport */}
      <div className="workbench-panel min-h-[540px] flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden bg-white shadow-sm border-slate-300">
        
        {/* Slide Top Metadata Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 bg-red-700 text-white rounded flex items-center justify-center font-bold text-xs font-mono">
              SC
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                ANAVANDI 2026 Selection Presentation
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Track 3: Public Welfare &bull; Challenge SC-12: District Blood Donor Matching
              </span>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            0{currentSlide + 1} / 08
          </span>
        </div>

        {/* Slide Main Content Container */}
        <div className="my-auto py-6">
          
          {/* SLIDE 1 */}
          {currentSlide === 0 && (
            <div className="space-y-4 max-w-4xl">
              <div className="inline-block px-2.5 py-0.5 bg-red-50 text-red-800 border border-red-200 rounded text-[11px] font-bold uppercase tracking-wider">
                Slide 1 &bull; Challenge Selected and Why
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                SC-12: District Blood Donor Matching
              </h1>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Broad WhatsApp broadcast chains fail during medical emergencies. They flood community groups, disturb volunteers who donated only weeks ago, expose personal telephone numbers to commercial marketing scrapers, and waste hours while acute trauma patients wait for compatible blood.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-1">
                  <div className="font-bold text-slate-900 text-xs">Zero Broadcast Spam</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Direct dispatch replaces forward chains, reaching only qualified nearby donors instead of generic group blasts.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-1">
                  <div className="font-bold text-slate-900 text-xs">Clinical Interval Guard</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    90-day (male) and 120-day (female) recovery cooldowns stop premature donor solicitation and protect ferritin reserves.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-1">
                  <div className="font-bold text-slate-900 text-xs">Tokenized Privacy</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Personal contact details remain cryptographically locked until the volunteer explicitly confirms acceptance.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2 */}
          {currentSlide === 1 && (
            <div className="space-y-4 max-w-4xl">
              <div className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 rounded text-[11px] font-bold uppercase tracking-wider">
                Slide 2 &bull; Who Has This Problem and What They Do Today
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Current Practice: The Broken WhatsApp Loop
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="space-y-3 bg-red-50/60 p-4 rounded border border-red-200">
                  <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider">
                    Who Suffers From This Problem
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-start space-x-2">
                      <span className="font-bold text-red-700">&bull;</span>
                      <span><strong>Hospital Blood Banks:</strong> Suffer delayed emergency turnaround while managing chaotic phone inquiries from unqualified callers.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="font-bold text-red-700">&bull;</span>
                      <span><strong>Patient Relatives:</strong> Desperately share personal phone numbers online, exposing their families to commercial marketing harassment.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="font-bold text-red-700">&bull;</span>
                      <span><strong>Voluntary Donors:</strong> Face severe donor fatigue from frequent calls when they are under active clinical deferral.</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3 bg-slate-50 p-4 rounded border border-slate-200">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    What Happens Today (The WhatsApp Failure)
                  </h3>
                  <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                    <p>
                      An urgent message like <em>"URGENT B+ Blood Needed at Aluva Taluk Hospital, contact 984..."</em> is forwarded into dozens of groups.
                    </p>
                    <p>
                      <strong>The Breakdown:</strong> Over 85% of recipients are either incompatible, live 40 km away, or donated 2 weeks ago. Meanwhile, well-meaning callers flood the hospital desk with questions instead of actual donations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3 */}
          {currentSlide === 2 && (
            <div className="space-y-6 text-center max-w-3xl mx-auto">
              <div className="inline-block px-2.5 py-0.5 bg-red-50 text-red-800 border border-red-200 rounded text-[11px] font-bold uppercase tracking-wider">
                Slide 3 &bull; What You Built (One Clear Sentence)
              </div>

              <blockquote className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug border-y-2 border-red-700 py-6 my-4">
                "An algorithmic district blood coordination system that matches emergency hospital requisitions with verified nearby donors based on compatibility, clinical recovery intervals, and radial distance, keeping personal contacts completely private until explicit volunteer acceptance."
              </blockquote>

              <div className="flex items-center justify-center space-x-6 text-xs text-slate-600 font-semibold uppercase tracking-wider">
                <span>Verified Hospital Demand</span>
                <span>&bull;</span>
                <span>Clinical Interval Safeguard</span>
                <span>&bull;</span>
                <span>Tokenized Consent Unmasking</span>
              </div>
            </div>
          )}

          {/* SLIDE 4 */}
          {currentSlide === 3 && (
            <div className="space-y-4 max-w-4xl">
              <div className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 rounded text-[11px] font-bold uppercase tracking-wider">
                Slide 4 &bull; Live Product Flow &amp; Submission Verification
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                End-to-End Workflow Enforcing SC-12 Rules
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-1.5">
                  <div className="w-6 h-6 bg-slate-900 text-white rounded flex items-center justify-center font-bold text-xs font-mono">1</div>
                  <div className="font-bold text-slate-900">Hospital Request</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Coordinator specifies hospital, patient code, blood group, component, units, and urgency.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-1.5">
                  <div className="w-6 h-6 bg-red-700 text-white rounded flex items-center justify-center font-bold text-xs font-mono">2</div>
                  <div className="font-bold text-slate-900">Algorithmic Filter</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Engine excludes incompatible groups, active cooldowns, and out-of-radius candidates.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-1.5">
                  <div className="w-6 h-6 bg-slate-900 text-white rounded flex items-center justify-center font-bold text-xs font-mono">3</div>
                  <div className="font-bold text-slate-900">Private Alert</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Anonymized token dispatched. Coordinator only sees masked ID (DONOR-EKM-XXX).
                  </p>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded space-y-1.5">
                  <div className="w-6 h-6 bg-emerald-700 text-white rounded flex items-center justify-center font-bold text-xs font-mono">4</div>
                  <div className="font-bold text-emerald-950">Accept &amp; Unmask</div>
                  <p className="text-emerald-900 text-[11px] leading-relaxed">
                    Volunteer taps Accept. Verified phone and ETA unmask exclusively on the hospital desk.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 5 */}
          {currentSlide === 4 && (
            <div className="space-y-4 max-w-4xl">
              <div className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 rounded text-[11px] font-bold uppercase tracking-wider">
                Slide 5 &bull; How It Works: Architecture, Stack and Data
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Sensible, High-Reliability Technical Architecture
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2">
                  <div className="font-bold text-slate-900 text-sm">Go (Golang 1.27) Core</div>
                  <ul className="space-y-1 text-slate-600 leading-relaxed">
                    <li>&bull; High-throughput native concurrency</li>
                    <li>&bull; Haversine radial distance math</li>
                    <li>&bull; Sub-10ms matching evaluation</li>
                    <li>&bull; Single standalone cross-platform binary</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2">
                  <div className="font-bold text-slate-900 text-sm">Pure Go SQLite Store</div>
                  <ul className="space-y-1 text-slate-600 leading-relaxed">
                    <li>&bull; Zero CGO compilation requirement</li>
                    <li>&bull; Relational schema with Foreign Keys</li>
                    <li>&bull; Audit ledger for unmasking actions</li>
                    <li>&bull; ACID transactional data integrity</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2">
                  <div className="font-bold text-slate-900 text-sm">React + TypeScript SPA</div>
                  <ul className="space-y-1 text-slate-600 leading-relaxed">
                    <li>&bull; High-density clinical operations console</li>
                    <li>&bull; Zero purple gradients or pill buttons</li>
                    <li>&bull; SVG stroke vector icons (Lucide)</li>
                    <li>&bull; Interactive volunteer mobile simulator</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 6 */}
          {currentSlide === 5 && (
            <div className="space-y-4 max-w-4xl">
              <div className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 rounded text-[11px] font-bold uppercase tracking-wider">
                Slide 6 &bull; What Works Now and What Does Not
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Honest Assessment of Current Prototype Status
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded space-y-2">
                  <div className="font-bold text-emerald-950 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>What Fully Works in This Submission</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-700 text-[11px] leading-relaxed">
                    <li>&bull; Full Request, Match, Notify, and Accept cycle.</li>
                    <li>&bull; 90-day (M) and 120-day (F) whole blood cooldown enforcement.</li>
                    <li>&bull; 14-day platelet apheresis recovery interval calculations.</li>
                    <li>&bull; Donor contact privacy locked until explicit voluntary accept.</li>
                    <li>&bull; Proximity calculations and transparent filtering audit log.</li>
                  </ul>
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded space-y-2">
                  <div className="font-bold text-amber-950 flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>Current Constraints &amp; Limitations</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-700 text-[11px] leading-relaxed">
                    <li>&bull; SMS/WhatsApp dispatch uses simulated token sandbox instead of paid Meta WhatsApp Cloud API credentials.</li>
                    <li>&bull; Hospital authentication uses case numbers rather than single-sign-on (SSO) with State Health Services database.</li>
                    <li>&bull; Road distance uses Haversine straight-line coordinates rather than real-time Google Maps traffic telemetry.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 7 */}
          {currentSlide === 6 && (
            <div className="space-y-4 max-w-4xl">
              <div className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 rounded text-[11px] font-bold uppercase tracking-wider">
                Slide 7 &bull; What You Would Improve With Two More Weeks
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Production Roadmap for State-Wide Rollout
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 text-xs">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-1">
                  <div className="font-bold text-slate-900">1. ABHA Digital Health Account Sync</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Synchronize with Ayushman Bharat Health Accounts to automatically fetch verified hemoglobin levels and past transfusion records without manual entry.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-1">
                  <div className="font-bold text-slate-900">2. Official WhatsApp Cloud API Webhook</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Deploy Meta-verified business templates with native "Accept" and "Decline" interactive buttons, removing the need for donors to open browser links.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-1">
                  <div className="font-bold text-slate-900">3. Multilingual IVR Voice Calls</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Automated telephone voice calls in Malayalam and English with numeric dialpad prompts (Press 1 to Accept) for volunteers without smartphones.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-1">
                  <div className="font-bold text-slate-900">4. e-RaktKosh Inventory Cross-Check</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Connect with e-RaktKosh district repository to verify whether nearby government hospitals already possess available units before alerting donors.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 8 */}
          {currentSlide === 7 && (
            <div className="space-y-6 text-center max-w-2xl mx-auto">
              <div className="inline-block px-2.5 py-0.5 bg-red-50 text-red-800 border border-red-200 rounded text-[11px] font-bold uppercase tracking-wider">
                Slide 8 &bull; Team Names, Institution and Contact Details
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Project: District Blood Donor Matching (SC-12)
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  ANAVANDI 2026 Selection Round &bull; Jain School of Future, Kochi
                </p>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded text-xs text-left space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Team Member 1</span>
                    <span className="font-bold text-slate-900 text-sm">Joyel Joseph</span>
                    <span className="text-slate-500 block text-[11px]">Team Lead &bull; Backend Engineering</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Team Member 2</span>
                    <span className="font-bold text-slate-900 text-sm">Team Partner</span>
                    <span className="text-slate-500 block text-[11px]">Frontend &bull; Clinical Systems</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Institution</span>
                  <span className="font-semibold text-slate-800 text-xs">
                    Amal Jyothi College of Engineering (AJCE), Kerala
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">Challenge Track: Track 3 (Public Welfare)</span>
                  <span className="text-emerald-700 font-semibold">Deployed Prototype Ready for Judging</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Slide Footer Info */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400 font-mono">
          <span>ANAVANDI 2026 Selection Round</span>
          <span>Challenge SC-12: District Blood Donor Matching</span>
          <span>Use Arrow Keys to Navigate</span>
        </div>

      </div>

      {/* Slide Thumbnails Tray */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {[
          '1. Challenge',
          '2. Problem',
          '3. What Built',
          '4. Live Flow',
          '5. Architecture',
          '6. Current State',
          '7. Two Weeks',
          '8. Team Info',
        ].map((title, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`p-2 rounded text-[11px] text-left border transition-all truncate ${
              currentSlide === idx
                ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {title}
          </button>
        ))}
      </div>

    </div>
  );
};
