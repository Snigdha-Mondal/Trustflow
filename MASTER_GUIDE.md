# MASTER_GUIDE.md — Trustflow Master Specification & Production Blueprint
*(A 22-Section Specification for the PayPal AI Hackathon)*

---

## 1. Project Overview
* **The Problem:** 
  * Freelancers lose billions annually to unpaid invoices, delayed client reviews, and ghosting after work is submitted.
  * Clients fear paying 100% upfront for software or creative work that might fail to ship or diverge from requirements.
  * Traditional escrow platforms (Upwork, Escrow.com) charge punitive 10–20% fees and rely on slow, bureaucratic manual dispute arbitration.
  * Scope creep destroys contracts: clients move the goalposts mid-project without compensating freelancers.
* **The Solution:** 
  * Trustflow creates an automated, "freelancer-first" milestone escrow workflow powered by PayPal and AI agents.
  * The client funds the full project upfront into PayPal escrow.
  * AI decomposes the brief into transparent milestone tranches with objective criteria on an interactive **Bryntum Gantt** timeline.
  * When work is submitted, an **AI Deliverable Inspector** validates the code/URL against the agreed criteria.
  * Passing work triggers instantaneous payouts via the **PayPal Payouts API**; subjective work enters a human-in-the-loop review protected by a **72-Hour "Silence Means Yes"** auto-release guarantee.
* **One-Line Pitch:** *“Freelance milestone escrow where nobody gets burned—powered by PayPal, automated AI verification, and zero platform friction.”*

---

## 2. Why This Idea Is Different

| Dimension | Traditional Marketplaces (Upwork/Fiverr) | Legacy Escrow (Escrow.com) | Web3 Smart Contracts | Trustflow (PayPal + AI) |
| :--- | :--- | :--- | :--- | :--- |
| **Platform Fees** | 10%–20% cut on all earnings | 3.25% + high wire fees | Gas fees + crypto volatility | Minimal standard PayPal processing |
| **Milestone Review** | Manual client button click | Manual inspection & sign-off | Complex oracle / DAO voting | **Autonomous AI Inspector + 72h timer** |
| **Scope Creep Defense** | Weak (clients change terms easily) | Neutral (relies on initial contract) | Rigid code (cannot adapt) | **Immutable objective criteria locked upfront** |
| **Ghosting Protection** | 14-day manual wait + dispute tickets | Multi-week escrow dispute | Stuck funds if oracle fails | **"Silence Means Yes" (72-hour auto-release)** |
| **Payment Currency** | Fiat (delayed bank payouts) | Fiat (wire/check delays) | Cryptocurrencies (tax nightmare) | **Instant Real Fiat via PayPal Sandbox/Live** |
| **Schedule Adaptation** | Freelancer penalized for client delays | Static calendar dates | None | **Agent-Driven Rescheduling (Bryntum Gantt)** |

---

## 3. Target Users

### Persona 1: Alex (Full-Stack Freelance Engineer)
* **Everyday Workflows:** Delivers React/Next.js repositories, REST API endpoints, Supabase schemas, and Vercel deployments.
* **Pain Points:** Spends 5+ days waiting for non-technical clients to test code; fears being ghosted on the final $1,500 milestone after transferring GitHub repo ownership.

### Persona 2: Sarah (Non-Technical Startup Founder / Client)
* **Everyday Workflows:** Hires freelance developers to build landing pages, MVPs, and integrations; reviews deliverables via preview links.
* **Pain Points:** Terrified of paying upfront for broken code; doesn't know how to run automated test suites to verify if the freelancer completed all requested pages.

### Persona 3: Marcus (AI Solutions Contractor)
* **Everyday Workflows:** Delivers custom AI automation agents, LangChain pipelines, and webhook handlers.
* **Pain Points:** Clients struggle to test autonomous backend pipelines locally, leading to endless revision delays and stalled escrow releases.

---

## 4. MVP Scope & Functional Boundaries

* **Feature A: Scope & Milestone Clarifier (Agent 1):** Takes raw prompt brief $\rightarrow$ outputs structured 3-milestone JSON with separated objective vs subjective criteria.
* **Feature B: Upfront Escrow Funding:** Authorizes & captures total budget via PayPal Orders API (`intent: CAPTURE`).
* **Feature C: Interactive Tranche Board (Bryntum Gantt):** Visualizes timeline, dependencies, escrow status badges, and 72-hour countdown timers.
* **Feature D: AI Deliverable Inspector (Agent 2):** Crawls submitted URLs or parses GitHub PR commits; validates against agreed criteria; produces a Verification Dossier.
* **Feature E: Autonomous Payout Engine:** Calls PayPal Payouts API (`/v1/payments/payouts`) to disburse funds to freelancer's email upon milestone verification.

### Contract Data Schema (JSON)
```json
{
  "contractId": "ct_9843a812",
  "title": "SaaS Marketing Site & Lead Funnel",
  "totalBudget": 900.00,
  "currency": "USD",
  "clientEmail": "client@example.com",
  "freelancerEmail": "freelancer@example.com",
  "status": "FUNDED",
  "milestones": [
    {
      "id": "ms_01",
      "order": 1,
      "title": "Figma Wireframes & Design System",
      "amount": 300.00,
      "durationDays": 3,
      "status": "PAID",
      "criteria": [
        { "id": "c1", "text": "Mobile & Desktop responsive layouts provided", "isAutomated": false },
        { "id": "c2", "text": "Figma design tokens match specified color palette", "isAutomated": false }
      ],
      "payoutBatchId": "PAYOUTS_BATCH_78912"
    },
    {
      "id": "ms_02",
      "order": 2,
      "title": "Frontend Implementation (Next.js)",
      "amount": 300.00,
      "durationDays": 4,
      "status": "IN_REVIEW",
      "criteria": [
        { "id": "c3", "text": "Live URL returns HTTP 200 on /, /about, and /pricing", "isAutomated": true },
        { "id": "c4", "text": "Page contains contact form with email validation input", "isAutomated": true },
        { "id": "c5", "text": "Client visual aesthetic approval", "isAutomated": false }
      ],
      "reviewDeadline": "2026-11-12T20:00:00Z"
    }
  ]
}
```

---

## 5. The Role of AI vs. Deterministic Code

> **The Golden Architectural Rule:**  
> *Model reasons, clarifies, and interprets deliverables; deterministic code validates, schedules, and executes money movements.*

| Task | Handled By | Implementation Mechanism |
| :--- | :--- | :--- |
| Decomposing unstructured brief into milestones | **AI (Agent 1)** | Gemini Structured Output JSON Schema |
| De-scoping unrequested requirements | **AI (Agent 1)** | System Prompt hard constraints |
| Locking escrow funds via PayPal Checkout | **Deterministic Code** | PayPal Orders API (`/v2/checkout/orders`) |
| Measuring project timeline & task dependencies | **Deterministic Code** | Bryntum Gantt Engine (`@bryntum/gantt-react`) |
| Checking HTTP 200 & HTML DOM tags of preview URL | **Deterministic Code** | Node.js `fetch` + DOM Parser (`cheerio`) |
| Inspecting subjective design adherence | **AI (Agent 2)** | Gemini Multimodal Vision analysis |
| Disbursing milestone cash to freelancer | **Deterministic Code** | PayPal Payouts API (`/v1/payments/payouts`) |
| 72-Hour countdown & timeout auto-release | **Deterministic Code** | Serverless Cron / Scheduled Database check |

---

## 6. High-Level Architecture Flowchart

```
[ Client Brief ]
       │
       ▼
┌─────────────────────────────────┐
│ Agent 1: Scope Clarifier        │ ──> Deconstructs into 3 Tranches with Objective Checks
└─────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Dual Sign-Off & PayPal Checkout │ ──> Calls PayPal Orders API ($900 Captured to Escrow)
└─────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Bryntum Gantt Timeline Board    │ ──> Milestone 1: ACTIVE | Milestones 2 & 3: LOCKED 🔒
└─────────────────────────────────┘
       │
       ▼ (Freelancer Submits Code / URL)
┌─────────────────────────────────┐
│ Agent 2: Deliverable Inspector  │ ──> Runs DOM / GitHub Checks & Generates Dossier
└─────────────────────────────────┘
       ├───> Criteria Passed (High Confidence) ─────────┐
       │                                                │
       └───> Ambiguous / Subjective Criteria            │
             └─> 72h Silence-Means-Yes Timer            │
                 (Client Approves OR Timeout Expires)   │
                                                        ▼
                                       ┌──────────────────────────────────┐
                                       │ PayPal Payouts API Disbursal     │ ($300 to Freelancer)
                                       └──────────────────────────────────┘
                                                        │
                                                        ▼
                                       ┌──────────────────────────────────┐
                                       │ Bryntum Gantt Unlocks Phase 2 🔓 │ (State moves to Next Tranche)
                                       └──────────────────────────────────┘
```

---

## 7. Recommended Project Structure

```
trustflow/
├── AGENTS.md                   # Front door & locked decisions (DeftBench)
├── PRD.md                      # Product Requirements Document
├── ARCHITECTURE.md             # System architecture & schemas
├── DESIGN.md                   # UI tokens & conversion copy (ai-design-skills)
├── ENGINEERING_PLAYBOOK.md     # 9-step loop, definition of done, stop signs
├── BACKLOG.md                  # Sliced tasks with exit criteria
├── PROGRESS.md                 # Living session diary & decisions log
├── MASTER_GUIDE.md             # This 22-section master specification
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── prisma/
│   └── schema.prisma           # SQLite persistence schema
├── skills/
│   └── landing-page-design/
│       └── SKILL.md            # elayadesign/ai-design-skills agent package
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # High-converting landing page
│   │   ├── project/[id]/
│   │   │   └── page.tsx        # Project cockpit with Bryntum Gantt
│   │   └── api/
│   │       ├── milestones/generate/route.ts
│   │       ├── contracts/route.ts
│   │       ├── paypal/create-order/route.ts
│   │       ├── paypal/payout/route.ts
│   │       └── deliverable/inspect/route.ts
│   ├── components/
│   │   ├── GanttBoard.tsx      # Bryntum Gantt wrapper
│   │   ├── MilestoneCard.tsx
│   │   ├── VerificationModal.tsx
│   │   └── CountdownBadge.tsx
│   └── lib/
│       ├── paypal.ts           # PayPal REST SDK client
│       ├── gemini.ts           # AI model client
│       └── db.ts               # Prisma client
```

---

## 8. Agent Skill Package
*(Stored at `skills/landing-page-design/SKILL.md` following Agent Skills Open Standard; see dedicated file).*

---

## 9. System Prompt & Model Design

### Agent 1: The Milestone & Scope Clarifier
```text
You are an objective freelance contract mediator and scope architect.
Your job is to transform an unstructured project brief into 3 distinct, fair milestone tranches.

HARD RULES:
1. DO NOT invent extra scope or technical burdens (e.g., do NOT mandate 100% test coverage, WCAG AAA, or internationalization unless explicitly demanded by the client).
2. Separate criteria strictly into:
   - automated: true (objective, measurable via HTTP, DOM, or repo structure)
   - automated: false (subjective aesthetic or tone, requiring human client check).
3. Sum of milestone amounts must equal the total budget exactly.
4. Output MUST conform strictly to the JSON schema.
```

### Agent 2: The Deliverable Inspector
```text
You are an objective deliverable auditor. You inspect submitted links, code, or assets against agreed milestone criteria.

HARD RULES:
1. You CANNOT unilaterally reject work. You can only give a status of "PASSED" or "FLAGGED_FOR_HUMAN_REVIEW".
2. If objective criteria pass with >90% confidence, status is "PASSED".
3. If criteria are subjective or ambiguous, status MUST be "FLAGGED_FOR_HUMAN_REVIEW" with specific citations.
4. Never assume. Provide factual evidence for every evaluated criterion.
```

---

## 10. Scoring & Diagnostic Classification

| Verification Status | Confidence Threshold | System Action | Financial Consequence |
| :--- | :--- | :--- | :--- |
| **`PASSED`** | $\ge 90\%$ on all automated criteria | Instant auto-release | PayPal Payouts API fires immediately; next tranche unlocks. |
| **`FLAGGED_FOR_REVIEW`** | Contains subjective criteria or $<90\%$ confidence | Human escalation + 72h countdown | Client review required; auto-releases if client is silent for 72h. |
| **`REVISION_REQUESTED`** | Client feedback logged | Agent-driven rescheduling | Bryntum Gantt recalculates and shifts downstream deadlines. |

---

## 11. Privacy & Security Rules
* **Zero Secrets Committed:** PayPal Client ID/Secret and Gemini API Keys exist strictly in `.env.local`.
* **Sandbox Exclusivity:** All endpoints point to `https://api-m.sandbox.paypal.com`.
* **Ephemeral Inspection:** Submissions (URLs, repos) are inspected in memory; no user code is permanently mirrored.
* **Tokenized Authorizations:** Payment methods are handled entirely within the official PayPal SDK iframe/popup.

---

## 12. Threat Model
* **What It Protects Against:**
  * *Client Ghosting:* Protected by the 72-Hour "Silence Means Yes" countdown.
  * *Freelancer Abandonment:* Protected by locked escrow (client funds are not released until deliverable verified).
  * *Scope Creep:* Protected by immutable sign-off criteria.
  * *AI Overreach:* Protected by the rule that AI cannot unilaterally fail a milestone.
* **Honest Limitations:**
  * AI cannot guarantee that an application has zero zero-day security vulnerabilities.
  * Subjective design appeal still fundamentally requires human eyes (addressed via human-in-the-loop).

---

## 13. Testing Plan
* **Unit Tests:**
  1. `test_paypal_auth`: Generates valid OAuth2 bearer token from PayPal Sandbox.
  2. `test_milestone_sum`: Verifies generated milestone amounts sum exactly to `totalBudget`.
  3. `test_descoper_rules`: Verifies Agent 1 does not add unrequested accessibility or SEO bloat.
  4. `test_url_checker`: Verifies DOM crawler detects presence of required elements.
  5. `test_payout_dispatch`: Validates PayPal Payouts API payload structure.
* **Safety Tests:** Prompt injection attempts in client brief are sanitized and ignored.

---

## 14. Evaluation Benchmark (30 Synthetic Fixtures)

| Category | # Fixtures | Test Objective | Target Pass Rate |
| :--- | :--- | :--- | :--- |
| **Scope Parsing** | 6 | Decomposing vague briefs into 3 milestones | 100% |
| **Scope Creep Suppression** | 6 | Rejecting hallucinated extra requirements | 100% |
| **DOM / Live URL Verification** | 6 | Correctly verifying responsive tags & routes | $\ge 95\%$ |
| **Subjective Flagging** | 6 | Correctly routing subjective work to human review | 100% |
| **PayPal API Payout Execution** | 6 | Successful payout dispatch in Sandbox | 100% |

---

## 15. Three-Minute Demo Flow (Video Script)
* **0:00–0:30 (The Pain):** Show headline: *"Freelance contracts where nobody gets burned."* Explain how freelancers get ghosted and clients get abandoned.
* **0:30–1:00 (The Setup):** Paste raw brief. Watch Agent 1 decompose it into 3 clean tranches with clear criteria.
* **1:00–1:40 (The Funding):** Client clicks PayPal button; funds $900 in Sandbox. Watch the **Bryntum Gantt chart** initialize with Milestone 1 active and 2 & 3 locked.
* **1:40–2:20 (The Delivery & Inspection):** Freelancer submits live URL. Watch Agent 2 run real-time checks. All automated criteria turn green.
* **2:20–2:45 (The Payout Moment):** **PayPal Payouts API triggers.** Show the sandbox transaction ID and the Bryntum Gantt chart unlocking Milestone 2 live!
* **2:45–3:00 (The Vision):** Show 72h "Silence Means Yes" safeguard and conclude.

---

## 16. GitHub README Outline
* High-impact hero badge: `PayPal AI Hackathon 2026` + `Bryntum Sponsor Track`.
* Animated GIF showing the Bryntum Gantt timeline unlocking a tranche upon AI payout.
* Quickstart guide (3 commands: `npm install`, add `.env.local`, `npm run dev`).
* Architecture overview and security guarantees.

---

## 17. GitHub Publishing Checklist
- [x] Open-source MIT License file included.
- [ ] No API keys, credentials, or private emails committed in git history.
- [ ] Comprehensive setup instructions in README.
- [ ] Working demo URL or sandbox test credentials documented.

---

## 18. Hackathon & Sponsor Alignment

1. **Overall Grand Prize ($12,000 / $8,000 / $5,000):** Solves a massive global problem with deep PayPal integration and agentic automation.
2. **Best Use of Agentic Commerce ($5,000):** Puts AI behind the wheel of autonomous financial disbursements.
3. **Best Use of Bryntum ($1,000):** Directly implements Bryntum's #1 and #6 sponsor challenge prompts (Delivery board with payment tranche dependencies and agent-driven rescheduler).
4. **Best Use of PayPal + AI ($5,000):** Deepest integration of PayPal Orders + Payouts APIs with multimodal LLM inspection.

---

## 19. Phased Build Plan
* **Phase 1:** Scaffold Next.js App, Tailwind design system, PayPal client auth, Prisma schema.
* **Phase 2:** Agent 1 Scope Clarifier API + Dual sign-off UI.
* **Phase 3:** Bryntum Gantt timeline board + tranche dependency locks.
* **Phase 4:** Agent 2 Deliverable Inspector + PayPal Payouts auto-release engine.
* **Phase 5:** 72h timer, landing page polish, and 3-minute demo video.

---

## 20. Future Roadmap (Post-MVP)
* Cross-border fiat conversions with multi-currency PayPal accounts.
* Automated GitHub Actions webhook integration for CI/CD pipeline verification.
* Split payout disbursement to sub-contractors on multi-freelancer teams.

---

## 21. Common Mistakes to Avoid
1. *Do not let Agent 1 hallucinate requirements:* Always enforce strict de-scoper constraints.
2. *Do not let AI unilaterally fail work:* Always provide a human review escalation path.
3. *Do not use real money:* Strict sandbox endpoints only (`api-m.sandbox.paypal.com`).
4. *Do not use unstyled UI:* Adhere to `DESIGN.md` visual tokens.
5. *Do not leave build broken:* Keep commits small, verified, and documented.

---

## 22. Final Judge / User Takeaway
> **“Trustflow turns freelance payment anxiety into mathematical certainty—protecting clients with upfront escrow, and protecting freelancers with autonomous AI verification and guaranteed payout releases.”**

