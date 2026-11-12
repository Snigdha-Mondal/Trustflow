"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Bot,
  User,
  Plus,
  Trash2,
  AlertCircle,
  ChevronLeft,
  RotateCcw,
  Sliders,
} from "lucide-react";

interface CriterionDraft {
  id: string;
  text: string;
  isAutomated: boolean;
}

interface MilestoneDraft {
  order: number;
  title: string;
  description: string;
  amount: number | string;
  durationDays: number | string;
  criteria: CriterionDraft[];
}

const TEMPLATES = [
  {
    label: "SaaS Marketing Website",
    brief: "Build a modern responsive Next.js marketing website with dynamic pricing tables, feature comparison grid, customer testimonials, and an interactive contact lead form with email validation.",
    budget: 900,
    milestones: [
      {
        order: 1,
        title: "Design System, Wireframes & Scaffold",
        description: "Establish Tailwind tokens adhering to DESIGN.md, scaffold Next.js repository, and complete desktop/mobile wireframes.",
        amount: 270,
        durationDays: 3,
        criteria: [
          { id: "c1_1", text: "Design system tokens match specified typography and spacing scale", isAutomated: false },
          { id: "c1_2", text: "Desktop & mobile responsive layouts completed", isAutomated: false },
          { id: "c1_3", text: "Project repository scaffolded with Next.js and TypeScript", isAutomated: true },
        ],
      },
      {
        order: 2,
        title: "Core Frontend & Interactive Components",
        description: "Implement responsive hero, pricing calculator, and contact lead form with live API validation.",
        amount: 360,
        durationDays: 4,
        criteria: [
          { id: "c2_1", text: "Live URL returns HTTP 200 on /, /pricing, and /contact", isAutomated: true },
          { id: "c2_2", text: "Page contains contact form with email validation input", isAutomated: true },
          { id: "c2_3", text: "Responsive viewport meta tag verified with no horizontal overflow", isAutomated: true },
          { id: "c2_4", text: "Client aesthetic and brand approval", isAutomated: false },
        ],
      },
      {
        order: 3,
        title: "Production Deployment, Testing & Handover",
        description: "Production domain launch, SSL setup, end-to-end smoke verification, and repository transfer.",
        amount: 270,
        durationDays: 3,
        criteria: [
          { id: "c3_1", text: "Production preview URL live with valid HTTPS certificate", isAutomated: true },
          { id: "c3_2", text: "Zero critical console errors on page load", isAutomated: true },
          { id: "c3_3", text: "Repository README includes complete local setup and deployment steps", isAutomated: true },
        ],
      },
    ],
  },
  {
    label: "AI Automation Pipeline",
    brief: "Develop an autonomous webhook ingestion service in Node.js that parses PDF client briefs, executes Gemini AI summary tasks, and delivers webhooks with 99.9% uptime and payload validation.",
    budget: 1200,
    milestones: [
      {
        order: 1,
        title: "Architecture Spec & Webhook Ingestion API",
        description: "Scaffold Node.js/TypeScript microservice, define JSON schemas, and configure incoming webhook endpoints.",
        amount: 360,
        durationDays: 3,
        criteria: [
          { id: "c1_1", text: "Webhook receiver live returning HTTP 200 on health check", isAutomated: true },
          { id: "c1_2", text: "Payload schema validation rejects malformed JSON bodies with HTTP 400", isAutomated: true },
          { id: "c1_3", text: "Architecture diagram and webhook event schema approved by client", isAutomated: false },
        ],
      },
      {
        order: 2,
        title: "Gemini AI Parsing & Extraction Pipeline",
        description: "Integrate Google GenAI SDK to parse incoming payloads and produce structured summaries.",
        amount: 480,
        durationDays: 5,
        criteria: [
          { id: "c2_1", text: "Gemini AI model parses PDF documents into structured JSON schema", isAutomated: true },
          { id: "c2_2", text: "Automated retry mechanism handling API rate limits with exponential backoff", isAutomated: true },
          { id: "c2_3", text: "Sample extraction benchmark accuracy >= 95% verified", isAutomated: false },
        ],
      },
      {
        order: 3,
        title: "Production Deployment, Monitoring & Handover",
        description: "Deploy to cloud container with uptime monitoring, secret rotation, and API documentation.",
        amount: 360,
        durationDays: 4,
        criteria: [
          { id: "c3_1", text: "Cloud worker deployed with HTTPS endpoint and health check", isAutomated: true },
          { id: "c3_2", text: "End-to-end webhook delivery latency under 3000ms", isAutomated: true },
          { id: "c3_3", text: "Documentation runbook with environment variable instructions", isAutomated: true },
        ],
      },
    ],
  },
  {
    label: "Next.js + Supabase Full-Stack MVP",
    brief: "Create an MVP web application with Supabase authentication, user profile management, protected dashboard route, and Stripe/PayPal payment checkout integration.",
    budget: 1500,
    milestones: [
      {
        order: 1,
        title: "Database Schema, Auth & App Scaffold",
        description: "Configure Supabase PostgreSQL, row-level security (RLS), Next.js 15 App Router scaffold, and auth flows.",
        amount: 450,
        durationDays: 4,
        criteria: [
          { id: "c1_1", text: "Supabase auth configured for email/password and social login", isAutomated: true },
          { id: "c1_2", text: "Database migrations committed with Row Level Security enabled", isAutomated: true },
          { id: "c1_3", text: "Wireframes and database entity diagram reviewed by client", isAutomated: false },
        ],
      },
      {
        order: 2,
        title: "Protected Dashboard & Core Application Features",
        description: "Build protected user dashboard, CRUD data tables, user profile settings, and responsive layout.",
        amount: 600,
        durationDays: 6,
        criteria: [
          { id: "c2_1", text: "Protected dashboard route redirects unauthenticated users to /login", isAutomated: true },
          { id: "c2_2", text: "Interactive data management table with live create/read/update/delete operations", isAutomated: true },
          { id: "c2_3", text: "Client UI review and user experience sign-off", isAutomated: false },
        ],
      },
      {
        order: 3,
        title: "Payment Checkout, Production Launch & Handover",
        description: "Integrate payment checkout, deploy to production hosting with custom domain and SSL, and transfer repository.",
        amount: 450,
        durationDays: 4,
        criteria: [
          { id: "c3_1", text: "Live PayPal checkout flow captures order and updates subscription status", isAutomated: true },
          { id: "c3_2", text: "Production preview URL live with valid HTTPS and 0 console errors", isAutomated: true },
          { id: "c3_3", text: "Clean repository transfer with environment secrets and local setup instructions", isAutomated: true },
        ],
      },
    ],
  },
];

export default function WizardPage() {
  const router = useRouter();

  // Intake state
  const [brief, setBrief] = useState(TEMPLATES[0].brief);
  const [totalBudget, setTotalBudget] = useState<number | string>(TEMPLATES[0].budget);
  const [clientEmail, setClientEmail] = useState("founder.sarah@startup.io");
  const [freelancerEmail, setFreelancerEmail] = useState("alex.dev@engineer.net");

  // AI Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generated Plan State
  const [projectTitle, setProjectTitle] = useState("SaaS Marketing Website & Lead Funnel");
  const [milestones, setMilestones] = useState<MilestoneDraft[]>(
    JSON.parse(JSON.stringify(TEMPLATES[0].milestones))
  );

  // Milestone Math Validation
  const budgetNum = Math.max(0, parseFloat(String(totalBudget)) || 0);
  const calculatedSum = Math.round(
    milestones.reduce((sum, m) => sum + (parseFloat(String(m.amount)) || 0), 0) * 100
  ) / 100;
  const isBudgetBalanced = budgetNum > 0 && Math.abs(calculatedSum - budgetNum) < 0.01;

  async function handleGeneratePlan() {
    if (!brief.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/milestones/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief, totalBudget: budgetNum, currency: "USD" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate milestones");
      }

      setProjectTitle(data.plan.title);
      setMilestones(data.plan.milestones);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error generating milestone plan");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleMilestoneAmountChange(index: number, newAmount: number | string) {
    setMilestones((prev) =>
      prev.map((m, i) => (i === index ? { ...m, amount: newAmount } : m))
    );
  }

  function handleMilestoneDurationChange(index: number, newDays: number | string) {
    setMilestones((prev) =>
      prev.map((m, i) => (i === index ? { ...m, durationDays: newDays } : m))
    );
  }

  function handleMilestoneTitleChange(index: number, newTitle: string) {
    setMilestones((prev) =>
      prev.map((m, i) => (i === index ? { ...m, title: newTitle } : m))
    );
  }

  function handleMilestoneDescriptionChange(index: number, newDesc: string) {
    setMilestones((prev) =>
      prev.map((m, i) => (i === index ? { ...m, description: newDesc } : m))
    );
  }

  function handleCriterionTextChange(mIdx: number, cIdx: number, newText: string) {
    setMilestones((prev) =>
      prev.map((m, i) => {
        if (i !== mIdx) return m;
        const newCriteria = m.criteria.map((c, j) =>
          j === cIdx ? { ...c, text: newText } : c
        );
        return { ...m, criteria: newCriteria };
      })
    );
  }

  function handleToggleCriterionAutomated(mIdx: number, cIdx: number) {
    setMilestones((prev) =>
      prev.map((m, i) => {
        if (i !== mIdx) return m;
        const newCriteria = m.criteria.map((c, j) =>
          j === cIdx ? { ...c, isAutomated: !c.isAutomated } : c
        );
        return { ...m, criteria: newCriteria };
      })
    );
  }

  function handleAddCriterion(mIdx: number) {
    setMilestones((prev) =>
      prev.map((m, i) => {
        if (i !== mIdx) return m;
        return {
          ...m,
          criteria: [
            ...m.criteria,
            {
              id: `c_custom_${Date.now()}`,
              text: "",
              isAutomated: true,
            },
          ],
        };
      })
    );
  }

  function handleDeleteCriterion(mIdx: number, cIdx: number) {
    setMilestones((prev) =>
      prev.map((m, i) => {
        if (i !== mIdx) return m;
        return {
          ...m,
          criteria: m.criteria.filter((_, j) => j !== cIdx),
        };
      })
    );
  }

  // 1-Click Auto-Balance: Proportionally scales milestones to match total budget exactly
  function handleAutoBalance() {
    if (budgetNum <= 0 || milestones.length === 0) return;

    const currentTotal = milestones.reduce(
      (sum, m) => sum + (parseFloat(String(m.amount)) || 0),
      0
    );

    let allocated = 0;
    const updated = milestones.map((m, idx) => {
      let newAmt: number;
      if (idx === milestones.length - 1) {
        newAmt = Math.round((budgetNum - allocated) * 100) / 100;
      } else {
        const weight =
          currentTotal > 0
            ? (parseFloat(String(m.amount)) || 0) / currentTotal
            : 1 / milestones.length;
        newAmt = Math.round(budgetNum * weight * 100) / 100;
        allocated += newAmt;
      }
      return { ...m, amount: newAmt };
    });

    setMilestones(updated);
  }

  // 1-Click Sync: Updates total budget to match whatever custom sum the milestones have
  function handleSyncBudgetToTranches() {
    if (calculatedSum > 0) {
      setTotalBudget(calculatedSum);
    }
  }

  async function handleCreateContract() {
    if (!isBudgetBalanced) {
      setError(
        `Milestone amounts ($${calculatedSum.toFixed(2)}) must sum exactly to total budget ($${budgetNum.toFixed(2)}). Click 'Auto-Balance' to align them instantly.`
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const sanitizedMilestones = milestones.map((m) => ({
        ...m,
        amount: parseFloat(String(m.amount)) || 0,
        durationDays: Math.max(1, parseInt(String(m.durationDays), 10) || 1),
      }));

      const res = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: projectTitle,
          description: brief,
          totalBudget: budgetNum,
          currency: "USD",
          clientEmail,
          freelancerEmail,
          milestones: sanitizedMilestones,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create contract");
      }

      router.push(`/project/${data.contract.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error creating contract");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#141517] text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-[#DAF99C] uppercase tracking-wider font-semibold">
            <ShieldCheck className="h-4 w-4 text-[#DAF99C]" />
            Agent 1: Scope &amp; Milestone Clarifier
          </div>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="heading-2 hero-gradient-text">
            Create Escrow Contract
          </h1>
          <p className="body-1 text-zinc-300">
            Deconstruct unstructured project requirements into objective payment tranches with Gemini AI.
          </p>
        </div>

        {error && (
          <div className="rounded-none border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-300 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Section 1: Project Intake */}
        <div className="luxury-card p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="title-1 text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-none bg-[#DAF99C] text-[#0E1012] text-xs font-bold">1</span>
              Project Intake &amp; Parties
            </h2>
            <span className="text-xs text-zinc-400 font-mono">Step 1 of 2</span>
          </div>

          {/* Quick Templates */}
          <div className="space-y-2">
            <label className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
              Load Preset Brief Template
            </label>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.label}
                  type="button"
                  onClick={() => {
                    setBrief(tmpl.brief);
                    setTotalBudget(tmpl.budget);
                    setProjectTitle(tmpl.label);
                    setMilestones(JSON.parse(JSON.stringify(tmpl.milestones)));
                  }}
                  className="rounded-none border border-white/10 bg-[#25272B] px-3.5 py-1.5 text-xs text-zinc-300 hover:border-[#DAF99C]/50 hover:text-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98]"
                >
                  {tmpl.label} (${tmpl.budget})
                </button>
              ))}
            </div>
          </div>

          {/* Brief Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">
              Project Brief or Requirements
            </label>
            <textarea
              rows={4}
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="Paste raw project brief, client emails, or feature requests..."
              className="w-full rounded-none border border-white/10 bg-[#161719] p-4 text-sm text-white placeholder-zinc-500 focus:border-[#DAF99C] focus:outline-none focus:ring-1 focus:ring-[#DAF99C]"
            />
          </div>

          {/* Email & Budget Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">Total Budget (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-500 text-sm">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={totalBudget}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || /^\d*\.?\d*$/.test(val)) {
                      setTotalBudget(val);
                    }
                  }}
                  onBlur={() => {
                    const num = parseFloat(String(totalBudget));
                    if (isNaN(num) || num <= 0) {
                      setTotalBudget(100);
                    } else {
                      setTotalBudget(Math.round(num * 100) / 100);
                    }
                  }}
                  placeholder="900"
                  className="w-full rounded-none border border-white/10 bg-[#161719] pl-7 pr-3 py-2 text-sm text-white focus:border-[#DAF99C] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">Client PayPal Email</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full rounded-none border border-white/10 bg-[#161719] px-3 py-2 text-sm text-white focus:border-[#DAF99C] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">Freelancer Payout Email</label>
              <input
                type="email"
                value={freelancerEmail}
                onChange={(e) => setFreelancerEmail(e.target.value)}
                className="w-full rounded-none border border-white/10 bg-[#161719] px-3 py-2 text-sm text-white focus:border-[#DAF99C] focus:outline-none"
              />
            </div>
          </div>

          {/* AI Decomposition Action */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGeneratePlan}
              className="lime-button inline-flex items-center gap-2 rounded-none px-6 py-2.5 text-sm font-semibold active:scale-[0.98] disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4 text-[#0E1012]" />
              {isGenerating ? "Decomposing Brief with Gemini..." : "Deconstruct Brief with Agent 1"}
            </button>
            <span className="text-xs text-zinc-400">
              Agent 1 automatically partitions the brief into 3 objective tranches matching your budget.
            </span>
          </div>
        </div>

        {/* Section 2: Milestone Tranches Review */}
        <div className="luxury-card p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-4 gap-3">
            <div>
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-none bg-[#DAF99C] text-[#0E1012] text-xs font-bold">2</span>
                Objective Milestone Tranches
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                De-scoped to prevent creep. Separated into automated inspection vs client sign-off.
              </p>
            </div>

            {/* Live Budget Sum Indicator & Quick Balance Tools */}
            <div className="flex flex-col items-start md:items-end gap-2">
              <div
                className={`inline-flex items-center gap-2 rounded-none border px-3 py-1.5 text-xs font-mono font-semibold ${
                  isBudgetBalanced
                    ? "border-[#DAF99C]/40 bg-[#DAF99C]/10 text-[#DAF99C]"
                    : "border-[#FBBF24]/40 bg-[#FBBF24]/10 text-[#FBBF24]"
                }`}
              >
                {isBudgetBalanced ? (
                  <CheckCircle2 className="h-4 w-4 text-[#DAF99C]" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-[#FBBF24]" />
                )}
                <span>
                  Total Tranches: ${calculatedSum.toFixed(2)} / ${budgetNum.toFixed(2)}
                </span>
              </div>

              {!isBudgetBalanced && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutoBalance}
                    className="inline-flex items-center gap-1 rounded-none border border-[#DAF99C] bg-[#DAF99C] px-2.5 py-1 text-[11px] font-mono font-semibold text-[#0E1012] hover:bg-[#c6e689] transition-colors"
                    title="Scale milestone tranches proportionally to match the total budget"
                  >
                    <Sliders className="h-3 w-3" />
                    Auto-Balance Tranches to ${budgetNum.toFixed(2)}
                  </button>
                  <button
                    type="button"
                    onClick={handleSyncBudgetToTranches}
                    className="inline-flex items-center gap-1 rounded-none border border-white/20 bg-[#25272B] px-2.5 py-1 text-[11px] font-mono font-semibold text-zinc-200 hover:border-white/40 hover:text-white transition-colors"
                    title="Update total project budget to match the sum of your custom tranches"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Set Budget to ${calculatedSum.toFixed(2)}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Project Title Field */}
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 font-medium">Contract Title</label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full rounded-none border border-white/10 bg-[#161719] px-3 py-2 text-sm text-white focus:border-[#DAF99C] focus:outline-none"
            />
          </div>

          {/* Milestone Cards List */}
          <div className="space-y-4">
            {milestones.map((m, mIdx) => (
              <div
                key={m.order}
                className="rounded-none border border-white/10 bg-[#1C1D20] p-5 space-y-4 transition-all hover:border-white/20"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="flex h-7 w-7 items-center justify-center rounded-none bg-black border border-white/10 text-xs font-mono font-bold text-[#DAF99C] flex-shrink-0 mt-0.5">
                      M{m.order}
                    </span>
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={m.title}
                        onChange={(e) => handleMilestoneTitleChange(mIdx, e.target.value)}
                        placeholder="Milestone title..."
                        className="w-full bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#DAF99C] text-sm font-semibold text-white py-0.5 focus:outline-none transition-colors"
                      />
                      <textarea
                        rows={2}
                        value={m.description}
                        onChange={(e) => handleMilestoneDescriptionChange(mIdx, e.target.value)}
                        placeholder="Milestone deliverable scope and description..."
                        className="w-full bg-transparent border border-transparent hover:border-white/10 focus:border-white/20 rounded-none text-xs text-zinc-400 p-1 focus:outline-none transition-colors resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 self-end sm:self-start">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-300 bg-black/40 px-2.5 py-1.5 border border-white/10">
                      <Clock className="h-3.5 w-3.5 text-[#DAF99C]" />
                      <input
                        type="text"
                        inputMode="numeric"
                        value={m.durationDays}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "" || /^\d*$/.test(val)) {
                            handleMilestoneDurationChange(mIdx, val);
                          }
                        }}
                        onBlur={() => {
                          const n = parseInt(String(m.durationDays), 10);
                          if (isNaN(n) || n < 1) {
                            handleMilestoneDurationChange(mIdx, 1);
                          } else {
                            handleMilestoneDurationChange(mIdx, n);
                          }
                        }}
                        className="w-12 bg-transparent text-xs font-mono font-semibold text-white text-center focus:outline-none border-b border-transparent focus:border-[#DAF99C]"
                        title="Milestone duration in days"
                      />
                      <span className="font-mono text-[11px] text-zinc-400">days</span>
                    </div>

                    <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1.5 border border-white/10">
                      <span className="text-[#DAF99C] text-xs font-mono font-bold">$</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={m.amount}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "" || /^\d*\.?\d*$/.test(val)) {
                            handleMilestoneAmountChange(mIdx, val);
                          }
                        }}
                        onBlur={() => {
                          const n = parseFloat(String(m.amount));
                          if (isNaN(n) || n < 0) {
                            handleMilestoneAmountChange(mIdx, 0);
                          } else {
                            handleMilestoneAmountChange(mIdx, Math.round(n * 100) / 100);
                          }
                        }}
                        className="w-20 bg-transparent text-xs font-mono font-bold text-[#DAF99C] text-right focus:outline-none border-b border-transparent focus:border-[#DAF99C]"
                        title="Milestone payment amount in USD"
                      />
                    </div>
                  </div>
                </div>

                {/* Criteria Checklist */}
                <div className="space-y-2 border-t border-white/10 pt-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                    <span className="text-[11px] uppercase tracking-wider font-mono">Verifiable Sign-Off Criteria</span>
                    <button
                      type="button"
                      onClick={() => handleAddCriterion(mIdx)}
                      className="inline-flex items-center gap-1 text-[#DAF99C] hover:underline font-mono text-[11px]"
                    >
                      <Plus className="h-3 w-3" />
                      Add Criterion
                    </button>
                  </div>

                  <div className="space-y-2">
                    {m.criteria.map((c, cIdx) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between gap-2 rounded-none border border-white/10 bg-[#161719] p-2 text-xs"
                      >
                        <input
                          type="text"
                          value={c.text}
                          onChange={(e) => handleCriterionTextChange(mIdx, cIdx, e.target.value)}
                          placeholder="Type verifiable requirement (e.g., Responsive navbar with mobile drawer)..."
                          className="flex-1 bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#DAF99C] text-zinc-200 text-xs py-1 px-1 focus:outline-none transition-colors"
                        />

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleCriterionAutomated(mIdx, cIdx)}
                            className={`rounded-none px-2.5 py-1 text-[10px] font-mono font-semibold transition-all ${
                              c.isAutomated
                                ? "bg-[#DAF99C] text-[#0E1012]"
                                : "bg-[#FBBF24] text-[#0E1012]"
                            }`}
                            title="Toggle between deterministic automated inspection and subjective 72h client sign-off"
                          >
                            {c.isAutomated ? "Automated (DOM/HTTP)" : "Subjective (72h Silence-Means-Yes)"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteCriterion(mIdx, cIdx)}
                            className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                            title="Delete criterion"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submission Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-white/10 gap-4">
            <div className="text-xs text-zinc-400 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#DAF99C]" />
              <span>Full budget captured upfront in PayPal Escrow. Disburses on verified completion.</span>
            </div>

            <button
              type="button"
              disabled={isSubmitting || !isBudgetBalanced}
              onClick={handleCreateContract}
              className="lime-button w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-none px-7 py-3.5 text-sm font-semibold active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-[#DAF99C]/25"
            >
              {isSubmitting ? "Creating Contract..." : "Proceed to Escrow Cockpit"}
              <ArrowRight className="h-4 w-4 text-[#0E1012]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
