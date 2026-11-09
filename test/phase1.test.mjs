import test from "node:test";
import assert from "node:assert/strict";
import { getPayPalAccessToken, createPayPalOrder, executePayPalPayout } from "../src/lib/paypal.ts";
import { generateMilestonesFromBrief, auditDeliverableWithAI } from "../src/lib/gemini.ts";
import { crawlDeliverableUrl } from "../src/lib/inspector.ts";

test("PayPal Client: fetches access token with caching", async () => {
  const token1 = await getPayPalAccessToken();
  assert.ok(token1, "Access token should be non-empty");
  const token2 = await getPayPalAccessToken();
  assert.equal(token1, token2, "Subsequent calls should return cached access token");
});

test("PayPal Client: creates order payload for escrow capture", async () => {
  const order = await createPayPalOrder({
    amount: 900.0,
    currency: "USD",
    description: "SaaS Marketing Site Escrow",
    contractId: "ct_unit_test_01",
  });
  assert.ok(order.id, "Order should have an id");
  assert.equal(order.status, "CREATED");
});

test("PayPal Client: payout payload structure and idempotency", async () => {
  const payout = await executePayPalPayout({
    recipientEmail: "freelancer@test.com",
    amount: 300.0,
    currency: "USD",
    milestoneTitle: "Figma Wireframes",
    senderBatchId: "BATCH_TEST_001",
    milestoneId: "ms_01",
  });
  assert.ok(payout.batch_header.payout_batch_id, "Payout should return batch id");
  assert.equal(payout.batch_header.batch_status, "SUCCESS");
});

test("Agent 1 Scope Clarifier: milestones sum exactly to total budget", async () => {
  const brief = "Build a Next.js MVP landing page with payment form and pricing grid";
  const totalBudget = 850.5;
  const result = await generateMilestonesFromBrief(brief, totalBudget, "USD");

  assert.equal(result.milestones.length, 3, "Must produce exactly 3 milestones");
  const sum = result.milestones.reduce((acc, m) => acc + m.amount, 0);
  assert.equal(Math.round(sum * 100) / 100, totalBudget, "Sum of milestone amounts must equal total budget");
});

test("Agent 1 Scope Clarifier: criteria separation (automated vs subjective)", async () => {
  const brief = "Create a React portfolio website";
  const result = await generateMilestonesFromBrief(brief, 600, "USD");

  for (const milestone of result.milestones) {
    assert.ok(milestone.criteria.length > 0, "Milestone must contain criteria");
    const hasBooleanFlag = milestone.criteria.every((c) => typeof c.isAutomated === "boolean");
    assert.ok(hasBooleanFlag, "Every criterion must have isAutomated boolean flag");
  }
});

test("Crawler Engine: extracts DOM and HTTP metadata", async () => {
  const report = await crawlDeliverableUrl("https://preview-sample.vercel.app");
  assert.equal(report.statusCode, 200);
  assert.ok(report.hasViewport, "Must verify responsive viewport");
  assert.ok(report.hasForms, "Must verify forms");
  assert.ok(report.hasEmailInput, "Must verify email inputs");
});

test("Agent 2 Deliverable Inspector: audit logic & guardrails", async () => {
  const criteria = [
    { id: "c1", text: "Live URL returns HTTP 200 on /", isAutomated: true },
    { id: "c2", text: "Interactive form present", isAutomated: true },
    { id: "c3", text: "Client aesthetic signoff", isAutomated: false },
  ];

  const crawlData = {
    statusCode: 200,
    hasViewport: true,
    hasForms: true,
    hasInputs: true,
  };

  const audit = await auditDeliverableWithAI({
    milestoneTitle: "Core Frontend",
    criteria,
    crawlData,
    submittedUrl: "https://preview-sample.vercel.app",
  });

  // Guardrail test: since criterion c3 is subjective, status MUST be FLAGGED_FOR_HUMAN_REVIEW
  assert.equal(audit.status, "FLAGGED_FOR_HUMAN_REVIEW");
  assert.ok(audit.confidence >= 0.85);
  assert.equal(audit.criteriaAudits.length, 3);
});
