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
  Sparkles,
  Users,
  MapPin,
  Cpu,
  Database,
  Lock,
  HeartPulse,
  Radio
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
      <div className="workbench-panel p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-3">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-primary text-white uppercase tracking-wider shadow-xs">
            AANAVANDITHON 2026
          </span>
          <span className="text-xs font-bold text-on-surface">
            Slide {currentSlide + 1} of {totalSlides}
          </span>
          <span className="hidden sm:inline text-[11px] text-outline font-mono">
            &bull; (Use &larr; / &rarr; Arrow Keys or Space to Navigate)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center space-x-1 cursor-pointer disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentSlide === totalSlides - 1}
            className="btn-primary text-xs py-1.5 px-3.5 flex items-center space-x-1 cursor-pointer shadow-xs disabled:opacity-40"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="btn-secondary text-xs py-1.5 px-3 hidden sm:flex items-center space-x-1.5 cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Exit' : 'Present'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="btn-secondary text-xs py-1.5 px-3 hidden md:flex items-center space-x-1.5 cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Deck</span>
          </button>
        </div>
      </div>

      {/* Slide Canvas Viewport */}
      <div className="workbench-panel min-h-[560px] flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden bg-surface-bright shadow-sm border border-outline-variant/30 rounded-2xl">
        
        {/* Slide Top Metadata Bar */}
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-xs font-mono shadow-xs">
              SC
            </div>
            <div>
              <span className="text-xs font-extrabold text-on-surface uppercase tracking-wider block">
                AANAVANDI 2026 Evaluation Deck
              </span>
              <span className="text-[11px] text-outline font-medium">
                Track 3: Public Welfare &bull; Challenge SC-12: District Blood Donor Matching
              </span>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
            0{currentSlide + 1} / 0{totalSlides}
          </span>
        </div>

        {/* Slide Main Content Container */}
        <div className="my-auto py-8">
          
          {/* SLIDE 1 */}
          {currentSlide === 0 && (
            <div className="space-y-5 max-w-4xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[11px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span>Slide 1 &bull; Challenge Selected and Why</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
                SC-12: District Blood Donor Matching &bull; Ernakulam Sector
              </h1>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                Broad WhatsApp broadcast chains fail during medical emergencies. They flood civic chat groups, disturb volunteers who donated only weeks ago, expose personal telephone numbers to commercial marketing scrapers, and waste critical hours while acute trauma patients wait for compatible blood.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4.5 bg-surface-container-low border border-outline-variant/20 rounded-xl space-y-1.5">
                  <div className="flex items-center space-x-2 text-primary font-bold text-xs">
                    <Radio className="w-4 h-4" />
                    <span>Zero Broadcast Spam</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Direct dispatch replaces chaotic forward chains, reaching only qualified nearby donors instead of generic group blasts.
                  </p>
                </div>
                <div className="p-4.5 bg-surface-container-low border border-outline-variant/20 rounded-xl space-y-1.5">
                  <div className="flex items-center space-x-2 text-primary font-bold text-xs">
                    <Clock className="w-4 h-4" />
                    <span>Clinical Interval Guard</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Strict 90-day (male) and 120-day (female) recovery cooldowns stop premature solicitation and protect donor ferritin stores.
                  </p>
                </div>
                <div className="p-4.5 bg-surface-container-low border border-outline-variant/20 rounded-xl space-y-1.5">
                  <div className="flex items-center space-x-2 text-primary font-bold text-xs">
                    <Lock className="w-4 h-4" />
                    <span>Cryptographic Privacy</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Personal contact numbers remain cryptographically locked behind pseudonym tokens until explicit volunteer confirmation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2 */}
          {currentSlide === 1 && (
            <div className="space-y-5 max-w-4xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-surface-container text-on-surface-variant border border-outline-variant/20 rounded-full text-[11px] font-bold uppercase tracking-wider">
                <span>Slide 2 &bull; Who Has This Problem and Current Practice</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
                Current Practice: The Catastrophic WhatsApp Loop
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="space-y-3 bg-primary/5 p-5 rounded-xl border border-primary/20">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Who Suffers From This Systemic Failure</span>
                  </h3>
                  <ul className="space-y-2.5 text-xs text-on-surface leading-relaxed">
                    <li className="flex items-start space-x-2">
                      <span className="font-bold text-primary">&bull;</span>
                      <span><strong>Hospital Blood Banks:</strong> Suffer delayed emergency turnaround while managing chaotic phone inquiries from unqualified callers.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="font-bold text-primary">&bull;</span>
                      <span><strong>Patient Families:</strong> Desperately share personal phone numbers online, exposing their families to telemarketing scams.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="font-bold text-primary">&bull;</span>
                      <span><strong>Voluntary Donors:</strong> Experience severe donor fatigue from frequent phone calls when they are under active clinical deferral.</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3 bg-surface-container-low p-5 rounded-xl border border-outline-variant/20">
                  <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                    The WhatsApp Forwarding Breakdown
                  </h3>
                  <div className="text-xs text-on-surface-variant space-y-2.5 leading-relaxed">
                    <p className="p-2.5 bg-surface-bright rounded-lg border border-outline-variant/20 italic font-mono text-[11px] text-outline">
                      "URGENT B+ Blood Needed at Aluva Taluk Hospital, contact 98470..." forwarded across 50 groups.
                    </p>
                    <p>
                      <strong>The Reality:</strong> Over 85% of recipients are incompatible, live 40+ km away, or donated 2 weeks ago. Meanwhile, well-meaning callers flood the hospital desk with questions instead of actual blood units.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3 */}
          {currentSlide === 2 && (
            <div className="space-y-6 text-center max-w-3xl mx-auto py-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[11px] font-bold uppercase tracking-wider">
                <span>Slide 3 &bull; What We Built (One Clear Sentence)</span>
              </div>

              <blockquote className="text-xl sm:text-2xl font-black text-on-surface leading-snug border-y-2 border-primary py-7 my-4">
                "An algorithmic district blood coordination system that matches emergency hospital requisitions with verified nearby donors based on compatibility, clinical recovery intervals, and radial distance, keeping personal contacts completely private until explicit volunteer acceptance."
              </blockquote>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                <span className="px-2.5 py-1 bg-surface-container rounded-md border border-outline-variant/20">Verified Hospital Demand</span>
                <span>&bull;</span>
                <span className="px-2.5 py-1 bg-surface-container rounded-md border border-outline-variant/20">Clinical Recovery Safeguard</span>
                <span>&bull;</span>
                <span className="px-2.5 py-1 bg-surface-container rounded-md border border-outline-variant/20">Tokenized Consent Unmasking</span>
              </div>
            </div>
          )}

          {/* SLIDE 4 */}
          {currentSlide === 3 && (
            <div className="space-y-5 max-w-4xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-surface-container text-on-surface-variant border border-outline-variant/20 rounded-full text-[11px] font-bold uppercase tracking-wider">
                <span>Slide 4 &bull; Live Product Flow &amp; Protocol Verification</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
                End-to-End Workflow Enforcing SC-12 Rules
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 pt-2 text-xs">
                <div className="p-4 bg-surface-container-low border border-outline-variant/20 rounded-xl space-y-2">
                  <div className="w-7 h-7 bg-surface-container text-on-surface rounded-lg flex items-center justify-center font-bold text-xs font-mono border border-outline-variant/30">1</div>
                  <div className="font-bold text-on-surface">Hospital Intake</div>
                  <p className="text-on-surface-variant text-[11px] leading-relaxed">
                    Coordinator specifies hospital, patient code, blood group, component, units, and urgency.
                  </p>
                </div>

                <div className="p-4 bg-surface-container-low border border-outline-variant/20 rounded-xl space-y-2">
                  <div className="w-7 h-7 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-xs font-mono shadow-xs">2</div>
                  <div className="font-bold text-on-surface">Algorithmic Match</div>
                  <p className="text-on-surface-variant text-[11px] leading-relaxed">
                    Engine excludes incompatible groups, active cooldowns, and out-of-radius candidates.
                  </p>
                </div>

                <div className="p-4 bg-surface-container-low border border-outline-variant/20 rounded-xl space-y-2">
                  <div className="w-7 h-7 bg-surface-container text-on-surface rounded-lg flex items-center justify-center font-bold text-xs font-mono border border-outline-variant/30">3</div>
                  <div className="font-bold text-on-surface">Private Alert</div>
                  <p className="text-on-surface-variant text-[11px] leading-relaxed">
                    Anonymized token dispatched. Coordinator only sees masked ID (DONOR-EKM-XXX).
                  </p>
                </div>

                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2">
                  <div className="w-7 h-7 bg-emerald-700 text-white rounded-lg flex items-center justify-center font-bold text-xs font-mono shadow-xs">4</div>
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
            <div className="space-y-5 max-w-4xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-surface-container text-on-surface-variant border border-outline-variant/20 rounded-full text-[11px] font-bold uppercase tracking-wider">
                <span>Slide 5 &bull; Architecture, Stack and Data Design</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
                Sensible, High-Reliability Technical Architecture
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="p-5 bg-surface-container-low border-t-2 border-t-primary border-outline-variant/20 rounded-xl space-y-2.5">
                  <div className="font-bold text-on-surface text-sm flex items-center space-x-1.5">
                    <Cpu className="w-4 h-4 text-primary" />
                    <span>Go (Golang 1.27) Core</span>
                  </div>
                  <ul className="space-y-1.5 text-on-surface-variant leading-relaxed">
                    <li>&bull; High-throughput native concurrency</li>
                    <li>&bull; Haversine radial distance math</li>
                    <li>&bull; Sub-10ms matching evaluation</li>
                    <li>&bull; Single standalone cross-platform binary</li>
                  </ul>
                </div>

                <div className="p-5 bg-surface-container-low border-t-2 border-t-emerald-700 border-outline-variant/20 rounded-xl space-y-2.5">
                  <div className="font-bold text-on-surface text-sm flex items-center space-x-1.5">
                    <Database className="w-4 h-4 text-emerald-700" />
                    <span>Pure Go SQLite Store</span>
                  </div>
                  <ul className="space-y-1.5 text-on-surface-variant leading-relaxed">
                    <li>&bull; Zero CGO compilation requirement</li>
                    <li>&bull; Relational schema with Foreign Keys</li>
                    <li>&bull; Immutable audit ledger for unmasking</li>
                    <li>&bull; ACID transactional data integrity</li>
                  </ul>
                </div>

                <div className="p-5 bg-surface-container-low border-t-2 border-t-primary border-outline-variant/20 rounded-xl space-y-2.5">
                  <div className="font-bold text-on-surface text-sm flex items-center space-x-1.5">
                    <Activity className="w-4 h-4 text-primary" />
                    <span>React 18 + TS Console</span>
                  </div>
                  <ul className="space-y-1.5 text-on-surface-variant leading-relaxed">
                    <li>&bull; High-density clinical dispatch console</li>
                    <li>&bull; Pure Math QR (Model 2) &amp; Code 128 / ISBT 128 engine</li>
                    <li>&bull; Zero-asset Web Audio API synthetic chimes</li>
                    <li>&bull; Print-ready cold-chain specimen manifests</li>
                    <li>&bull; Interactive donor mobile voucher portal</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 6 */}
          {currentSlide === 5 && (
            <div className="space-y-5 max-w-4xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-surface-container text-on-surface-variant border border-outline-variant/20 rounded-full text-[11px] font-bold uppercase tracking-wider">
                <span>Slide 6 &bull; Honest Evaluation of Current Prototype</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
                Current Operational Status &amp; Real Constraints
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2.5">
                  <div className="font-bold text-emerald-950 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>What Fully Works in This Prototype</span>
                  </div>
                  <ul className="space-y-2 text-emerald-950 text-[11px] leading-relaxed">
                    <li>&bull; Full Request, Match, Notify, and Accept dispatch cycle.</li>
                    <li>&bull; On-site optical QR &amp; Voucher verification desk scanner.</li>
                    <li>&bull; Standards-compliant ISBT 128 cold-chain transport manifest generation.</li>
                    <li>&bull; Strict 90-day (M) and 120-day (F) whole blood cooldown enforcement.</li>
                    <li>&bull; 14-day platelet apheresis recovery interval calculation.</li>
                    <li>&bull; Donor contact privacy locked until explicit voluntary accept.</li>
                    <li>&bull; Synthetic Web Audio telemetry and native push notification pings.</li>
                  </ul>
                </div>

                <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2.5">
                  <div className="font-bold text-amber-950 flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>Known Constraints &amp; Next Integrations</span>
                  </div>
                  <ul className="space-y-2 text-amber-950 text-[11px] leading-relaxed">
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
            <div className="space-y-5 max-w-4xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-surface-container text-on-surface-variant border border-outline-variant/20 rounded-full text-[11px] font-bold uppercase tracking-wider">
                <span>Slide 7 &bull; Production Roadmap With Two More Weeks</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
                State-Wide Health Grid Expansion Plan
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                <div className="p-4.5 bg-surface-container-low border border-outline-variant/20 rounded-xl space-y-1.5">
                  <div className="font-bold text-on-surface flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>1. ABHA Digital Health Account Sync</span>
                  </div>
                  <p className="text-on-surface-variant text-[11px] leading-relaxed">
                    Synchronize with Ayushman Bharat Health Accounts to automatically fetch verified hemoglobin levels and past transfusion records without manual entry.
                  </p>
                </div>

                <div className="p-4.5 bg-surface-container-low border border-outline-variant/20 rounded-xl space-y-1.5">
                  <div className="font-bold text-on-surface flex items-center space-x-1.5">
                    <Radio className="w-4 h-4 text-primary" />
                    <span>2. Official WhatsApp Cloud API Webhooks</span>
                  </div>
                  <p className="text-on-surface-variant text-[11px] leading-relaxed">
                    Deploy Meta-verified business templates with native "Accept" and "Decline" interactive buttons, removing the need for donors to open browser links.
                  </p>
                </div>

                <div className="p-4.5 bg-surface-container-low border border-outline-variant/20 rounded-xl space-y-1.5">
                  <div className="font-bold text-on-surface flex items-center space-x-1.5">
                    <Activity className="w-4 h-4 text-primary" />
                    <span>3. Multilingual IVR Voice Calls</span>
                  </div>
                  <p className="text-on-surface-variant text-[11px] leading-relaxed">
                    Automated telephone voice calls in Malayalam and English with numeric dialpad prompts (Press 1 to Accept) for volunteers without smartphones.
                  </p>
                </div>

                <div className="p-4.5 bg-surface-container-low border border-outline-variant/20 rounded-xl space-y-1.5">
                  <div className="font-bold text-on-surface flex items-center space-x-1.5">
                    <Layers className="w-4 h-4 text-primary" />
                    <span>4. e-RaktKosh Inventory Cross-Check</span>
                  </div>
                  <p className="text-on-surface-variant text-[11px] leading-relaxed">
                    Connect with e-RaktKosh district repository to verify whether nearby government hospitals already possess available units before alerting donors.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 8 */}
          {currentSlide === 7 && (
            <div className="space-y-6 text-center max-w-2xl mx-auto py-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[11px] font-bold uppercase tracking-wider">
                <span>Slide 8 &bull; Team &amp; Submission Credential</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
                  District Blood Donor Matching (SC-12)
                </h2>
                <p className="text-xs text-outline font-medium mt-1 font-mono">
                  AANAVANDITHON 2026 &bull; Jain University School of Future, Kochi
                </p>
              </div>

              <div className="p-5 bg-surface-container-low border border-outline-variant/20 rounded-xl text-xs text-left space-y-3.5 shadow-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-outline block text-[11px] font-mono">Lead Engineer</span>
                    <span className="font-bold text-on-surface text-sm">Joyel Joseph</span>
                    <span className="text-outline block text-[11px]">Backend &bull; Concurrency Architecture</span>
                  </div>
                  <div>
                    <span className="text-outline block text-[11px] font-mono">Co-Developer</span>
                    <span className="font-bold text-on-surface text-sm">Team Partner</span>
                    <span className="text-outline block text-[11px]">Frontend &bull; Clinical Systems</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-outline-variant/20">
                  <span className="text-outline block text-[11px] font-mono">Engineering Institution</span>
                  <span className="font-bold text-on-surface text-xs">
                    Amal Jyothi College of Engineering (AJCE), Autonomous, Kerala
                  </span>
                </div>

                <div className="pt-2.5 border-t border-outline-variant/20 flex items-center justify-between text-[11px]">
                  <span className="text-on-surface-variant font-medium">Track 3: Public Welfare</span>
                  <span className="text-emerald-800 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Live Working Prototype Deployed
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Slide Footer Info */}
        <div className="flex items-center justify-between border-t border-outline-variant/20 pt-3 text-[11px] text-outline font-mono">
          <span>AANAVANDITHON 2026 SELECTION</span>
          <span>CHALLENGE SC-12: BLOOD DONOR GRID</span>
          <span>USE ARROW KEYS &larr; / &rarr;</span>
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
            className={`p-2.5 rounded-lg text-[11px] text-left border transition-all truncate cursor-pointer ${
              currentSlide === idx
                ? 'bg-primary text-white border-primary font-bold shadow-xs'
                : 'bg-surface-bright text-on-surface-variant border-outline-variant/20 hover:border-outline-variant/40'
            }`}
          >
            {title}
          </button>
        ))}
      </div>

    </div>
  );
};
