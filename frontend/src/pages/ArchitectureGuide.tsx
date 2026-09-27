import React, { useState, useEffect } from 'react';
import { api, AuditLog } from '../services/api';
import {
  Server,
  Database,
  ShieldCheck,
  Code,
  Terminal,
  CheckCircle2,
  ArrowRight,
  Lock,
  Activity,
  Layers,
  Cpu,
  Globe,
  Radio,
  FileCode2
} from 'lucide-react';

export const ArchitectureGuide: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    api.getAuditLogs(20).then(setAuditLogs).catch(() => {});
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Architecture Header */}
      <div className="workbench-panel p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Server className="w-4 h-4" />
            </span>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest uppercase bg-primary/10 text-primary border border-primary/20">
                SC-12 SPECIFICATION
              </span>
              <span className="text-[11px] font-mono text-outline">SYS-VER: 4.19.2-TACTICAL</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-800 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>ZERO CGO DEPENDENCIES</span>
            </span>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight mt-1">
          District Transfusion Grid &bull; High-Concurrency Civic Architecture
        </h1>
        <p className="text-xs text-on-surface-variant mt-2 max-w-3xl leading-relaxed">
          High-performance municipal healthcare infrastructure engineered for sub-10ms algorithmic matching latency, zero external runtime microservices, and cryptographically segregated donor privacy.
        </p>
      </div>

      {/* 3-Tier Component Architecture */}
      <div className="workbench-panel p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-bold text-on-surface uppercase tracking-wider">
              System Component Topology (3-Tier Decoupled Core)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-outline">ACID COMPLIANT &bull; STANDALONE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="p-5 bg-surface-container-low border border-outline-variant/20 rounded-xl space-y-3 hover:border-outline-variant/40 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-on-surface font-bold text-sm">
                <Code className="w-4 h-4 text-primary" />
                <span>1. Presentation Layer</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-outline">CLIENT SPA</span>
            </div>
            <ul className="space-y-2 text-on-surface-variant leading-relaxed">
              <li className="flex items-start space-x-1.5">
                <span className="text-primary font-bold">&bull;</span>
                <span>React 18 + TypeScript strict build</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-primary font-bold">&bull;</span>
                <span>High-density clinical dispatch console</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-primary font-bold">&bull;</span>
                <span>Split-pane triage &amp; live audit workbench</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-primary font-bold">&bull;</span>
                <span>Bundled directly into single Go executable</span>
              </li>
            </ul>
          </div>

          <div className="p-5 bg-surface-container-low border-t-2 border-t-primary border-outline-variant/20 rounded-xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-on-surface font-bold text-sm">
                <Cpu className="w-4 h-4 text-primary" />
                <span>2. Go API Engine</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-primary">GOLANG 1.27</span>
            </div>
            <ul className="space-y-2 text-on-surface-variant leading-relaxed">
              <li className="flex items-start space-x-1.5">
                <span className="text-primary font-bold">&bull;</span>
                <span>High-throughput Goroutine dispatch</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-primary font-bold">&bull;</span>
                <span>Haversine Great-Circle radial distance math</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-primary font-bold">&bull;</span>
                <span>NBTC clinical cooldown filter (90d / 120d)</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-primary font-bold">&bull;</span>
                <span>Cryptographic transient token vault</span>
              </li>
            </ul>
          </div>

          <div className="p-5 bg-surface-container-low border border-outline-variant/20 rounded-xl space-y-3 hover:border-outline-variant/40 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-on-surface font-bold text-sm">
                <Database className="w-4 h-4 text-emerald-700" />
                <span>3. Relational Vault</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-800">SQLITE (PURE)</span>
            </div>
            <ul className="space-y-2 text-on-surface-variant leading-relaxed">
              <li className="flex items-start space-x-1.5">
                <span className="text-emerald-700 font-bold">&bull;</span>
                <span>Pure Go SQLite driver (modernc.org/sqlite)</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-emerald-700 font-bold">&bull;</span>
                <span>Foreign key enforcement &amp; indexing</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-emerald-700 font-bold">&bull;</span>
                <span>ACID transactional concurrency control</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-emerald-700 font-bold">&bull;</span>
                <span>Immutable tamper-evident audit ledger</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* End-to-End Sequence Flow */}
      <div className="workbench-panel p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Request-Match-Notify-Accept Sequence Flow
            </h2>
          </div>
          <span className="text-[11px] font-mono text-outline">LIFECYCLE PIPELINE</span>
        </div>
        
        <p className="text-xs text-on-surface-variant leading-relaxed">
          How the system deterministically executes the challenge rules while keeping personal data locked:
        </p>

        <div className="bg-slate-950 text-slate-100 p-5 rounded-xl text-xs font-mono space-y-2.5 leading-relaxed overflow-x-auto border border-slate-800 shadow-md">
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span className="text-white font-bold">[1. HOSPITAL INTAKE]</span>
            <span>POST /api/requests &rarr; [Go REST API Core]</span>
          </div>
          <div className="text-slate-400 pl-4 border-l-2 border-slate-800 ml-1">
            Requisition registered (e.g. REQ-EKM-2026-01: 2 Units B+ Whole Blood &bull; Emergency Level-1)
          </div>

          <div className="flex items-center space-x-2 text-cyan-400 pt-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span className="font-bold">[2. CLINICAL ALGORITHMIC AUDIT]</span>
          </div>
          <div className="text-slate-300 pl-4 border-l-2 border-cyan-800 ml-1 space-y-1">
            <div className="text-emerald-400">&bull; ABO/Rh Compatibility Matrix evaluation (Universal Donor logic applied)</div>
            <div className="text-amber-400">&bull; NBTC Recovery Cooldown filter (90d male / 120d female strictly excluded)</div>
            <div className="text-blue-400">&bull; Haversine Great-Circle distance computed (Taluk centroid km sorting)</div>
          </div>

          <div className="flex items-center space-x-2 text-slate-400 pt-1">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-white font-bold">[3. PRIVACY-SHIELDED DISPATCH]</span>
            <span>Triggered by Coordinator</span>
          </div>
          <div className="text-slate-400 pl-4 border-l-2 border-slate-800 ml-1">
            Hospital view restricted to masked pseudonym tokens (e.g. DONOR-EKM-003). Phone numbers remain sealed in SQLite.
          </div>

          <div className="flex items-center space-x-2 text-emerald-400 pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-bold">[4. VOLUNTEER ACCEPTANCE &amp; UNMASKING]</span>
            <span>POST /api/respond (ACCEPT)</span>
          </div>
          <div className="text-emerald-300 pl-4 border-l-2 border-emerald-800 ml-1 space-y-1">
            <div>&bull; Donor verifies hospital identity, distance, and parking fast-track voucher.</div>
            <div>&bull; Volunteer confirms: contact is unmasked exclusively on the treating hospital desk.</div>
            <div className="text-slate-400">&bull; Audit ledger logs immutable consent event with microsecond timestamp.</div>
          </div>
        </div>
      </div>

      {/* Single-Command Deployment & Custom Domain Guide */}
      <div className="workbench-panel p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-bold text-on-surface uppercase tracking-wider">
            Zero-Dependency Deployment &amp; Custom Domain Guide
          </h2>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          The entire solution compiles into a single, self-sufficient binary combining the embedded SQLite engine and the compiled React production bundle.
        </p>

        <div className="bg-slate-950 text-slate-100 p-5 rounded-xl text-xs font-mono space-y-3 border border-slate-800">
          <div>
            <div className="text-slate-400 text-[11px] mb-1"># Step 1: Compile optimized React production bundle</div>
            <div className="text-emerald-400 bg-slate-900/80 px-3 py-1.5 rounded border border-slate-800">
              cd frontend &amp;&amp; npm run build
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px] mb-1"># Step 2: Build self-contained Go runtime binary</div>
            <div className="text-emerald-400 bg-slate-900/80 px-3 py-1.5 rounded border border-slate-800">
              go build -o server.exe .
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px] mb-1"># Step 3: Run standalone on port 8080 or cloud PORT environment</div>
            <div className="text-emerald-400 bg-slate-900/80 px-3 py-1.5 rounded border border-slate-800">
              ./server.exe -port 8080 -frontend frontend/dist
            </div>
          </div>
        </div>

        <div className="p-4 bg-surface-container-low border border-outline-variant/20 rounded-xl text-xs space-y-1.5">
          <div className="font-bold text-on-surface flex items-center space-x-1.5">
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span>Configuring Production Domain &amp; Reverse Proxy:</span>
          </div>
          <p className="text-on-surface-variant leading-relaxed">
            Attach a CNAME record at your DNS registrar (e.g. <code>grid.kerala.gov.in</code>) pointing to your cloud host (e.g. Render, Railway, AWS, or local DMZ server). The internal Go HTTP multiplexer handles host forwarding automatically without requiring manual virtual host configurations.
          </p>
        </div>
      </div>

      {/* Live Immutable Privacy Audit Ledger */}
      <div className="workbench-panel p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-outline-variant/20 gap-2">
          <div className="flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Immutable Privacy &amp; Access Audit Ledger ({auditLogs.length} Events)
              </h3>
              <p className="text-[11px] text-outline">Tamper-evident record of all privacy-sensitive actions</p>
            </div>
          </div>
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>LIVE AUDIT STREAM</span>
          </span>
        </div>

        <div className="overflow-x-auto border border-outline-variant/20 rounded-xl">
          <table className="min-w-full divide-y divide-outline-variant/20 text-xs">
            <thead className="bg-surface-container-low text-on-surface-variant font-bold">
              <tr>
                <th className="py-2.5 px-3.5 text-left font-mono tracking-wider uppercase text-[10px]">Timestamp</th>
                <th className="py-2.5 px-3 text-left font-mono tracking-wider uppercase text-[10px]">Action Event</th>
                <th className="py-2.5 px-3 text-left font-mono tracking-wider uppercase text-[10px]">Target ID</th>
                <th className="py-2.5 px-3 text-left font-mono tracking-wider uppercase text-[10px]">Initiated By</th>
                <th className="py-2.5 px-3.5 text-left font-mono tracking-wider uppercase text-[10px]">Audit Log Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 bg-surface-bright">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-outline text-xs">
                    No privacy audit records registered yet.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-primary/5 transition-colors">
                    <td className="py-2.5 px-3.5 font-mono text-[11px] text-outline whitespace-nowrap">
                      {log.timestamp ? log.timestamp.slice(11, 19) : '00:00:00'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-surface-container text-on-surface rounded border border-outline-variant/30">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-on-surface font-semibold text-xs">{log.target_id}</td>
                    <td className="py-2.5 px-3 text-on-surface font-medium">{log.performed_by}</td>
                    <td className="py-2.5 px-3.5 text-on-surface-variant text-[11px] leading-relaxed">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
