# Trustflow — Freelance Milestone Escrow with Autonomous AI Inspection

[![PayPal AI Hackathon 2026](https://img.shields.io/badge/PayPal_AI_Hackathon-2026-0070BA?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.devpost.com)
[![Bryntum Sponsor Track](https://img.shields.io/badge/Bryntum_Track-%231_%26_%236_Prompts-10B981?style=for-the-badge)](https://bryntum.com)
[![DeftBench Agent Loop](https://img.shields.io/badge/Architecture-DeftBench_Loop-8B5CF6?style=for-the-badge)](AGENTS.md)
[![Design Skills](https://img.shields.io/badge/Design_System-elayadesign%2Fai--design--skills-FF5722?style=for-the-badge)](DESIGN.md)

> **“Freelance milestone escrow where nobody gets burned—powered by PayPal, automated AI verification, and zero platform friction.”**

---

## 💡 The Core Problem

1. **Freelancers lose billions annually** to delayed client sign-offs, ghosting after handing over code or deployments, and endless scope creep.
2. **Clients are terrified of paying 100% upfront** for software or landing pages that might fail to ship, contain bugs, or diverge from agreed briefs.
3. **Legacy platforms (Upwork, Fiverr) charge punitive 10%–20% take rates** and rely on slow, bureaucratic manual dispute arbitration.

---

## ⚡ The Trustflow Solution

Trustflow eliminates both sides of payment anxiety through an automated, agentic escrow loop:

```
[ Client Brief ]
       │
       ▼
┌──────────────────────────────────────────────┐
│ Agent 1: Scope & Milestone Clarifier         │ ──> Deconstructs brief into 3 Tranches with Objective Checks
└──────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│ Dual Sign-Off & PayPal Upfront Checkout      │ ──> Authorizes & captures total budget via PayPal Orders API
└──────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│ Interactive Bryntum Gantt Timeline Board     │ ──> Milestone 1: ACTIVE ⚡ | Milestones 2 & 3: LOCKED 🔒
└──────────────────────────────────────────────┘
       │
       ▼ (Freelancer Submits Live URL / Preview)
┌──────────────────────────────────────────────┐
│ Agent 2: AI Deliverable Inspector            │ ──> Crawls DOM, validates HTTP 200, forms, responsive tags
└──────────────────────────────────────────────┘
       ├───> Criteria Passed (High Confidence) ─────────┐
       │                                                │
       └───> Ambiguous / Subjective Criteria            │
             └─> 72-Hour "Silence Means Yes" Timer      │
                 (Client Approves OR Timeout Expires)   │
                                                        ▼
                                       ┌──────────────────────────────────┐
                                       │ PayPal Payouts API Disbursal     │ (Cash sent to freelancer email)
                                       └──────────────────────────────────┘
                                                        │
                                                        ▼
                                       ┌──────────────────────────────────┐
                                       │ Bryntum Gantt Unlocks Phase 2 🔓 │ (Downstream Tranche Activates)
                                       └──────────────────────────────────┘
```

---

## 🏆 Hackathon & Sponsor Alignment

1. **Overall Grand Prize:** Solves a multi-billion dollar real-world dilemma with zero platform fee friction.
2. **Best Use of Agentic Commerce:** Autonomous code triggering the **PayPal Payouts API** based on multimodal verification.
3. **Best Use of Bryntum (Challenge Prompts #1 & #6):**
   - **Challenge Prompt #1:** Interactive Delivery Board with milestone dependencies and locked payment tranches.
   - **Challenge Prompt #6:** Agent-driven Gantt schedule recalculator when revisions or extensions occur.
4. **Best Use of PayPal + AI:** Deep integration of **PayPal Orders API** (escrow capture) and **PayPal Payouts API** (instant autonomous disbursement) paired with Gemini structured inspection.

---

## 🎨 Design System: `elayadesign/ai-design-skills`

Trustflow strictly incorporates the open-source [`elayadesign/ai-design-skills`](https://github.com/elayadesign/ai-design-skills) system documented in [`DESIGN.md`](DESIGN.md):
- **Strategy (Part A):** One offer $\rightarrow$ one audience $\rightarrow$ one primary action. Benefit-first copy, real metrics, and zero generic buzzwords.
- **Visuals (Part B):**
  - **Typography:** Geist / Manrope with strict Tailwind scale snapping. Monospace strictly for IDs, hashes, and amounts. No italic fonts.
  - **Surfaces:** Flat, solid dark-mode surfaces (`#000000`, `#181818`, `#1F1F1F`, `#272727`). Zero background gradients.
  - **Hero Text Gradient:** The only allowed gradient is on the hero headline text itself (`#FFFFFF` $\rightarrow$ `#9B9B9B`).
  - **Nested Radius Rule:** $\text{inner radius} = \text{outer radius} - \text{gap}$.
  - **Mandatory Section B11:** Scroll-driven word-by-word reveal section (*"No ghosting. No scope creep. Just verified deliverables and automatic PayPal payouts."*).

---

## 🤖 DeftBench AI Agent Loop Architecture

This repository is built following the **DeftBench** methodology:
- [`AGENTS.md`](AGENTS.md): The front door, 8 golden rules, and locked decisions.
- [`ENGINEERING_PLAYBOOK.md`](ENGINEERING_PLAYBOOK.md): The engineering manager, 9-step loop, and stop signs.
- [`PRD.md`](PRD.md): Product requirements, personas, and scope boundaries.
- [`ARCHITECTURE.md`](ARCHITECTURE.md): System architecture, Prisma SQLite schema, and API contracts.
- [`DESIGN.md`](DESIGN.md): Visual design tokens and copywriting guidelines.
- [`BACKLOG.md`](BACKLOG.md): Sliced tasks across 5 verified phases.
- [`PROGRESS.md`](PROGRESS.md): Living session diary and permanent decisions log.

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Node.js v20+ (v22.15.0 tested)
- npm or pnpm

### 2. Setup
```bash
# Clone the repository
git clone https://github.com/your-username/trustflow.git
cd trustflow

# Install dependencies
npm install

# Initialize SQLite database and demo seed contract
npm run db:push
npm run db:seed
```

### 3. Environment Variables (`.env.local`)
Create `.env.local` with your Sandbox credentials:
```env
DATABASE_URL="file:./dev.db"

# PayPal REST API (Sandbox)
PAYPAL_CLIENT_ID="your_sandbox_client_id"
PAYPAL_CLIENT_SECRET="your_sandbox_client_secret"
PAYPAL_API_BASE="https://api-m.sandbox.paypal.com"
PAYPAL_MODE="sandbox"

# Google Gemini API (Optional: intelligent mock fallback included)
GEMINI_API_KEY="your_gemini_api_key"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Automated Tests
```bash
npm test
```
Runs 41 automated test fixtures (including the comprehensive 30-fixture evaluation benchmark) verifying PayPal OAuth token caching, Orders capture, Payouts dispatch, de-scoper constraints, DOM crawler validation, subjective routing, and Gantt rescheduling.

---

## 🎬 3-Minute Demo Flow

1. **The Setup (0:00 - 0:30):** Navigate to [http://localhost:3000](http://localhost:3000). Experience the landing page adhering to `DESIGN.md`, with the scroll-driven tagline reveal section.
2. **Agent 1 Scope Clarifier (0:30 - 1:00):** Click "Create Contract". Select the *"SaaS Marketing Website"* template. Click "Deconstruct Brief with Agent 1". Observe how Gemini breaks the brief into 3 balanced milestones totaling exactly $900.00, with automated criteria clearly separated from subjective checks.
3. **Upfront Escrow Funding (1:00 - 1:40):** Proceed to the Project Cockpit. Click **"Fund $900.00 via PayPal"**. Watch the PayPal Orders API capture funds into escrow. Observe the **Bryntum Gantt Board** initialize: Milestone 1 is `ACTIVE ⚡` and Milestones 2 & 3 are `LOCKED 🔒`.
4. **Deliverable Submission & AI Inspection (1:40 - 2:20):** Freelancer enters preview URL (`https://preview-sample.vercel.app`) and clicks **"Run Inspection & Trigger Payout"**. Agent 2 crawls the URL, verifies HTTP 200, checks the viewport, and detects the contact form inputs.
5. **The Payout Moment (2:20 - 2:45):** All automated criteria pass! **PayPal Payouts API executes immediately.** Confetti fires, the transaction batch ID is recorded, and Milestone 2 automatically unlocks on the Gantt chart!
6. **72-Hour "Silence Means Yes" (2:45 - 3:00):** For subjective deliverables, show the 72-hour countdown badge and simulate the timeout auto-release guarantee.

