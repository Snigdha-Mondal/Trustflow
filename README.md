# Trustflow — Freelance Milestone Escrow with Autonomous AI Inspection

"Freelance milestone escrow where nobody gets burned — powered by PayPal, automated AI verification, and zero platform friction."

---

## The Core Problem

Online freelance commerce suffers from a structural breakdown in trust known as the **Asymmetric Trust Dilemma**:

1. **The Client Dilemma:** Clients are reluctant to pay 100% upfront for software, design, or engineering deliverables that may arrive late, contain critical bugs, or fail to match the initial scope.
2. **The Freelancer Dilemma:** Freelancers risk their livelihood when delivering work without guaranteed payment. Handing over source code, credentials, or live deployments before payment often leads to client ghosting, delayed payment cycles, or forced discounts through unilateral renegotiation.
3. **Client Ghosting:** Once a deliverable is submitted, clients routinely delay review for weeks or stop communicating altogether, leaving the freelancer's capital and time trapped indefinitely.
4. **Freelancer Abandonment:** Conversely, when a freelancer disappears mid-project, clients lose their deposit, face missed launch deadlines, and lack the technical context needed to onboard a replacement developer.
5. **Legacy Platform Friction:** Traditional intermediaries (such as Upwork and Fiverr) extract punitive 10% to 20% take rates, hold funds in opaque custody, and rely on slow, bureaucratic manual dispute resolution that can take months to arbitrate.

---

## What Trustflow Does

Trustflow is an autonomous milestone escrow protocol that creates symmetrical protection for both clients and freelancers. It combines upfront PayPal escrow funding, automated code and DOM inspection, and guaranteed time-locked release rules:

* **Upfront Escrow Custody:** Clients fund 100% of the project budget upfront into PayPal escrow custody via the PayPal Orders API (`intent: CAPTURE`). Freelancers build with complete confidence knowing the funds are fully secured before work begins.
* **Agent 1: Scope Clarifier:** Converts unstructured project briefs into objective milestone tranches with mathematically balanced budgets and explicit separation between deterministic criteria (HTTP 200, DOM elements, form validation) and subjective requirements.
* **Symmetrical Ghosting Protection:**
  * **Client Ghosting Defense ("Silence Means Yes"):** If a freelancer submits work and the client fails to review or respond within 72 hours, the escrow funds automatically disburse to the freelancer via the PayPal Payouts API.
  * **Freelancer Ghosting Defense (Inactivity Refund & AI Takeover):** If a freelancer misses a milestone deadline and remains inactive for more than 72 hours, the client can claim an immediate refund of unreleased escrow via the PayPal Captures Refund API. Simultaneously, Agent 3 audits completed milestones and generates a turnkey AI Takeover Brief so a replacement freelancer can resume work immediately.
* **Agent 2: Multimodal Deliverable Inspector:** Crawls submitted preview URLs in real time using Cheerio and Node Fetch to verify HTTP status, responsive viewport configuration, and DOM element presence. Google Gemini audits requirement compliance before triggering payouts.
* **Interactive Timeline Board:** Provides milestone dependency locks where downstream tranches remain locked until predecessor deliverables are verified and paid. Incorporates dynamic schedule recalculation when revision requests occur.

---

## Workflow Architecture

```mermaid
flowchart TD
    A[Client Project Brief] --> B[Agent 1: Scope & Milestone Clarifier]
    B --> C[Deconstruct into Objective Milestones & Criteria]
    C --> D[Upfront Escrow Funding via PayPal Orders API]
    D --> E[Interactive Milestone Timeline Board]
    E --> F[Milestone 1: Active | Downstream Milestones: Locked]
    F --> G[Freelancer Submits Deliverable Preview URL]
    G --> H[Agent 2: Deliverable Inspector]
    
    H -->|Automated Criteria Verified| I[PayPal Payouts API Disbursal]
    H -->|Subjective Criteria Present| J[72-Hour Review Window]
    
    J -->|Client Approves| I
    J -->|Client Silent for 72h| K[Silence Means Yes Auto-Release] --> I
    
    F -->|Freelancer Inactive for 72h Past Deadline| L[Freelancer Ghosting Protection]
    L --> M[PayPal Refund API: Return Unreleased Escrow]
    L --> N[Agent 3: AI Continuity Handoff Brief]
    
    I --> O[Next Milestone Unlocks on Timeline]
    O -->|All Milestones Completed| P[Contract Completed]
```

---

## Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router), React 19 | Full-stack architecture, React Server Components, and client interactivity |
| **Language** | TypeScript (Strict Mode) | End-to-end type safety across API routes, components, and data models |
| **Styling** | Tailwind CSS | Utility-first styling with high-contrast surfaces and custom geometric design tokens |
| **Payments** | PayPal REST SDK (Sandbox) | Orders API (`v2`) for escrow funding, Payouts API (`v1`) for disbursements, Captures Refund API (`v2`) for inactivity claims |
| **AI Engine** | Google GenAI SDK (`@google/generative-ai`) | Gemini models for scope deconstruction (Agent 1), deliverable audit (Agent 2), and continuity handoff briefs (Agent 3) |
| **Inspection Engine** | Cheerio + Node Fetch | Real-time DOM inspection, HTTP status validation, and metadata extraction |
| **Database & ORM** | Prisma ORM with SQLite | Schema modeling, zero-configuration local persistence, and atomic transactions |
| **Timeline Engine** | Custom Interactive Gantt Board | Milestone dependency locking, timeline scrubbing, and schedule recalculation |
| **Icons & Animation** | Lucide React, Canvas Confetti | System iconography and interaction feedback |
| **Testing** | Node.js Test Runner + `tsx` | 43 automated end-to-end tests and evaluation benchmarks |

---

## Quickstart Guide

### 1. Prerequisites
* Node.js v20 or higher
* npm or pnpm

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Snigdha-Mondal/Trustflow.git
cd Trustflow

# Install dependencies
npm install

# Initialize SQLite database and demo seed contract
npm run db:push
npm run db:seed
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
DATABASE_URL="file:./dev.db"

# PayPal REST API (Sandbox)
PAYPAL_CLIENT_ID="your_sandbox_client_id"
PAYPAL_CLIENT_SECRET="your_sandbox_client_secret"
PAYPAL_API_BASE="https://api-m.sandbox.paypal.com"
PAYPAL_MODE="sandbox"

# Google Gemini API (Optional: automated fallback included)
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
Executes all 43 test fixtures verifying PayPal OAuth token caching, Orders capture, Payouts dispatch, inactivity refunds, de-scoper constraints, DOM crawler verification, and Gantt timeline dependencies.
