import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { executePayPalPayout } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contractId, milestoneId, force = false } = body;

    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: { milestones: true },
    });

    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    const milestone = contract.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
    }

    if (milestone.status !== "IN_REVIEW") {
      return NextResponse.json({ error: "Milestone is not currently in client review" }, { status: 400 });
    }

    const now = new Date();
    const isExpired = milestone.reviewDeadline ? milestone.reviewDeadline <= now : false;

    if (!isExpired && !force) {
      return NextResponse.json({
        error: "72-Hour review deadline has not yet expired",
        reviewDeadline: milestone.reviewDeadline,
      }, { status: 400 });
    }

    // Auto-release triggered under "Silence Means Yes" rule
    const senderBatchId = `AUTORELEASE_BATCH_${contract.id.slice(0, 8)}_${milestone.id.slice(0, 8)}_${Date.now()}`;

    const payoutResult = await executePayPalPayout({
      recipientEmail: contract.freelancerEmail,
      amount: milestone.amount,
      currency: contract.currency,
      milestoneTitle: `${milestone.title} (72h Auto-Release)`,
      senderBatchId,
      milestoneId: milestone.id,
    });

    const batchId = payoutResult?.batch_header?.payout_batch_id || `BATCH_${Date.now()}`;

    await prisma.milestone.update({
      where: { id: milestone.id },
      data: {
        status: "PAID",
        payoutBatchId: batchId,
      },
    });

    // Unlock next milestone if exists
    const nextMilestone = contract.milestones.find((m) => m.order === milestone.order + 1);
    if (nextMilestone) {
      await prisma.milestone.update({
        where: { id: nextMilestone.id },
        data: {
          status: "ACTIVE",
          startDate: new Date(),
          endDate: new Date(Date.now() + nextMilestone.durationDays * 24 * 60 * 60 * 1000),
        },
      });
    } else {
      await prisma.contract.update({
        where: { id: contract.id },
        data: { status: "COMPLETED" },
      });
    }

    const refreshed = await prisma.contract.findUnique({
      where: { id: contractId },
      include: { milestones: { include: { criteria: true }, orderBy: { order: "asc" } } },
    });

    return NextResponse.json({
      success: true,
      message: "Milestone auto-released under 72-Hour Silence Means Yes guarantee.",
      contract: refreshed,
      payoutResult,
    });
  } catch (error: unknown) {
    console.error("[Auto-Release API Error]", error);
    const message = error instanceof Error ? error.message : "Auto-release failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
