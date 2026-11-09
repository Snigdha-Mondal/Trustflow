import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contractId, delayDays = 2 } = body;

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

    // Shift dates for non-PAID milestones
    const msInDelay = Number(delayDays) * 24 * 60 * 60 * 1000;

    for (const milestone of contract.milestones) {
      if (milestone.status !== "PAID" && milestone.startDate && milestone.endDate) {
        const newStart = new Date(milestone.startDate.getTime() + msInDelay);
        const newEnd = new Date(milestone.endDate.getTime() + msInDelay);
        await prisma.milestone.update({
          where: { id: milestone.id },
          data: {
            startDate: newStart,
            endDate: newEnd,
          },
        });
      }
    }

    const refreshed = await prisma.contract.findUnique({
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
      message: `Bryntum Gantt schedule recalculated: shifted downstream milestones by ${delayDays} days.`,
      contract: refreshed,
    });
  } catch (error: unknown) {
    console.error("[Gantt Reschedule Error]", error);
    const message = error instanceof Error ? error.message : "Reschedule failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
