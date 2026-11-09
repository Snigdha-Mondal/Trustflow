import { NextRequest, NextResponse } from "next/server";
import { generateMilestonesFromBrief } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brief, totalBudget = 900, currency = "USD" } = body;

    if (!brief || typeof brief !== "string" || brief.trim().length < 5) {
      return NextResponse.json(
        { error: "Brief must be a descriptive string of at least 5 characters." },
        { status: 400 }
      );
    }

    const budgetNum = Number(totalBudget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      return NextResponse.json(
        { error: "Total budget must be a positive number." },
        { status: 400 }
      );
    }

    const plan = await generateMilestonesFromBrief(brief.trim(), budgetNum, currency);
    return NextResponse.json({ success: true, plan });
  } catch (error: unknown) {
    console.error("[Scope Clarifier API Error]", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

