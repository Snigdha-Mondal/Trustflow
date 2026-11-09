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
  amount: number;
  durationDays: number;
  criteria: CriterionDraft[];
}

const TEMPLATES = [
  {
    label: "SaaS Marketing Website",
    brief: "Build a modern responsive Next.js marketing website with dynamic pricing tables, feature comparison grid, customer testimonials, and an interactive contact lead form with email validation.",
    budget: 900,
  },
  {
    label: "AI Automation Pipeline",
    brief: "Develop an autonomous webhook ingestion service in Node.js that parses PDF client briefs, executes Gemini AI summary tasks, and delivers webhooks with 99.9% uptime and payload validation.",
    budget: 1200,
  },
  {
    label: "Next.js + Supabase Full-Stack MVP",
    brief: "Create an MVP web application with Supabase authentication, user profile management, protected dashboard route, and Stripe/PayPal payment checkout integration.",
    budget: 1500,
  },
];

export default function WizardPage() {
  const router = useRouter();

  // Intake state
  const [brief, setBrief] = useState(TEMPLATES[0].brief);
  const [totalBudget, setTotalBudget] = useState<number>(TEMPLATES[0].budget);
  const [clientEmail, setClientEmail] = useState("founder.sarah@startup.io");
  const [freelancerEmail, setFreelancerEmail] = useState("alex.dev@engineer.net");

  // AI Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generated Plan State
  const [projectTitle, setProjectTitle] = useState("SaaS Marketing Website & Lead Funnel");
  const [milestones, setMilestones] = useState<MilestoneDraft[]>([
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
  ]);

  // Milestone Math Validation
  const calculatedSum = milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);
  const isBudgetBalanced = Math.abs(calculatedSum - totalBudget) < 0.01;

  async function handleGeneratePlan() {
    if (!brief.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/milestones/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief, totalBudget, currency: "USD" }),
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

  function handleMilestoneAmountChange(index: number, newAmount: number) {
    const updated = [...milestones];
    updated[index].amount = newAmount;
    setMilestones(updated);
  }

  function handleToggleCriterionAutomated(mIdx: number, cIdx: number) {
    const updated = [...milestones];
    updated[mIdx].criteria[cIdx].isAutomated = !updated[mIdx].criteria[cIdx].isAutomated;
    setMilestones(updated);
  }

  function handleAddCriterion(mIdx: number) {
    const updated = [...milestones];
    updated[mIdx].criteria.push({
      id: `c_custom_${Date.now()}`,
      text: "New verifiable milestone deliverable criterion",
      isAutomated: true,
    });
    setMilestones(updated);
  }

  function handleDeleteCriterion(mIdx: number, cIdx: number) {
    const updated = [...milestones];
    updated[mIdx].criteria.splice(cIdx, 1);
    setMilestones(updated);
  }

  async function handleCreateContract() {
    if (!isBudgetBalanced) {
      setError(`Milestone amounts ($${calculatedSum.toFixed(2)}) must sum exactly to total budget ($${totalBudget.toFixed(2)}).`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: projectTitle,
          description: brief,
          totalBudget,
          currency: "USD",
          clientEmail,
          freelancerEmail,
          milestones,
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
    <div className="min-h-screen bg-black text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-quick"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Agent 1: Scope & Milestone Clarifier
          </div>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold hero-gradient-text tracking-tight">
            Create Escrow Contract
          </h1>
          <p className="text-base text-zinc-400">
            Deconstruct unstructured project requirements into objective payment tranches with Gemini AI.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-900/60 bg-red-950/40 p-4 text-sm text-red-300 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Section 1: Project Intake */}
        <div className="trustflow-card p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold">1</span>
              Project Intake & Parties
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
                  }}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs text-zinc-300 hover:border-zinc-700 hover:text-white transition-quick active:scale-[0.98]"
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
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Email & Budget Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">Total Budget (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-500 text-sm">$</span>
                <input
                  type="number"
                  min="50"
                  step="10"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/90 pl-7 pr-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">Client PayPal Email</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">Freelancer Payout Email</label>
              <input
                type="email"
                value={freelancerEmail}
                onChange={(e) => setFreelancerEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* AI Decomposition Action */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGeneratePlan}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition-decelerate active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating ? "Decomposing Brief with Gemini..." : "Deconstruct Brief with Agent 1"}
            </button>
          </div>
        </div>

        {/* Section 2: Milestone Tranches Review */}
        <div className="trustflow-card p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-4 gap-2">
            <div>
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold">2</span>
                Objective Milestone Tranches
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                De-scoped to prevent creep. Separated into automated inspection vs client sign-off.
              </p>
            </div>

            {/* Live Budget Sum Indicator */}
            <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-mono ${
              isBudgetBalanced
                ? "border-emerald-800/80 bg-emerald-950/40 text-emerald-300"
                : "border-amber-800/80 bg-amber-950/40 text-amber-300"
            }`}>
              {isBudgetBalanced ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <AlertCircle className="h-4 w-4 text-amber-400" />}
              <span>
                Total Tranches: ${calculatedSum.toFixed(2)} / ${totalBudget.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Project Title Field */}
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 font-medium">Contract Title</label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Milestone Cards List */}
          <div className="space-y-4">
            {milestones.map((m, mIdx) => (
              <div
                key={m.order}
                className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5 space-y-4 transition-quick hover:border-zinc-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-300">
                      M{m.order}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-white">{m.title}</h3>
                      <p className="text-xs text-zinc-400">{m.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{m.durationDays} days</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-zinc-400 text-xs">$</span>
                      <input
                        type="number"
                        value={m.amount}
                        onChange={(e) => handleMilestoneAmountChange(mIdx, Number(e.target.value))}
                        className="w-20 rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-sm font-semibold text-emerald-400 text-right focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Criteria Checklist */}
                <div className="space-y-2 border-t border-zinc-800/80 pt-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                    <span>Verifiable Sign-Off Criteria</span>
                    <button
                      type="button"
                      onClick={() => handleAddCriterion(mIdx)}
                      className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
                    >
                      <Plus className="h-3 w-3" />
                      Add Criterion
                    </button>
                  </div>

                  <div className="space-y-2">
                    {m.criteria.map((c, cIdx) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between gap-2 rounded-lg border border-zinc-800/60 bg-zinc-950/60 p-2.5 text-xs"
                      >
                        <span className="text-zinc-200 flex-1">{c.text}</span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleCriterionAutomated(mIdx, cIdx)}
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-quick ${
                              c.isAutomated
                                ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/50"
                                : "bg-amber-950/80 text-amber-400 border border-amber-800/50"
                            }`}
                          >
                            {c.isAutomated ? "Automated (DOM/HTTP)" : "Subjective (72h Silence-Means-Yes)"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteCriterion(mIdx, cIdx)}
                            className="text-zinc-500 hover:text-red-400 transition-quick p-1"
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
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-zinc-800 gap-4">
            <div className="text-xs text-zinc-400 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Full budget captured upfront in PayPal Escrow. Disburses on verified completion.</span>
            </div>

            <button
              type="button"
              disabled={isSubmitting || !isBudgetBalanced}
              onClick={handleCreateContract}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-decelerate active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Creating Contract..." : "Proceed to Escrow Cockpit"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
