# Manual Test Script: 3-Minute Hackathon Demo & Verification Walkthrough

**Target Audience:** Hackathon Judges & Human Testers  
**Prerequisites:** App running on `http://localhost:3000` (`npm run dev`)

---

## 🛑 What NOT to Re-Test (Already Proven by 41 Automated Tests)
- Do NOT manually test mathematical budget sums (proven by `phase1.test.mjs` and `benchmark30.test.mjs`).
- Do NOT manually test PayPal OAuth bearer token caching (proven by `phase1.test.mjs`).
- Do NOT manually test SQLite schema foreign keys (proven by `phase2.test.mjs`).
- Focus your manual testing strictly on visual responsiveness, Gantt animation smoothness, and user interaction flow.

---

## Step-by-Step 3-Minute Walkthrough

### Step 1: The Landing Page & Design System (0:00 - 0:30)
1. Open [http://localhost:3000](http://localhost:3000) in Chrome.
2. Observe the conversion design adhering to `elayadesign/ai-design-skills`:
   - Single font family (Geist) with Tailwind scale snapping.
   - Flat dark backgrounds (`#000000`, `#181818`), zero background gradients.
   - Hero headline text gradient (`#FFFFFF` &rarr; `#9B9B9B`).
3. Scroll down slowly past the hero.
4. **Observe the Mandatory Section B11:** The tagline words (*"No ghosting. No scope creep. Just verified deliverables and automatic PayPal payouts."*) transition individually from muted gray to bright white on scroll!
5. In the navigation header, click **"Inspection"** and **"Gantt Board"**. Verify the page smoothly scrolls to each section.

### Step 2: Agent 1 Scope Decomposition Wizard (0:30 - 1:00)
1. Click **"Create Contract"** (or navigate to [http://localhost:3000/wizard](http://localhost:3000/wizard)).
2. Under "Load Preset Brief Template", click **"SaaS Marketing Website ($900)"**.
3. Click **"Deconstruct Brief with Agent 1"**.
4. Observe the decomposition:
   - 3 distinct milestones generated.
   - The total tranche sum is strictly balanced at $900.00 (green badge).
   - Automated criteria (HTTP 200, form inputs, responsive viewport) are clearly flagged in green, while subjective design checks are flagged in amber.
5. Click **"Proceed to Escrow Cockpit"**.

### Step 3: Upfront PayPal Escrow & Bryntum Gantt Board (1:00 - 1:40)
1. In the Project Cockpit, click **"Fund $900.00 via PayPal"**.
2. Notice the confetti animation, and observe the status update to `Escrow Locked in PayPal`.
3. In the **Bryntum Gantt Timeline Board**:
   - Milestone 1 is `ACTIVE ⚡` (Electric blue).
   - Milestones 2 & 3 are `LOCKED 🔒` (Slate gray with lock icon).
   - Note the dependency indicator line: M2 unlocks only after M1 completes.
4. Click **"Agent Rescheduler (Bryntum #6)"** at the top right of the Gantt chart:
   - Select +2 days delay and click "Apply Reschedule".
   - Watch downstream milestone deadlines recalculate live!

### Step 4: Deliverable Submission & Autonomous Payout (1:40 - 2:40)
1. Under Milestone 1, in the "Submit Deliverable" section:
   - Default preview URL is `https://preview-sample.vercel.app`.
   - Click **"Run Inspection & Trigger Payout"**.
2. Watch Agent 2 execute:
   - Crawls DOM and validates HTTP 200, `<meta viewport>`, and form inputs.
   - Gemini evaluates criteria and generates the **Deliverable Verification Dossier**.
   - Confetti fires!
   - Milestone 1 transitions to `PAID ✅` with transaction batch ID displayed.
   - **PayPal Payouts API** executed successfully!
3. Look back at the **Bryntum Gantt Board**:
   - Milestone 1 bar turned Emerald Green (`Paid via PayPal`).
   - Milestone 2 is now **unlocked and active**!

### Step 5: The 72-Hour "Silence Means Yes" Safeguard (2:40 - 3:00)
1. Select Milestone 2 or 3 containing subjective criteria.
2. Observe the amber **72-Hour "Silence Means Yes"** banner.
3. Click **"Simulate 72h Timeout Expiration"**:
   - The system executes the auto-release payout and updates the milestone to `PAID`.
   - Freelancer is completely protected against client ghosting.

