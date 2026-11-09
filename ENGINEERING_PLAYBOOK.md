# ENGINEERING_PLAYBOOK.md — The Operating Manual

This document acts as the Engineering Manager for Trustflow. It defines how we pick work, build it, test it, verify it, and when to pause and ask the Product Owner.

---

## 1. Roles and Escalation

| Role | Who | Ownership |
| :--- | :--- | :--- |
| **Product Owner** | User (Human) | Final priorities, approvals, external services, money, deployment, and scope changes. |
| **Engineering Manager** | This Playbook | The processes, engineering standards, quality gates, and checklists. |
| **Engineer** | AI Agent | Planning, coding, testing, verifying, reviewing, and keeping docs in sync. |

---

## 2. Source of Truth (Precedence Order)

When two documents or sources disagree, the higher tier strictly wins:

```
1. What the Product Owner says now (Direct User Instructions)
         ▲
2. PRD.md (Product Intent & MVP Scope)
         ▲
3. ARCHITECTURE.md (Technical Design & Fixed Choices)
         ▲
4. ENGINEERING_PLAYBOOK.md (Process & Rules)
         ▲
5. BACKLOG.md (Concrete Task Slices)
         ▲
6. Existing Code & Comments (May be out of date / drifted)
```

**Conflict Resolution Rules:**
- Found a conflict? Stop and flag it with a proposed fix. Never quietly pick one.
- Missing a detail? Propose adding it to the specification. Do not make an unwritten assumption.
- Settled decision? Never re-argue decisions recorded in the Decisions Log.

---

## 3. The 9-Step Loop

Every working slice follows this exact loop:

```
[ 1. Orient ] ──> [ 2. Select ] ──> [ 3. Plan ]
                                         │
[ 6. Review ] <── [ 5. Test ]   <── [ 4. Build ]
      │
      └───> [ 7. Record ] ──> [ 8. Commit ] ──> [ 9. Reflect ]
```

1. **Orient:** Read `AGENTS.md`, `PROGRESS.md`, and the current phase in `BACKLOG.md`.
2. **Select:** Pick the next unblocked task in order. If an item has a 🔒, pause and ask the Product Owner.
3. **Plan:** Draft a concise plan: what changes, which files are affected, and how it will be verified.
4. **Build:** Implement the smallest functional slice that satisfies the task.
5. **Test:** Run automated unit/integration tests and run the real application to verify actual behavior. "Done" means seen working.
6. **Review:** Check for bugs, security leaks, clean abstractions, and compliance with `DESIGN.md`.
7. **Record:** Update `PROGRESS.md` with date, test evidence, decisions, and any updated specs.
8. **Commit:** Commit clean, verified code with a descriptive git message.
9. **Reflect:** Log any newly discovered risks, bugs, or backlog items, then continue to the next task.

---

## 4. Definition of Ready & Definition of Done

### Definition of Ready (DoR)
A task may ONLY be started when:
- The exact outcome is clear and bounded.
- All prerequisite tasks and dependencies are completed.
- It fits within a single coherent working slice.
- The relevant architectural specs and `DESIGN.md` guidelines have been read.

### Definition of Done (DoD)
A task is ONLY complete when:
- It meets the specification.
- Automated tests pass without warnings.
- It was run and seen working with real inputs/outputs (evidence documented).
- Code is reviewed: zero secrets committed, zero mock data where real data belongs.
- `PROGRESS.md` and related docs are updated in the same slice.
- Build is clean and committed.

---

## 5. Stop Signs: When the Agent Must Ask

### 🟢 GO: Do It Yourself
- Pick and build the next unblocked backlog task.
- Write unit, integration, and contract tests.
- Refactor within existing patterns.
- Fix small bugs in scope.
- Update documentation and `PROGRESS.md`.
- Make low-level implementation choices and log them in the Decisions Log.

### 🟡 PAUSE: Checkpoint (Ask with Proposed Solution)
- Database schema migrations or breaking model changes.
- Changes to API contracts or payment flows.
- Anything touching security, cryptography, or auth tokens.
- Integrating a new third-party library or service.
- Ambiguous requirements or conflicting specifications.

### 🔴 NEVER Without Approval
- Delete persistent user or financial data.
- Deploy to production or spend real money (Sandbox only!).
- Commit secrets, private keys, or API tokens.
- Weaken security, skip validation, or bypass error handling to "make it work".
- Alter a locked fixed decision.
- Expand scope beyond what is defined in `PRD.md`.

---

## 6. Engineering Standards

1. **Strict Type Safety:** TypeScript `strict: true`. No unchecked `any` types.
2. **Design Fidelity:** Strict adherence to [DESIGN.md](DESIGN.md) (`elayadesign/ai-design-skills`).
   - Single font family (Geist / Manrope).
   - Tailwind scale steps only.
   - Spacing tokens (0 to 96px).
   - Corner radius formula: `inner radius = outer radius - gap`.
   - Flat backgrounds (no gradient backgrounds).
   - Hero text gradient only (`#FFFFFF` → `#9B9B9B` in dark mode).
   - Full states for interactive components: Default, Hover, Active, Focus, Loading, Empty, Error.
3. **Payments Security:**
   - Strict sandbox endpoints (`https://api-m.sandbox.paypal.com`).
   - Idempotency keys on all PayPal Payout dispatches.
   - Clear audit trails in database.
4. **Resilient AI Auditing:**
   - Agent 1 (Scope Clarifier) must strictly separate automated vs subjective criteria.
   - Agent 2 (Deliverable Inspector) can NEVER unilaterally reject work; flags for human review if confidence < 90% or criteria are subjective.

---

## 7. Lessons Learned (DeftBench Playbook Rules)

1. **Evidence beats "looks right":** Unit tests passing doesn't mean the UI or API works with real network data. Test end-to-end.
2. **Get the signal, not the stream:** Run commands cleanly and filter logs for errors instead of spewing unparsed output.
3. **The two-try rule:** If UI click-through fails twice, inspect the underlying network API or DB state directly.
4. **Docs drift quietly:** When code changes, specs must update in the same commit. Drift is a bug.
5. **Fix the cause, don't hide it:** Never disable lint rules, TypeScript checks, or tests to make a build pass. Fix the root cause.
6. **Never fake it:** If mock data isn't needed, test with real database or sandbox responses. Mark incomplete work as deferred rather than faking passes.
7. **Keep the entry file clean:** Keep `AGENTS.md` concise so it is always read in full every session.
