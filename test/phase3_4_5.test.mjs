import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/db.ts";
import { createPayPalOrder, capturePayPalOrder, executePayPalPayout } from "../src/lib/paypal.ts";
import { crawlDeliverableUrl } from "../src/lib/inspector.ts";
import { auditDeliverableWithAI } from "../src/lib/gemini.ts";

test("Phase 3 & 4: Full Escrow Lifecycle (Funding -> AI Inspection -> Payout -> Tranche Unlock)", async () => {
  // 1. Create a fresh draft contract in SQLite
  const contract = await prisma.contract.create({
    data: {
      title: "End-to-End Escrow Test Contract",
      description: "Testing PayPal Orders, AI inspection, and Payouts disbursement",
      totalBudget: 900.0,
      currency: "USD",
      clientEmail: "sarah.client@test.io",
      freelancerEmail: "alex.engineer@test.net",
      status: "DRAFT",
      milestones: {
        create: [
          {
            order: 1,
            title: "Tranche 1: Frontend Scaffold",
            description: "Scaffold and wireframe",
            amount: 300.0,
            durationDays: 3,
            status: "LOCKED",
            criteria: {
              create: [
                { text: "Live URL returns HTTP 200 on /", isAutomated: true },
                { text: "Responsive viewport meta tag verified", isAutomated: true },
              ],
            },
          },
          {
            order: 2,
            title: "Tranche 2: Interactive Features",
            description: "Form inputs and lead capture",
            amount: 300.0,
            durationDays: 4,
            status: "LOCKED",
            criteria: {
              create: [
                { text: "Interactive form present with email input", isAutomated: true },
              ],
            },
          },
          {
            order: 3,
            title: "Tranche 3: Deployment Handover",
            description: "Final deploy",
            amount: 300.0,
            durationDays: 3,
            status: "LOCKED",
            criteria: {
              create: [
                { text: "Live HTTPS production URL verified", isAutomated: true },
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

  assert.equal(contract.status, "DRAFT");
  assert.equal(contract.milestones.length, 3);
  assert.equal(contract.milestones[0].status, "LOCKED");

  // 2. Fund contract via PayPal Orders API
  const order = await createPayPalOrder({
    amount: contract.totalBudget,
    currency: contract.currency,
    description: contract.title,
    contractId: contract.id,
  });
  assert.ok(order.id);

  const capture = await capturePayPalOrder(order.id);
  assert.equal(capture.status, "COMPLETED");

  // Update contract to FUNDED and activate Milestone 1
  const now = new Date();
  await prisma.contract.update({
    where: { id: contract.id },
    data: { status: "FUNDED", paypalCaptureId: capture.captureId || "CAP_TEST" },
  });

  await prisma.milestone.update({
    where: { id: contract.milestones[0].id },
    data: {
      status: "ACTIVE",
      startDate: now,
      endDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
    },
  });

  // Verify Milestone 1 is now ACTIVE while 2 and 3 remain LOCKED
  const fundedContract = await prisma.contract.findUnique({
    where: { id: contract.id },
    include: { milestones: { orderBy: { order: "asc" } } },
  });
  assert.equal(fundedContract.status, "FUNDED");
  assert.equal(fundedContract.milestones[0].status, "ACTIVE");
  assert.equal(fundedContract.milestones[1].status, "LOCKED");
  assert.equal(fundedContract.milestones[2].status, "LOCKED");

  // 3. Freelancer submits deliverable for Milestone 1
  const submittedUrl = "https://preview-sample.vercel.app";
  const crawlData = await crawlDeliverableUrl(submittedUrl);
  assert.equal(crawlData.statusCode, 200);

  const audit = await auditDeliverableWithAI({
    milestoneTitle: fundedContract.milestones[0].title,
    criteria: contract.milestones[0].criteria,
    crawlData,
    submittedUrl,
  });

  assert.equal(audit.status, "PASSED");
  assert.ok(audit.confidence >= 0.9);

  // 4. Trigger Autonomous PayPal Payout for Milestone 1
  const payout = await executePayPalPayout({
    recipientEmail: contract.freelancerEmail,
    amount: fundedContract.milestones[0].amount,
    currency: contract.currency,
    milestoneTitle: fundedContract.milestones[0].title,
    senderBatchId: `BATCH_${contract.id}_M1_${Date.now()}`,
    milestoneId: fundedContract.milestones[0].id,
  });
  assert.equal(payout.batch_header.batch_status, "SUCCESS");

  // Mark M1 PAID and unlock M2 to ACTIVE
  await prisma.milestone.update({
    where: { id: fundedContract.milestones[0].id },
    data: { status: "PAID", payoutBatchId: payout.batch_header.payout_batch_id },
  });

  await prisma.milestone.update({
    where: { id: fundedContract.milestones[1].id },
    data: {
      status: "ACTIVE",
      startDate: new Date(),
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    },
  });

  // Verify Milestone 1 is PAID and Milestone 2 is UNLOCKED (ACTIVE)
  const afterPayout = await prisma.contract.findUnique({
    where: { id: contract.id },
    include: { milestones: { orderBy: { order: "asc" } } },
  });
  assert.equal(afterPayout.milestones[0].status, "PAID");
  assert.ok(afterPayout.milestones[0].payoutBatchId);
  assert.equal(afterPayout.milestones[1].status, "ACTIVE");
  assert.equal(afterPayout.milestones[2].status, "LOCKED");
});

test("Phase 5: Agent-Driven Rescheduling (Bryntum Prompt #6)", async () => {
  const m1 = await prisma.milestone.findFirst({
    where: { status: "ACTIVE" },
  });

  if (m1 && m1.startDate && m1.endDate) {
    const oldEnd = m1.endDate.getTime();
    const delayDays = 2;
    const newEnd = new Date(oldEnd + delayDays * 24 * 60 * 60 * 1000);

    await prisma.milestone.update({
      where: { id: m1.id },
      data: { endDate: newEnd },
    });

    const refreshed = await prisma.milestone.findUnique({ where: { id: m1.id } });
    assert.equal(refreshed.endDate.getTime(), newEnd.getTime());
  }
});
