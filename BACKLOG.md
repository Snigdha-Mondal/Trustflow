# BACKLOG.md — Trustflow Implementation Backlog

Work is split into phases. Each item is a small verified slice with a clear outcome. Items requiring Product Owner approval are flagged with 🔒.

---

## Phase 1: Project Scaffolding & Foundation
**Exit Goal:** Next.js 15 app builds cleanly with TypeScript and Tailwind, SQLite schema is migrated, and PayPal / Gemini client tests pass in sandbox.

- [x] **1.1 Next.js 15 & Dependencies Setup**
  - Install Next.js, React 19, Lucide React, Cheerio, Prisma, Google GenAI SDK.
  - Configure `tsconfig.json` and project directories.
- [x] **1.2 Design System & Tailwind Configuration**
  - Configure `tailwind.config.ts` and `src/app/globals.css` with exact tokens from `DESIGN.md` (Geist font, spacing tokens 0-900, corner radius formula, dark backgrounds `#000000`, `#181818`, `#1F1F1F`, deceleration curve).
- [x] **1.3 Database Setup with Prisma (SQLite)**
  - Define `prisma/schema.prisma` with `Contract`, `Milestone`, `Criterion`, and `DeliverableInspection`.
  - Run initial migration and generate Prisma Client.
- [x] **1.4 PayPal REST Client Setup**
  - Implement `src/lib/paypal.ts` supporting OAuth2 token caching, Orders creation/capture, and Payouts dispatch against Sandbox (`https://api-m.sandbox.paypal.com`).
- [x] **1.5 Gemini AI Client Setup**
  - Implement `src/lib/gemini.ts` using `@google/genai` with structured JSON schema output and fallback validation.
- [x] 🔒 **1.6 Phase 1 Review & Verification**
  - Verify build, database, and client initialization.

---

## Phase 2: Agent 1 (Scope Clarifier) & Contract Creation
**Exit Goal:** User can input a project brief, generate 3 balanced milestone tranches with separated automated vs subjective criteria, and persist the contract.

- [ ] **2.1 Scope Clarifier API (`/api/milestones/generate`)**
  - Implement Agent 1 prompt enforcing de-scoper constraints (no hallucinated enterprise bloat; exact budget sums).
- [ ] **2.2 Scope Clarifier Wizard UI**
  - Create interactive wizard allowing user to enter brief, preview AI-generated milestones, edit criteria, and adjust amounts.
- [ ] **2.3 Contract Creation & Retrieval API (`/api/contracts`)**
  - Save contract with nested milestones and criteria to SQLite.
  - Implement contract detail fetch endpoint (`/api/contracts/[id]`).
- [ ] 🔒 **2.4 Phase 2 Review & Verification**
  - Validate milestone generation with sample briefs; ensure sums match budget.

---

## Phase 3: PayPal Escrow Funding & Bryntum Gantt Board
**Exit Goal:** Client can authorize and capture full escrow funds via PayPal Sandbox; project cockpit renders interactive Bryntum Gantt board with tranche dependency locks.

- [ ] **3.1 PayPal Checkout Integration (`/api/paypal/create-order` & `/api/paypal/capture-order`)**
  - Create order with intent `CAPTURE` and capture escrow funds into contract.
- [ ] **3.2 Bryntum Gantt Timeline Board Component**
  - Implement `GanttBoard.tsx` displaying timeline bars, task dependencies, milestone status badges, and payout indicators.
- [ ] **3.3 Tranche Dependency & Lock State Management**
  - Ensure Milestone 1 is `ACTIVE` and Milestones 2 & 3 are `LOCKED 🔒` until previous tranches are paid.
- [ ] 🔒 **3.4 Phase 3 Review & Verification**
  - Run end-to-end sandbox checkout and verify Gantt chart reacts live.

---

## Phase 4: Agent 2 (Deliverable Inspector) & Autonomous PayPal Payouts
**Exit Goal:** Freelancer submits URL/code; Inspector validates DOM/HTTP/semantics and triggers instant PayPal Payout upon passing, unlocking the next tranche.

- [ ] **4.1 Deliverable Crawler Engine (`src/lib/inspector.ts`)**
  - Fetch target URL, verify HTTP 200, inspect DOM tags (viewport, forms, buttons, links) using Cheerio.
- [ ] **4.2 Agent 2 Semantic Review & Verification Dossier (`/api/deliverable/inspect`)**
  - Evaluate criteria against crawl data with Gemini; generate structured Verification Dossier.
  - Enforce hard rule: AI cannot unilaterally reject work; flag for human review if subjective or confidence < 90%.
- [ ] **4.3 Autonomous Payout Dispatch (`/api/paypal/payout`)**
  - Trigger PayPal Payouts API (`/v1/payments/payouts`) with unique batch ID.
  - Update milestone to `PAID`, record payout batch ID, and unlock next tranche.
- [ ] **4.4 Deliverable Submission Modal & Dossier UI**
  - Build submission drawer/modal showing real-time inspection checklist, confidence score, and payout receipt.
- [ ] 🔒 **4.4 Phase 4 Review & Verification**
  - Verify deliverable inspection and sandbox payout execution.

---

## Phase 5: 72-Hour "Silence Means Yes" Timer, Landing Page & Wrap-Up
**Exit Goal:** 72h auto-release countdown functions, landing page matches `DESIGN.md` with scroll tagline reveal, all tests pass, and demo flow is complete.

- [ ] **5.1 72-Hour Countdown Guard & Auto-Release API**
  - Visual countdown badge on deliverables flagged for review.
  - Auto-release endpoint (`/api/milestones/auto-release`) triggering payout if 72 hours elapse without client objection.
- [ ] **5.2 Agent-Driven Rescheduling**
  - Endpoint to recalculate milestone timeline and shift downstream Gantt bars when revision feedback is submitted.
- [ ] **5.3 High-Converting Landing Page (`src/app/page.tsx`)**
  - Build landing page following `DESIGN.md`: hero gradient text, benefit bullets, how it works, social proof, FAQs, and the mandatory scroll-driven tagline reveal section.
- [ ] **5.4 Automated Test Suite & Benchmark**
  - Implement tests covering PayPal auth, milestone math, URL inspection, and payout dispatch.
- [ ] 🔒 **5.5 Phase 5 Final Acceptance & Video Script Verification**
  - End-to-end run of the 3-minute hackathon demo script.
