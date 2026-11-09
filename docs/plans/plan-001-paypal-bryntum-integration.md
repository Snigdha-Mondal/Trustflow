# Plan 001: PayPal REST API, Bryntum Gantt, and Gemini AI Integration Plan

## Objective
Implement end-to-end integration between PayPal Orders (escrow capture), PayPal Payouts (milestone disbursement), Bryntum Gantt timeline board (tranche dependencies & rescheduling), and Gemini AI (scope architect & deliverable auditor).

---

## 1. PayPal REST API Integration

### 1.1 Escrow Capture (Orders API v2)
- **Endpoint:** `POST https://api-m.sandbox.paypal.com/v2/checkout/orders`
- **Headers:** `Authorization: Bearer <access_token>`, `Content-Type: application/json`
- **Payload:**
  ```json
  {
    "intent": "CAPTURE",
    "purchase_units": [
      {
        "reference_id": "contract_id",
        "description": "Trustflow Escrow Budget",
        "amount": { "currency_code": "USD", "value": "900.00" }
      }
    ]
  }
  ```
- **Capture Execution:** `POST /v2/checkout/orders/{id}/capture`
- **Idempotency & Custody:** Captured funds remain in platform escrow balance until milestone completion.

### 1.2 Autonomous Milestone Disbursement (Payouts API v1)
- **Endpoint:** `POST https://api-m.sandbox.paypal.com/v1/payments/payouts`
- **Payload:**
  ```json
  {
    "sender_batch_header": {
      "sender_batch_id": "BATCH_{contractId}_{milestoneId}_{timestamp}",
      "email_subject": "Trustflow Milestone Payout: {milestoneTitle}"
    },
    "items": [
      {
        "recipient_type": "EMAIL",
        "amount": { "value": "300.00", "currency": "USD" },
        "receiver": "freelancer@domain.net",
        "sender_item_id": "milestone_id"
      }
    ]
  }
  ```

---

## 2. Bryntum Gantt Architecture (Prompts #1 & #6)

### 2.1 Tranche Dependency Locking (Prompt #1)
- Data model maps each milestone to a task row.
- Dependency logic: Task $M_{i+1}$ has prerequisite $M_i$.
- Visual badges: `LOCKED 🔒` until predecessor reaches `PAID ✅`.
- Cashflow overview: Displays Disbursed, In-Review, and Locked tranche totals.

### 2.2 Agent-Driven Rescheduling (Prompt #6)
- Endpoint: `POST /api/milestones/reschedule`
- When client feedback or revision is logged, the engine calculates the delta delay (e.g. +2 days) and shifts `startDate` and `endDate` for all downstream uncompleted milestones.
- Gantt bars animate into their newly calculated positions using the base deceleration curve `cubic-bezier(0.22, 1, 0.36, 1)`.

---

## 3. Gemini Multimodal Deliverable Inspector

### 3.1 Two-Stage Verification Pipeline
1. **Stage 1: Deterministic Crawl:** Node fetch + Cheerio crawls the target preview URL, inspecting HTTP status code (200), viewport configuration, forms, inputs, and links.
2. **Stage 2: Multimodal AI Semantic Audit:** Gemini audits the crawl evidence against contractual criteria.

### 3.2 Safety Invariants
- AI cannot unilaterally reject work.
- If objective criteria pass with $\ge 90\%$ confidence, status is `PASSED` and payout triggers.
- If criteria are subjective or confidence $< 90\%$, status is `FLAGGED_FOR_HUMAN_REVIEW` with the 72-Hour "Silence Means Yes" countdown.

