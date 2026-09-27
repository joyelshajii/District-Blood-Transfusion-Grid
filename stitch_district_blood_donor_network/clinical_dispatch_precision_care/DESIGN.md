---
name: Clinical Dispatch & Precision Care
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf4'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dde9ff'
  surface-container-highest: '#d5e3fd'
  on-surface: '#0d1c2f'
  on-surface-variant: '#59413e'
  inverse-surface: '#233144'
  inverse-on-surface: '#ebf1ff'
  outline: '#8d706d'
  outline-variant: '#e1bfbb'
  surface-tint: '#b02d29'
  primary: '#760009'
  on-primary: '#ffffff'
  primary-container: '#991b1b'
  on-primary-container: '#ffaaa1'
  inverse-primary: '#ffb4ac'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#00402d'
  on-tertiary: '#ffffff'
  tertiary-container: '#005a40'
  on-tertiary-container: '#75d2ab'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ac'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#8e1214'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#97f5cc'
  tertiary-fixed-dim: '#7bd8b1'
  on-tertiary-fixed: '#002115'
  on-tertiary-fixed-variant: '#00513a'
  background: '#f8f9ff'
  on-background: '#0d1c2f'
  surface-variant: '#d5e3fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: 3.5rem
    letterSpacing: -0.025em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: '0'
  label-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.025em
  data-mono:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies clinical precision, emergency response authority, and absolute data clarity. Built for institutional blood bank coordinators, field phlebotomists, and donors, the interface balances life-critical urgency with patient privacy and institutional trust. 

The aesthetic is grounded in a hybrid of **Clean Clinical Functionalism** and **Tactical Dispatch Systems**. It rejects consumer wellness fluff, unnecessary ornamentation, and low-contrast ambiguity in favor of razor-sharp data hierarchy, high-contrast legibility under varied lighting conditions (e.g., triage tents, ambulances, bright labs), and immediate visual parsing of blood types, compatibility matrices, and dispatch statuses.

### Emotional Baseline
- **Authoritative & Legitimate:** Evokes hospital-grade software, regulatory compliance, and biological precision.
- **Urgent without Panic:** Alerts and dispatch calls present clear situational awareness without cognitive overload.
- **Privacy-Forward:** Visual architectures natively prioritize tokenized, masked donor records and audit-ready data isolation.

## Colors

The palette is engineered around high semantic utility, separating vital alerts from routine diagnostic telemetry.

### Primary & Blood Tones
- **Deep Crimson (`#991B1B`) & Arterial Red (`#B91C1C`):** Used strictly for core blood group telemetry, critical stock shortages, urgent emergency dispatch triggers, and the primary system identity. Avoid using red for generic destructive secondary actions to preserve its critical life-saving semantics.
- **Hemoglobin Soft Tint (`#FEF2F2`):** Background fill for critical triage alerts, urgent blood calls, and negative Rh factor highlights.

### Slate Neutrals & Clinical Slate
- **Surgical Void (`#0F172A`):** The primary typographic and framing anchor. High-contrast, formal, and authoritative.
- **Slate Steel (`#334155`):** Secondary text, structural grid dividers, inactive states, and clinical telemetry boundaries.
- **Lab Surface (`#F8FAFC`) & Clean Tray (`#FFFFFF`):** The default optical baseline. Provides a sterile, anti-glare canvas across workstation monitors and handheld field tablets.

### Functional Accents
- **Clinical Emerald (`#047857`):** Represents verified eligibility, successful donor screening, cold-chain temperature compliance, and cleared antibody crossmatches.
- **Urgent Amber (`#D97706`):** Highlights impending eligibility countdowns, expiring platelets (5-day limit), and priority dispatch alerts.

## Typography

The typographic hierarchy couples **Plus Jakarta Sans** for structural headings and brand-level focal points with **Inter** for dense data displays, masked donor IDs, eligibility metrics, and clinical tables.

### Typesetting Rules
- **Tabular Figures:** All counts, units (mL), blood inventory volumes, and eligibility dates must enforce OpenType tabular figures (`tnum`) to eliminate visual jitter during real-time data streaming.
- **Blood Group Notation:** Blood group identifiers (e.g., `O-`, `AB+`) must be set in `headline-sm` or `label-md` with `font-weight: 700`, ensuring the Rh factor is visually distinct from the letter characters.
- **Masked Data Presentation:** Donor identification tokens (e.g., `DN-9402•••X`) utilize uppercase `data-mono` styling to provide clear character distinction and prevent confusion between zeroes, 'O's, ones, and 'I's.

## Layout & Spacing

This design system uses a strict **12-column fluid grid system** with rigid baseline alignments to sustain high information density while preserving legibility during triage operations.

### Breakpoints & Layout Adapters
- **Desktop (≥ 1280px):** 12-column grid with a `margin` of `2rem` and `gutter` of `1.25rem`. Optimized for command-and-control multi-panel views (District Inventory, Active Dispatches, Matching Queue).
- **Tablet (768px – 1279px):** 8-column layout. Sidebars collapse to responsive command rails; cards stack into bi-column modular units.
- **Mobile Handheld (≤ 767px):** 4-column layout with a compressed `margin-mobile` of `1rem` and `gutter-mobile` of `0.75rem`. Prioritizes single-column full-width match cards, simplified donor profiles, and prominent persistent action buttons.

### Spacing Principles
- Layout structures follow an 8px rhythmic grid with a 4px sub-grid for dense clinical tables and badge paddings (`space-xs`).
- Card interiors never exceed `space-lg` padding to maximize screen utility without feeling crowded.

## Elevation & Depth

Visual hierarchy uses a **surface-border-tonal hybrid** rather than dramatic drop shadows. In medical software, heavy shadows muddy data visualization and create perceptual ambiguity.

### Surface System
- **Ground Floor (`#F8FAFC`):** Application canvas background.
- **Work Surface Tier 1 (`#FFFFFF`):** Primary card bodies, lists, and standard table cells. Elevated strictly via a structural `1px` crisp border in Slate Neutral (`#E2E8F0`).
- **Triage Priority Tier 2:** Urgent matches and blood unit requests utilize a soft dual border (`1px` `#B91C1C` outer border paired with a faint `2px` inset outline in `#FEF2F2`) to assert immediate priority without heavy visual weight.

### Shadow Profile
- Shadows are reserved strictly for floating panels, dispatch overlays, and modals.
- When required, shadows use a clinical, diffused signature: `0 4px 16px -2px rgba(15, 23, 42, 0.08), 0 2px 4px -1px rgba(15, 23, 42, 0.04)`.

## Shapes

The design system employs **Soft (`1`)** roundedness. Corner radii are kept crisp and disciplined (base radius of `0.25rem` / `4px`, up to `0.5rem` / `8px` for large containers), communicating structural rigor, reliability, and institutional precision.

Circular treatments (`border-radius: 9999px`) are exclusively reserved for blood group badges, donor status indicator pips, and numerical count pills. All functional forms, inputs, and cards retain disciplined rectangular silhouettes.

## Components

### Buttons & Dispatch Triggers
- **Primary / Urgent Dispatch:** Deep Crimson background (`#991B1B`), white bold text, `0.25rem` radius. On active/focus states, shifts to `#7F1D1D` with an authoritative 2px slate outline offset.
- **Secondary / Operational:** Surface white with a sharp `#CBD5E1` border and `#0F172A` text.
- **Destructive / Abort:** Border-only `#DC2626` with transparent background, alerting operators without competing with urgent dispatch calls.

### Chips & Badges
- **Blood Group Badge:** Circular or condensed-pill format featuring high-contrast inverted styling (e.g., `#991B1B` background with bold white typography for critical Universal Donor `O-` units; `#0F172A` background with crisp white typography for compatible matches).
- **Eligibility Countdown Indicator:** Amber-tinted badge (`#FEF3C7` background, `#92400E` text) showing time-remaining metrics (e.g., `Eligible in 14d`) alongside a segmented linear bar.
- **Privacy Mask Tag:** Dark-neutral background (`#F1F5F9`) with monospaced text, a lock icon, and subtle click-to-audit interaction tracking.

### Cards & Data Containers
- **Donor Match Card:** High-density modular cards. Left edge includes a 4px color-coded priority bar (Crimson for Immediate STAT Need, Amber for Routine Replenishment, Slate for Standby). Contains donor anonymous token, geographical radius (km), antibody screening pass status, and direct-dispatch button.
- **Cold-Chain Telemetry Unit:** Embedded miniature data panel with live temperature status (`+4°C ± 2°C`) and verified transit countdown timer.

### Input Fields & Controls
- **Form Controls:** Clean white interior with a strict 1px `#CBD5E1` border, transitioning to a 2px `#991B1B` border upon focus. Labels remain permanently pinned above inputs to avoid ambiguity during rapid data entry.
- **Checkboxes & Radios:** Sharp, tactile checkboxes with an active Crimson fill and high-contrast white checkmark icon.