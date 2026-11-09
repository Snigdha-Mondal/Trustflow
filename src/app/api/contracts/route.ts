import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const contracts = await prisma.contract.findMany({
      include: {
        milestones: {
          include: {
            criteria: true,
            inspections: true,
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, contracts });
  } catch (error: unknown) {
    console.error("[Contracts GET Error]", error);
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      totalBudget,
      currency = "USD",
      clientEmail,
      freelancerEmail,
      milestones,
    } = body;

    if (!title || !clientEmail || !freelancerEmail) {
      return NextResponse.json(
        { error: "Title, client email, and freelancer email are required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(milestones) || milestones.length === 0) {
      return NextResponse.json(
        { error: "Contract must have at least one milestone." },
        { status: 400 }
      );
    }

    const budgetNum = Number(totalBudget);
    const calculatedSum = milestones.reduce((sum: number, m: { amount: number }) => sum + Number(m.amount || 0), 0);
    if (Math.abs(calculatedSum - budgetNum) > 0.05) {
      return NextResponse.json(
        { error: `Milestone sum ($${calculatedSum.toFixed(2)}) must match total budget ($${budgetNum.toFixed(2)}).` },
        { status: 400 }
      );
    }

    // Create contract and nested milestones with atomic Prisma transaction
    const contract = await prisma.contract.create({
      data: {
        title: title.trim(),
        description: (description || "").trim(),
        totalBudget: budgetNum,
        currency,
        clientEmail: clientEmail.trim().toLowerCase(),
        freelancerEmail: freelancerEmail.trim().toLowerCase(),
        status: "DRAFT",
        milestones: {
          create: milestones.map((m: {
            order: number;
            title: string;
            description?: string;
            amount: number;
            durationDays: number;
            criteria: { text: string; isAutomated: boolean }[];
          }, index: number) => ({
            order: m.order || index + 1,
            title: m.title.trim(),
            description: (m.description || "").trim(),
            amount: Number(m.amount),
            durationDays: Number(m.durationDays) || 3,
            status: "LOCKED",
            criteria: {
              create: (m.criteria || []).map((c) => ({
                text: c.text.trim(),
                isAutomated: !!c.isAutomated,
              })),
            },
          })),
        },
      },
      include: {
        milestones: {
          include: { criteria: true },
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({ success: true, contract });
  } catch (error: unknown) {
    console.error("[Contracts POST Error]", error);
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
