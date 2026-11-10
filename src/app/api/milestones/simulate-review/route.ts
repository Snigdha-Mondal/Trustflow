import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contractId, milestoneId } = body;

    if (!contractId || !milestoneId) {
      return NextResponse.json({ error: "contractId and milestoneId are required" }, { status: 400 });
    }

    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: { milestones: { orderBy: { order: "asc" } } },
    });

    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    const milestone = contract.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
    }

    // Set milestone to IN_REVIEW with a 72-hour review deadline
    const reviewDeadline = new Date(Date.now() + 72 * 60 * 60 * 1000);
    await prisma.milestone.update({
      where: { id: milestone.id },
      data: {
        status: "IN_REVIEW",
        reviewDeadline,
      },
    });

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
      message: 'Milestone transitioned to IN_REVIEW with 72-Hour "Silence Means Yes" countdown active.',
      contract: refreshedContract,
      reviewDeadline,
    });
  } catch (error: any) {
    console.error("[Simulate Review Error]", error);
    return NextResponse.json({ error: error.message || "Failed to enter review state" }, { status: 500 });
  }
}
