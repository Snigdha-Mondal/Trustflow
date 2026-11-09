"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  ShieldCheck,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ExternalLink,
  Bot,
  User,
  CreditCard,
  AlertCircle,
  FileCheck,
  Send,
  Zap,
} from "lucide-react";
import GanttBoard, { GanttMilestone } from "@/components/GanttBoard";

interface Criterion {
  id: string;
  text: string;
  isAutomated: boolean;
  passed?: boolean | null;
  evidence?: string | null;
}

interface Inspection {
  id: string;
  submittedUrl: string;
  notes?: string | null;
  status: string;
  confidence: number;
  rawReport: string;
  createdAt: string;
}

interface Milestone {
  id: string;
  order: number;
  title: string;
  description: string;
  amount: number;
  durationDays: number;
  status: "LOCKED" | "ACTIVE" | "IN_REVIEW" | "PAID";
  startDate?: string | null;
  endDate?: string | null;
  payoutBatchId?: string | null;
  reviewDeadline?: string | null;
  criteria: Criterion[];
  inspections?: Inspection[];
}

interface Contract {
  id: string;
  title: string;
  description: string;
  totalBudget: number;
  currency: string;
  clientEmail: string;
  freelancerEmail: string;
  status: "DRAFT" | "FUNDED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  paypalOrderId?: string | null;
  paypalCaptureId?: string | null;
  milestones: Milestone[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectCockpitPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const contractId = resolvedParams.id;

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Funding state
  const [isFunding, setIsFunding] = useState(false);

  // Deliverable Submission state
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [submittedUrl, setSubmittedUrl] = useState("https://preview-sample.vercel.app");
  const [submissionNotes, setSubmissionNotes] = useState("Implemented Next.js responsive layout with validated lead capture form.");
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectionResult, setInspectionResult] = useState<any | null>(null);

  // Manual Payout / Action state
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  async function fetchContract() {
    try {
      const res = await fetch(`/api/contracts/${contractId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load contract");
      setContract(data.contract);
      if (data.contract.milestones.length > 0 && !selectedMilestone) {
        setSelectedMilestone(data.contract.milestones[0]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error loading contract");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContract();
  }, [contractId]);

  // Trigger PayPal Escrow Funding (Orders API create + capture)
  async function handleFundEscrow() {
    setIsFunding(true);
    setError(null);
    try {
      // Step 1: Create Order
      const createRes = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId }),
      });
      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.error || "Order creation failed");

      // Step 2: Capture Order into Platform Escrow
      const captureRes = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId, orderId: createData.order.id }),
      });
      const captureData = await captureRes.json();
      if (!captureRes.ok) throw new Error(captureData.error || "Order capture failed");

      setContract(captureData.contract);
      if (captureData.contract.milestones.length > 0) {
        setSelectedMilestone(captureData.contract.milestones[0]);
      }

      confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Funding failed");
    } finally {
      setIsFunding(false);
    }
  }

  // Trigger Agent 2 Deliverable Inspection
  async function handleInspectDeliverable(milestoneId: string) {
    setIsInspecting(true);
    setError(null);
    setInspectionResult(null);

    try {
      const res = await fetch("/api/deliverable/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId,
          milestoneId,
          submittedUrl,
          notes: submissionNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Inspection failed");

      setInspectionResult(data);
      setContract(data.contract);

      // If instant payout triggered, fire confetti!
      if (data.inspectionResult?.status === "PASSED") {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ["#10B981", "#3B82F6", "#F59E0B"],
        });
      }

      // Update selected milestone
      const updatedM = data.contract.milestones.find((m: Milestone) => m.id === milestoneId);
      if (updatedM) setSelectedMilestone(updatedM);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Deliverable inspection failed");
    } finally {
      setIsInspecting(false);
    }
  }

  // Client Manual Release or 72h Silence-Means-Yes Auto-Release
  async function handleReleasePayout(milestoneId: string, forceAutoRelease = false) {
    setIsProcessingAction(true);
    setError(null);
    try {
      const endpoint = forceAutoRelease ? "/api/milestones/auto-release" : "/api/paypal/payout";
      const payload = forceAutoRelease
        ? { contractId, milestoneId, force: true }
        : { contractId, milestoneId };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payout release failed");

      setContract(data.contract);
      const updatedM = data.contract.milestones.find((m: Milestone) => m.id === milestoneId);
      if (updatedM) setSelectedMilestone(updatedM);

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payout execution failed");
    } finally {
      setIsProcessingAction(false);
    }
  }

  // Agent-Driven Rescheduling (Bryntum Sponsor Prompt #6)
  async function handleReschedule(delayDays: number) {
    try {
      const res = await fetch("/api/milestones/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId, delayDays }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reschedule failed");
      setContract(data.contract);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Reschedule failed");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="text-sm font-mono">Loading Escrow Cockpit...</span>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-zinc-300 p-8">
        <AlertCircle className="h-10 w-10 text-red-400 mb-3" />
        <h2 className="text-xl font-semibold">Contract Not Found</h2>
        <Link href="/wizard" className="mt-4 text-sm text-blue-400 hover:underline">
          Return to Scope Wizard
        </Link>
      </div>
    );
  }

  const paidTotal = contract.milestones
    .filter((m) => m.status === "PAID")
    .reduce((sum, m) => sum + m.amount, 0);

  const activeMilestone = contract.milestones.find((m) => m.status === "ACTIVE");
  const inReviewMilestone = contract.milestones.find((m) => m.status === "IN_REVIEW");

  return (
    <div className="min-h-screen bg-black text-zinc-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation & Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-quick"
            >
              <ChevronLeft className="h-4 w-4" />
              Overview
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-sm font-mono text-zinc-300 truncate max-w-xs">{contract.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs font-mono">
              <span className={`h-2 w-2 rounded-full ${
                contract.status === "COMPLETED"
                  ? "bg-emerald-500"
                  : contract.status === "FUNDED"
                  ? "bg-blue-500 animate-pulse"
                  : "bg-amber-500"
              }`} />
              <span>Contract: {contract.status}</span>
            </div>

            <div className="inline-flex items-center gap-1 text-xs font-mono text-zinc-400">
              <span className="text-zinc-500">ID:</span>
              <span>{contract.id.slice(0, 10)}...</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-900/60 bg-red-950/40 p-4 text-sm text-red-300 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Contract Escrow Overview Banner */}
        <div className="trustflow-card p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                PayPal Escrow Protected &bull; 72-Hour "Silence Means Yes" Guarantee
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                {contract.title}
              </h1>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {contract.description}
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Client: <span className="text-zinc-200 font-mono">{contract.clientEmail}</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Freelancer: <span className="text-zinc-200 font-mono">{contract.freelancerEmail}</span></span>
                </div>
              </div>
            </div>

            {/* Financial Status Box */}
            <div className="flex flex-col items-end justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 min-w-[240px] space-y-2">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">Total Project Escrow</span>
              <div className="text-3xl font-mono font-bold text-white">
                ${contract.totalBudget.toFixed(2)} <span className="text-sm font-sans text-zinc-400">{contract.currency}</span>
              </div>
              <div className="text-xs text-zinc-400 font-mono">
                Disbursed to Freelancer: <span className="text-emerald-400 font-bold">${paidTotal.toFixed(2)}</span>
              </div>

              {contract.status === "DRAFT" ? (
                <button
                  type="button"
                  disabled={isFunding}
                  onClick={handleFundEscrow}
                  className="w-full mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0070BA] hover:bg-[#005EA6] px-4 py-2.5 text-xs font-semibold text-white transition-decelerate active:scale-95 shadow-lg shadow-blue-900/20"
                >
                  <CreditCard className="h-4 w-4" />
                  {isFunding ? "Authorizing PayPal..." : `Fund $${contract.totalBudget.toFixed(2)} via PayPal`}
                </button>
              ) : (
                <div className="mt-2 w-full flex items-center justify-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 rounded-md py-1 px-2">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Escrow Locked in PayPal</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Bryntum Gantt Timeline Board */}
        <GanttBoard
          milestones={contract.milestones as GanttMilestone[]}
          totalBudget={contract.totalBudget}
          currency={contract.currency}
          onSelectMilestone={(m) => setSelectedMilestone(m as Milestone)}
          onReschedule={handleReschedule}
        />

        {/* Milestone Detail & Deliverable Inspection Section */}
        {selectedMilestone && (
          <div className="trustflow-card p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 text-sm font-bold">
                  M{selectedMilestone.order}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedMilestone.title}</h3>
                  <p className="text-xs text-zinc-400">{selectedMilestone.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-lg font-mono font-bold text-emerald-400">
                    ${selectedMilestone.amount.toFixed(2)}
                  </div>
                  <div className="text-xs text-zinc-500 font-mono">{selectedMilestone.durationDays} days duration</div>
                </div>

                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                  selectedMilestone.status === "PAID"
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                    : selectedMilestone.status === "ACTIVE"
                    ? "bg-blue-950 text-blue-400 border border-blue-800 animate-pulse"
                    : selectedMilestone.status === "IN_REVIEW"
                    ? "bg-amber-950 text-amber-400 border border-amber-800"
                    : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                }`}>
                  {selectedMilestone.status}
                </span>
              </div>
            </div>

            {/* Criteria Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
                Agreed Sign-Off Criteria & Verification Dossier
              </h4>

              <div className="grid grid-cols-1 gap-2.5">
                {selectedMilestone.criteria.map((c) => (
                  <div
                    key={c.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3.5 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      {c.passed === true ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      ) : selectedMilestone.status === "PAID" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-zinc-600 flex-shrink-0" />
                      )}
                      <span className="text-zinc-200 font-medium">{c.text}</span>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                        c.isAutomated
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/40"
                          : "bg-amber-950/80 text-amber-400 border border-amber-800/40"
                      }`}>
                        {c.isAutomated ? "Automated Inspection" : "Subjective (72h Silence-Means-Yes)"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Zone: Deliverable Submission & Inspection */}
            {selectedMilestone.status === "ACTIVE" && (
              <div className="rounded-xl border border-blue-900/60 bg-blue-950/20 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-300">
                    <Sparkles className="h-4 w-4 text-blue-400" />
                    <span>Submit Deliverable for Autonomous AI Inspection</span>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">Agent 2: Inspector Active</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-zinc-300 font-medium mb-1">
                      Live Preview URL or GitHub Staging Deployment
                    </label>
                    <input
                      type="url"
                      value={submittedUrl}
                      onChange={(e) => setSubmittedUrl(e.target.value)}
                      placeholder="https://your-preview-staging.vercel.app"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 font-medium mb-1">
                      Freelancer Handover Notes
                    </label>
                    <textarea
                      rows={2}
                      value={submissionNotes}
                      onChange={(e) => setSubmissionNotes(e.target.value)}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={isInspecting}
                    onClick={() => handleInspectDeliverable(selectedMilestone.id)}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs font-semibold text-white transition-decelerate active:scale-95 disabled:opacity-50"
                  >
                    <Bot className="h-4 w-4" />
                    {isInspecting ? "Auditing Code & Live Preview..." : "Run Inspection & Trigger Payout"}
                  </button>
                </div>
              </div>
            )}

            {/* 72-Hour "Silence Means Yes" Zone */}
            {selectedMilestone.status === "IN_REVIEW" && (
              <div className="rounded-xl border border-amber-900/60 bg-amber-950/20 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
                    <Clock className="h-4 w-4 text-amber-400" />
                    <span>In Review: 72-Hour "Silence Means Yes" Auto-Release Active</span>
                  </div>
                  <span className="text-xs font-mono text-amber-400">
                    Auto-releases on timeout
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  Automated checks passed. Deliverable contains subjective aesthetic criteria. If the client does not object within 72 hours, the full ${selectedMilestone.amount.toFixed(2)} milestone funds automatically disburse to the freelancer.
                </p>

                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    type="button"
                    disabled={isProcessingAction}
                    onClick={() => handleReleasePayout(selectedMilestone.id, false)}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition-quick active:scale-95 disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {isProcessingAction ? "Processing..." : `Client Sign-Off: Release $${selectedMilestone.amount.toFixed(2)}`}
                  </button>

                  <button
                    type="button"
                    disabled={isProcessingAction}
                    onClick={() => handleReleasePayout(selectedMilestone.id, true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-amber-800 bg-amber-950/60 hover:bg-amber-900/60 px-4 py-2 text-xs font-semibold text-amber-300 transition-quick active:scale-95 disabled:opacity-50"
                  >
                    <Zap className="h-4 w-4 text-amber-400" />
                    Simulate 72h Timeout Expiration
                  </button>
                </div>
              </div>
            )}

            {/* Paid Confirmation Receipt */}
            {selectedMilestone.status === "PAID" && (
              <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/20 p-5 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Milestone Disbursed via PayPal Payouts API</span>
                </div>
                <div className="text-xs font-mono text-zinc-400">
                  Transaction Batch ID: <span className="text-zinc-200">{selectedMilestone.payoutBatchId || "BATCH_SIM_78912"}</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Funds released directly to freelancer account ({contract.freelancerEmail}). Next tranche unlocked on Gantt timeline.
                </p>
              </div>
            )}

            {/* Inspection Dossier Display */}
            {inspectionResult && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <FileCheck className="h-4 w-4 text-emerald-400" />
                    Deliverable Verification Dossier
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    Confidence: {(inspectionResult.inspectionResult.confidence * 100).toFixed(1)}%
                  </span>
                </div>

                <p className="text-xs text-zinc-300">{inspectionResult.inspectionResult.summary}</p>

                <div className="space-y-2">
                  {inspectionResult.inspectionResult.criteriaAudits.map((a: any) => (
                    <div key={a.id} className="rounded-lg border border-zinc-800/80 bg-zinc-900/80 p-3 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">{a.text}</span>
                        <span className={a.passed ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                          {a.passed ? "VERIFIED" : "PENDING REVIEW"}
                        </span>
                      </div>
                      <p className="text-zinc-400 font-mono text-[11px]">{a.evidence}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
