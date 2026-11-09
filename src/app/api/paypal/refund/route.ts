import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { refundPayPalCapture } from "@/lib/paypal";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contractId, milestoneId, reason } = body;

    if (!contractId) {
      return NextResponse.json(
        { error: "Missing required contractId parameter" },
        { status: 400 }
      );
    }

    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        milestones: {
          orderBy: { order: "asc" },
          include: { criteria: true },
        },
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: `Contract not found with id: ${contractId}` },
        { status: 404 }
      );
    }

    if (contract.status === "ABANDONED_REFUNDED") {
      return NextResponse.json(
        { error: "Contract has already been refunded for abandonment." },
        { status: 400 }
      );
    }

    if (contract.status === "DRAFT") {
      return NextResponse.json(
        { error: "Cannot refund draft contract — escrow has not been funded yet." },
        { status: 400 }
      );
    }

    const captureId = contract.paypalCaptureId || `CAPTURE_SIM_${contract.id}`;

    // Calculate unreleased balance: only refund milestones that have NOT been paid out
    const paidMilestones = contract.milestones.filter((m) => m.status === "PAID");
    const paidAmount = paidMilestones.reduce((acc, m) => acc + m.amount, 0);
    const unreleasedMilestones = contract.milestones.filter((m) => m.status !== "PAID");
    const unreleasedAmount = Math.max(0, contract.totalBudget - paidAmount);

    if (unreleasedAmount <= 0) {
      return NextResponse.json(
        { error: "No unreleased escrow balance remaining to refund. All milestones have already been paid." },
        { status: 400 }
      );
    }

    // Execute PayPal Refund
    const refundNote = reason || `Trustflow Inactivity Refund: Freelancer abandoned milestone overdue > 72h. Refunding remaining $${unreleasedAmount.toFixed(2)} to client.`;
    const refundResult = await refundPayPalCapture({
      captureId,
      amount: unreleasedAmount,
      currency: contract.currency || "USD",
      noteReason: refundNote,
    });

    // Mark unreleased milestones as ABANDONED in database
    await prisma.milestone.updateMany({
      where: {
        contractId: contract.id,
        status: { not: "PAID" },
      },
      data: {
        status: "ABANDONED",
      },
    });

    // Update contract status and record refund details
    const updatedContract = await prisma.contract.update({
      where: { id: contract.id },
      data: {
        status: "ABANDONED_REFUNDED",
        refundId: refundResult.id,
        refundedAmount: unreleasedAmount,
      },
      include: {
        milestones: {
          orderBy: { order: "asc" },
          include: { criteria: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      contractId: updatedContract.id,
      status: updatedContract.status,
      refundId: refundResult.id,
      refundedAmount: unreleasedAmount,
      paidAmount,
      currency: updatedContract.currency,
      abandonedMilestonesCount: unreleasedMilestones.length,
      refundReceipt: {
        refundId: refundResult.id,
        captureId,
        amount: unreleasedAmount,
        currency: updatedContract.currency,
        recipient: contract.clientEmail,
        timestamp: new Date().toISOString(),
        note: refundNote,
      },
    });
  } catch (err: any) {
    console.error("[PayPal Refund Route Error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process abandonment refund" },
      { status: 500 }
    );
  }
}
