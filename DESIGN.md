# DESIGN.md — Trustflow High-Class Design System & Kinetic Architecture
*(Integrated with `elayadesign/ai-design-skills`, `landing-page-design`, and `design-taste-frontend`)*

This document governs all visual styling, typography, component hierarchies, layout structures, kinetic motion physics, and conversion copywriting for Trustflow. It defines the high-class, luxury FinTech aesthetic that eliminates generic AI template tropes through layered obsidian surfaces, tactile micro-interactions, weighted spring physics, and rigorous typography.

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

## 2. Visual System & Design Tokens (Part B)

### 2.1 The Obsidian Luxury Canvas & Color Tokens
To avoid flat, lifeless generic black palettes, Trustflow employs a multi-layered obsidian and slate depth hierarchy with luminous micro-accents:

```
[ Canvas Layer 0: Deep Obsidian #030712 ]
       │
       ├── [ Ambient Radial Glow: rgba(0, 112, 186, 0.08) / rgba(56, 189, 248, 0.05) ]
       │
       ├── [ Surface Layer 1 (Cards & Bento Grid): #0B0F19 / rgba(15, 23, 42, 0.65) + backdrop-blur-xl ]
       │       └── Border: rgba(255, 255, 255, 0.08) (Hover: rgba(56, 189, 248, 0.25))
       │
       ├── [ Surface Layer 2 (Inner Modals & Tranche Rows): #111827 / rgba(17, 24, 39, 0.8) ]
       │       └── Border: rgba(255, 255, 255, 0.06)
       │
       └── [ Surface Layer 3 (Badges & Code Wells): #050811 with Geist Mono ]
```

#### Approved Palette Hex Values:
- **Base Canvas:** `#030712` (Rich Obsidian Slate)
- **Surface 1 (Card background):** `#0B0F19` with `backdrop-blur-xl`
- **Surface 2 (Elevated wells & inputs):** `#111827`
- **Surface 3 (Hover & active highlights):** `#1E293B`
- **Primary Brand (PayPal Electric Blue):** `#0070BA` (Hover: `#005EA6`, Active: `#004C87`)
- **Accent Light (Cyan Luster):** `#38BDF8` (Used for highlights, focus rings, and milestone progress)
- **Verification Emerald (Pass / Funded):** `#10B981` (Surface: `#064E3B`/30, Text: `#34D399`)
- **Inspection Amber (Review / 72h Timer):** `#F59E0B` (Surface: `#78350F`/30, Text: `#FBBF24`)
- **Neutral Text Primary:** `#F8FAFC` (Pure High-Contrast White)
- **Neutral Text Secondary:** `#94A3B8` (Refined Slate Muted)
- **Neutral Text Tertiary:** `#64748B` (Subtle Captions & Metadata)
- **Border Default:** `rgba(255, 255, 255, 0.08)` (1px solid border around all 4 sides)
- **Border Active/Hover:** `rgba(56, 189, 248, 0.3)`

#### Background Rules:
- **No Heavy Background Gradients:** All structural card surfaces are flat obsidian tones.
- **Allowed Gradients:**
  1. Hero headline text: `bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent`.
  2. Ambient spotlight glows: CSS `radial-gradient(ellipse at 50% 0%, rgba(0, 112, 186, 0.15), transparent 70%)` behind the hero and timeline sections.
  3. Specular button highlight: 1px top highlight `shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]`.

---

### 2.2 Typography Hierarchy & Scale Snapping
All typography strictly enforces the Geist family with semantic scale steps:
- **Primary Display & Interface Font:** `Geist` or `Geist Sans`, system fallback `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`.
- **Monospace Font:** `Geist Mono` exclusively for financial amounts, PayPal transaction hashes, timestamps, and DOM selectors.
- **Strict Prohibition:** NEVER use italic styling anywhere. NEVER use font weights above 700 (no 800/900/Black).
- **Balanced Text Wrapping:** Headings use `text-wrap: balance`; paragraphs use `text-wrap: pretty`. Zero orphaned words.

| Style Token | Scale Step | Size / Line-Height | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Heading 1** | `text-5xl md:text-6xl` | 48px/60px (1.1) | Semibold | `-0.03em` | Hero main proposition |
| **Heading 2** | `text-3xl md:text-4xl` | 36px/40px (1.1) | Semibold | `-0.025em`| Major section headings |
| **Heading 3** | `text-2xl md:text-3xl` | 24px/32px (1.2) | Semibold | `-0.02em` | B11 Tagline & Feature titles |
| **Title 1** | `text-xl` | 20px / 28px | Medium | `-0.01em` | Card headers, milestone titles |
| **Title 2** | `text-lg` | 18px / 28px | Medium | `-0.01em` | Modal titles, sub-card headers |
| **Body 1** | `text-base` | 16px / 24px | Regular | `normal` | Primary explanatory body copy |
| **Body 2** | `text-sm` | 14px / 20px | Regular | `normal` | Secondary descriptions & table rows |
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

### 2.4 Corner Radius & The Nested Geometry Formula
Every child element nested inside a padded container must obey the nested radius formula:
$$\text{inner radius} = \text{outer radius} - \text{internal padding}$$
*(Applies when result $> 2px$)*

- **Outer Bento Card:** `rounded-2xl` (16px) with `p-4` (16px padding) $\rightarrow$ Inner status pill: `rounded-lg` (8px).
- **Navigation Dock:** `rounded-full` (9999px) $\rightarrow$ Inner navigation pill: `rounded-full`.
- **Tranche Container:** `rounded-xl` (12px) with `p-2` (8px padding) $\rightarrow$ Inner button: `rounded-md` (6px).

---

### 2.5 Borders & Surface Rules
1. **Four-Sided Borders Only:** Never apply a single-sided border (`border-b`, `border-l`) to a card container. Borders must encircle all four sides (`border border-white/10`).
2. **Dividers:** Internal dividers use full-width horizontal rules (`h-[1px] bg-white/[0.08]`).
3. **No Drop Shadows on Pitch Black:** Standard black shadows are invisible on dark themes. Instead, use ambient glow borders (`ring-1 ring-sky-500/20`) and luminous surface highlights.

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
   - Frosted glass finish (`bg-[#030712]/75 backdrop-blur-xl border border-white/10 shadow-2xl`).
   - Dynamic active pill indicator sliding smoothly beneath the active section.
2. **Hero Live Escrow Simulator:**
   - Interactive live preview demonstrating PayPal funds locking upfront, tranche breakdown, and instant disbursement.
   - Pulsing beacon dot (`animate-pulse ring-4 ring-emerald-500/20`).
3. **Bryntum Gantt Board with Kinetic Dependency Connectors:**
   - SVG dependency curves that illuminate when hovering related milestones.
   - Live interactive scrubber allowing the user to drag the timeline forward and watch milestone status update in real-time.
   - Integrated Bryntum AI Prompt Rescheduler modal with simulated automatic timeline adjustment.
4. **B11 Mandatory Tagline Reveal Section:**
   - High-impact two-line statement:
     *"No ghosting. No scope creep. Just verified deliverables and automatic PayPal payouts."*
   - Words transition sequentially from muted `opacity-30` to radiant `opacity-100 text-white` as the section scrolls into the viewport.
5. **Interactive FAQ Accordion:**
   - Smooth expand/collapse using the base deceleration curve.
   - Micro-rotate 180° indicator on chevron.
   - Subtle luminous border glow on active open question.

---

### 2.7 Interactive Component State Matrix (Part B9)
Every interactive element must support the full 7-state lifecycle:

1. **Default:** Crisp contrast ratio ($\ge 4.5:1$), legible typography, defined 4-sided border.
2. **Hover:** Subtle upward translate (`-translate-y-0.5`), surface brightening (`bg-white/[0.05]`), and border glow (`border-sky-500/30`).
3. **Active/Pressed:** Tactile mechanical depression (`active:scale-[0.98] active:translate-y-0`).
4. **Focus-Visible:** Accessible high-contrast focus ring (`focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none`).
5. **Loading:** Shimmering skeleton placeholders mirroring actual layout geometry (never raw circular spinners).
6. **Empty State:** Illustrated structured container with explicit onboarding action (never blank void).
7. **Error State:** Specific inline error callouts with immediate remediation steps (never generic browser alerts).

---

## 3. Section Architecture & Layout Flow

The landing page and cockpit follow a strict narrative conversion sequence:

1. **Floating Glass Dock Navigation:** Brand glyph, anchor links (How it Works, Inspection, Gantt Board, FAQ), Live Status Pill, Primary Action ("Create Contract").
2. **Hero Section:**
   - Category Badge: "Autonomous Freelance Escrow — Powered by PayPal & Gemini AI"
   - Headline: Max width 680px, gradient text, meaningful line breaks.
   - Subheadline: Max width 680px, outcome-driven value proposition.
   - Dual Action CTAs: Primary ("Create Escrow Contract") + Secondary ("Explore Live Demo").
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
