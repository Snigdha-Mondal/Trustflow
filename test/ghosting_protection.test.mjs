import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/db.ts";
import { refundPayPalCapture } from "../src/lib/paypal.ts";
import { generateTakeoverBrief } from "../src/lib/handoff.ts";

test("Ghosting Protection: PayPal Sandbox Refund calculation and capture call", async () => {
  // Test direct refund client
  const refundRes = await refundPayPalCapture({
    captureId: "CAPTURE_TEST_12345",
    amount: 600.0,
    currency: "USD",
    noteReason: "Freelancer inactive > 72h. Escrow refund issued.",
  });

  assert.ok(refundRes.id, "Refund response must include a refund ID");
  assert.equal(refundRes.status, "COMPLETED", "Refund status should be COMPLETED");
  assert.equal(refundRes.amount.value, "600.00", "Refund amount value should equal 600.00");
  assert.equal(refundRes.amount.currency_code, "USD", "Currency should be USD");
});

test("Ghosting Protection: Full Lifecycle (Partial Payout -> 72h Abandonment -> Escrow Refund -> Agent 3 Dossier)", async () => {
  // 1. Create a test contract with 3 milestones ($300 each = $900 total)
  const contract = await prisma.contract.create({
    data: {
      title: "Ghosting Protection Test Project",
      description: "Testing 72h inactivity refund and Agent 3 takeover generator",
      totalBudget: 900.0,
      currency: "USD",
      clientEmail: "sarah.client@test.io",
      freelancerEmail: "ghosting.freelancer@test.net",
      status: "FUNDED",
      paypalOrderId: "ORDER_GHOST_TEST_01",
      paypalCaptureId: "CAPTURE_GHOST_TEST_01",
      milestones: {
        create: [
          {
            order: 1,
            title: "Phase 1: Project Scaffold & Brand Tokens",
            description: "Initial frontend setup and token configuration",
            amount: 300.0,
            durationDays: 3,
            status: "PAID",
            payoutBatchId: "PAYOUT_BATCH_TEST_01",
            criteria: {
              create: [
                { text: "Design tokens match specified scale", isAutomated: true, passed: true },
                { text: "Next.js 15 repository initialized", isAutomated: true, passed: true },
              ],
            },
          },
          {
            order: 2,
            title: "Phase 2: Interactive Views & Lead Forms",
            description: "Lead capture and dynamic routing",
            amount: 300.0,
            durationDays: 4,
            status: "ACTIVE",
            criteria: {
              create: [
                { text: "Lead form validated on submit", isAutomated: true },
                { text: "HTTP 200 on /contact route", isAutomated: true },
              ],
            },
          },
          {
            order: 3,
            title: "Phase 3: Production Deployment",
            description: "Production domain launch and SSL",
            amount: 300.0,
            durationDays: 3,
            status: "LOCKED",
            criteria: {
              create: [
                { text: "Production HTTPS URL live", isAutomated: true },
              ],
            },
          },
        ],
      },
    },
    include: {
      milestones: {
        include: { criteria: true },
        orderBy: { order: "asc" },
      },
    },
  });

  // Verify initial state
  assert.equal(contract.milestones.length, 3);
  const paidMilestones = contract.milestones.filter((m) => m.status === "PAID");
  const unreleasedMilestones = contract.milestones.filter((m) => m.status !== "PAID");
  assert.equal(paidMilestones.length, 1);
  assert.equal(unreleasedMilestones.length, 2);

  // 2. Calculate unreleased amount
  const paidAmount = paidMilestones.reduce((acc, m) => acc + m.amount, 0);
  const unreleasedAmount = Math.max(0, contract.totalBudget - paidAmount);
  assert.equal(paidAmount, 300.0, "Milestone 1 paid amount must be 300.00");
  assert.equal(unreleasedAmount, 600.0, "Unreleased escrow balance to refund must be exactly 600.00");

  // 3. Execute PayPal refund for only unreleased balance
  const refundResult = await refundPayPalCapture({
    captureId: contract.paypalCaptureId,
    amount: unreleasedAmount,
    currency: contract.currency,
    noteReason: "Trustflow Ghosting Protection: Milestone 2 overdue > 72h with zero activity.",
  });
  assert.ok(refundResult.id);

  // 4. Update contract & milestones in database
  await prisma.milestone.updateMany({
    where: {
      contractId: contract.id,
      status: { not: "PAID" },
    },
    data: { status: "ABANDONED" },
  });

  await prisma.contract.update({
    where: { id: contract.id },
    data: {
      status: "ABANDONED_REFUNDED",
      refundId: refundResult.id,
      refundedAmount: unreleasedAmount,
    },
  });

  // 5. Generate Agent 3 Takeover Brief
  const refreshedContract = await prisma.contract.findUnique({
    where: { id: contract.id },
    include: {
      milestones: {
        include: { criteria: true },
        orderBy: { order: "asc" },
      },
    },
  });

  const takeoverBrief = await generateTakeoverBrief({
    contract: refreshedContract,
  });

  // Validate Takeover Brief structure
  assert.equal(takeoverBrief.contractId, contract.id);
  assert.equal(takeoverBrief.financialSummary.totalOriginalBudget, 900.0);
  assert.equal(takeoverBrief.financialSummary.disbursedAmount, 300.0);
  assert.equal(takeoverBrief.financialSummary.refundedAmount, 600.0);
  assert.equal(takeoverBrief.financialSummary.remainingScopeBudget, 600.0);
  assert.equal(takeoverBrief.financialSummary.estimatedDaysToFinish, 7); // 4 + 3 days

  // Validate working state & remaining scope
  assert.equal(takeoverBrief.currentWorkingState.completedMilestones.length, 1);
  assert.equal(takeoverBrief.currentWorkingState.completedMilestones[0].order, 1);
  assert.equal(takeoverBrief.remainingScope.uncompletedMilestones.length, 2);
  assert.equal(takeoverBrief.remainingScope.uncompletedMilestones[0].order, 2);
  assert.equal(takeoverBrief.remainingScope.uncompletedMilestones[1].order, 3);
  assert.ok(takeoverBrief.replacementActionPlan.length >= 3);
  assert.ok(takeoverBrief.markdownTakeoverDoc.includes("Replacement Freelancer Takeover Brief"));
  assert.ok(takeoverBrief.markdownTakeoverDoc.includes("$600.00 USD"));

  // 6. Save dossier to contract record
  const finalized = await prisma.contract.update({
    where: { id: contract.id },
    data: { handoffDossier: JSON.stringify(takeoverBrief) },
  });
  assert.ok(finalized.handoffDossier);
  assert.equal(finalized.status, "ABANDONED_REFUNDED");
  assert.equal(finalized.refundedAmount, 600.0);

  // Clean up test contract
  await prisma.contract.delete({ where: { id: contract.id } });
});
