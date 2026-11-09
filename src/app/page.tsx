"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight,
  Bot,
  Layers,
  ChevronDown,
  Sparkles,
  CreditCard,
  FileCheck,
  TrendingUp,
  Globe,
  Code2,
  ExternalLink,
  Cpu,
  Check,
  ChevronRight,
  Terminal,
  Play,
  RotateCcw,
  Sliders,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import GanttBoard, { GanttMilestone } from "@/components/GanttBoard";

const INITIAL_DEMO_MILESTONES: GanttMilestone[] = [
  {
    id: "m1",
    order: 1,
    title: "Design System, Wireframes & Scaffold",
    description: "Geist typography tokens, spacing scale, and mobile wireframes.",
    amount: 300,
    durationDays: 3,
    status: "PAID",
    payoutBatchId: "PAYOUTS_BATCH_78912",
  },
  {
    id: "m2",
    order: 2,
    title: "Frontend Implementation & Lead Forms",
    description: "Responsive hero, contact lead forms, and verified routes.",
    amount: 300,
    durationDays: 4,
    status: "ACTIVE",
  },
  {
    id: "m3",
    order: 3,
    title: "Production Deployment & Handover",
    description: "Valid SSL certificate, domain routing, and repository transfer.",
    amount: 300,
    durationDays: 3,
    status: "LOCKED",
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [landingMilestones, setLandingMilestones] = useState<GanttMilestone[]>(INITIAL_DEMO_MILESTONES);
  const [simStep, setSimStep] = useState<1 | 2 | 3 | 4>(2);

  // Tagline reveal animation state (B11 in DESIGN.md)
  const taglineRef = useRef<HTMLDivElement>(null);
  const [activeWordsCount, setActiveWordsCount] = useState(0);

  const taglineWords = [
    { text: "No", isAccent: false },
    { text: "ghosting.", isAccent: false },
    { text: "No", isAccent: false },
    { text: "scope", isAccent: false },
    { text: "creep.", isAccent: false },
    { text: "Just", isAccent: false },
    { text: "verified", isAccent: true },
    { text: "deliverables", isAccent: true },
    { text: "and", isAccent: false },
    { text: "automatic", isAccent: true },
    { text: "PayPal", isAccent: true },
    { text: "payouts.", isAccent: true }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let count = 0;
            const interval = setInterval(() => {
              count += 1;
              setActiveWordsCount(count);
              if (count >= taglineWords.length) {
                clearInterval(interval);
              }
            }, 60);
          }
        });
      },
      { threshold: 0.25 }
    );

    if (taglineRef.current) {
      observer.observe(taglineRef.current);
    }

    return () => observer.disconnect();
  }, [taglineWords.length]);

  function handleLandingReschedule(delayDays: number) {
    setLandingMilestones((prev) =>
      prev.map((m) =>
        m.status !== "PAID"
          ? { ...m, durationDays: m.durationDays + delayDays }
          : m
      )
    );
  }

  const FAQS = [
    {
      q: "How does Trustflow protect freelancers from being ghosted?",
      a: "Trustflow enforces an ironclad 72-Hour Silence-Means-Yes guarantee. When you submit deliverables for a milestone containing subjective aesthetic checks, the client has 72 hours to review. If they go silent, the full milestone funds in PayPal escrow automatically disburse to your PayPal email.",
    },
    {
      q: "How does Trustflow protect clients from paying for broken work?",
      a: "Clients fund the project upfront into escrow, but zero dollars are disbursed until the deliverable passes inspection. Agent 2 crawls the live staging preview, validates HTTP status codes, checks responsive tags, and verifies form inputs before any payout can execute.",
    },
    {
      q: "What PayPal APIs are used behind the scenes?",
      a: "Trustflow integrates two official PayPal APIs: the Orders API (v2) with intent CAPTURE to hold 100% of the project budget safely in platform escrow custody, and the Payouts API (v1) to disburse instant batch payouts directly to the freelancer's PayPal email upon milestone completion.",
    },
    {
      q: "Can the AI Agent unilaterally fail a freelancer's work?",
      a: "Never. Under our strict safety invariants, AI reasons and audits, but cannot unilaterally reject work. If automated criteria pass with high confidence, payouts execute. If criteria are ambiguous or subjective, the deliverable is flagged for human review under the 72-hour timer.",
    },
    {
      q: "What role does the Bryntum Gantt chart play?",
      a: "Trustflow uses the Bryntum Gantt design model to visualize milestone tranches, sequential payment locks, and dependency schedules. If client revisions occur, the agent reschedules downstream milestones automatically so freelancers aren't penalized for client delays.",
    },
    {
      q: "Are there high platform take rates like Upwork or Fiverr?",
      a: "No. Traditional platforms take 10% to 20% of your earnings. Trustflow operates with zero platform take rate, relying strictly on standard PayPal payment processing.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#141517] text-[#F8F9FA] flex flex-col overflow-hidden selection:bg-[#DAF99C] selection:text-[#0E1012]">
      {/* Top Ambient Luster */}
      <div className="ambient-glow-top" />

      {/* Floating Capsule Dock Navigation */}
      <header className="fixed top-5 inset-x-0 z-50 max-w-4xl mx-auto px-4">
        <nav className="flex items-center justify-between rounded-full border border-white/10 bg-[#1C1D20]/90 backdrop-blur-2xl px-5 py-2.5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.85)]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DAF99C] text-[#0E1012] font-bold text-sm shadow-md shadow-[#DAF99C]/20 group-hover:scale-105 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
              T
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-base tracking-tight text-white">Trustflow</span>
              <span className="text-[10px] font-mono uppercase bg-[#DAF99C]/10 text-[#DAF99C] border border-[#DAF99C]/20 px-2 py-0.5 rounded-full font-semibold">
                Escrow
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-300">
            <a href="#how-it-works" className="hover:text-[#DAF99C] transition-colors">How It Works</a>
            <a href="#inspection" className="hover:text-[#DAF99C] transition-colors">Inspection</a>
            <a href="#timeline" className="hover:text-[#DAF99C] transition-colors">Gantt Board</a>
            <a href="#faq" className="hover:text-[#DAF99C] transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              className="hidden sm:inline-flex items-center gap-1 text-xs text-zinc-300 hover:text-white px-2.5 py-1.5 transition-colors"
            >
              <span>Live Demo</span>
              <ExternalLink className="h-3 w-3 text-[#DAF99C]" />
            </Link>

            <Link
              href="/wizard"
              className="lime-button rounded-full px-4 py-2 text-xs font-semibold active:scale-[0.98]"
            >
              Create Contract
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-8">
        {/* Floating Pill Badge */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-[#1C1D20]/80 backdrop-blur-md px-4 py-1.5 text-xs text-zinc-300 shadow-inner">
          <span className="flex h-2 w-2 rounded-full bg-[#DAF99C] animate-pulse" />
          <span className="font-medium text-zinc-200">Autonomous Freelance Escrow</span>
          <span className="text-zinc-600">&bull;</span>
          <span className="text-[#DAF99C] font-mono font-semibold">PayPal Orders &amp; Payouts</span>
        </div>

        {/* Hero Headline (Capped at 680px with Meaningful Line Breaks) */}
        <h1 className="heading-1 hero-gradient-text max-w-[680px] mx-auto">
          Freelance milestone escrow without payment anxiety or ghosting
        </h1>

        {/* Subheadline */}
        <p className="body-1 text-zinc-300 max-w-[640px] mx-auto">
          Lock client budget into PayPal escrow upfront. Decompose the brief into objective tranches with AI. When deliverables pass automated inspection, get paid instantly.
        </p>

        {/* Dual CTA Cluster */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/wizard"
            className="lime-button w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold shadow-xl shadow-[#DAF99C]/20 active:scale-[0.98]"
          >
            Create Escrow Contract
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-[#1C1D20]/80 hover:bg-[#25272B] backdrop-blur-md px-7 py-3.5 text-base font-medium text-zinc-200 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98]"
          >
            <span>Explore Live Demo Cockpit</span>
            <ExternalLink className="h-4 w-4 text-[#DAF99C]" />
          </Link>
        </div>

        {/* Social Proof & Security Strip */}
        <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-zinc-400 uppercase tracking-wider">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#DAF99C]" />
            100% Upfront PayPal Escrow
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#DAF99C]" />
            72-Hour "Silence Means Yes"
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#DAF99C]" />
            Bryntum Gantt Dependencies
          </span>
        </div>

        {/* Cinematic Live Escrow Simulation Terminal */}
        <div className="pt-6 max-w-4xl mx-auto">
          <div className="luxury-card p-6 md:p-8 text-left space-y-6">
            {/* Top Bar with Contract ID and Step Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 rounded-full bg-[#DAF99C] animate-pulse" />
                <div>
                  <span className="text-xs font-mono text-zinc-400 uppercase">Live Escrow Protocol &bull; Contract #demo-contract-2026</span>
                  <h3 className="text-lg font-semibold text-white">Full-Stack SaaS Platform &amp; Mobile Lead Engine</h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#DAF99C]/30 bg-[#DAF99C]/10 px-3 py-1.5 text-xs font-mono text-[#DAF99C] font-semibold shadow-sm">
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>$900.00 USD Locked in PayPal</span>
                </div>
              </div>
            </div>

            {/* Interactive Step Switcher (Demonstrating the 4 Engines) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-semibold text-zinc-300">Click a phase to test Trustflow autonomous logic:</span>
                <span className="font-mono text-[#DAF99C] font-semibold">Step {simStep} of 4</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setSimStep(1)}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] ${
                    simStep === 1
                      ? "border-[#DAF99C] bg-[#DAF99C]/10 text-white shadow-md shadow-[#DAF99C]/10"
                      : "border-white/5 bg-[#25272B]/60 text-zinc-400 hover:border-white/10"
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase text-[#DAF99C] font-bold">Phase 1</div>
                  <div className="text-xs font-semibold mt-0.5">Upfront Funding</div>
                  <div className="text-[10px] text-zinc-400 font-mono">PayPal Orders API</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSimStep(2)}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] ${
                    simStep === 2
                      ? "border-[#DAF99C] bg-[#DAF99C]/10 text-white shadow-md shadow-[#DAF99C]/10"
                      : "border-white/5 bg-[#25272B]/60 text-zinc-400 hover:border-white/10"
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase text-[#DAF99C] font-bold">Phase 2</div>
                  <div className="text-xs font-semibold mt-0.5">Deliverable Audit</div>
                  <div className="text-[10px] text-zinc-400 font-mono">Agent 2 + Cheerio</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSimStep(3)}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] ${
                    simStep === 3
                      ? "border-[#FBBF24] bg-[#FBBF24]/10 text-white shadow-md shadow-[#FBBF24]/10"
                      : "border-white/5 bg-[#25272B]/60 text-zinc-400 hover:border-white/10"
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase text-[#FBBF24] font-bold">Phase 3</div>
                  <div className="text-xs font-semibold mt-0.5">72h Auto-Release</div>
                  <div className="text-[10px] text-zinc-400 font-mono">Anti-Ghosting Guard</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSimStep(4)}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] ${
                    simStep === 4
                      ? "border-[#DAF99C] bg-[#DAF99C]/10 text-white shadow-md shadow-[#DAF99C]/10"
                      : "border-white/5 bg-[#25272B]/60 text-zinc-400 hover:border-white/10"
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase text-[#DAF99C] font-bold">Phase 4</div>
                  <div className="text-xs font-semibold mt-0.5">Instant Payout</div>
                  <div className="text-[10px] text-zinc-400 font-mono">PayPal Payouts API</div>
                </button>
              </div>
            </div>

            {/* Tranche Preview Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Tranche 1 */}
              <div className="rounded-xl border border-[#DAF99C]/30 bg-[#DAF99C]/[0.08] p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">M1: Wireframes &amp; Scaffold</span>
                  <span className="text-[10px] font-mono uppercase bg-[#DAF99C] text-[#0E1012] px-2 py-0.5 rounded-md font-bold">
                    PAID
                  </span>
                </div>
                <div className="text-lg font-mono font-bold text-[#DAF99C]">$300.00</div>
                <p className="text-[11px] text-zinc-300">Disbursed via PayPal Payouts batch #78912</p>
              </div>

              {/* Tranche 2 */}
              <div className={`rounded-xl border p-3.5 space-y-1.5 transition-all duration-300 ${
                simStep === 2
                  ? "border-[#DAF99C]/70 bg-[#25272B] shadow-lg shadow-[#DAF99C]/10"
                  : simStep === 3
                  ? "border-[#FBBF24]/70 bg-[#FBBF24]/10"
                  : simStep === 4
                  ? "border-[#DAF99C]/70 bg-[#DAF99C]/10"
                  : "border-white/10 bg-[#25272B]/60"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">M2: Frontend Implementation</span>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md font-bold ${
                    simStep === 4
                      ? "bg-[#DAF99C] text-[#0E1012]"
                      : simStep === 3
                      ? "bg-[#FBBF24] text-[#0E1012]"
                      : "bg-white text-[#0E1012]"
                  }`}>
                    {simStep === 4 ? "PAID" : simStep === 3 ? "IN REVIEW" : "ACTIVE ⚡"}
                  </span>
                </div>
                <div className="text-lg font-mono font-bold text-white">$300.00</div>
                <p className="text-[11px] text-zinc-300">
                  {simStep === 4
                    ? "Payout executed to freelancer PayPal email"
                    : simStep === 3
                    ? "72-Hour timer active • Silence means yes"
                    : "Deliverable preview URL under automated crawl"}
                </p>
              </div>

              {/* Tranche 3 */}
              <div className={`rounded-xl border p-3.5 space-y-1.5 ${
                simStep === 4
                  ? "border-white/20 bg-white/[0.04]"
                  : "border-white/5 bg-[#25272B]/40 opacity-65"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400">M3: Production Handover</span>
                  <span className="text-[10px] font-mono uppercase bg-[#141517] text-zinc-400 px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/5">
                    {simStep === 4 ? "UNLOCKED ⚡" : <><Lock className="h-2.5 w-2.5" /> LOCKED</>}
                  </span>
                </div>
                <div className="text-lg font-mono font-bold text-zinc-300">$300.00</div>
                <p className="text-[11px] text-zinc-400">
                  {simStep === 4 ? "Now active for deliverable submission" : "Unlocks upon M2 completion"}
                </p>
              </div>
            </div>

            {/* Live Terminal Tracer Snippet */}
            <div className="rounded-xl border border-white/10 bg-[#121315] p-4 font-mono text-xs space-y-1.5 text-zinc-300">
              <div className="flex items-center justify-between text-zinc-400 text-[11px] pb-1.5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-[#DAF99C]" />
                  <span className="text-zinc-300">Trustflow Autonomous Execution Tracer</span>
                </div>
                <span className="text-[#DAF99C] font-semibold">● LIVE SANDBOX</span>
              </div>

              {simStep === 1 && (
                <div className="space-y-1">
                  <div className="text-zinc-400">&gt; POST /v2/checkout/orders &rarr; intent: CAPTURE</div>
                  <div className="text-[#DAF99C]">&gt; Status: COMPLETED &bull; Order ID: 4T891238479210</div>
                  <div className="text-white">&gt; Escrow Vault: $900.00 USD secured in platform custody</div>
                </div>
              )}

              {simStep === 2 && (
                <div className="space-y-1">
                  <div className="text-[#DAF99C]">&gt; GET https://preview-sample.vercel.app &rarr; 200 OK (142ms)</div>
                  <div className="text-[#DAF99C]">&gt; DOM audit: meta[name=&quot;viewport&quot;] responsive tags verified</div>
                  <div className="text-[#DAF99C]">&gt; DOM audit: form input[type=&quot;email&quot;] lead capture detected</div>
                  <div className="text-white">&gt; Gemini Agent 2 confidence: 96.5% &bull; Objective criteria validated</div>
                </div>
              )}

              {simStep === 3 && (
                <div className="space-y-1">
                  <div className="text-[#FBBF24]">&gt; Invariant: Subjective design review flagged for human client</div>
                  <div className="text-[#FBBF24]">&gt; Timer initiated: 72:00:00 remaining on contract #demo-contract-2026</div>
                  <div className="text-zinc-300">&gt; Guaranteed safety rule: Inaction triggers autonomous disbursement</div>
                </div>
              )}

              {simStep === 4 && (
                <div className="space-y-1">
                  <div className="text-[#DAF99C]">&gt; POST /v1/payments/payouts &rarr; batch_id: PAYOUTS_BATCH_78912</div>
                  <div className="text-[#DAF99C]">&gt; Disbursed $300.00 USD to freelancer@trustflow.dev</div>
                  <div className="text-white">&gt; Bryntum Gantt Board: Milestone 2 set to PAID &bull; Milestone 3 UNLOCKED</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mandatory Tagline Reveal Section (B11 in DESIGN.md) */}
      <section
        ref={taglineRef}
        className="relative py-28 px-4 sm:px-6 lg:px-8 border-y border-white/5 bg-[#18191C] text-center"
      >
        <div className="max-w-[680px] mx-auto space-y-5">
          <p className="text-xs uppercase tracking-widest font-mono text-[#DAF99C] font-semibold flex items-center justify-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#DAF99C]" />
            The Trustflow Guarantee
          </p>
          <h2 className="heading-2 leading-snug tracking-tight">
            {taglineWords.map((wordObj, idx) => {
              const isActive = idx < activeWordsCount;
              return (
                <span
                  key={idx}
                  className={`inline-block mr-2.5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive
                      ? wordObj.isAccent
                        ? "opacity-100 text-[#DAF99C] font-semibold"
                        : "opacity-100 text-white"
                      : "opacity-25 text-zinc-600"
                  }`}
                >
                  {wordObj.text}
                </span>
              );
            })}
          </h2>
        </div>
      </section>

      {/* Bento Grid Architecture: The Three Engines */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-[680px] mx-auto">
          <h2 className="heading-2 text-white">
            How Trustflow eliminates freelance payment failure
          </h2>
          <p className="body-1 text-zinc-300">
            Three interconnected engines replace arbitrary marketplace bureaucracy with deterministic code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Engine 1: Upfront Escrow */}
          <div className="luxury-card p-7 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DAF99C]/10 text-[#DAF99C] border border-[#DAF99C]/20 font-mono font-bold text-base">
                01
              </div>
              <h3 className="title-1 text-white">PayPal Upfront Custody</h3>
              <p className="body-2 text-zinc-300">
                Clients authorize 100% of the project budget upfront into PayPal escrow using the Orders API with intent CAPTURE. Freelancers build knowing every dollar is already locked in custody.
              </p>
            </div>
            <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-[#DAF99C] flex items-center gap-1.5 font-semibold">
              <CreditCard className="h-3.5 w-3.5" />
              <span>Orders API (v2) intent: CAPTURE</span>
            </div>
          </div>

          {/* Engine 2: AI Deliverable Inspector */}
          <div className="luxury-card p-7 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DAF99C]/10 text-[#DAF99C] border border-[#DAF99C]/20 font-mono font-bold text-base">
                02
              </div>
              <h3 className="title-1 text-white">Autonomous Inspection</h3>
              <p className="body-2 text-zinc-300">
                When code or staging links are submitted, Cheerio crawls live HTTP status, viewport meta tags, and form fields, while Gemini AI audits objective criteria. Passing work triggers payouts instantly.
              </p>
            </div>
            <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-[#DAF99C] flex items-center gap-1.5 font-semibold">
              <Bot className="h-3.5 w-3.5" />
              <span>Deterministic DOM &bull; Node Fetch</span>
            </div>
          </div>

          {/* Engine 3: 72-Hour Auto-Release */}
          <div className="luxury-card p-7 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/20 font-mono font-bold text-base">
                03
              </div>
              <h3 className="title-1 text-white">Silence Means Yes</h3>
              <p className="body-2 text-zinc-300">
                If deliverables require subjective design sign-off, a 72-hour countdown starts. If the client goes silent or delays review, milestone funds automatically disburse to the freelancer's PayPal account.
              </p>
            </div>
            <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-[#FBBF24] flex items-center gap-1.5 font-semibold">
              <Clock className="h-3.5 w-3.5" />
              <span>Guaranteed Anti-Ghosting Clock</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Inspection Deep Dive (Anchor #inspection) */}
      <section id="inspection" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-[680px] mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DAF99C]/20 bg-[#DAF99C]/10 px-3.5 py-1 text-xs font-mono text-[#DAF99C] font-semibold">
            <Bot className="h-3.5 w-3.5" />
            Agent 2 &bull; Multimodal Deliverable Inspector
          </div>
          <h2 className="heading-2 text-white">
            Objective deliverable verification without human bias
          </h2>
          <p className="body-1 text-zinc-300">
            AI reasons and audits, but deterministic code validates URLs and triggers payouts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="luxury-card p-7 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DAF99C]/10 text-[#DAF99C] border border-[#DAF99C]/20">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h3 className="title-1 text-white">Deterministic DOM &amp; HTTP Crawl</h3>
                <p className="text-xs text-zinc-400">Node Fetch + Cheerio validation engine</p>
              </div>
            </div>
            <p className="body-2 text-zinc-300">
              When a deliverable URL is submitted, the crawler inspects HTTP response status (200 OK), checks the responsive viewport meta tag, verifies form inputs, and inspects routes before invoking the AI.
            </p>
            <div className="rounded-xl border border-white/10 bg-[#121315] p-3.5 font-mono text-[11px] text-zinc-400 space-y-1.5">
              <div className="text-[#DAF99C]">&#10003; GET https://staging.preview.app &rarr; 200 OK (142ms)</div>
              <div className="text-[#DAF99C]">&#10003; meta[name=&quot;viewport&quot;] responsive scale verified</div>
              <div className="text-[#DAF99C]">&#10003; form input[type=&quot;email&quot;] lead capture present</div>
            </div>
          </div>

          <div className="luxury-card p-7 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white border border-white/20">
                <ShieldCheck className="h-5 w-5 text-[#DAF99C]" />
              </div>
              <div>
                <h3 className="title-1 text-white">The 72h Silence-Means-Yes Safety Guard</h3>
                <p className="text-xs text-zinc-400">Guaranteed freelancer ghosting defense</p>
              </div>
            </div>
            <p className="body-2 text-zinc-300">
              AI can <strong>never</strong> unilaterally reject work. If criteria contain subjective aesthetics, the deliverable routes to client review with a 72-hour countdown timer. If the client is silent, funds auto-release.
            </p>
            <div className="rounded-xl border border-white/10 bg-[#121315] p-3.5 font-mono text-[11px] text-zinc-400 space-y-1.5">
              <div className="text-[#FBBF24]">&#9203; In-Review: 72h countdown started for M2</div>
              <div className="text-zinc-300">&bull; Client approves &rarr; Instant PayPal Payout</div>
              <div className="text-zinc-300">&bull; Client silent &rarr; Auto-releases on timeout</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Bryntum Gantt Timeline Board Showcase (Anchor #timeline) */}
      <section id="timeline" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-[680px] mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DAF99C]/20 bg-[#DAF99C]/10 px-3.5 py-1 text-xs font-mono text-[#DAF99C] font-semibold">
            <Layers className="h-3.5 w-3.5" />
            Bryntum Sponsor Track &bull; Challenge Prompts #1 &amp; #6
          </div>
          <h2 className="heading-2 text-white">
            Interactive Bryntum Gantt Timeline Board
          </h2>
          <p className="body-1 text-zinc-300">
            Sequential payment tranche dependency locks and automated agent-driven rescheduling. Test the live board below:
          </p>
        </div>

        {/* Embedded Interactive Gantt Board */}
        <GanttBoard
          milestones={landingMilestones}
          totalBudget={900}
          currency="USD"
          onReschedule={handleLandingReschedule}
        />

        <div className="text-center pt-2">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1C1D20]/80 hover:bg-[#25272B] px-6 py-3 text-xs font-semibold text-zinc-200 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] shadow-md"
          >
            <span>Open Full Interactive Cockpit Demo</span>
            <ExternalLink className="h-3.5 w-3.5 text-[#DAF99C]" />
          </Link>
        </div>
      </section>

      {/* FAQ Accordion Section (Anchor #faq) */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-[680px] mx-auto">
          <h2 className="heading-2 text-white">
            Frequently asked questions
          </h2>
          <p className="body-1 text-zinc-300">
            Everything you need to know about Trustflow escrow and autonomous payout releases.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`luxury-card overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isOpen ? "border-[#DAF99C]/40 bg-[#25272B] shadow-lg shadow-[#DAF99C]/5" : "border-white/10"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm md:text-base font-semibold text-white hover:text-[#DAF99C] transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-zinc-400 flex-shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isOpen ? "rotate-180 text-[#DAF99C]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs md:text-sm text-zinc-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Risk-Reversal CTA Section */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-[#141517] text-center space-y-6">
        <div className="max-w-[680px] mx-auto space-y-4">
          <h2 className="heading-2 hero-gradient-text">
            Start your next freelance contract with zero payment anxiety
          </h2>
          <p className="body-1 text-zinc-300">
            Protect your time with locked upfront escrow, automated AI verification, and guaranteed PayPal payouts.
          </p>
          <div className="pt-2">
            <Link
              href="/wizard"
              className="lime-button inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold shadow-xl shadow-[#DAF99C]/25 active:scale-[0.98]"
            >
              Create Escrow Contract
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* High-Class Footer */}
      <footer className="border-t border-white/5 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">Trustflow</span>
          <span>&copy; 2026. Built for PayPal AI Hackathon &amp; Bryntum Sponsor Track.</span>
        </div>
        <div className="flex items-center gap-5 text-zinc-400">
          <Link href="/wizard" className="hover:text-white transition-colors">Scope Wizard</Link>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#inspection" className="hover:text-white transition-colors">Inspection</a>
          <a href="#timeline" className="hover:text-white transition-colors">Gantt Board</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>
      </footer>
    </div>
  );
}
