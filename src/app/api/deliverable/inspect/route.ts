import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { crawlDeliverableUrl } from "@/lib/inspector";
import { auditDeliverableWithAI } from "@/lib/gemini";
import { executePayPalPayout } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contractId, milestoneId, submittedUrl, notes } = body;

    if (!contractId || !milestoneId || !submittedUrl) {
      return NextResponse.json(
        { error: "contractId, milestoneId, and submittedUrl are required" },
        { status: 400 }
      );
    }

    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        milestones: {
          include: { criteria: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    const milestone = contract.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
    }

    // Step 1: Deterministic Crawl of preview URL
    const crawlData = await crawlDeliverableUrl(submittedUrl);

    // Step 2: Agent 2 AI Audit against contractual criteria
    const inspectionResult = await auditDeliverableWithAI({
      milestoneTitle: milestone.title,
      criteria: milestone.criteria.map((c) => ({
        id: c.id,
        text: c.text,
        isAutomated: c.isAutomated,
      })),
      crawlData,
      submittedUrl,
      notes,
    });

    // Step 3: Record inspection record in SQLite
    const inspection = await prisma.deliverableInspection.create({
      data: {
        milestoneId,
        submittedUrl,
        notes: notes || null,
        status: inspectionResult.status,
        confidence: inspectionResult.confidence,
        rawReport: JSON.stringify(inspectionResult),
      },
    });

    // Step 4: Update individual criteria evidence
    for (const audit of inspectionResult.criteriaAudits) {
      await prisma.criterion.update({
        where: { id: audit.id },
        data: {
          passed: audit.passed,
          evidence: audit.evidence,
        },
      });
    }

    let payoutResult = null;
    let nextMilestoneUnlocked = null;

    // Step 5: Autonomous Financial Disbursement
    if (inspectionResult.status === "PASSED") {
      const senderBatchId = `BATCH_${contract.id.slice(0, 8)}_${milestone.id.slice(0, 8)}_${Date.now()}`;

      payoutResult = await executePayPalPayout({
        recipientEmail: contract.freelancerEmail,
        amount: milestone.amount,
        currency: contract.currency,
        milestoneTitle: milestone.title,
        senderBatchId,
        milestoneId: milestone.id,
      });

      const batchId = payoutResult?.batch_header?.payout_batch_id || `BATCH_${Date.now()}`;

      // Mark milestone PAID
      await prisma.milestone.update({
        where: { id: milestone.id },
        data: {
          status: "PAID",
          payoutBatchId: batchId,
        },
      });

      // Unlock next milestone if present
      const nextMilestone = contract.milestones.find((m) => m.order === milestone.order + 1);
      if (nextMilestone) {
        nextMilestoneUnlocked = await prisma.milestone.update({
          where: { id: nextMilestone.id },
          data: {
            status: "ACTIVE",
            startDate: new Date(),
            endDate: new Date(Date.now() + nextMilestone.durationDays * 24 * 60 * 60 * 1000),
          },
        });
      } else {
        // All milestones paid! Contract completed!
        await prisma.contract.update({
          where: { id: contract.id },
          data: { status: "COMPLETED" },
        });
      }
    } else {
      // Flagged for human review -> start 72-hour Silence-Means-Yes countdown
      const deadline = new Date(Date.now() + 72 * 60 * 60 * 1000);
      await prisma.milestone.update({
        where: { id: milestone.id },
        data: {
          status: "IN_REVIEW",
          reviewDeadline: deadline,
        },
      });
    }

    // Return fresh contract state
    const refreshedContract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        milestones: {
          include: { criteria: true, inspections: { orderBy: { createdAt: "desc" } } },
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      inspection,
      inspectionResult,
      crawlData,
      payoutResult,
      nextMilestoneUnlocked,
      contract: refreshedContract,
    });
  } catch (error: unknown) {
    console.error("[Deliverable Inspection Error]", error);
    const message = error instanceof Error ? error.message : "Inspection failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

