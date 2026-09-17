import React from 'react';
import { ShieldCheck, Lock, FileCheck, CheckCircle2, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      
      {/* Policy Header Bar */}
      <div className="workbench-panel p-5 sm:p-6 shadow-xs">
        <div className="flex items-center space-x-2 text-red-700 font-bold text-xs uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Statutory Governance Protocol</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Privacy Policy &amp; Volunteer Data Protection
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Effective: September 17, 2026 &bull; Compliant with Indian Digital Personal Data Protection Act (DPDPA 2023) and NBTC Transfusion Safety Guidelines.
        </p>
      </div>

      {/* Legal Text Workbench */}
      <div className="workbench-panel p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-xs">
        
        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider">
            1. Principle of Tokenized Contact Concealment
          </h2>
          <p>
            The District Blood Donor Matching System was specifically engineered to replace insecure, unencrypted WhatsApp broadcast chains. When a citizen registers as a volunteer donor, their mobile telephone number, full legal name, and physical address are immediately isolated in a restricted cryptographic vault.
          </p>
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
            <div className="font-semibold text-slate-900">What Requesting Hospitals and Public Visitors See:</div>
            <p className="text-slate-600 leading-relaxed">
              Coordinators and public interfaces only see a pseudonymous identifier such as <code>DONOR-EKM-101</code>, along with non-identifiable clinical compatibility data (blood group, distance in kilometers, and interval verification status). Personal contact details are completely locked.
            </p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider">
            2. The Affirmative Consent &amp; Unmasking Protocol
          </h2>
          <p>
            Personal contact details are unmasked strictly upon affirmative action by the donor. When an emergency notification is dispatched:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 leading-relaxed">
            <li>
              <strong>Initial Notification:</strong> The volunteer receives an invitation containing hospital name, clinical urgency, distance, and blood component requested. At this stage, zero personal information is accessible to the hospital.
            </li>
            <li>
              <strong>Explicit Acceptance:</strong> Only when the donor explicitly reviews the request and clicks <em>"Accept &amp; Share Contact"</em> does the system securely transmit the donor's telephone number to the verified hospital blood bank desk.
            </li>
            <li>
              <strong>Decline or Expiry:</strong> If the donor declines or ignores the request, no contact details are ever revealed. The system logs a private decline event and cascades the notification to the next eligible candidate.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider">
            3. Purpose of Clinical Interval Data Collection
          </h2>
          <p>
            The platform records specific medical interval data solely for safety compliance with the National Blood Transfusion Council (NBTC) regulations:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 leading-relaxed">
            <li>
              <strong>Previous Donation Date &amp; Component:</strong> Used exclusively by the automated eligibility engine to enforce 90-day (male whole blood), 120-day (female whole blood), and 14-day (platelet apheresis) recovery periods to preserve donor ferritin and hemoglobin.
            </li>
            <li>
              <strong>Geographic Coordinates:</strong> Used solely for computing Haversine radial distance to identify nearby hospitals. Coordinates are never published or shared with third-party tracking networks.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider">
            4. Absolute Prohibition of Commercial Use &amp; Scraping
          </h2>
          <p>
            Under no circumstances is donor information sold, leased, or transmitted to commercial marketing brokers, pharmaceutical representatives, or insurance entities. All data access requests are recorded in an immutable audit ledger available to district health administrators.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider">
            5. Donor Rights &amp; Revocation of Availability
          </h2>
          <p>
            Every volunteer retains the statutory right to deactivate their profile or request complete erasure of their records at any time. When a donor toggles their status to inactive, they are instantly excluded from all automated matching queries.
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
            District Health Administration &bull; Ernakulam Sector
          </span>
        </div>

      </div>

    </div>
  );
};
