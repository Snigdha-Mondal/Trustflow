# ADR 001: Selection of Tech Stack, PayPal Escrow Integration, and Bryntum Timeline Model

## Status
Accepted

## Context
Trustflow is built for the PayPal AI Hackathon 2026. Freelance contracts routinely break down because of two opposing trust dilemmas:
1. Clients do not want to release money before work is proven to function.
2. Freelancers do not want to hand over work or deploy sites without guaranteed payment custody, fearing client ghosting or endless revision cycles.

Traditional platforms charge 10-20% take rates and rely on manual dispute processes. We need an automated, developer-friendly architecture that:
- Uses real PayPal APIs (Orders API for upfront escrow capture + Payouts API for instant milestone disbursal).
- Uses Gemini AI for scope decomposition and objective deliverable inspection.
- Uses an interactive Gantt timeline (Bryntum Gantt design model) to represent dependent payment tranches, lock statuses, and automated rescheduling.
- Provides a fast, modern Next.js 15 App Router web experience adhering to `DESIGN.md` (`elayadesign/ai-design-skills`).

## Decision
1. **Next.js 15 (App Router) + TypeScript + Tailwind CSS:** Provides fast server-side and client-side rendering, robust API route handlers, and unified full-stack TypeScript safety.
2. **Prisma ORM with SQLite:** Provides local atomic transactional persistence without requiring external database provisioning.
3. **PayPal Sandbox REST API (`api-m.sandbox.paypal.com`):**
   - Upfront contract funding: Captured using `/v2/checkout/orders` with `intent: CAPTURE`.
   - Milestone disbursement: Autonomous disbursement using `/v1/payments/payouts` with unique, idempotent sender batch IDs.
4. **Deliverable Verification Architecture:**
   - Deterministic HTTP/DOM crawler using Cheerio + fetch for objective checks (HTTP 200 status, responsive meta viewport, required DOM elements, forms).
   - Gemini AI for structured semantic auditing against contractual criteria.
   - Guardrail: AI can never unilaterally reject work; any ambiguous or subjective criteria triggers human review with the 72-hour auto-release timer.
5. **Interactive Bryntum Gantt Architecture:**
   - Tasks and milestones with explicit dependencies (Milestone 2 depends on Milestone 1; Milestone 3 depends on Milestone 2).
   - Dynamic recalculation of milestone start and end dates when revisions or extensions occur.

## Consequences
- **Positive:** Full compliance with PayPal AI Hackathon criteria; zero runtime database dependencies during judging; high conversion design fidelity via `elayadesign/ai-design-skills`; crystal clear audit trail.
- **Negative:** SQLite is local to the instance (sufficient for MVP and demo); PayPal Sandbox credentials must be configured in `.env.local`.
