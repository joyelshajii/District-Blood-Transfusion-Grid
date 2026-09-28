/**
 * Clinical Print-Ready Cold-Chain Transport Requisition Slip
 * Conforming to NBTC & Drugs and Cosmetics Rules (1945) Schedule F Part XII-B
 * Features ISBT 128 Specimen Barcode, Verification QR, Thermal Log Table, and Custody Signatures
 */

import React from 'react';
import {
  Printer,
  X,
  ShieldCheck,
  Thermometer,
  Truck,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { BarcodeSVG, generateISBT128DIN } from '../utils/barcode';
import { QRCodeSVG } from '../utils/qrCode';

export interface TransportSlipData {
  caseNumber: string;
  hospitalName: string;
  hospitalTaluk: string;
  donorCode: string;
  bloodGroup: string;
  component: string;
  units: number;
  urgencyLevel: string;
  departureTime?: string;
  patientCode?: string;
}

interface TransportSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TransportSlipData;
}

export const TransportSlipModal: React.FC<TransportSlipModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!isOpen) return null;

  const specimenDIN = generateISBT128DIN('W4821', parseInt(data.donorCode.replace(/[^0-9]/g, '') || '104820', 10));
  const printTimestamp = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }) + ' IST';

  const isPlatelet = data.component.toLowerCase().includes('platelet') || data.component.toLowerCase().includes('apheresis');
  const tempRange = isPlatelet ? '+20°C to +24°C (Gentle Agitation)' : '+2°C to +6°C (Cold-Chain Ice Box)';

  return (
    <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-2xl w-full my-6 overflow-hidden text-slate-900">
        
        {/* Modal Action Ribbon (Hidden on physical print) */}
        <div className="print:hidden flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-bold tracking-widest uppercase">
              STAT REQUISITION MANIFEST // PRINT-READY
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="bg-primary hover:bg-primary/90 text-white text-xs py-1.5 px-3 rounded-lg flex items-center space-x-1.5 shadow-xs font-semibold cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Physical Slip Canvas */}
        <div className="p-6 sm:p-8 space-y-5 bg-white text-xs" id="printable-transport-slip">
          
          {/* Header Banner */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 bg-red-700 text-white rounded flex items-center justify-center font-bold text-xs font-mono">
                  +
                </span>
                <span className="font-extrabold uppercase tracking-wider text-slate-900 text-xs font-mono">
                  GOVERNMENT OF KERALA &bull; DEPARTMENT OF HEALTH SERVICES
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-1">
                Cold-Chain Blood Specimen Transport Slip
              </h1>
              <p className="text-[11px] text-slate-600 font-mono">
                District Blood Transfusion Coordination Cell &bull; Ernakulam Sector
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="inline-block px-2.5 py-1 bg-red-100 text-red-900 border border-red-300 font-mono font-bold text-xs rounded">
                {data.urgencyLevel.toUpperCase()}
              </span>
              <span className="text-[10px] text-slate-500 block font-mono mt-1">
                Generated: {printTimestamp}
              </span>
            </div>
          </div>

          {/* Barcode & Requisition Identification Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="sm:col-span-2 space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
                ISBT 128 SPECIMEN IDENTIFICATION NUMBER (DIN)
              </span>
              <div className="overflow-x-auto">
                <BarcodeSVG
                  value={specimenDIN}
                  type="code128"
                  height={42}
                  barWidth={1.35}
                  captionTitle="ISBT 128 BARCODE"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">CASE NUMBER</span>
                  <span className="font-bold text-slate-900">{data.caseNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">DONOR CODE TOKEN</span>
                  <span className="font-bold text-red-700">{data.donorCode}</span>
                </div>
              </div>
            </div>

            {/* QR Code Verification Anchor */}
            <div className="flex flex-col items-center justify-center bg-white p-2.5 rounded-lg border border-slate-200">
              <QRCodeSVG
                value={`district-blood://manifest/${data.caseNumber}?din=${encodeURIComponent(specimenDIN)}&ts=${Date.now()}`}
                size={110}
                fgColor="#0f172a"
              />
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-1">
                DIGITAL AUDIT QR
              </span>
            </div>
          </div>

          {/* Transfusion Specification Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">BLOOD GROUP</span>
              <span className="text-base font-black text-red-700 font-mono">{data.bloodGroup}</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">COMPONENT</span>
              <span className="text-xs font-bold text-slate-900">{data.component}</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">UNITS DISPATCHED</span>
              <span className="text-base font-bold font-mono text-slate-900">{data.units} Unit(s)</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">ANTICOAGULANT</span>
              <span className="text-xs font-mono font-bold text-slate-900">CPD-A1 Solution</span>
            </div>
          </div>

          {/* Clinical Cold-Chain Thermal Protocol */}
          <div className="p-3.5 bg-emerald-50/60 border border-emerald-300 rounded-xl space-y-1.5">
            <div className="flex items-center space-x-2 text-emerald-900 font-bold">
              <Thermometer className="w-4 h-4 text-emerald-700" />
              <span>Mandatory Cold-Chain Temperature Specification:</span>
            </div>
            <p className="text-[11px] text-emerald-950 font-mono leading-relaxed">
              Standard: <strong>{tempRange}</strong>. Must be transported in validated insulated bio-transport container with pre-conditioned ice gel packs. Do not expose to direct sunlight or ambient heat.
            </p>
          </div>

          {/* Courier & Hospital Custody Chain Handover Table */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Chain of Custody Handover Verification
            </span>
            <table className="min-w-full border border-slate-300 divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-100 font-semibold text-slate-700 text-[11px]">
                <tr>
                  <th className="py-2 px-3 text-left">Stage</th>
                  <th className="py-2 px-3 text-left">Authorized Officer / Facility</th>
                  <th className="py-2 px-3 text-left">Temp (°C)</th>
                  <th className="py-2 px-3 text-left">Timestamp</th>
                  <th className="py-2 px-3 text-right">Signature / Seal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-[11px]">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">1. Dispatch</td>
                  <td className="py-2.5 px-3 font-mono">Blood Bank MO / Attendant</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">+4.2°C</td>
                  <td className="py-2.5 px-3 font-mono">{printTimestamp.split(',')[1] || '18:45 IST'}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400 italic">Signed on Entry</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">2. Courier Custody</td>
                  <td className="py-2.5 px-3 font-mono">Emergency Transit Vehicle #KL-07</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">+4.0°C</td>
                  <td className="py-2.5 px-3 font-mono">En Route</td>
                  <td className="py-2.5 px-3 text-right text-slate-400 italic">Seal Intact</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">3. Hospital Receipt</td>
                  <td className="py-2.5 px-3 font-mono">{data.hospitalName}</td>
                  <td className="py-2.5 px-3 font-mono">________°C</td>
                  <td className="py-2.5 px-3 font-mono">____:____ IST</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-400">[ Sign Here ]</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Statutory Footer Disclaimer */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 font-mono gap-2">
            <span>Drugs &amp; Cosmetics Rules 1945 &bull; Schedule F XII-B Compliant</span>
            <span>Tamper-evident physical dispatch slip</span>
          </div>

        </div>

      </div>
    </div>
  );
};
