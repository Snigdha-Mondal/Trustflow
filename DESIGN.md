# DESIGN.md — Trustflow Architectural Charcoal & Acid Lime Design System
*(Adapted from `elayadesign/ai-design-skills`, `landing-page-design`, and `design-taste-frontend` with the Bohne & Söhne Charcoal & Lime Aesthetic)*

This document governs all visual styling, typography, component hierarchies, layout structures, kinetic motion physics, and conversion copywriting for Trustflow. It defines the high-end architectural editorial aesthetic that discards generic AI black-and-blue clichés in favor of **deep matte charcoal**, **vibrant acid lime / pistachio chartreuse**, **crisp architectural white**, and **warm stone gray**.

---

## 1. Core Conversion Strategy (Part A)

### 1.1 The Core Offer Equation
**One Offer → One Audience → One Primary Action.**
- **The Core Offer:** Automated freelance milestone escrow powered by upfront PayPal funding, AI deliverable inspection, and an ironclad 72-hour "Silence Means Yes" auto-release guarantee.
- **The Audience (ICP):** Professional software engineers, designers, and agencies who suffer from delayed client reviews, scope creep, and unpaid invoices; and founders who require verified deliverables before milestone funds disburse.
- **The Primary Action:** Create an escrow contract / launch instant AI scope breakdown.

### 1.2 High-Class Copywriting Formulas
- **Headline Formula:** *"{Outcome} without {pain}"*
  - *"Freelance milestone escrow without payment anxiety or ghosting."*
  - Subheadline: *"Lock client budget into PayPal escrow upfront. Decompose the brief into objective tranches with AI. When deliverables pass automated inspection, get paid instantly."*
- **Primary CTA:** *"Create Escrow Contract"* or *"Analyze Project Brief"* (Never "Learn More", "Submit", or "Click Here").
- **Secondary CTA:** *"Explore Live Demo"* (Direct jump into interactive cockpit with zero sign-up friction).
- **Benefit-First Value Pillars:**
  - **Zero Ghosting Guarantee:** 72-hour Silence-Means-Yes rule auto-releases escrow funds if clients fail to review submitted work.
  - **Deterministic Inspection:** AI validates HTTP endpoints, DOM elements, and code commits against locked criteria before payment triggers.
  - **Instant Payouts:** Funds disburse directly to freelancer PayPal accounts via the PayPal Payouts API (`/v1/payments/payouts`).
  - **Fair Rescheduling:** Interactive Bryntum Gantt timelines automatically recalculate downstream dates when revisions occur.
- **Banned Filler Words:**
  Never use: *"revolutionize"*, *"supercharge"*, *"cutting edge"*, *"effortless"*, *"transform your workflow"*, *"take it to the next level"*, *"harness the power"*, or *"world class"*. Speak in concrete, operational facts.
- **Content Realism:**
  All amounts, transaction IDs, client names, and milestone deadlines must look authentic (e.g. `$900.00`, `$450.00`, `PAYOUTS_BATCH_78912`, `ct_9843a812`, `demo-contract-2026`).

---

## 2. Visual System & Color Architecture (Part B)

### 2.1 The Architectural Charcoal & Acid Lime Palette
The palette draws direct inspiration from high-end architectural editorial spaces (charcoal masonry, warm stone, and electrifying acid lime accents):

```
[ Canvas Layer 0: Deep Matte Charcoal #141517 ]
       │
       ├── [ Subtle Ambient Luster: rgba(218, 249, 156, 0.05) / rgba(255, 255, 255, 0.02) ]
       │
       ├── [ Surface Layer 1 (Cards & Bento Grid): #1C1D20 / rgba(28, 29, 32, 0.85) + backdrop-blur-xl ]
       │       └── Border: rgba(255, 255, 255, 0.08) (Hover: rgba(218, 249, 156, 0.35))
       │
       ├── [ Surface Layer 2 (Elevated Wells & Tranche Rows): #25272B ]
       │       └── Border: rgba(255, 255, 255, 0.06)
       │
       └── [ Signature Accent: Acid Lime #DAF99C / #D2F86E ]
               └── High-contrast dark text #0E1012 on lime buttons & active status pills
```

#### Approved Hex Token Values:
- **Base Canvas:** `#141517` (Deep Architectural Matte Charcoal)
- **Surface 1 (Card containers):** `#1C1D20` with `backdrop-blur-xl`
- **Surface 2 (Elevated wells, inputs & active rows):** `#25272B`
- **Surface 3 (Hover states & dark pills):** `#2E3036`
- **Primary Accent (Acid Lime / Chartreuse):** `#DAF99C` (Hover: `#CCF580`, Pressed: `#BFE86A`)
- **Accent Dark (Text on Acid Lime):** `#0E1012` (Ultra-high contrast dark graphite)
- **Secondary Accent (Architectural Off-White):** `#FFFFFF` / `#F8F9FA`
- **Secondary Neutral (Warm Stone Gray):** `#D6D7D8` (Used for metadata, section subheads, and secondary panels)
- **Muted Slate:** `#8A8E94` (Tertiary labels, timestamps, border dividers)
- **Inspection Amber (72h Timer / In Review):** `#FBBF24` (Surface: `rgba(251, 191, 36, 0.12)`)
- **Border Subtle:** `rgba(255, 255, 255, 0.08)` (1px solid border around all 4 sides)
- **Border Active/Hover:** `rgba(218, 249, 156, 0.4)`

#### Background & Contrast Rules:
1. **No Cold Neon Blue:** Blue has been eliminated in favor of Acid Lime (`#DAF99C`) and Architectural White.
2. **Flat Solid Surfaces:** Card and page surfaces are matte solid charcoal tones.
3. **Contrast Requirement:** Acid lime buttons use dark charcoal text (`text-[#0E1012]`) delivering a massive 12.8:1 contrast ratio that exceeds AAA accessibility requirements.

---

### 2.2 Typography Hierarchy & Hero Poster Layout
- **Hero Display Typography:** Geometric Ultra-Heavy Display Typography (`Unbounded` / `Syne`, fallback `Geist`, `Arial Black`, system-ui) at `clamp(3.8rem, 14vw, 11rem)` with `line-height: 0.88`, `font-weight: 900`, uppercase, and tight `-0.045em` letter tracking, spanning across the viewport like Razorpay's editorial campaign poster.
- **Hero Lockup:** The massive title **"TRUSTFLOW"** dominates the top of the viewport, with a right-aligned `by PayPal & Gemini AI` lockup directly below it, framed by tilted perforated ticket stamp cards (`rotate-[-5deg]` to `rotate-[6deg]`) that break the symmetry and present real user pain points.
- **Primary Interface Font:** `Geist` or `Geist Sans`, system fallback `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`.
- **Monospace Font:** `Geist Mono` or `JetBrains Mono` exclusively for financial amounts, PayPal transaction hashes, timestamps, and DOM selectors.
- **Balanced Text Wrapping:** Headings use `text-wrap: balance`; paragraphs use `text-wrap: pretty`. Zero orphaned words.

### 2.3 Strict Rectangular Button Geometry (0px Border Radius)
- **Zero Border-Radius Mandate:** All buttons, inputs, tabs, and interactive triggers are STRICT RECTANGLES with `border-radius: 0px` (`rounded-none`). No capsules, no rounded squares, no pills.
- **Primary Button (`.lime-button`):** `#DAF99C` (Acid Lime) background, `#0E1012` bold dark text, sharp 90° corners, hover brightness `#CCF580`, scale on press `active:scale-[0.98]`.
- **Secondary Button (`.rect-button-secondary`):** `#1C1D20` charcoal background, 1px solid `rgba(255, 255, 255, 0.2)` border, sharp 90° corners, `#F8F9FA` text.
- **Perforated Ticket Cards (`.ticket-stamp`):** `#1E2024` surface, 1.5px dashed border `rgba(255, 255, 255, 0.22)`, sharp 90° rectangular geometry, tilted angles.

| Style Token | Scale Step | Size / Line-Height | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Heading 1** | `text-5xl md:text-6xl` | 48px/60px (1.1) | Semibold | `-0.035em` | Hero main proposition |
| **Heading 2** | `text-3xl md:text-4xl` | 36px/40px (1.15) | Semibold | `-0.03em`| Major section headings |
| **Heading 3** | `text-2xl md:text-3xl` | 24px/32px (1.25) | Semibold | `-0.02em` | B11 Tagline & Feature titles |
| **Title 1** | `text-xl` | 20px / 28px | Medium | `-0.015em` | Card headers, milestone titles |
| **Title 2** | `text-lg` | 18px / 28px | Medium | `-0.01em` | Modal titles, sub-card headers |
| **Body 1** | `text-base` | 16px / 26px | Regular | `normal` | Primary explanatory body copy |
| **Body 2** | `text-sm` | 14px / 22px | Regular | `normal` | Secondary descriptions & table rows |
| **Button-md** | `text-base` | 16px / 24px | Semibold | `-0.01em` | Primary & secondary buttons |
| **Button-sm** | `text-sm` | 14px / 20px | Medium | `normal` | Dock action buttons & filters |
| **Caption 1** | `text-xs` | 12px / 16px | Medium | `0.05em` | Uppercase category pills & status |
| **Mono Data** | `text-xs md:text-sm` | 12px-14px | Mono | `0` | Hashes, batch IDs, PayPal balances |

---

### 2.3 Spacing Scale & Layout Rhythm
Spacing strictly adheres to 8-point and 4-point design tokens:
- `Spacing-50` (4px): Micro gaps between icons and labels
- `Spacing-75` (8px): Button vertical padding, badge margins
- `Spacing-100` (12px): Standard button horizontal padding, list item gaps
- `Spacing-200` (16px): Card internal padding, grid column gaps
- `Spacing-300` (24px): Section element stacks, navbar dock offset
- `Spacing-400` (32px): Major card padding, modal internal whitespace
- `Spacing-600` (48px): Section rhythm margins
- `Spacing-800` (80px): Major section separation padding

---

### 2.4 Corner Radius & Rectangular Button Geometry
- **Buttons are strictly sharp rectangles:** Action buttons, CTAs, and filter triggers use `rounded-none` or `rounded-[2px]`. Pill and capsule buttons are strictly prohibited.
- **Card Containers:** Use `rounded-2xl` (16px) or `rounded-xl` (12px).
- **Nested Geometry Rule:** When a shape sits inside another shape and the gap between them is less than 32px:
  $$\text{inner radius} = \text{outer radius} - \text{internal padding}$$
  *(Applies when result $> 2px$)*

---

### 2.5 Borders & Surface Rules
1. **Four-Sided Borders Only:** Never apply a single-sided border (`border-b`, `border-l`) to a card container. Borders must encircle all four sides (`border border-white/10`).
2. **Dividers:** Internal dividers use full-width horizontal rules (`h-[1px] bg-white/[0.08]`).
3. **No Heavy Shadows on Dark:** Standard drop shadows are invisible on matte charcoal. Instead, use micro-shimmer borders (`ring-1 ring-[#DAF99C]/25`) and tactile surface highlights.

---

### 2.6 Kinetic Motion & Physics (Part B7)
Motion must feel weighted, premium, and physical. Generic browser defaults (`ease`, `linear`) are prohibited.

- **Primary Deceleration Curve:** `cubic-bezier(0.22, 1, 0.36, 1)` (Spring-like settling without overshoot).
- **Durations:**
  - Layout & modal transitions: `duration-500`
  - Hover brightness & border shifts: `duration-300`
  - Active press feedback: `duration-150`
- **Only Animate Transforms & Opacity:** Never animate `width`, `height`, `top`, or `left` directly. Use CSS transforms (`scale`, `translateY`, `rotate`).
- **Reduced Motion Support:** Respect `@media (prefers-reduced-motion)` by substituting positional transitions with simple opacity fades.

#### Signature Micro-Interactions:
1. **Floating Capsule Dock Navigation:**
   - Floats 20px off top edge, centered.
   - Architectural charcoal finish (`bg-[#1C1D20]/85 backdrop-blur-2xl border border-white/10`).
   - Acid Lime brand monogram with subtle glow.
2. **Hero Live Escrow Simulator:**
   - Interactive live preview demonstrating PayPal funds locking upfront, tranche breakdown, and instant disbursement.
   - Pulsing Acid Lime beacon dot (`animate-pulse ring-4 ring-[#DAF99C]/25 bg-[#DAF99C]`).
3. **Bryntum Gantt Board with Kinetic Dependency Connectors:**
   - SVG dependency curves that illuminate in Acid Lime when hovering related milestones.
   - Live interactive scrubber allowing the user to drag the timeline forward and watch milestone status update in real-time.
   - Integrated Bryntum AI Prompt Rescheduler modal with simulated automatic timeline adjustment.
4. **B11 Mandatory Tagline Reveal Section:**
   - High-impact two-line statement:
     *"No ghosting. No scope creep. Just verified deliverables and automatic PayPal payouts."*
   - Words transition sequentially from muted `opacity-25` to radiant `opacity-100 text-white` (with key guarantee words highlighted in `#DAF99C`) as the section scrolls into the viewport.
5. **Interactive FAQ Accordion:**
   - Smooth expand/collapse using the base deceleration curve.
   - Micro-rotate 180° indicator on chevron.
   - Subtle Acid Lime border glow on active open question.

---

### 2.7 Interactive Component State Matrix (Part B9)
Every interactive element must support the full 7-state lifecycle:

1. **Default:** Crisp contrast ratio ($\ge 4.5:1$), legible typography, defined 4-sided border.
2. **Hover:** Subtle upward translate (`-translate-y-0.5`), surface brightening (`bg-white/[0.04]`), and border glow (`border-[#DAF99C]/40`).
3. **Active/Pressed:** Tactile mechanical depression (`active:scale-[0.98] active:translate-y-0`).
4. **Focus-Visible:** Accessible high-contrast focus ring (`focus-visible:ring-2 focus-visible:ring-[#DAF99C] focus-visible:outline-none`).
5. **Loading:** Shimmering skeleton placeholders mirroring actual layout geometry (never raw circular spinners).
6. **Empty State:** Illustrated structured container with explicit onboarding action (never blank void).
7. **Error State:** Specific inline error callouts with immediate remediation steps (never generic browser alerts).

---

## 3. Section Architecture & Layout Flow

The landing page and cockpit follow a strict narrative conversion sequence:

1. **Floating Glass Dock Navigation:** Brand glyph in Acid Lime, anchor links (How it Works, Inspection, Gantt Board, FAQ), Live Status Pill, Primary Action ("Create Contract" in Acid Lime).
2. **Hero Section:**
   - Category Badge: "Autonomous Freelance Escrow — Powered by PayPal & Gemini AI"
   - Headline: Max width 680px, architectural white with subtle metallic gradient, meaningful line breaks.
   - Subheadline: Max width 640px, outcome-driven value proposition.
   - Dual Action CTAs: Primary ("Create Escrow Contract" in Acid Lime `#DAF99C` with `#0E1012` text) + Secondary ("Explore Live Demo" in charcoal glass).
   - Live Interactive Escrow Simulation Terminal.
3. **B11 Tagline Reveal Moment:** Word-by-word kinetic scroll reveal across two high-impact sentences.
4. **Bento Grid Architecture (The Three Engines):**
   - Engine 1: PayPal Upfront Escrow & Payouts API.
   - Engine 2: Gemini AI Deliverable Inspector (DOM/HTTP + Subjective Audit).
   - Engine 3: 72-Hour "Silence Means Yes" Auto-Release Protocol.
5. **Interactive Bryntum Gantt Timeline Board:**
   - Visual milestone tranches with status indicators.
   - Interactive timeline scrubber simulating contract progression.
   - Bryntum prompt recalculator widget.
6. **Live Deliverable Inspection Engine View:**
   - Real-time simulated crawler auditing live HTTP status, viewport meta tags, form inputs, and Gemini deliverable checklist.
7. **Social Proof & Security Metric Strip:** Zero ghosting rate, 100% automated payouts, 72h auto-release benchmark.
8. **Objection Handling FAQ Accordion:** 6 detailed answers addressing PayPal sandbox mode, fee structures, dispute handling, and AI inspector boundaries.
9. **Final Risk-Reversal CTA Banner:** Replicating primary offer with 72-hour protection guarantee.
10. **High-Class Footer:** Legal links, status indicator, PayPal Sandbox badges, GitHub repo link.
