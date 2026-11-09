# ARCHITECTURE.md — System Architecture & Data Blueprints

## 1. High-Level System Architecture

```
                          [ Client / Freelancer Browser ]
                                        │
                         (Next.js 15 App Router + React 19)
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           ▼                            ▼                            ▼
   [ Landing Page ]            [ Project Cockpit ]          [ AI Scope Wizard ]
 (Conversion & System)      (Bryntum Gantt Board)      (Milestone Decomposition)
           │                            │                            │
           └────────────────────────────┼────────────────────────────┘
                                        │ (Next.js API Routes)
                                        ▼
                   ┌──────────────────────────────────────────┐
                   │        Backend Services & Engines        │
                   ├────────────────────┬─────────────────────┤
                   │  PayPal Client     │  Gemini AI Client   │
                   │  - Orders API      │  - Agent 1 Scope    │
                   │  - Payouts API     │  - Agent 2 Inspect  │
                   ├────────────────────┼─────────────────────┤
                   │  Crawler Engine    │  Schedule Engine    │
                   │  - Cheerio + Fetch │  - Bryntum Engine   │
                   └────────────────────┴─────────────────────┘
                                        │
                                        ▼
                         [ SQLite Database (Prisma ORM) ]
```

---

## 2. Fixed Decisions & Invariants

1. **Framework:** Next.js 15 with React 19 and App Router (`src/app`).
2. **Persistence:** Prisma ORM backed by SQLite for zero-setup, atomic local transactions.
3. **Escrow Custody:** Upfront payment captured via PayPal Orders API (`intent: CAPTURE`) to the platform escrow account.
4. **Milestone Disbursement:** Direct disbursement to freelancer email via PayPal Payouts API (`/v1/payments/payouts`) with idempotent batch IDs (`payout_batch_${contractId}_${milestoneId}`).
5. **Timeline Board:** Bryntum Gantt-compatible data model and interactive Gantt component supporting task dependencies, milestone locks, and automated rescheduling.
6. **AI Safety Rule:** The model reasons and classifies; deterministic code triggers payouts. AI cannot unilaterally reject work.
7. **Design Tokens:** Strict conformity with [DESIGN.md](DESIGN.md) (`elayadesign/ai-design-skills`).

---

## 3. Database Schema (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Contract {
  id              String      @id @default(cuid())
  title           String
  description     String
  totalBudget     Float
  currency        String      @default("USD")
  clientEmail     String
  freelancerEmail String
  status          String      @default("DRAFT") // DRAFT, FUNDED, ACTIVE, COMPLETED, CANCELLED
  paypalOrderId   String?
  paypalCaptureId String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  milestones      Milestone[]
}

model Milestone {
  id              String                  @id @default(cuid())
  contractId      String
  contract        Contract                @relation(fields: [contractId], references: [id], onDelete: Cascade)
  order           Int
  title           String
  description     String
  amount          Float
  durationDays    Int
  status          String                  @default("LOCKED") // LOCKED, ACTIVE, SUBMITTED, IN_REVIEW, PAID
  startDate       DateTime?
  endDate         DateTime?
  payoutBatchId   String?
  reviewDeadline  DateTime?
  criteria        Criterion[]
  inspections     DeliverableInspection[]
  createdAt       DateTime                @default(now())
  updatedAt       DateTime                @updatedAt
}

model Criterion {
  id          String    @id @default(cuid())
  milestoneId String
  milestone   Milestone @relation(fields: [milestoneId], references: [id], onDelete: Cascade)
  text        String
  isAutomated Boolean   @default(false)
  passed      Boolean?
  evidence    String?
}

model DeliverableInspection {
  id           String    @id @default(cuid())
  milestoneId  String
  milestone    Milestone @relation(fields: [milestoneId], references: [id], onDelete: Cascade)
  submittedUrl String
  notes        String?
  status       String    // PASSED, FLAGGED_FOR_HUMAN_REVIEW
  confidence   Float
  rawReport    String    // JSON text of inspection details
  createdAt    DateTime  @default(now())
}
```

---

## 4. API Routes Specification

### 4.1 `POST /api/milestones/generate`
- **Purpose:** Agent 1 (Scope Clarifier) transforms raw brief into 3 distinct milestone tranches.
- **Request:**
  ```json
  { "brief": "Build a Next.js marketing site with pricing page and contact form", "totalBudget": 900.00 }
  ```
- **Response:**
  ```json
  {
    "title": "SaaS Marketing Website",
    "totalBudget": 900.00,
    "milestones": [
      {
        "order": 1,
        "title": "Figma Wireframes & Design System",
        "amount": 300.00,
        "durationDays": 3,
        "criteria": [
          { "text": "Figma tokens for typography & spacing match DESIGN.md", "isAutomated": false },
          { "text": "Desktop & mobile responsive layouts provided", "isAutomated": false }
        ]
      },
      ...
    ]
  }
  ```

### 4.2 `POST /api/contracts`
- **Purpose:** Persist contract and milestones to SQLite via Prisma.

### 4.3 `POST /api/paypal/create-order`
- **Purpose:** Call PayPal Orders API to create an authorization order for the total contract amount.

### 4.4 `POST /api/paypal/capture-order`
- **Purpose:** Capture PayPal Order, lock escrow funds in contract record, and set Milestone 1 to `ACTIVE`.

### 4.5 `POST /api/deliverable/inspect`
- **Purpose:** Agent 2 (Deliverable Inspector) executes HTTP/DOM crawl and Gemini semantic review against milestone criteria.
- **Output:** Returns Verification Dossier and triggers instant payout if all criteria pass.

### 4.6 `POST /api/paypal/payout`
- **Purpose:** Execute payout via PayPal Payouts API (`/v1/payments/payouts`), set milestone status to `PAID`, and unlock downstream milestone on Gantt board.

### 4.7 `POST /api/milestones/reschedule`
- **Purpose:** Automatically recalculate milestone start and end dates when revisions occur.

---

## 5. Security & Isolation Architecture
- All API requests to PayPal Sandbox authenticate using OAuth 2.0 Client Credentials flow (`/v1/oauth2/token`).
- Tokens are cached in-memory with automatic expiration renewal.
- Gemini API calls use the official Google GenAI SDK with structured output JSON schemas.
- External preview URLs inspected by the crawler run in memory with request timeouts and size limits (10MB max).

