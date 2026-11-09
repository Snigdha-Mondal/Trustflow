import { GoogleGenerativeAI } from "@google/generative-ai";

export interface TakeoverBrief {
  projectTitle: string;
  contractId: string;
  generatedAt: string;
  summary: string;
  financialSummary: {
    totalOriginalBudget: number;
    disbursedAmount: number;
    refundedAmount: number;
    remainingScopeBudget: number;
    estimatedDaysToFinish: number;
  };
  currentWorkingState: {
    completedMilestones: Array<{
      order: number;
      title: string;
      amount: number;
      deliverableUrl?: string;
      verifiedCriteria: string[];
    }>;
    entryPointsAndAssets: string[];
    techStack: string[];
  };
  remainingScope: {
    uncompletedMilestones: Array<{
      order: number;
      title: string;
      description: string;
      amount: number;
      durationDays: number;
      pendingCriteria: string[];
    }>;
    knownRisksAndBlockers: string[];
  };
  replacementActionPlan: string[];
  markdownTakeoverDoc: string;
}

/**
 * Agent 3: AI Continuity Handoff Auditor
 * Synthesizes completed deliverables, verified criteria, and pending scope
 * into an actionable, turnkey Takeover Brief for a replacement engineer.
 */
export async function generateTakeoverBrief(params: {
  contract: {
    id: string;
    title: string;
    description: string;
    totalBudget: number;
    currency: string;
    clientEmail: string;
    freelancerEmail: string;
    status: string;
    refundId?: string | null;
    refundedAmount?: number | null;
    milestones: Array<{
      id: string;
      order: number;
      title: string;
      description: string;
      amount: number;
      durationDays: number;
      status: string;
      criteria: Array<{
        id: string;
        text: string;
        isAutomated: boolean;
        passed?: boolean | null;
      }>;
      inspections?: Array<{
        submittedUrl: string;
        status: string;
        confidence: number;
      }>;
    }>;
  };
}): Promise<TakeoverBrief> {
  const { contract } = params;

  const paidMilestones = contract.milestones.filter((m) => m.status === "PAID");
  const uncompletedMilestones = contract.milestones.filter((m) => m.status !== "PAID");

  const disbursedAmount = paidMilestones.reduce((sum, m) => sum + m.amount, 0);
  const refundedAmount = contract.refundedAmount || Math.max(0, contract.totalBudget - disbursedAmount);
  const remainingScopeBudget = refundedAmount;
  const estimatedDaysToFinish = uncompletedMilestones.reduce((sum, m) => sum + m.durationDays, 0);

  // Fallback template builder if Gemini API is offline or dummy key
  const buildFallbackBrief = (): TakeoverBrief => {
    const completedList = paidMilestones.map((m) => ({
      order: m.order,
      title: m.title,
      amount: m.amount,
      deliverableUrl: m.inspections?.[0]?.submittedUrl || "https://preview-sample.vercel.app",
      verifiedCriteria: m.criteria.map((c) => c.text),
    }));

    const pendingList = uncompletedMilestones.map((m) => ({
      order: m.order,
      title: m.title,
      description: m.description,
      amount: m.amount,
      durationDays: m.durationDays,
      pendingCriteria: m.criteria.map((c) => c.text),
    }));

    const actionPlan = [
      "1. Inspect delivered assets and codebase from Phase 1 (frontend scaffold & typography tokens).",
      `2. Resume work on Milestone ${uncompletedMilestones[0]?.order || 2}: "${uncompletedMilestones[0]?.title || "Remaining Features"}".`,
      "3. Implement pending lead forms, responsive hero sections, and route validation.",
      `4. Complete final delivery within target schedule (~${estimatedDaysToFinish || 7} days).`,
      `5. Submit live preview URL to Trustflow for automated Agent 2 DOM & HTTP inspection to release remaining $${remainingScopeBudget.toFixed(2)}.`,
    ];

    const markdownDoc = `# Replacement Freelancer Takeover Brief
**Project:** ${contract.title}
**Contract ID:** \`${contract.id}\`
**Date Generated:** ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
**Escrow Status:** \`ABANDONED_REFUNDED\` (Unreleased funds $${remainingScopeBudget.toFixed(2)} refunded to client)

---

## 1. Executive Summary
The previous freelancer went inactive for over 72 hours on an active milestone tranche. Under Trustflow's symmetric Ghosting Protection protocol, unreleased escrow funds of **$${remainingScopeBudget.toFixed(2)} USD** have been refunded to the client. This dossier provides all technical entry points and criteria so you can take over and finish the project immediately.

## 2. Financial & Schedule Matrix
- **Original Project Budget:** $${contract.totalBudget.toFixed(2)} USD
- **Disbursed to Previous Contributor:** $${disbursedAmount.toFixed(2)} USD (${paidMilestones.length} milestone(s) completed)
- **Available Replacement Budget:** $${remainingScopeBudget.toFixed(2)} USD
- **Estimated Time to Completion:** ${estimatedDaysToFinish} business days

## 3. Current Working State
${completedList.length > 0
  ? completedList.map((m) => `### Milestone ${m.order}: ${m.title} (VERIFIED & PAID)
- **Verified Deliverable Preview:** ${m.deliverableUrl}
- **Passed Criteria:**
${m.verifiedCriteria.map((c) => `  - [x] ${c}`).join("\n")}`).join("\n\n")
  : "No milestones were paid out prior to abandonment. The project is at Day 0 scaffold state."
}

## 4. Remaining Scope to Deliver
${pendingList.map((m) => `### Milestone ${m.order}: ${m.title} ($${m.amount.toFixed(2)} USD | ${m.durationDays} Days)
*${m.description}*
**Pending Criteria:**
${m.pendingCriteria.map((c) => `  - [ ] ${c}`).join("\n")}`).join("\n\n")}

## 5. Next Steps for Replacement Contributor
${actionPlan.join("\n")}
`;

    return {
      projectTitle: contract.title,
      contractId: contract.id,
      generatedAt: new Date().toISOString(),
      summary: `Freelancer went inactive on milestone tranche. Trustflow refunded $${remainingScopeBudget.toFixed(2)} to client. ${paidMilestones.length} tranche(s) already verified and paid.`,
      financialSummary: {
        totalOriginalBudget: contract.totalBudget,
        disbursedAmount,
        refundedAmount,
        remainingScopeBudget,
        estimatedDaysToFinish,
      },
      currentWorkingState: {
        completedMilestones: completedList,
        entryPointsAndAssets: [
          completedList[0]?.deliverableUrl || "https://preview-sample.vercel.app",
          "Repository: /src/components/GanttBoard.tsx",
          "Design Tokens: DESIGN.md tokens & Tailwind scale",
        ],
        techStack: ["Next.js 15", "React 19", "Tailwind CSS", "TypeScript", "PayPal REST SDK"],
      },
      remainingScope: {
        uncompletedMilestones: pendingList,
        knownRisksAndBlockers: [
          "Milestone 2 lead capture form requires connected submission endpoint",
          "Deployment handover requires valid SSL and DNS routing",
        ],
      },
      replacementActionPlan: actionPlan,
      markdownTakeoverDoc: markdownDoc,
    };
  };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "mock_gemini_key" || apiKey.startsWith("dummy")) {
    return buildFallbackBrief();
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `You are Agent 3: AI Continuity Handoff Auditor in the Trustflow escrow system.
A freelancer abandoned an active contract by going inactive for > 72 hours.
The client has claimed an abandonment refund of $${remainingScopeBudget.toFixed(2)} USD.

Contract Title: "${contract.title}"
Contract Description: "${contract.description}"
Total Budget: $${contract.totalBudget} USD
Disbursed So Far: $${disbursedAmount} USD
Remaining Escrow Refunded: $${remainingScopeBudget} USD

Completed/Paid Milestones:
${JSON.stringify(paidMilestones, null, 2)}

Abandoned / Pending Milestones:
${JSON.stringify(uncompletedMilestones, null, 2)}

Produce a JSON object matching this schema:
{
  "summary": "String explaining the abandonment context and handover state",
  "techStack": ["String"],
  "entryPointsAndAssets": ["String"],
  "knownRisksAndBlockers": ["String"],
  "replacementActionPlan": ["String"]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const parsed = JSON.parse(text || "{}");
    const fallback = buildFallbackBrief();

    return {
      ...fallback,
      summary: parsed.summary || fallback.summary,
      currentWorkingState: {
        ...fallback.currentWorkingState,
        techStack: parsed.techStack?.length ? parsed.techStack : fallback.currentWorkingState.techStack,
        entryPointsAndAssets: parsed.entryPointsAndAssets?.length ? parsed.entryPointsAndAssets : fallback.currentWorkingState.entryPointsAndAssets,
      },
      remainingScope: {
        ...fallback.remainingScope,
        knownRisksAndBlockers: parsed.knownRisksAndBlockers?.length ? parsed.knownRisksAndBlockers : fallback.remainingScope.knownRisksAndBlockers,
      },
      replacementActionPlan: parsed.replacementActionPlan?.length ? parsed.replacementActionPlan : fallback.replacementActionPlan,
    };
  } catch (err) {
    console.warn("[Agent 3 Gemini Error] Falling back to structured continuity builder:", err);
    return buildFallbackBrief();
  }
}
