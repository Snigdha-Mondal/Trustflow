# AGENTS.md — The Front Door

> **Read the Playbook first**: Before any work, open and review [ENGINEERING_PLAYBOOK.md](ENGINEERING_PLAYBOOK.md).

## What This Project Is
Trustflow is an automated, freelance-first milestone escrow workflow powered by PayPal Orders & Payouts APIs and Gemini AI deliverable inspection. It eliminates client ghosting with a 72-hour auto-release guarantee and protects clients by holding funds in escrow until milestones pass objective criteria visualized on an interactive timeline.
- Detailed Requirements: [PRD.md](PRD.md)
- Technical Blueprint: [ARCHITECTURE.md](ARCHITECTURE.md)
- Master Guide: [MASTER_GUIDE.md](MASTER_GUIDE.md)

## The 8 Golden Rules
1. **Small, verified slices.** Never leave the build broken. Commit often with evidence.
2. **Evidence over assertion.** "Done" means you ran it, tested it, and saw it work.
3. **Respect the fixed decisions.** Changing any locked tech or architecture decision requires product owner approval.
4. **Use the shared building blocks.** Don't hard-wire vendors into business logic. Keep adapters clean.
5. **Never commit secrets or personal data, weaken security, spend real money, or add a new service without approval.** Use PayPal Sandbox only (`api-m.sandbox.paypal.com`).
6. **Stop and ask when things are unclear or sensitive.** Follow the stop signs in the Playbook.
7. **Keep docs in sync with code, and update PROGRESS.md every session.** Drift between docs and code counts as a bug.
8. **Verify without drowning in output.** Read the signal, not pages of logs.

## Fixed Decisions (Locked Tech Choices)
*Any change to these requires explicit Product Owner approval:*
- **Framework:** Next.js 15 (App Router), React 19, TypeScript.
- **Styling & Tokens:** Tailwind CSS, adhering strictly to [DESIGN.md](DESIGN.md) (`elayadesign/ai-design-skills`).
- **Payments:** PayPal REST SDK in Sandbox Mode (`api-m.sandbox.paypal.com`), using Orders API (`intent: CAPTURE`) for escrow funding and Payouts API (`/v1/payments/payouts`) for milestone disbursement.
- **Database / ORM:** Prisma ORM with SQLite for reliable local, zero-config persistence and portability.
- **Timeline Engine:** Interactive Gantt / Milestone Tranche Board with dependency locking and automated rescheduling (Bryntum Gantt design / interactive Gantt component).
- **Deliverable Inspection:** Cheerio + Node Fetch for DOM/HTTP validation, combined with Gemini AI (Google GenAI SDK) for objective requirement auditing.
- **Design Standard:** `elayadesign/ai-design-skills` (`skills/landing-page-design/SKILL.md`). Single approved typeface (Geist/Manrope), no italics, Tailwind scale snapping, flat backgrounds, no single-side borders.

## Where to Find Things

| Need | Document | Purpose |
| :--- | :--- | :--- |
| **Operating Manual** | [ENGINEERING_PLAYBOOK.md](ENGINEERING_PLAYBOOK.md) | How to pick work, build it, test it, and stop signs |
| **Product Intent & Scope** | [PRD.md](PRD.md) | Target personas, MVP scope, what is in and out |
| **Technical Blueprint** | [ARCHITECTURE.md](ARCHITECTURE.md) | Component architecture, API contracts, Prisma schema |
| **Design System & Copy** | [DESIGN.md](DESIGN.md) | Visual tokens, type scales, colors, landing page copy |
| **To-Do List & Phases** | [BACKLOG.md](BACKLOG.md) | Sliced phases with exit criteria and 🔒 blockers |
| **Living Session Diary** | [PROGRESS.md](PROGRESS.md) | What was done, test evidence, decisions log, next steps |
| **Master Hackathon Guide** | [MASTER_GUIDE.md](MASTER_GUIDE.md) | 22-section comprehensive blueprint for PayPal & Bryntum |
| **Architecture Decisions** | [docs/adr/](docs/adr/) | Formal Architecture Decision Records (ADRs) |
| **Detailed Stories & Specs**| [docs/stories/](docs/stories/) | Requirements for major features |
| **Test Verification Plans** | [docs/manual-tests/](docs/manual-tests/) | Human and automated verification scripts |
