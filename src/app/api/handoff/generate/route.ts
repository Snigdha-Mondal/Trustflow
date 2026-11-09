import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateTakeoverBrief } from "@/lib/handoff";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contractId, forceRefresh } = body;

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
          include: {
            criteria: true,
            inspections: {
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: `Contract not found with id: ${contractId}` },
        { status: 404 }
      );
    }

    // If already generated and not forcing refresh, return existing brief
    if (contract.handoffDossier && !forceRefresh) {
      try {
        const cachedBrief = JSON.parse(contract.handoffDossier);
        return NextResponse.json({
          success: true,
          cached: true,
          takeoverBrief: cachedBrief,
          contractId: contract.id,
        });
      } catch {
        // Fall through to re-generate if cached JSON is malformed
      }
    }

    // Generate Turnkey Takeover Brief with Agent 3 AI continuity auditor
    const takeoverBrief = await generateTakeoverBrief({
      contract: {
        id: contract.id,
        title: contract.title,
        description: contract.description,
        totalBudget: contract.totalBudget,
        currency: contract.currency,
        clientEmail: contract.clientEmail,
        freelancerEmail: contract.freelancerEmail,
        status: contract.status,
        refundId: contract.refundId,
        refundedAmount: contract.refundedAmount,
        milestones: contract.milestones.map((m) => ({
          id: m.id,
          order: m.order,
          title: m.title,
          description: m.description,
          amount: m.amount,
          durationDays: m.durationDays,
          status: m.status,
          criteria: m.criteria.map((c) => ({
            id: c.id,
            text: c.text,
            isAutomated: c.isAutomated,
            passed: c.passed,
          })),
          inspections: m.inspections?.map((ins) => ({
            submittedUrl: ins.submittedUrl,
            status: ins.status,
            confidence: ins.confidence,
          })),
        })),
      },
    });

    // Save dossier to SQLite contract record
    await prisma.contract.update({
      where: { id: contract.id },
      data: {
        handoffDossier: JSON.stringify(takeoverBrief),
      },
    });

    return NextResponse.json({
      success: true,
      takeoverBrief,
      contractId: contract.id,
    });
  } catch (err: any) {
    console.error("[Agent 3 Handoff Route Error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate AI takeover brief" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const contractId = searchParams.get("contractId");

    if (!contractId) {
      return NextResponse.json({ error: "Missing contractId" }, { status: 400 });
    }

    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      select: { id: true, handoffDossier: true, status: true, refundId: true, refundedAmount: true },
    });

    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    if (!contract.handoffDossier) {
      return NextResponse.json({ success: false, message: "No handoff dossier generated yet" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      takeoverBrief: JSON.parse(contract.handoffDossier),
      contractId: contract.id,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to retrieve brief" }, { status: 500 });
  }
}
