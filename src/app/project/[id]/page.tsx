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
  RefreshCw,
  X,
  MessageSquare,
  HelpCircle,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import GanttBoard, { GanttMilestone } from "@/components/GanttBoard";
import TakeoverModal from "@/components/TakeoverModal";
import type { TakeoverBrief } from "@/lib/handoff";

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
  status: "LOCKED" | "ACTIVE" | "IN_REVIEW" | "PAID" | "ABANDONED";
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
  status: "DRAFT" | "FUNDED" | "ACTIVE" | "COMPLETED" | "CANCELLED" | "ABANDONED_REFUNDED";
  paypalOrderId?: string | null;
  paypalCaptureId?: string | null;
  refundId?: string | null;
  refundedAmount?: number | null;
  handoffDossier?: string | null;
  milestones: Milestone[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

type ActiveRole = "ALL" | "CLIENT" | "FREELANCER";

export default function ProjectCockpitPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const contractId = resolvedParams.id;

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Role simulation switcher (Client vs Freelancer vs Judge Demo)
  const [activeRole, setActiveRole] = useState<ActiveRole>("ALL");

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

  // Client Revision Request Modal
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionFeedback, setRevisionFeedback] = useState("Please adjust mobile button padding and tweak hero copy per the design system.");
  const [revisionDays, setRevisionDays] = useState(2);
  const [isSubmittingRevision, setIsSubmittingRevision] = useState(false);

  // Demo Reset state
  const [isResettingDemo, setIsResettingDemo] = useState(false);

  // 72h Silence Means Yes Simulation States
  const [isSimulatingReview, setIsSimulatingReview] = useState(false);
  const [isAutoReleasing, setIsAutoReleasing] = useState(false);

  // Freelancer Ghosting Protection states
  const [isSimulatingInactivity, setIsSimulatingInactivity] = useState(false);
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);
  const [showTakeoverModal, setShowTakeoverModal] = useState(false);
  const [takeoverBrief, setTakeoverBrief] = useState<TakeoverBrief | null>(null);
  const [refundReceipt, setRefundReceipt] = useState<{
    refundId: string;
    amount: number;
    currency: string;
    recipient?: string;
  } | null>(null);

  async function fetchContract() {
    try {
      const res = await fetch(`/api/contracts/${contractId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load contract");
      setContract(data.contract);

      // Hydrate handoff dossier if present
      if (data.contract.handoffDossier) {
        try {
          const parsed = JSON.parse(data.contract.handoffDossier);
          setTakeoverBrief(parsed);
        } catch {
          // ignore
        }
      }

      if (data.contract.refundId && data.contract.refundedAmount) {
        setRefundReceipt({
          refundId: data.contract.refundId,
          amount: data.contract.refundedAmount,
          currency: data.contract.currency || "USD",
          recipient: data.contract.clientEmail,
        });
      }

      if (data.contract.milestones.length > 0 && !selectedMilestone) {
        setSelectedMilestone(data.contract.milestones[0]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error loading contract");
    } finally {
      setLoading(false);
    }
  }

  // Determine if a milestone has triggered a 72-hour inactivity warning
  const isOverdue = (m: Milestone) => {
    if (contract?.status === "ABANDONED_REFUNDED") return false;
    if (isSimulatingInactivity && m.status === "ACTIVE") return true;
    if (m.status === "ACTIVE" && m.endDate && new Date(m.endDate).getTime() < Date.now()) return true;
    return false;
  };

  // Reset Demo Contract to fresh state
  async function handleResetDemo() {
    setIsResettingDemo(true);
    setError(null);
    try {
      const res = await fetch("/api/demo/reset", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset demo");
      setContract(data.contract);
      setSelectedMilestone(data.contract.milestones[0]);
      setIsSimulatingInactivity(false);
      setTakeoverBrief(null);
      setRefundReceipt(null);
      setSuccessMessage("Demo contract reset to fresh state! (Milestone 1 Paid, Milestone 2 Active).");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setIsResettingDemo(false);
    }
  }

  // Claim Inactivity Refund & Generate AI Takeover Brief
  async function handleClaimInactivityRefund() {
    setIsProcessingRefund(true);
    setError(null);
    try {
      // Step 1: PayPal Escrow Refund Route (POST /api/paypal/refund)
      const refundRes = await fetch("/api/paypal/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId,
          reason: "Freelancer milestone overdue > 72 hours with zero activity. Triggering Trustflow Ghosting Protection refund.",
        }),
      });

      const refundData = await refundRes.json();
      if (!refundRes.ok) throw new Error(refundData.error || "PayPal refund execution failed");

      // Step 2: Agent 3 AI Continuity Handoff Generator (POST /api/handoff/generate)
      const handoffRes = await fetch("/api/handoff/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId, forceRefresh: true }),
      });

      const handoffData = await handoffRes.json();
      if (!handoffRes.ok) throw new Error(handoffData.error || "AI handoff generator failed");

      setTakeoverBrief(handoffData.takeoverBrief);
      setRefundReceipt({
        refundId: refundData.refundId,
        amount: refundData.refundedAmount,
        currency: refundData.currency || "USD",
        recipient: contract?.clientEmail,
      });

      // Refresh contract state
      await fetchContract();
      setShowTakeoverModal(true);
      setSuccessMessage(
        `Freelancer Ghosting Protection executed! $${refundData.refundedAmount.toFixed(2)} refunded to client PayPal account. Turnkey Takeover Brief generated.`
      );
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 },
        colors: ["#F59E0B", "#10B981", "#DAF99C"],
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Inactivity refund claim failed");
    } finally {
      setIsProcessingRefund(false);
    }
  }

  // Simulate Transition to 72h Review State (Silence Means Yes)
  async function handleSimulateReview(milestoneId?: string) {
    const targetId =
      milestoneId ||
      contract?.milestones.find((m) => m.status === "ACTIVE")?.id ||
      selectedMilestone?.id;

    if (!targetId) {
      setError("No active milestone found to submit for review.");
      return;
    }

    setIsSimulatingReview(true);
    setError(null);
    try {
      const res = await fetch("/api/milestones/simulate-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId, milestoneId: targetId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit for review");
      setContract(data.contract);
      const updated = data.contract.milestones.find((m: Milestone) => m.id === targetId);
      if (updated) setSelectedMilestone(updated);
      setSuccessMessage(
        'Milestone entered 72-Hour "Silence Means Yes" review window! Timer active.'
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to simulate review");
    } finally {
      setIsSimulatingReview(false);
    }
  }

  // Trigger 72h Silence-Means-Yes Auto-Release
  async function handleTriggerSilenceAutoRelease(milestoneId?: string) {
    const targetId =
      milestoneId ||
      contract?.milestones.find((m) => m.status === "IN_REVIEW")?.id ||
      contract?.milestones.find((m) => m.status === "ACTIVE")?.id ||
      selectedMilestone?.id;

    if (!targetId) {
      setError("No milestone available to auto-release.");
      return;
    }

    setIsAutoReleasing(true);
    setError(null);
    try {
      await handleReleasePayout(targetId, true);
    } finally {
      setIsAutoReleasing(false);
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
      const createRes = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId }),
      });
      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.error || "Order creation failed");

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

      setSuccessMessage(`PayPal Escrow Funded! Captured $${captureData.contract.totalBudget.toFixed(2)} USD into platform custody.`);
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

      if (data.inspectionResult?.status === "PASSED") {
        setSuccessMessage(`All automated criteria verified! Disbursed $${data.contract.milestones.find((m: Milestone) => m.id === milestoneId)?.amount.toFixed(2)} via PayPal Payouts.`);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ["#10B981", "#3B82F6", "#F59E0B"],
        });
      } else {
        setSuccessMessage(`Deliverable inspected. Work flagged for client review under 72-Hour "Silence Means Yes" guarantee.`);
      }

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

      setSuccessMessage(
        forceAutoRelease
          ? `Milestone auto-released on 72h timeout! Funds sent via PayPal Payouts.`
          : `Client approved deliverable! Payout disbursed via PayPal Payouts.`
      );
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payout execution failed");
    } finally {
      setIsProcessingAction(false);
    }
  }

  // Client Revision Request & Agent Rescheduling (Bryntum Prompt #6)
  async function handleSubmitRevision(milestoneId: string) {
    setIsSubmittingRevision(true);
    setError(null);
    try {
      const res = await fetch("/api/milestones/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId, delayDays: revisionDays }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reschedule failed");
      setContract(data.contract);
      setShowRevisionModal(false);
      setSuccessMessage(`Revision logged: "${revisionFeedback}". Bryntum Gantt schedule recalculated by +${revisionDays} days.`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Revision submission failed");
    } finally {
      setIsSubmittingRevision(false);
    }
  }

  // General Agent-Driven Reschedule Handler
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
      setSuccessMessage(`Bryntum schedule recalculated: shifted downstream milestones by ${delayDays} days.`);
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

  const unreleasedTotal = Math.max(0, contract.totalBudget - paidTotal);

  const activeOrReviewMilestone =
    contract.milestones.find((m) => m.status === "IN_REVIEW") ||
    contract.milestones.find((m) => m.status === "ACTIVE") ||
    selectedMilestone;

  return (
    <div className="min-h-screen bg-[#141517] text-zinc-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation & Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Overview
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-sm font-mono text-zinc-300 truncate max-w-xs">{contract.title}</span>
          </div>

          {/* Role Simulation Switcher */}
          <div className="flex items-center gap-2 rounded-none border border-white/10 bg-[#1C1D20] p-1 text-xs font-medium shadow-sm">
            <button
              type="button"
              onClick={() => setActiveRole("ALL")}
              className={`rounded-none px-3.5 py-1 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                activeRole === "ALL"
                  ? "bg-[#DAF99C] text-[#0E1012] font-semibold shadow-md shadow-[#DAF99C]/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Demo / Judge View
            </button>
            <button
              type="button"
              onClick={() => setActiveRole("CLIENT")}
              className={`rounded-none px-3.5 py-1 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                activeRole === "CLIENT"
                  ? "bg-white text-[#0E1012] font-semibold border border-white/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Client: Sarah
            </button>
            <button
              type="button"
              onClick={() => setActiveRole("FREELANCER")}
              className={`rounded-none px-3.5 py-1 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                activeRole === "FREELANCER"
                  ? "bg-[#DAF99C] text-[#0E1012] font-semibold border border-[#DAF99C]/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Freelancer: Alex
            </button>

            {contract.id === "demo-contract-2026" && (
              <button
                type="button"
                disabled={isResettingDemo}
                onClick={handleResetDemo}
                className="rounded-none border-l border-white/10 pl-2.5 pr-2 py-1 text-[11px] text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 font-mono"
                title="Reset demo contract back to default state (M1 Paid, M2 Active)"
              >
                <RefreshCw className={`h-3 w-3 ${isResettingDemo ? "animate-spin text-[#DAF99C]" : "text-zinc-500"}`} />
                <span>{isResettingDemo ? "Resetting..." : "Reset Demo"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Role Helper Banner */}
        {activeRole === "CLIENT" && (
          <div className="rounded-xl border border-white/10 bg-[#1C1D20] p-4 text-xs text-zinc-200 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[#DAF99C] flex-shrink-0" />
              <span>
                <strong>Viewing as Client ({contract.clientEmail}):</strong> You fund escrow upfront into PayPal. Review deliverable preview links, approve payouts, or request revisions.
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase text-[#0E1012] bg-[#DAF99C] font-semibold px-2 py-0.5 rounded">
              Buyer Role
            </span>
          </div>
        )}

        {activeRole === "FREELANCER" && (
          <div className="rounded-xl border border-[#DAF99C]/30 bg-[#DAF99C]/[0.08] p-4 text-xs text-zinc-200 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[#DAF99C] flex-shrink-0" />
              <span>
                <strong>Viewing as Freelancer ({contract.freelancerEmail}):</strong> Complete active milestones, submit live staging URLs for Agent 2 AI inspection, and receive direct PayPal payouts.
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase text-[#0E1012] bg-[#DAF99C] font-semibold px-2 py-0.5 rounded">
              Provider Role
            </span>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-900/60 bg-red-950/40 p-4 text-sm text-red-300 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/40 p-4 text-sm text-emerald-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessMessage(null)}
              className="text-zinc-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Abandoned & Refunded Status Banner */}
        {contract.status === "ABANDONED_REFUNDED" && (
          <div className="rounded-none border border-amber-500/40 bg-amber-500/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <div className="font-semibold text-amber-200 text-sm flex items-center gap-2">
                  <span>Contract Abandoned &amp; Escrow Refunded via PayPal</span>
                  <span className="font-mono text-[10px] bg-amber-400/20 px-2 py-0.5 border border-amber-400/40 text-amber-300">
                    72h Ghosting Protection
                  </span>
                </div>
                <div className="text-zinc-300 text-xs mt-1">
                  Remaining unreleased escrow balance of <strong className="text-white font-mono">${(contract.refundedAmount || (contract.totalBudget - paidTotal)).toFixed(2)} USD</strong> was refunded back to your PayPal account.
                  Completed milestones remain safely disbursed to the previous contributor.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowTakeoverModal(true)}
              className="lime-button inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-none flex-shrink-0 shadow-md"
            >
              <FileCheck className="h-4 w-4 text-[#0E1012]" />
              <span>View AI Takeover Brief</span>
            </button>
          </div>
        )}

        {/* Symmetrical Dual Ghosting Protection Dashboard (Client & Freelancer Fair Protection) */}
        {contract.status !== "ABANDONED_REFUNDED" && contract.status !== "DRAFT" && (
          <div className="rounded-none border border-white/10 bg-[#161719] p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#DAF99C] animate-pulse" />
                <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-white">
                  Symmetrical Ghosting Protection Protocol
                </h3>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                Guaranteed fairness for both Client &amp; Freelancer &bull; 72-Hour Deadlines
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Client Ghosting Protection ("Silence Means Yes") */}
              <div className="rounded-none border border-[#DAF99C]/30 bg-[#1C1D20] p-4 flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#DAF99C]">
                      <Clock className="h-4 w-4 text-[#DAF99C]" />
                      <span>Client Ghosting ("Silence Means Yes")</span>
                    </div>
                    {activeOrReviewMilestone && (
                      <span className="font-mono text-[10px] bg-[#DAF99C]/10 text-[#DAF99C] border border-[#DAF99C]/20 px-2 py-0.5">
                        M{activeOrReviewMilestone.order}: {activeOrReviewMilestone.status}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    If freelancer submits work and client is silent for &gt;72h, escrow funds <strong>auto-release to freelancer</strong> via PayPal Payouts.
                  </p>
                  {activeOrReviewMilestone && activeOrReviewMilestone.status !== "PAID" ? (
                    <div className="text-[11px] font-mono text-zinc-400 bg-black/30 p-2 border border-white/5">
                      Target: <span className="text-white font-medium">{activeOrReviewMilestone.title}</span> (${activeOrReviewMilestone.amount.toFixed(2)} USD)
                    </div>
                  ) : (
                    <div className="text-[11px] font-mono text-emerald-400 bg-black/30 p-2 border border-white/5">
                      ✓ All milestones completed &amp; disbursed!
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                  {activeOrReviewMilestone && activeOrReviewMilestone.status === "ACTIVE" && (
                    <button
                      type="button"
                      disabled={isSimulatingReview}
                      onClick={() => handleSimulateReview(activeOrReviewMilestone.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none font-mono text-xs transition-colors border bg-[#25272B] text-zinc-200 border-white/10 hover:text-white hover:border-white/20 disabled:opacity-50"
                      title="Set milestone into 72-hour review window with active countdown"
                    >
                      <Clock className="h-3 w-3 text-[#DAF99C]" />
                      <span>{isSimulatingReview ? "Submitting..." : "1. Enter 72h Review State"}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={isAutoReleasing || isProcessingAction || !activeOrReviewMilestone || activeOrReviewMilestone.status === "PAID"}
                    onClick={() => handleTriggerSilenceAutoRelease(activeOrReviewMilestone?.id)}
                    className="lime-button inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-none transition-all active:scale-[0.98] disabled:opacity-50"
                    title="Simulate 72h passing with zero client response to auto-release funds to freelancer"
                  >
                    <Zap className="h-3.5 w-3.5 text-[#0E1012]" />
                    <span>{isAutoReleasing || isProcessingAction ? "Auto-Releasing..." : "⚡ Trigger 72h Auto-Release Payout"}</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Freelancer Ghosting Protection (Inactivity Refund & Agent 3) */}
              <div className="rounded-none border border-amber-500/30 bg-[#1C1D20] p-4 flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                      <ShieldAlert className="h-4 w-4 text-amber-400" />
                      <span>Freelancer Ghosting (Inactivity Refund)</span>
                    </div>
                    <span className="font-mono text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5">
                      ${unreleasedTotal.toFixed(2)} USD in Escrow
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    If freelancer is inactive past deadline (&gt;72h), client claims <strong>instant PayPal refund</strong> of unreleased escrow + generates <strong>Agent 3 Takeover Brief</strong>.
                  </p>
                  <div className="text-[11px] font-mono text-zinc-400 bg-black/30 p-2 border border-white/5">
                    Unreleased Escrow: <span className="text-amber-300 font-semibold">${unreleasedTotal.toFixed(2)} USD</span> &bull; {contract.milestones.filter(m => m.status !== "PAID").length} Milestones Remaining
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                  {activeRole === "ALL" && (
                    <button
                      type="button"
                      onClick={() => setIsSimulatingInactivity(!isSimulatingInactivity)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none font-mono text-xs transition-colors border ${
                        isSimulatingInactivity
                          ? "bg-amber-400 text-black border-amber-300 font-bold"
                          : "bg-[#25272B] text-zinc-300 border-white/10 hover:text-white"
                      }`}
                      title="Toggle simulation of milestone overdue > 72 hours"
                    >
                      <AlertTriangle className="h-3 w-3" />
                      <span>{isSimulatingInactivity ? "Clear 72h Inactivity" : "Simulate 72h Inactivity"}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={isProcessingRefund || unreleasedTotal <= 0}
                    onClick={handleClaimInactivityRefund}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-none bg-amber-400 hover:bg-amber-300 text-black transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    <ShieldAlert className="h-3.5 w-3.5 text-black" />
                    <span>{isProcessingRefund ? "Processing Refund..." : "Claim Inactivity Refund & Generate Handoff"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contract Escrow Overview Banner */}
        <div className="luxury-card p-6 md:p-8 space-y-6">
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
            <div className="flex flex-col items-end justify-center rounded-xl border border-white/10 bg-[#25272B] p-5 min-w-[240px] space-y-2">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">Total Project Escrow</span>
              <div className="text-3xl font-mono font-bold text-white">
                ${contract.totalBudget.toFixed(2)} <span className="text-sm font-sans text-zinc-400">{contract.currency}</span>
              </div>
              <div className="text-xs text-zinc-400 font-mono">
                Disbursed to Freelancer: <span className="text-[#DAF99C] font-bold">${paidTotal.toFixed(2)}</span>
              </div>

              {contract.status === "DRAFT" ? (
                <button
                  type="button"
                  disabled={isFunding}
                  onClick={handleFundEscrow}
                  className="lime-button w-full mt-3 inline-flex items-center justify-center gap-2 rounded-none px-4 py-2.5 text-xs font-semibold active:scale-[0.98] shadow-lg shadow-[#DAF99C]/20"
                >
                  <CreditCard className="h-4 w-4 text-[#0E1012]" />
                  {isFunding ? "Authorizing PayPal..." : `Fund $${contract.totalBudget.toFixed(2)} via PayPal`}
                </button>
              ) : (
                <div className="w-full mt-2 space-y-1">
                  <div className="w-full flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#0E1012] bg-[#DAF99C] font-semibold rounded-none py-1 px-2">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Escrow Locked in PayPal</span>
                  </div>
                  {activeRole === "ALL" && (
                    <button
                      type="button"
                      disabled={isFunding}
                      onClick={handleFundEscrow}
                      className="w-full text-[10px] font-mono text-zinc-400 hover:text-[#DAF99C] transition-colors text-center pt-0.5 block"
                      title="Re-run the live PayPal sandbox order creation & capture flow"
                    >
                      {isFunding ? "Authorizing PayPal Orders..." : "↻ Test PayPal Funding Flow"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Bryntum Gantt Timeline Board */}
        <GanttBoard
          milestones={contract.milestones.map((m) => ({
            ...m,
            isInactivityOverdue: isOverdue(m),
          })) as GanttMilestone[]}
          totalBudget={contract.totalBudget}
          currency={contract.currency}
          onSelectMilestone={(m) => setSelectedMilestone(m as Milestone)}
          onReschedule={handleReschedule}
          onClaimInactivityRefund={handleClaimInactivityRefund}
        />

        {/* Milestone Detail & Deliverable Inspection Section */}
        {selectedMilestone && (
          <div className="luxury-card p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DAF99C] text-[#0E1012] text-sm font-bold">
                  M{selectedMilestone.order}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedMilestone.title}</h3>
                  <p className="text-xs text-zinc-400">{selectedMilestone.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-lg font-mono font-bold text-[#DAF99C]">
                    ${selectedMilestone.amount.toFixed(2)}
                  </div>
                  <div className="text-xs text-zinc-500 font-mono">{selectedMilestone.durationDays} days duration</div>
                </div>

                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                  selectedMilestone.status === "PAID"
                    ? "bg-[#DAF99C] text-[#0E1012]"
                    : selectedMilestone.status === "ACTIVE"
                    ? "bg-white text-[#0E1012]"
                    : selectedMilestone.status === "IN_REVIEW"
                    ? "bg-[#FBBF24] text-[#0E1012]"
                    : "bg-[#25272B] text-zinc-400 border border-white/10"
                }`}>
                  {selectedMilestone.status}
                </span>
              </div>
            </div>

            {/* Criteria Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
                Agreed Sign-Off Criteria &amp; Verification Dossier
              </h4>

              <div className="grid grid-cols-1 gap-2.5">
                {selectedMilestone.criteria.map((c) => (
                  <div
                    key={c.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#161719] p-3.5 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      {c.passed === true ? (
                        <CheckCircle2 className="h-4 w-4 text-[#DAF99C] flex-shrink-0" />
                      ) : selectedMilestone.status === "PAID" ? (
                        <CheckCircle2 className="h-4 w-4 text-[#DAF99C] flex-shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-zinc-600 flex-shrink-0" />
                      )}
                      <span className="text-zinc-200 font-medium">{c.text}</span>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        c.isAutomated
                          ? "bg-[#DAF99C] text-[#0E1012]"
                          : "bg-[#FBBF24] text-[#0E1012]"
                      }`}>
                        {c.isAutomated ? "Automated Inspection" : "Subjective (72h Silence-Means-Yes)"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Zone: Deliverable Submission & Inspection (Freelancer View / All) */}
            {selectedMilestone.status === "ACTIVE" && (activeRole === "ALL" || activeRole === "FREELANCER") && (
              <div className="rounded-xl border border-[#DAF99C]/30 bg-[#DAF99C]/[0.05] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Sparkles className="h-4 w-4 text-[#DAF99C]" />
                    <span>Submit Deliverable for Autonomous AI Inspection</span>
                  </div>
                  <span className="text-xs font-mono text-[#DAF99C] font-semibold">Agent 2: Inspector Ready</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-zinc-300 font-medium mb-1">
                      Live Preview URL or Staging Deployment Link
                    </label>
                    <input
                      type="url"
                      value={submittedUrl}
                      onChange={(e) => setSubmittedUrl(e.target.value)}
                      placeholder="https://your-preview-staging.vercel.app"
                      className="w-full rounded-lg border border-white/10 bg-[#161719] p-2.5 text-xs text-white focus:border-[#DAF99C] focus:outline-none font-mono"
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
                      className="w-full rounded-lg border border-white/10 bg-[#161719] p-2.5 text-xs text-white focus:border-[#DAF99C] focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      disabled={isInspecting}
                      onClick={() => handleInspectDeliverable(selectedMilestone.id)}
                      className="lime-button inline-flex items-center gap-2 rounded-none px-5 py-2.5 text-xs font-semibold active:scale-[0.98] disabled:opacity-50"
                    >
                      <Bot className="h-4 w-4 text-[#0E1012]" />
                      {isInspecting ? "Auditing Code & Live Preview..." : "Run Inspection & Trigger Payout"}
                    </button>

                    <button
                      type="button"
                      disabled={isSimulatingReview}
                      onClick={() => handleSimulateReview(selectedMilestone.id)}
                      className="inline-flex items-center gap-2 rounded-none border border-[#DAF99C]/30 bg-[#DAF99C]/10 hover:bg-[#DAF99C]/20 px-4 py-2.5 text-xs font-semibold text-[#DAF99C] transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
                      title="Transition this milestone into 72h review state to test Silence Means Yes countdown"
                    >
                      <Clock className="h-4 w-4 text-[#DAF99C]" />
                      {isSimulatingReview ? "Submitting..." : "Submit for 72h Review"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 72-Hour "Silence Means Yes" Zone */}
            {selectedMilestone.status === "IN_REVIEW" && (
              <div className="rounded-none border border-[#FBBF24]/40 bg-[#FBBF24]/10 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#FBBF24]">
                    <Clock className="h-4 w-4 text-[#FBBF24]" />
                    <span>In Review: 72-Hour "Silence Means Yes" Auto-Release Active</span>
                  </div>
                  <span className="text-xs font-mono text-[#FBBF24] font-semibold">
                    Auto-releases on timeout
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  Automated checks passed. Deliverable contains subjective aesthetic criteria. If the client does not object within 72 hours, the full ${selectedMilestone.amount.toFixed(2)} milestone funds automatically disburse to the freelancer.
                </p>

                <div className="flex flex-wrap gap-3 pt-1">
                  {/* Client Sign-off Action */}
                  {(activeRole === "ALL" || activeRole === "CLIENT") && (
                    <>
                      <button
                        type="button"
                        disabled={isProcessingAction}
                        onClick={() => handleReleasePayout(selectedMilestone.id, false)}
                        className="lime-button inline-flex items-center gap-2 rounded-none px-4 py-2 text-xs font-semibold active:scale-[0.98] disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-4 w-4 text-[#0E1012]" />
                        {isProcessingAction ? "Processing..." : `Client Sign-Off: Release $${selectedMilestone.amount.toFixed(2)}`}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowRevisionModal(true)}
                        className="inline-flex items-center gap-2 rounded-none border border-white/10 bg-[#25272B] hover:bg-[#2E3036] px-4 py-2 text-xs font-semibold text-zinc-200 transition-all duration-300 active:scale-[0.98]"
                      >
                        <MessageSquare className="h-4 w-4 text-[#DAF99C]" />
                        Request Revision (Agent Rescheduler)
                      </button>
                    </>
                  )}

                  {/* Demo Helper */}
                  {(activeRole === "ALL" || activeRole === "FREELANCER") && (
                    <button
                      type="button"
                      disabled={isProcessingAction}
                      onClick={() => handleReleasePayout(selectedMilestone.id, true)}
                      className="inline-flex items-center gap-2 rounded-none border border-[#FBBF24]/50 bg-[#FBBF24]/10 hover:bg-[#FBBF24]/20 px-4 py-2 text-xs font-semibold text-[#FBBF24] transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
                    >
                      <Zap className="h-4 w-4 text-[#FBBF24]" />
                      Simulate 72h Timeout Expiration
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Paid Confirmation Receipt */}
            {selectedMilestone.status === "PAID" && (
              <div className="rounded-xl border border-[#DAF99C]/30 bg-[#DAF99C]/[0.08] p-5 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#DAF99C]">
                  <CheckCircle2 className="h-4 w-4 text-[#DAF99C]" />
                  <span>Milestone Disbursed via PayPal Payouts API</span>
                </div>
                <div className="text-xs font-mono text-zinc-300">
                  Transaction Batch ID: <span className="text-white font-semibold">{selectedMilestone.payoutBatchId || "BATCH_SIM_78912"}</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Funds released directly to freelancer account ({contract.freelancerEmail}). Next tranche unlocked on Gantt timeline.
                </p>
              </div>
            )}

            {/* Inspection Dossier Display */}
            {inspectionResult && (
              <div className="rounded-xl border border-white/10 bg-[#161719] p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <FileCheck className="h-4 w-4 text-[#DAF99C]" />
                    Deliverable Verification Dossier
                  </span>
                  <span className="text-xs font-mono text-[#DAF99C] font-semibold">
                    Confidence: {(inspectionResult.inspectionResult.confidence * 100).toFixed(1)}%
                  </span>
                </div>

                <p className="text-xs text-zinc-300">{inspectionResult.inspectionResult.summary}</p>

                <div className="space-y-2">
                  {inspectionResult.inspectionResult.criteriaAudits.map((a: any) => (
                    <div key={a.id} className="rounded-lg border border-white/10 bg-[#25272B] p-3 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">{a.text}</span>
                        <span className={a.passed ? "text-[#DAF99C] font-bold" : "text-[#FBBF24] font-bold"}>
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

        {/* Client Revision Modal */}
        {showRevisionModal && selectedMilestone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="luxury-card max-w-lg w-full p-6 space-y-4 border-white/10 bg-[#1C1D20] shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <MessageSquare className="h-4 w-4 text-[#DAF99C]" />
                  <span>Request Deliverable Revision</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRevisionModal(false)}
                  className="text-zinc-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Provide specific revision feedback to the freelancer. Trustflow's <strong>Bryntum Rescheduler</strong> will automatically shift downstream milestone deadlines so the freelancer is not penalized for turnaround time.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Revision Details &amp; Feedback
                  </label>
                  <textarea
                    rows={3}
                    value={revisionFeedback}
                    onChange={(e) => setRevisionFeedback(e.target.value)}
                    className="w-full rounded-none border border-white/10 bg-black/60 p-2.5 text-xs text-white focus:border-[#DAF99C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Gantt Timeline Extension for Downstream Tranches
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="7"
                      value={revisionDays}
                      onChange={(e) => setRevisionDays(Number(e.target.value))}
                      className="flex-1 accent-[#DAF99C]"
                    />
                    <span className="text-sm font-mono font-bold text-[#DAF99C] w-12 text-right">
                      +{revisionDays}d
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowRevisionModal(false)}
                  className="rounded-none px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmittingRevision}
                  onClick={() => handleSubmitRevision(selectedMilestone.id)}
                  className="lime-button inline-flex items-center gap-1.5 rounded-none px-4 py-2 text-xs font-semibold active:scale-[0.98] disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isSubmittingRevision ? "animate-spin" : ""}`} />
                  {isSubmittingRevision ? "Rescheduling..." : "Submit & Reschedule Gantt"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Agent 3: Replacement Freelancer Takeover Modal */}
        <TakeoverModal
          isOpen={showTakeoverModal}
          onClose={() => setShowTakeoverModal(false)}
          brief={takeoverBrief}
          refundReceipt={refundReceipt}
        />
      </div>
    </div>
  );
}
