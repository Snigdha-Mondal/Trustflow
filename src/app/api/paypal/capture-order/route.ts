import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { capturePayPalOrder } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contractId, orderId } = body;

    if (!contractId || !orderId) {
      return NextResponse.json(
        { error: "contractId and orderId are required" },
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

    const captureResult = await capturePayPalOrder(orderId);

    // Calculate sequential Gantt schedule dates
    const now = new Date();
    let rollingDate = new Date(now);

    const updatedMilestonesPromises = contract.milestones.map((milestone, idx) => {
      const startDate = new Date(rollingDate);
      const endDate = new Date(startDate.getTime() + milestone.durationDays * 24 * 60 * 60 * 1000);
      rollingDate = new Date(endDate);

      return prisma.milestone.update({
        where: { id: milestone.id },
        data: {
          status: idx === 0 ? "ACTIVE" : "LOCKED",
          startDate,
          endDate,
        },
      });
    });

    await Promise.all(updatedMilestonesPromises);

    const updatedContract = await prisma.contract.update({
      where: { id: contractId },
      data: {
        status: "FUNDED",
        paypalCaptureId: captureResult.captureId || captureResult.id || `CAP_${Date.now()}`,
      },
      include: {
        milestones: {
          include: { criteria: true },
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      contract: updatedContract,
      capture: captureResult,
    });
  } catch (error: unknown) {
    console.error("[PayPal Capture Order Error]", error);
    const message = error instanceof Error ? error.message : "Failed to capture PayPal order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
