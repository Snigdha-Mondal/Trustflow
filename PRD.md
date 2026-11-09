# PRD.md — Product Requirements Document: Trustflow

## 1. Product Summary & Vision
Trustflow is an autonomous, freelance-first milestone escrow and delivery assurance platform. By coupling PayPal's Orders and Payouts APIs with Gemini multimodal AI inspection and interactive Bryntum Gantt timeline boards, Trustflow eliminates the two biggest failure points in freelance contracts:
1. **Client Ghosting & Delayed Reviews:** Addressed by immutable milestone criteria and the **72-Hour "Silence Means Yes"** auto-release timer.
2. **Client Fear of Incomplete/Broken Work:** Addressed by upfront PayPal escrow capture where funds are only disbursed once deliverables pass objective verification.

---

## 2. Target Personas

### 2.1 Alex (Full-Stack Freelance Engineer)
- **Profile:** Delivers Next.js apps, REST/GraphQL APIs, databases, and deployments.
- **Pain Point:** Spends days chasing clients for sign-offs; gets ghosted after handing over repositories or staging URLs.
- **Needs:** Automated verification of technical criteria (e.g., HTTP 200, contact forms present, responsive layouts) and guaranteed payment release.

### 2.2 Sarah (Non-Technical Startup Founder / Client)
- **Profile:** Hires freelance developers to build landing pages, MVPs, and integrations.
- **Pain Point:** Worried about paying upfront for buggy or incomplete deliverables; doesn't know how to inspect code or run tests.
- **Needs:** Peace of mind that her funds are safely held in PayPal escrow until milestones meet the agreed scope.

### 2.3 Marcus (AI Solutions Contractor)
- **Profile:** Deploys custom AI agents, webhook handlers, and backend pipelines.
- **Pain Point:** Clients don't know how to test autonomous endpoints locally, causing weeks of delay.
- **Needs:** Fast, automated validation of endpoint responses and schemas with automatic milestone payout.

---

## 3. Scope & Feature Boundaries

### 3.1 In-Scope (MVP)

#### Feature 1: Scope & Milestone Clarifier (Agent 1)
- Accepts unstructured project briefs or client prompts.
- Employs Gemini structured output to produce 3 balanced, logical milestone tranches.
- **Strict Hard Rules:**
  - Separates criteria strictly into `automated: true` (measurable via HTTP, DOM, or repo inspection) and `automated: false` (subjective aesthetic or tone).
  - Enforces scope creep suppression: never injects unrequested enterprise burdens (e.g., WCAG AAA, 100% test coverage) unless explicitly asked.
  - Sum of milestone amounts must strictly equal total budget.

#### Feature 2: Upfront Escrow Funding (PayPal Orders API)
- Client authorizes and captures total contract budget upfront via PayPal Checkout (`intent: CAPTURE`).
- Funds are safely held in escrow state (`FUNDED`).
- Contract transitions from `DRAFT` $\rightarrow$ `FUNDED` $\rightarrow$ `ACTIVE`.

#### Feature 3: Interactive Milestone Tranche Board (Bryntum Gantt)
- Interactive Gantt chart visualizing the project schedule, milestone dependencies, durations, and payment tranches.
- Real-time status indicators: `LOCKED 🔒`, `ACTIVE ⚡`, `IN_REVIEW ⏳`, `PAID ✅`.
- Downstream milestone tranches remain locked until preceding tranches are verified and paid.
- Automatic schedule recalculation if revisions are requested.

#### Feature 4: AI Deliverable Inspector (Agent 2)
- Freelancer submits deliverable URL (staging site, GitHub repository, or live endpoint).
- Deterministic checks: crawl preview URL with Node `fetch` + `cheerio` to verify HTTP status, meta tags, responsive viewport, form inputs, routes.
- Gemini AI semantic check: evaluates submitted content against contract criteria.
- Produces a comprehensive **Verification Dossier** detailing each criterion with pass/fail/evidence.
- **Hard Rule:** AI can NEVER unilaterally fail a milestone; if criteria are subjective or confidence < 90%, it flags for human review (`FLAGGED_FOR_HUMAN_REVIEW`).

#### Feature 5: Autonomous Payout Engine (PayPal Payouts API)
- When all automated criteria pass (or human signs off), deterministic code triggers the PayPal Payouts API (`/v1/payments/payouts`).
- Disburses milestone amount directly to the freelancer's PayPal email.
- Records `payoutBatchId`, marks milestone as `PAID`, and automatically unlocks the next tranche on the Gantt chart.

#### Feature 6: 72-Hour "Silence Means Yes" Auto-Release Guard
- For subjective deliverables flagged for client review, a 72-hour countdown timer begins.
- If client approves $\rightarrow$ instant payout.
- If client requests revision $\rightarrow$ feedback recorded, Gantt timeline automatically reschedules downstream tasks.
- If client takes no action within 72 hours $\rightarrow$ system automatically executes payout to protect the freelancer against ghosting.

---

### 3.2 Out-of-Scope (Post-MVP)
- Real money transactions (Strict PayPal Sandbox mode only).
- Fiat-to-crypto exchanges or Web3 wallets.
- Native mobile apps (iOS / Android) — responsive web only.
- Complex multi-currency hedging.
- Manual legal court arbitration integration.

---

## 4. Non-Functional Requirements
- **Security:** Zero credentials committed to git; all secrets in `.env.local`; sandbox exclusivity.
- **Performance:** Deliverable inspection executes within 5 seconds for live URLs.
- **Reliability:** Idempotent PayPal payout calls with unique `sender_batch_id` to prevent double-payouts.
- **Design System:** Strict adherence to `DESIGN.md` and `skills/landing-page-design/SKILL.md`.

---

## 5. Success Metrics
- 100% of generated milestone amounts sum exactly to `totalBudget`.
- 100% of verified deliverables trigger correct PayPal Payout Sandbox payload.
- Zero silent failures during deliverable URL inspection.
- 0% unauthorized funds movements.

