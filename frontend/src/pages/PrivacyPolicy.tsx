import React from 'react';
import { ShieldCheck, Lock, FileCheck, CheckCircle2, ArrowLeft, Shield, AlertCircle } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Policy Header Bar */}
      <div className="workbench-panel p-6 sm:p-7 shadow-xs">
        <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-wider mb-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>Statutory Governance Protocol</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
          Privacy Policy &amp; Volunteer Data Protection Protocol
        </h1>
        <p className="text-xs text-on-surface-variant mt-1.5 font-medium leading-relaxed">
          Effective: September 17, 2026 &bull; Compliant with Indian Digital Personal Data Protection Act (DPDPA 2023) and NBTC Transfusion Safety Guidelines.
        </p>
      </div>

      {/* Legal Text Workbench */}
      <div className="workbench-panel p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-on-surface leading-relaxed shadow-xs">
        
        <section className="space-y-2.5">
          <h2 className="text-sm sm:text-base font-bold text-on-surface uppercase tracking-wider flex items-center space-x-2">
            <Lock className="w-4 h-4 text-primary" />
            <span>1. Principle of Tokenized Contact Concealment</span>
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            The District Blood Donor Matching System was specifically engineered to replace insecure, unencrypted WhatsApp broadcast chains. When a citizen registers as a volunteer donor, their mobile telephone number, full legal name, and physical address are immediately isolated in a restricted cryptographic vault.
          </p>
          <div className="p-4 bg-surface-container-low border border-outline-variant/20 rounded-xl text-xs space-y-1.5">
            <div className="font-bold text-on-surface">What Requesting Hospitals and Public Visitors See:</div>
            <p className="text-on-surface-variant leading-relaxed">
              Coordinators and public interfaces only see a pseudonymous identifier such as <code className="bg-surface-container px-1.5 py-0.5 rounded font-mono text-primary font-bold">DONOR-EKM-101</code>, along with non-identifiable clinical compatibility data (blood group, distance in kilometers, and interval verification status). Personal contact details are completely locked.
            </p>
          </div>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-sm sm:text-base font-bold text-on-surface uppercase tracking-wider flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>2. The Affirmative Consent &amp; Unmasking Protocol</span>
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Personal contact details are unmasked strictly upon affirmative action by the donor. When an emergency notification is dispatched:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-on-surface-variant leading-relaxed">
            <li>
              <strong>Initial Notification:</strong> The volunteer receives an invitation containing hospital name, clinical urgency, distance, and blood component requested. At this stage, zero personal contact information is accessible to the hospital desk.
            </li>
            <li>
              <strong>Explicit Acceptance:</strong> Only when the donor explicitly reviews the request and clicks <em>"Accept &amp; Share Contact"</em> does the system securely transmit the donor's telephone number to the verified hospital blood bank desk.
            </li>
            <li>
              <strong>Decline or Expiry:</strong> If the donor declines or ignores the request, no contact details are ever revealed. The system logs a private decline event and cascades the notification to the next eligible candidate.
            </li>
          </ul>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-sm sm:text-base font-bold text-on-surface uppercase tracking-wider flex items-center space-x-2">
            <Shield className="w-4 h-4 text-primary" />
            <span>3. Purpose of Clinical Interval Data Collection</span>
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            The platform records specific medical interval data solely for safety compliance with National Blood Transfusion Council (NBTC) regulations:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-on-surface-variant leading-relaxed">
            <li>
              <strong>Previous Donation Date &amp; Component:</strong> Used exclusively by the automated eligibility engine to enforce 90-day (male whole blood), 120-day (female whole blood), and 14-day (platelet apheresis) recovery periods to preserve donor ferritin and hemoglobin.
            </li>
            <li>
              <strong>Geographic Coordinates:</strong> Used solely for computing Haversine radial distance to identify nearby hospitals. Coordinates are never published or shared with third-party tracking networks.
            </li>
          </ul>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-sm sm:text-base font-bold text-on-surface uppercase tracking-wider flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-primary" />
            <span>4. Absolute Prohibition of Commercial Use &amp; Scraping</span>
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Under no circumstances is donor information sold, leased, or transmitted to commercial marketing brokers, pharmaceutical representatives, or insurance entities. All data access requests are recorded in an immutable audit ledger available to district health administrators.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-sm sm:text-base font-bold text-on-surface uppercase tracking-wider">
            5. Donor Rights &amp; Revocation of Availability
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Every volunteer retains the statutory right to deactivate their profile or request complete erasure of their records at any time. When a donor toggles their status to inactive, they are instantly excluded from all automated matching queries.
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
            District Health Administration &bull; Ernakulam Sector
          </span>
        </div>

      </div>

    </div>
  );
};
