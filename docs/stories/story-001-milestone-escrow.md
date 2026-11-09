# Story 001: Autonomous Milestone Escrow & Deliverable Verification

## User Story
- **As a** freelance full-stack engineer (Alex),
- **I want** client project budgets locked in PayPal escrow upfront and automatically disbursed when my deliverables pass objective verification,
- **So that** I never have to worry about unpaid invoices, endless scope creep, or client ghosting after handing over code.

- **As a** startup founder / client (Sarah),
- **I want** funds safely held in escrow until deliverables are proven to work,
- **So that** I don't risk paying upfront for non-functional or incomplete deliverables.

---

## Acceptance Criteria

### 1. Scope Decomposition (Agent 1)
- [x] Given an unstructured project brief and a total budget, Agent 1 decomposes the brief into exactly 3 milestone tranches.
- [x] The mathematical sum of the milestone amounts must equal the total budget exactly.
- [x] Criteria must be partitioned into `isAutomated: true` (verifiable via HTTP, DOM tags, routes, or repo files) and `isAutomated: false` (subjective design or tone).
- [x] Agent 1 must suppress hallucinated enterprise burdens (no unrequested WCAG AAA, 100% test coverage, or internationalization).

### 2. Upfront Escrow Funding
- [x] The client authorizes and captures the total budget via the PayPal Orders API (`intent: CAPTURE`).
- [x] Funds enter platform escrow custody (`status = "FUNDED"`).
- [x] Milestone 1 is set to `ACTIVE ⚡`, and Milestones 2 and 3 are set to `LOCKED 🔒`.

### 3. Interactive Bryntum Gantt Timeline
- [x] The schedule renders on an interactive Gantt chart visualizing task durations, sequential dependency connectors, and payment tranche amounts.
- [x] Locked downstream milestones remain non-submittable until preceding milestones are verified and paid.
- [x] When revisions or delays occur, the Bryntum Agent-Driven Rescheduler automatically shifts downstream deadlines (Challenge Prompt #6).

### 4. Deliverable Inspection (Agent 2)
- [x] The freelancer submits a staging preview URL or deployment link.
- [x] Deterministic crawler validates HTTP 200 status, responsive viewport meta tags, and interactive form elements.
- [x] AI evaluates submitted content against contractual criteria and produces a **Verification Dossier**.
- [x] AI safety guardrail: AI cannot unilaterally reject work. If criteria are subjective or confidence < 90%, work is flagged for human review (`FLAGGED_FOR_HUMAN_REVIEW`).

### 5. Autonomous PayPal Payout
- [x] When all automated criteria pass, deterministic code triggers the PayPal Payouts API (`/v1/payments/payouts`).
- [x] Payout dispatches cash directly to the freelancer's PayPal email using an idempotent `sender_batch_id`.
- [x] Milestone status transitions to `PAID ✅` with transaction batch ID recorded.
- [x] Downstream milestone automatically transitions from `LOCKED 🔒` to `ACTIVE ⚡`.

### 6. The 72-Hour "Silence Means Yes" Safeguard
- [x] For subjective deliverables flagged for client review, a 72-hour countdown begins.
- [x] If the client takes no action within 72 hours, the funds auto-release to the freelancer.
- [x] If the client requests revisions, the agent reschedules downstream milestones.

