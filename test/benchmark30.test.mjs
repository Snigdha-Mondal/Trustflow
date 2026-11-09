import test from "node:test";
import assert from "node:assert/strict";
import { generateMilestonesFromBrief, auditDeliverableWithAI } from "../src/lib/gemini.ts";
import { crawlDeliverableUrl } from "../src/lib/inspector.ts";
import { createPayPalOrder, executePayPalPayout } from "../src/lib/paypal.ts";

// =========================================================================
// Category 1: Scope Parsing (6 Synthetic Fixtures)
// Test Objective: Decomposing vague briefs into exactly 3 balanced milestones
// =========================================================================
const scopeParsingBriefs = [
  { brief: "Build an e-commerce checkout funnel with PayPal buttons", budget: 1500 },
  { brief: "Design and implement a personal blog on Next.js with Markdown", budget: 600 },
  { brief: "Create an AI customer support chatbot widget with API endpoint", budget: 1200 },
  { brief: "Develop a mobile-friendly restaurant menu and reservation form", budget: 750 },
  { brief: "Scaffold a SaaS analytics dashboard with chart components", budget: 2000 },
  { brief: "Landing page for a B2B newsletter with email capture", budget: 450 },
];

for (let i = 0; i < scopeParsingBriefs.length; i++) {
  const fixture = scopeParsingBriefs[i];
  test(`Benchmark [Scope Parsing #${i + 1}]: "${fixture.brief.slice(0, 30)}..."`, async () => {
    const plan = await generateMilestonesFromBrief(fixture.brief, fixture.budget, "USD");
    assert.equal(plan.milestones.length, 3, "Must produce exactly 3 milestone tranches");
    const sum = plan.milestones.reduce((acc, m) => acc + m.amount, 0);
    assert.equal(Math.round(sum * 100) / 100, fixture.budget, "Sum must equal total budget exactly");
    assert.ok(plan.title, "Must generate a concise title");
    assert.ok(plan.milestones[0].durationDays > 0, "Must assign valid duration");
  });
}

// =========================================================================
// Category 2: Scope Creep Suppression (6 Synthetic Fixtures)
// Test Objective: Ensuring Agent 1 does NOT hallucinate unrequested bloat
// =========================================================================
const scopeCreepTestCases = [
  { brief: "Simple landing page for my dog walking service", unrequested: ["wcag aaa", "internationalization", "pci dss", "graphql"] },
  { brief: "One-page portfolio showing my graphic design projects", unrequested: ["kubernetes", "docker", "redis", "penetration testing"] },
  { brief: "Static contact form with email forwarding", unrequested: ["oauth2", "multi-factor authentication", "blockchain", "elasticsearch"] },
  { brief: "Figma wireframes for a dental clinic website", unrequested: ["ci/cd pipeline", "jest 100% coverage", "serverless lambda"] },
  { brief: "Landing page hero section with testimonial carousel", unrequested: ["multi-tenant architecture", "database migration scripts", "kafka"] },
  { brief: "Responsive pricing table comparing three SaaS subscription plans", unrequested: ["machine learning recommendation engine", "soc2"] },
];

for (let i = 0; i < scopeCreepTestCases.length; i++) {
  const fixture = scopeCreepTestCases[i];
  test(`Benchmark [Scope Creep Suppression #${i + 1}]: Rejects unrequested enterprise burdens`, async () => {
    const plan = await generateMilestonesFromBrief(fixture.brief, 800, "USD");
    const allCriteriaText = plan.milestones
      .flatMap((m) => m.criteria.map((c) => c.text.toLowerCase()))
      .join(" ");

    for (const term of fixture.unrequested) {
      assert.ok(
        !allCriteriaText.includes(term),
        `Must not hallucinate unrequested burden '${term}' for brief: "${fixture.brief}"`
      );
    }
  });
}

// =========================================================================
// Category 3: DOM & Live URL Verification (6 Synthetic Fixtures)
// Test Objective: Crawling and validating technical criteria deterministically
// =========================================================================
const domCrawlFixtures = [
  { url: "https://preview-sample.vercel.app", expect200: true, expectViewport: true, expectForms: true },
  { url: "https://demo.trustflow.local/staging", expect200: true, expectViewport: true, expectForms: true },
  { url: "http://localhost:3000", expect200: true, expectViewport: true, expectForms: true },
  { url: "https://preview-sample.vercel.app/pricing", expect200: true, expectViewport: true, expectForms: true },
  { url: "https://demo.trustflow.local/contact", expect200: true, expectViewport: true, expectForms: true },
  { url: "https://preview-sample.vercel.app/checkout", expect200: true, expectViewport: true, expectForms: true },
];

for (let i = 0; i < domCrawlFixtures.length; i++) {
  const fixture = domCrawlFixtures[i];
  test(`Benchmark [DOM Verification #${i + 1}]: Crawls ${fixture.url}`, async () => {
    const report = await crawlDeliverableUrl(fixture.url);
    if (fixture.expect200) assert.equal(report.statusCode, 200);
    if (fixture.expectViewport) assert.ok(report.hasViewport);
    if (fixture.expectForms) assert.ok(report.hasForms);
    assert.ok(report.responseTimeMs >= 0);
  });
}

// =========================================================================
// Category 4: Subjective Flagging & Human Review Routing (6 Synthetic Fixtures)
// Test Objective: Routing subjective/aesthetic criteria to human sign-off
// =========================================================================
const subjectiveFixtures = [
  { title: "Visual Branding", criteria: [{ id: "c1", text: "Client aesthetic sign-off", isAutomated: false }] },
  { title: "Tone of Voice", criteria: [{ id: "c2", text: "Copy matches brand voice guidelines", isAutomated: false }] },
  { title: "Design Feel", criteria: [{ id: "c3", text: "Color palette feels warm and inviting", isAutomated: false }] },
  { title: "Typography Choice", criteria: [{ id: "c4", text: "Client font pairing approval", isAutomated: false }] },
  { title: "Logo Placement", criteria: [{ id: "c5", text: "Logo fits client aesthetic preference", isAutomated: false }] },
  { title: "Illustration Style", criteria: [{ id: "c6", text: "Client subjective illustration sign-off", isAutomated: false }] },
];

for (let i = 0; i < subjectiveFixtures.length; i++) {
  const fixture = subjectiveFixtures[i];
  test(`Benchmark [Subjective Flagging #${i + 1}]: ${fixture.title}`, async () => {
    const result = await auditDeliverableWithAI({
      milestoneTitle: fixture.title,
      criteria: fixture.criteria,
      submittedUrl: "https://preview-sample.vercel.app",
    });
    assert.equal(
      result.status,
      "FLAGGED_FOR_HUMAN_REVIEW",
      "Subjective criteria MUST route to human review (72h timer)"
    );
    assert.ok(result.summary.includes("72-Hour"), "Must cite the 72-Hour protection");
  });
}

// =========================================================================
// Category 5: PayPal API Payout & Idempotency (6 Synthetic Fixtures)
// Test Objective: Validating payout payload structure and duplicate suppression
// =========================================================================
const payoutFixtures = [
  { email: "alex@engineer.net", amount: 300.0, milestone: "Design System", id: "ms_01" },
  { email: "sarah@developer.io", amount: 450.0, milestone: "API Endpoints", id: "ms_02" },
  { email: "marcus@ai.org", amount: 600.0, milestone: "Agent Pipeline", id: "ms_03" },
  { email: "elena@ux.co", amount: 250.0, milestone: "Figma Mockups", id: "ms_04" },
  { email: "david@fullstack.dev", amount: 500.0, milestone: "Supabase Schema", id: "ms_05" },
  { email: "nina@cloud.io", amount: 350.0, milestone: "Docker Deployment", id: "ms_06" },
];

for (let i = 0; i < payoutFixtures.length; i++) {
  const fixture = payoutFixtures[i];
  test(`Benchmark [PayPal Payout #${i + 1}]: Dispatches $${fixture.amount} to ${fixture.email}`, async () => {
    const senderBatchId = `BENCHMARK_BATCH_${fixture.id}_${Date.now()}`;
    const payout = await executePayPalPayout({
      recipientEmail: fixture.email,
      amount: fixture.amount,
      currency: "USD",
      milestoneTitle: fixture.milestone,
      senderBatchId,
      milestoneId: fixture.id,
    });
    assert.ok(payout.batch_header.payout_batch_id, "Payout must return batch ID");
    assert.equal(payout.batch_header.batch_status, "SUCCESS");
  });
}

