import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        milestones: {
          include: {
            criteria: true,
            inspections: {
              orderBy: { createdAt: "desc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    const paidAmount = contract.milestones
      .filter((m) => m.status === "PAID")
      .reduce((sum, m) => sum + m.amount, 0);

    const inReviewAmount = contract.milestones
      .filter((m) => m.status === "IN_REVIEW")
      .reduce((sum, m) => sum + m.amount, 0);

    const activeAmount = contract.milestones
      .filter((m) => m.status === "ACTIVE")
      .reduce((sum, m) => sum + m.amount, 0);

    const lockedAmount = contract.milestones
      .filter((m) => m.status === "LOCKED")
      .reduce((sum, m) => sum + m.amount, 0);

    return NextResponse.json({
      success: true,
      contract,
      stats: {
        paidAmount,
        inReviewAmount,
        activeAmount,
        lockedAmount,
        totalBudget: contract.totalBudget,
        currency: contract.currency,
      },
    });
  } catch (error: unknown) {
    console.error("[Contract GET Error]", error);
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
