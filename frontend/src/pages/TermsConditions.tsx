import React from 'react';
import { FileText, ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck, Scale } from 'lucide-react';

interface TermsConditionsProps {
  onBack: () => void;
}

export const TermsConditions: React.FC<TermsConditionsProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Terms Header Bar */}
      <div className="workbench-panel p-6 sm:p-7 shadow-xs">
        <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-wider mb-1.5">
          <Scale className="w-4 h-4" />
          <span>Operational Service Agreement</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
          Terms &amp; Conditions of Service Protocol
        </h1>
        <p className="text-xs text-on-surface-variant mt-1.5 font-medium leading-relaxed">
          Governing the District Blood Donor Matching Platform &bull; Applicable to Healthcare Facilities and Volunteer Donors under the Drugs and Cosmetics Rules (1945).
        </p>
      </div>

      {/* Legal Text Content */}
      <div className="workbench-panel p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-on-surface leading-relaxed shadow-xs">
        
        <section className="space-y-2.5">
          <h2 className="text-sm sm:text-base font-bold text-on-surface uppercase tracking-wider flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>1. Strictly Voluntary &amp; Non-Remunerated Service</span>
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            In accordance with the Supreme Court of India ruling and the Drugs and Cosmetics Rules (1945), all blood donation facilitated through this system is strictly voluntary and uncompensated. No donor, recipient, hospital coordinator, or third party shall offer, solicit, or accept any financial payment, gift, or commercial exchange for blood or blood components.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-sm sm:text-base font-bold text-on-surface uppercase tracking-wider flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>2. Hospital Requisition Integrity</span>
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Requisitions created on this network must originate exclusively from verified clinical personnel or authorized blood bank coordinators representing accredited medical facilities. Fictitious cases, duplicate bulk tests, or commercial collection drives are strictly prohibited.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-sm sm:text-base font-bold text-on-surface uppercase tracking-wider flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>3. Mandatory On-Site Clinical Verification</span>
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Algorithmic matching on this platform serves as an initial eligibility filter based on interval records and ABO compatibility. It does not replace the mandatory on-site pre-donation health screening conducted by the hospital blood bank medical officer, including hemoglobin testing (minimum 12.5 g/dL), blood pressure measurement, and screening for transmissible infections.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-sm sm:text-base font-bold text-on-surface uppercase tracking-wider">
            4. Accuracy of Donor Interval Disclosures
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Volunteers agree to declare true and accurate records regarding their last donation date and component. The platform's automated cooldown engine depends on truthful disclosures to ensure patient safety and donor biological well-being.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-sm sm:text-base font-bold text-on-surface uppercase tracking-wider">
            5. Emergency Fallback &amp; Disclaimer of Liability
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            While the platform aims to identify compatible nearby volunteers swiftly, it is designed as a supplementary civic coordination mechanism. Participating hospitals must continue to utilize standard blood bank inventory reserves and inter-hospital exchange protocols for immediate life-threatening hemorrhages.
          </p>
        </section>

        <div className="pt-4 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="btn-secondary text-xs py-2 px-3.5 flex items-center space-x-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Application</span>
          </button>

          <span className="text-[11px] text-outline font-mono">
            District Health Administration &bull; Version 1.0 &bull; Ernakulam
          </span>
        </div>

      </div>

    </div>
  );
};
