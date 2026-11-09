# DESIGN.md — Trustflow Design System & Conversion Architecture
*(Integrated with `elayadesign/ai-design-skills`)*

This document governs all visual styling, typography, component hierarchies, layout structures, and conversion copywriting for Trustflow. It is adapted directly from the `landing-page-design` and `figma-designer` specifications in `skills/landing-page-design/SKILL.md`.

---

## 1. Core Conversion Strategy (Part A)

### 1.1 The Core Offer Equation
**One Offer → One Audience → One Primary Action.**
- **The Core Offer:** Automated freelance milestone escrow powered by upfront PayPal funding, AI deliverable inspection, and an ironclad 72-hour auto-release guarantee.
- **The Audience (ICP):** Professional software engineers, designers, and agencies who suffer from delayed client reviews, scope creep, and unpaid invoices; and startup founders who need verified deliverables before funds are released.
- **The Primary Action:** Create an escrow contract / launch instant AI scope breakdown.

### 1.2 Copywriting Formulas
- **Headline Formula:** *"{Outcome} without {pain}"*
  - *"Freelance milestone escrow without payment anxiety or ghosting."*
  - Subheadline: *"Lock client budget into PayPal escrow upfront. Decompose the brief into objective tranches with AI. When the code passes automated inspection, get paid instantly."*
- **Primary CTA:** *"Create Escrow Contract"* or *"Analyze Project Brief"* (Never "Learn More", "Submit", or "Click Here").
- **Benefit-First Bullets:**
  - **Zero Ghosting Guarantee:** 72-hour Silence-Means-Yes rule auto-releases escrow funds if clients go unresponsive.
  - **Deterministic Inspection:** AI validates HTTP endpoints, DOM elements, and code commits against locked criteria before payment triggers.
  - **Instant Payouts:** Funds disburse directly to freelancer PayPal accounts via the PayPal Payouts API.
  - **Fair Rescheduling:** Interactive Bryntum Gantt timelines automatically adjust downstream milestones when revisions occur.
- **Banned Filler Words:**
  Do NOT use: *"revolutionize"*, *"supercharge"*, *"cutting edge"*, *"effortless"*, *"transform your workflow"*, *"take it to the next level"*, *"harness the power"*, or *"world class"*. Speak in concrete, operational facts.
- **Content Realism:**
  All amounts, transaction IDs, client names, and milestone deadlines must look authentic (e.g. `$900.00`, `$450.00`, `PAYOUTS_BATCH_78912`, `ct_9843a812`).

---

## 2. Visual System & Design Tokens (Part B)

### 2.1 Typography
- **Primary Font Family:** `Geist`, `Geist Sans`, or `Manrope` (with `Geist Mono` exclusively for hashes, IDs, currencies, and code blocks).
- **Prohibited Fonts:** NEVER use Inter, Roboto, Arial, Open Sans, or Helvetica.
- **Prohibited Styling:** NEVER use italic fonts anywhere in the interface. Cap font weight at bold/semibold (no 900/Black weights).
- **Copy Formatting:**
  - No hyphens inside text or sentences.
  - No orphaned words: apply `text-wrap: balance` for headings and `text-wrap: pretty` for body paragraphs.
  - Sentence case for all headings and button labels.

### 2.2 Strict Tailwind Type Scale
All text sizes snap strictly to standard Tailwind scale steps:

| Named Style | Scale Step | Size / Line-Height | Weight | Tailwind Utility Classes |
| :--- | :--- | :--- | :--- | :--- |
| **Heading 1** | `text-6xl` | 60px / 60px | Semibold | `text-5xl md:text-6xl font-semibold leading-none tracking-tight` |
| **Heading 2** | `text-5xl` | 48px / 48px | Semibold | `text-4xl md:text-5xl font-semibold leading-tight tracking-tight` |
| **Heading 3** | `text-4xl` | 36px / 40px | Semibold | `text-3xl md:text-4xl font-semibold leading-snug` |
| **Heading 4** | `text-3xl` | 30px / 36px | Semibold | `text-2xl md:text-3xl font-semibold leading-snug` |
| **Heading 5** | `text-2xl` | 24px / 32px | Semibold | `text-xl md:text-2xl font-semibold leading-normal` |
| **Heading 6** | `text-xl` | 20px / 28px | Semibold | `text-lg md:text-xl font-semibold leading-normal` |
| **Title 1** | `text-xl` | 20px / 28px | Medium | `text-xl font-medium leading-normal` |
| **Title 2** | `text-lg` | 18px / 28px | Medium | `text-lg font-medium leading-normal` |
| **Title 3** | `text-base`| 16px / 24px | Medium | `text-base font-medium leading-relaxed` |
| **Title 4** | `text-sm` | 14px / 20px | Medium | `text-sm font-medium leading-tight` |
| **Body 1** | `text-base`| 16px / 24px | Semibold | `text-base font-semibold leading-relaxed` |
| **Body 2** | `text-base`| 16px / 24px | Medium | `text-base font-medium leading-relaxed` |
| **Body 3** | `text-base`| 16px / 24px | Regular | `text-base font-normal leading-relaxed text-zinc-300` |
| **Body 4** | `text-sm` | 14px / 20px | Semibold | `text-sm font-semibold leading-normal` |
| **Body 5** | `text-sm` | 14px / 20px | Medium | `text-sm font-medium leading-normal` |
| **Body 6** | `text-sm` | 14px / 20px | Regular | `text-sm font-normal leading-normal text-zinc-400` |
| **Button-lg** | `text-lg` | 18px / 28px | Semibold | `text-lg font-semibold px-5 py-3` |
| **Button-md** | `text-base`| 16px / 24px | Semibold | `text-base font-semibold px-4 py-2` |
| **Button-sm** | `text-sm` | 14px / 20px | Semibold | `text-sm font-semibold px-3 py-1.5` |
| **Caption 1** | `text-xs` | 12px / 16px | Medium | `text-xs font-medium leading-tight tracking-wider uppercase` |

---

### 2.3 Spacing Scale
Use only these precise token values (no arbitrary margins or padding):

| Token | Pixels | Tailwind Equiv |
| :--- | :--- | :--- |
| `Spacing-0` | 0px | `p-0 / m-0` |
| `Spacing-25` | 2px | `p-0.5 / m-0.5` |
| `Spacing-50` | 4px | `p-1 / m-1` |
| `Spacing-75` | 8px | `p-2 / m-2` |
| `Spacing-100` | 12px | `p-3 / m-3` |
| `Spacing-200` | 16px | `p-4 / m-4` |
| `Spacing-300` | 24px | `p-6 / m-6` |
| `Spacing-400` | 32px | `p-8 / m-8` |
| `Spacing-500` | 40px | `p-10 / m-10` |
| `Spacing-600` | 48px | `p-12 / m-12` |
| `Spacing-700` | 64px | `p-16 / m-16` |
| `Spacing-800` | 80px | `p-20 / m-20` |
| `Spacing-900` | 96px | `p-24 / m-24` |

---

### 2.4 Corner Radius & The Nested Formula
When an element sits inside a container with padding `gap < 32px`:
$$\text{inner radius} = \text{outer radius} - \text{gap}$$
*(Applied when result $> 2px$)*
- Outer Card: `rounded-2xl` (16px) with `p-4` (16px gap) $\rightarrow$ Inner badge: `rounded-lg` (8px).
- Outer Box: `rounded-xl` (12px) with `p-2` (8px gap) $\rightarrow$ Inner button: `rounded-md` (6px).

---

### 2.5 Color Tokens & Flat Background Rules
- **No Background Gradients:** All card and page surfaces are strictly flat solid tones.
- **Approved Dark Theme Backgrounds:**
  - Base canvas: `#000000` or `#0B0F17` (Deep Obsidian)
  - Card / Surface 1: `#181818` or `#131823`
  - Card / Surface 2: `#1F1F1F` or `#1A2234`
  - Border Primary: `#272727` or `#2E3A52`
- **Text Gradient Hero Rule:**
  The only allowed gradient is on the hero headline text itself:
  - Dark Mode: `bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent`
- **Brand Colors:**
  - PayPal Electric Blue: `#0070BA` (Hover: `#005EA6`)
  - Verification Emerald (Pass): `#10B981` (Surface: `#064E3B`)
  - Inspection Amber (Review/Timer): `#F59E0B` (Surface: `#78350F`)
  - Locked Slate: `#64748B` (Border: `#334155`)

---

### 2.6 Borders & Cards
- **Rule:** Never apply a single-side border to a card. Borders must surround all four sides (`border border-zinc-800`) or not exist.
- Separator lines inside containers use full-width 1px dividers (`h-[1px] bg-zinc-800`).

---

### 2.7 Icons
- Standard Icon Set: `lucide-react` / `solar` / `phosphor` outline icons.
- Stroke weight: Consistent 1.5px or 1.75px across all views.
- NEVER use generic Material Icons or filled emoticons.

---

### 2.8 Motion & Deceleration Curves
- Base Deceleration Curve: `cubic-bezier(0.22, 1, 0.36, 1)`
- Layout and modal shifts: `duration-500`
- Hover color / opacity transitions: `duration-300` (never under 200ms)
- Animate only `transform` and `opacity`. Never animate `top`, `left`, `width`, or `height`.

---

### 2.9 Mandatory Tagline Reveal Section
Following `elayadesign/ai-design-skills` (Section B11):
- A prominent mid-page statement separate from the hero.
- Minimum 2 lines of high-impact copy:
  *"No ghosting. No scope creep. Just verified deliverables and automatic PayPal payouts."*
- Words activate in sequence from muted tone (`opacity-30`) to crisp full white (`opacity-100`) as the section scrolls into viewport using the base deceleration curve.

---

### 2.10 Comprehensive Component States
Every interactive element must provide:
1. **Default:** Clean, legible state with 3:1+ contrast.
2. **Hover:** Subtle brightness or border highlight (`hover:border-zinc-700 hover:bg-zinc-800/50`).
3. **Active/Pressed:** Physical feedback with `active:scale-[0.98]`.
4. **Focus:** High-visibility focus ring (`focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none`).
5. **Loading:** Skeleton placeholder shapes reflecting actual component geometry (never arbitrary raw spinners).
6. **Empty:** Structured illustration and clear call-to-action (never blank whitespace).
7. **Error:** Specific inline error callouts with remediation advice.

---

## 3. Responsive Constraints
- Target mobile viewport: 390px width minimum. Zero horizontal scroll overflow.
- Mobile navigation: Full-screen overlay menu with staggered link entrances.
- Touch targets: Minimum 44x44px clickable areas on touch devices.

