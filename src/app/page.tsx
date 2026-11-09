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
} from "lucide-react";
import GanttBoard, { GanttMilestone } from "@/components/GanttBoard";

const INITIAL_DEMO_MILESTONES: GanttMilestone[] = [
  {
    id: "m1",
    order: 1,
    title: "Design System & Wireframes",
    description: "Geist typography tokens, spacing scale, and mobile wireframes.",
    amount: 300,
    durationDays: 3,
    status: "PAID",
    payoutBatchId: "PAYOUTS_BATCH_78912",
  },
  {
    id: "m2",
    order: 2,
    title: "Frontend Implementation (Next.js)",
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [landingMilestones, setLandingMilestones] = useState<GanttMilestone[]>(INITIAL_DEMO_MILESTONES);

  // Tagline reveal animation state (B11 in DESIGN.md)
  const taglineRef = useRef<HTMLDivElement>(null);
  const [activeWordsCount, setActiveWordsCount] = useState(0);

  const taglineWords = [
    "No", "ghosting.",
    "No", "scope", "creep.",
    "Just", "verified", "deliverables",
    "and", "automatic", "PayPal", "payouts."
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
            }, 80);
          }
        });
      },
      { threshold: 0.3 }
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
      a: "Trustflow enforces a 72-Hour Silence-Means-Yes guarantee. When you submit deliverables for a milestone containing subjective aesthetic checks, the client has 72 hours to review. If they take no action, the milestone funds in PayPal escrow automatically disburse to your PayPal email.",
    },
    {
      q: "How does Trustflow protect clients from paying for broken work?",
      a: "Clients fund the project upfront into escrow, but zero dollars are disbursed until the deliverable passes inspection. Agent 2 crawls your live URL, validates HTTP status codes, checks responsive tags, and parses DOM elements before any payout can execute.",
    },
    {
      q: "What PayPal APIs are used behind the scenes?",
      a: "Trustflow integrates two official PayPal APIs: the Orders API (v2) with intent CAPTURE to hold 100% of the project budget safely in platform escrow, and the Payouts API (v1) to disburse instant batch payouts directly to the freelancer's PayPal email upon milestone completion.",
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
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Floating Navigation Header (B7 in DESIGN.md) */}
      <header className="fixed top-4 inset-x-0 z-50 max-w-4xl mx-auto px-4">
        <nav className="flex items-center justify-between rounded-full border border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-5 py-2.5 shadow-lg">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
              T
            </span>
            <span className="font-semibold text-base tracking-tight text-white">Trustflow</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
            <a href="#how-it-works" className="hover:text-white transition-quick">How It Works</a>
            <a href="#inspection" className="hover:text-white transition-quick">Inspection</a>
            <a href="#timeline" className="hover:text-white transition-quick">Gantt Board</a>
            <a href="#faq" className="hover:text-white transition-quick">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/wizard"
              className="rounded-full bg-blue-600 hover:bg-blue-500 px-4 py-1.5 text-xs font-semibold text-white transition-decelerate active:scale-95 shadow-sm"
            >
              Create Contract
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section (B5 in DESIGN.md: Headline max 680px, left-to-right text gradient) */}
      <section className="pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-1.5 text-xs text-zinc-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          PayPal AI Hackathon 2026 &bull; Bryntum Sponsor Track
        </div>

        <h1 className="text-5xl md:text-6xl font-semibold leading-none tracking-tight max-w-[680px] mx-auto hero-gradient-text">
          Freelance milestone escrow without payment anxiety
        </h1>

        <p className="text-base md:text-lg text-zinc-400 max-w-[680px] mx-auto leading-relaxed">
          Lock client budget into PayPal escrow upfront. Decompose the brief into objective tranches with AI. When the code passes automated inspection, get paid instantly.
        </p>

        {/* Primary CTA (One clear action above the fold per A4) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/wizard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3.5 text-base font-semibold text-white transition-decelerate active:scale-95 shadow-lg shadow-blue-900/20"
          >
            Create Escrow Contract
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 px-6 py-3.5 text-base font-medium text-zinc-300 transition-decelerate"
          >
            Explore How It Works
          </a>
        </div>

        {/* Proof Signal (A2 in DESIGN.md) */}
        <div className="pt-8 border-t border-zinc-900 flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-zinc-500 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            100% Upfront PayPal Escrow
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            72-Hour "Silence Means Yes"
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Bryntum Gantt Dependencies
          </span>
        </div>
      </section>

      {/* Mandatory Tagline Reveal Section (B11 in DESIGN.md) */}
      <section
        ref={taglineRef}
        className="py-24 px-4 sm:px-6 lg:px-8 border-y border-zinc-900 bg-black text-center"
      >
        <div className="max-w-[680px] mx-auto space-y-4">
          <p className="text-xs uppercase tracking-widest font-mono text-zinc-500 font-semibold">
            The Trust Guarantee
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold leading-snug">
            {taglineWords.map((word, idx) => {
              const isActive = idx < activeWordsCount;
              return (
                <span
                  key={idx}
                  className={`inline-block mr-2.5 transition-all duration-300 ${
                    isActive ? "opacity-100 text-white" : "opacity-25 text-zinc-600"
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </h2>
        </div>
      </section>

      {/* Problem to Solution Comparison (A2 in DESIGN.md) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-[680px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
            Why traditional freelance escrow fails
          </h2>
          <p className="text-sm md:text-base text-zinc-400">
            Freelancers lose billions to delayed reviews and ghosting. Clients fear paying upfront for broken code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Legacy Card */}
          <div className="trustflow-card p-6 md:p-8 space-y-5 border-red-950/40 bg-zinc-950">
            <div className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold">
              Legacy Platforms (Upwork, Escrow.com)
            </div>
            <ul className="space-y-3 text-xs md:text-sm text-zinc-400">
              <li className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold">✕</span>
                <span><strong>10% to 20% platform cut</strong> deducted from every invoice.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold">✕</span>
                <span><strong>Endless client delays:</strong> Funds remain trapped until a human clicks approve.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold">✕</span>
                <span><strong>Scope creep:</strong> Clients shift requirements mid-contract without compensation.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold">✕</span>
                <span><strong>Ghosting nightmare:</strong> Weeks of customer support tickets if clients disappear.</span>
              </li>
            </ul>
          </div>

          {/* Trustflow Card */}
          <div className="trustflow-card p-6 md:p-8 space-y-5 border-blue-900/50 bg-zinc-900/60 shadow-xl">
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Trustflow Escrow Protocol
            </div>
            <ul className="space-y-3 text-xs md:text-sm text-zinc-200">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Zero take rate:</strong> Keep 100% of your earnings; minimal standard PayPal processing.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>72-Hour "Silence Means Yes":</strong> Funds auto-release if the client goes silent.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Locked criteria:</strong> Scope is immutable upfront; AI prevents feature bloat.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Instant real fiat:</strong> PayPal Payouts API disburses cash straight to your account.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works: 3 Steps (A2 in DESIGN.md) */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-900 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-[680px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
            How Trustflow works in three steps
          </h2>
          <p className="text-sm md:text-base text-zinc-400">
            From raw client prompt to verified payout in hours, not weeks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="trustflow-card p-6 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 font-mono font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-semibold text-white">AI Scope Decomposition</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Agent 1 transforms raw project briefs into 3 objective milestone tranches. Automated criteria (HTTP, DOM, routes) are separated from subjective design review.
            </p>
          </div>

          {/* Step 2 */}
          <div className="trustflow-card p-6 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 font-mono font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-semibold text-white">Upfront PayPal Escrow</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Client authorizes and captures 100% of the project budget upfront using the PayPal Orders API. The Bryntum Gantt board initializes with Milestone 1 active.
            </p>
          </div>

          {/* Step 3 */}
          <div className="trustflow-card p-6 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 font-mono font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-semibold text-white">Verified Autonomous Payout</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Freelancer submits preview URL. Agent 2 crawls and audits the work. Passing criteria trigger the PayPal Payouts API immediately, unlocking the next tranche.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Inspection Deep Dive (Anchor #inspection) */}
      <section id="inspection" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-900 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-[680px] mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-900/60 bg-blue-950/40 px-3 py-1 text-xs font-mono text-blue-400">
            <Bot className="h-3.5 w-3.5" />
            Agent 2 &bull; Multimodal Deliverable Inspector
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
            Objective deliverable verification without human bias
          </h2>
          <p className="text-sm md:text-base text-zinc-400">
            AI reasons and audits, but deterministic code validates URLs and triggers payouts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="trustflow-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Deterministic DOM &amp; HTTP Crawl</h3>
                <p className="text-xs text-zinc-400">Node Fetch + Cheerio validation engine</p>
              </div>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              When a deliverable URL is submitted, the crawler inspects HTTP response status (200 OK), checks the responsive viewport meta tag, verifies form inputs, and inspects routes before invoking the AI.
            </p>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-[11px] text-zinc-400 space-y-1">
              <div className="text-emerald-400">✓ GET https://staging.preview.app &rarr; 200 OK (142ms)</div>
              <div className="text-emerald-400">✓ meta[name="viewport"] responsive scale verified</div>
              <div className="text-emerald-400">✓ form input[type="email"] lead capture present</div>
            </div>
          </div>

          <div className="trustflow-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-950 text-blue-400 border border-blue-800/40">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">The 72h Silence-Means-Yes Safety Guard</h3>
                <p className="text-xs text-zinc-400">Guaranteed freelancer ghosting defense</p>
              </div>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              AI can <strong>never</strong> unilaterally reject work. If criteria contain subjective aesthetics, the deliverable routes to client review with a 72-hour countdown timer. If the client is silent, funds auto-release.
            </p>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-[11px] text-zinc-400 space-y-1">
              <div className="text-amber-400">⏳ In-Review: 72h countdown started for M2</div>
              <div className="text-zinc-400">&bull; Client approves &rarr; Instant PayPal Payout</div>
              <div className="text-zinc-400">&bull; Client silent &rarr; Auto-releases on timeout</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Bryntum Gantt Timeline Board Showcase (Anchor #timeline) */}
      <section id="timeline" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-900 max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-[680px] mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/60 bg-emerald-950/40 px-3 py-1 text-xs font-mono text-emerald-400">
            <Layers className="h-3.5 w-3.5" />
            Bryntum Sponsor Track &bull; Challenge Prompts #1 &amp; #6
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
            Interactive Bryntum Gantt Timeline Board
          </h2>
          <p className="text-sm md:text-base text-zinc-400">
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
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800/80 px-5 py-2.5 text-xs font-semibold text-zinc-200 transition-quick active:scale-95 shadow-sm"
          >
            <span>Open Full Interactive Cockpit Demo</span>
            <ExternalLink className="h-3.5 w-3.5 text-blue-400" />
          </Link>
        </div>
      </section>

      {/* FAQ Section (A2 in DESIGN.md: 6-12 questions) */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-900 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
            Frequently asked questions
          </h2>
          <p className="text-sm md:text-base text-zinc-400">
            Everything you need to know about Trustflow escrow and autonomous payout releases.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="trustflow-card overflow-hidden transition-quick border-zinc-800"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-white hover:text-blue-400 transition-quick"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs md:text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA Section (A2 & B1 in DESIGN.md: identical to top CTA) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-zinc-900 bg-zinc-950 text-center space-y-6">
        <div className="max-w-[680px] mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight hero-gradient-text">
            Start your next freelance contract with zero payment anxiety
          </h2>
          <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
            Protect your time with locked upfront escrow, automated AI verification, and guaranteed PayPal payouts.
          </p>
          <div className="pt-2">
            <Link
              href="/wizard"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-7 py-3.5 text-base font-semibold text-white transition-decelerate active:scale-95 shadow-lg shadow-blue-900/20"
            >
              Create Escrow Contract
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer (B10 ship requirements) */}
      <footer className="border-t border-zinc-900 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-300">Trustflow</span>
          <span>&copy; 2026. Built for PayPal AI Hackathon &amp; Bryntum Sponsor Track.</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-400">
          <Link href="/wizard" className="hover:text-white transition-quick">Scope Wizard</Link>
          <a href="#how-it-works" className="hover:text-white transition-quick">How It Works</a>
          <a href="#inspection" className="hover:text-white transition-quick">Inspection</a>
          <a href="#timeline" className="hover:text-white transition-quick">Gantt Board</a>
          <a href="#faq" className="hover:text-white transition-quick">FAQ</a>
        </div>
      </footer>
    </div>
  );
}
