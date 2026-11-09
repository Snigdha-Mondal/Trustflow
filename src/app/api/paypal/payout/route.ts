import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { executePayPalPayout } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contractId, milestoneId, note = "Client Approved Release" } = body;

    if (!contractId || !milestoneId) {
      return NextResponse.json(
        { error: "contractId and milestoneId are required" },
        { status: 400 }
      );
    }

    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        milestones: {
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

    if (milestone.status === "PAID") {
      return NextResponse.json({ error: "Milestone has already been paid" }, { status: 400 });
    }

    const senderBatchId = `MANUAL_BATCH_${contract.id.slice(0, 8)}_${milestone.id.slice(0, 8)}_${Date.now()}`;

    const payoutResult = await executePayPalPayout({
      recipientEmail: contract.freelancerEmail,
      amount: milestone.amount,
      currency: contract.currency,
      milestoneTitle: milestone.title,
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

    const refreshedContract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        milestones: {
          include: { criteria: true },
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      payoutResult,
      contract: refreshedContract,
    });
  } catch (error: unknown) {
    console.error("[PayPal Payout API Error]", error);
    const message = error instanceof Error ? error.message : "Payout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

