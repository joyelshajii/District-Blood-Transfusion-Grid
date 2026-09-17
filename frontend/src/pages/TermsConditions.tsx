import React from 'react';
import { FileText, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';

interface TermsConditionsProps {
  onBack: () => void;
}

export const TermsConditions: React.FC<TermsConditionsProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      
      {/* Terms Header Bar */}
      <div className="workbench-panel p-5 sm:p-6 shadow-xs">
        <div className="flex items-center space-x-2 text-slate-700 font-bold text-xs uppercase tracking-wider mb-1">
          <FileText className="w-4 h-4 text-slate-700" />
          <span>Operational Service Agreement</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Terms &amp; Conditions of Service
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Governing the District Blood Donor Matching Platform &bull; Applicable to Healthcare Facilities and Volunteer Donors.
        </p>
      </div>

      {/* Legal Text Content */}
      <div className="workbench-panel p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-xs">
        
        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider">
            1. Strictly Voluntary &amp; Non-Remunerated Service
          </h2>
          <p>
            In accordance with the Supreme Court of India ruling and the Drugs and Cosmetics Rules (1945), all blood donation facilitated through this system is strictly voluntary and uncompensated. No donor, recipient, hospital coordinator, or third party shall offer, solicit, or accept any financial payment, gift, or commercial exchange for blood or blood components.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider">
            2. Hospital Requisition Integrity
          </h2>
          <p>
            Requisitions created on this network must originate exclusively from verified clinical personnel or authorized blood bank coordinators representing accredited medical facilities. Fictitious cases, duplicate bulk tests, or commercial collection drives are strictly prohibited.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider">
            3. Mandatory On-Site Clinical Verification
          </h2>
          <p>
            Algorithmic matching on this platform serves as an initial eligibility filter based on interval records and ABO compatibility. It does not replace the mandatory on-site pre-donation health screening conducted by the hospital blood bank medical officer, including hemoglobin testing (minimum 12.5 g/dL), blood pressure measurement, and screening for transmissible infections.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider">
            4. Accuracy of Donor Interval Disclosures
          </h2>
          <p>
            Volunteers agree to declare true and accurate records regarding their last donation date and component. The platform's automated cooldown engine depends on truthful disclosures to ensure patient safety and donor biological well-being.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider">
            5. Emergency Fallback &amp; Disclaimer of Liability
          </h2>
          <p>
            While the platform aims to identify compatible nearby volunteers swiftly, it is designed as a supplementary civic coordination mechanism. Participating hospitals must continue to utilize standard blood bank inventory reserves and inter-hospital exchange protocols for immediate life-threatening hemorrhages.
          </p>
        </section>

        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onBack}
            className="btn-secondary text-xs flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Application</span>
          </button>

          <span className="text-[11px] text-slate-500 font-mono">
            District Health Administration &bull; Version 1.0
          </span>
        </div>

      </div>

    </div>
  );
};
