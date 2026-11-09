"use client";

import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  Download,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Clock,
  DollarSign,
  Layers,
  Terminal,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import type { TakeoverBrief } from "@/lib/handoff";

interface TakeoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  brief: TakeoverBrief | null;
  refundReceipt?: {
    refundId: string;
    amount: number;
    currency: string;
    recipient?: string;
  } | null;
}

export default function TakeoverModal({
  isOpen,
  onClose,
  brief,
  refundReceipt,
}: TakeoverModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"visual" | "markdown">("visual");

  if (!isOpen || !brief) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(brief.markdownTakeoverDoc);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([brief.markdownTakeoverDoc], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Trustflow-Takeover-Brief-${brief.contractId}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const refundAmt = refundReceipt?.amount ?? brief.financialSummary.refundedAmount;
  const refundId = refundReceipt?.refundId ?? "REFUND_SIM_TX72H";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8 border border-white/10 bg-[#141517] shadow-2xl rounded-none text-white overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Accent Strip */}
        <div className="h-1 bg-gradient-to-r from-amber-500 via-[#DAF99C] to-emerald-500" />

        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-start justify-between bg-[#1C1D20]/80">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono mb-1.5">
              <span className="flex h-2 w-2 rounded-none bg-amber-400 animate-pulse" />
              <span className="text-amber-400 font-semibold uppercase tracking-wider">
                Agent 3 &bull; AI Continuity Engine
              </span>
              <span className="text-zinc-600">&bull;</span>
              <span className="text-zinc-400">Freelancer Ghosting Protection</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              Replacement Freelancer Takeover Dossier
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Project: <span className="text-zinc-200 font-medium">{brief.projectTitle}</span> &bull; Contract:{" "}
              <code className="text-[#DAF99C] font-mono">{brief.contractId}</code>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors rounded-none"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Refund Notification Banner */}
        <div className="px-6 py-3.5 bg-amber-950/40 border-b border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-none bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <div className="font-semibold text-amber-200 flex items-center gap-2">
                <span>Escrow Refund Completed via PayPal Sandbox</span>
                <span className="px-1.5 py-0.2 bg-amber-400/10 border border-amber-400/30 text-[10px] font-mono text-amber-300">
                  ABANDONED_REFUNDED
                </span>
              </div>
              <div className="text-zinc-400 text-[11px] mt-0.5">
                <span className="text-white font-mono font-bold">${refundAmt.toFixed(2)} USD</span> returned to client. Refund ID:{" "}
                <span className="font-mono text-zinc-300">{refundId}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              Prior Work Safe: Paid Tranches Disbursed
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 pb-2 border-b border-white/5 flex items-center justify-between bg-[#17181A]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("visual")}
              className={`px-3 py-1.5 text-xs font-medium rounded-none transition-colors ${
                activeTab === "visual"
                  ? "bg-[#25272B] text-white border border-white/10"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Structured Dossier
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("markdown")}
              className={`px-3 py-1.5 text-xs font-medium rounded-none transition-colors ${
                activeTab === "markdown"
                  ? "bg-[#25272B] text-white border border-white/10"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Raw Markdown Brief
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-none bg-[#DAF99C] text-[#0E1012] hover:bg-[#c9ee86] transition-all active:scale-[0.98]"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-900" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Handoff Brief</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-none border border-white/10 bg-[#25272B] text-zinc-300 hover:bg-[#2E3036] hover:text-white transition-colors"
              title="Download Markdown File"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export .md</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm bg-[#141517]">
          {activeTab === "visual" ? (
            <>
              {/* Financial & Time Metrics Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-[#1C1D20] border border-white/10 rounded-none">
                  <div className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Original Total</div>
                  <div className="text-lg font-mono font-bold text-white mt-1">
                    ${brief.financialSummary.totalOriginalBudget.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Original scope contract</div>
                </div>

                <div className="p-3.5 bg-[#1C1D20] border border-white/10 rounded-none">
                  <div className="text-[10px] font-mono uppercase text-[#DAF99C] tracking-wider">Already Paid</div>
                  <div className="text-lg font-mono font-bold text-[#DAF99C] mt-1">
                    ${brief.financialSummary.disbursedAmount.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Kept by original contributor</div>
                </div>

                <div className="p-3.5 bg-[#1C1D20] border border-amber-500/30 bg-amber-500/[0.04] rounded-none">
                  <div className="text-[10px] font-mono uppercase text-amber-300 tracking-wider">Refunded to You</div>
                  <div className="text-lg font-mono font-bold text-amber-300 mt-1">
                    ${brief.financialSummary.refundedAmount.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Available for replacement hire</div>
                </div>

                <div className="p-3.5 bg-[#1C1D20] border border-white/10 rounded-none">
                  <div className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Est. Completion</div>
                  <div className="text-lg font-mono font-bold text-white mt-1">
                    ~{brief.financialSummary.estimatedDaysToFinish} Days
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Remaining scope duration</div>
                </div>
              </div>

              {/* Section 1: Current Working State & Assets */}
              <div className="space-y-3 p-4 bg-[#1C1D20] border border-white/10 rounded-none">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#DAF99C] font-semibold">
                  <Layers className="h-4 w-4" />
                  <span>1. Current Working State &amp; Entry Points</span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {brief.summary}
                </p>

                {/* Completed Milestones List */}
                <div className="space-y-2 mt-2">
                  <div className="text-[11px] font-mono uppercase text-zinc-400">Verified &amp; Paid Milestones:</div>
                  {brief.currentWorkingState.completedMilestones.length > 0 ? (
                    brief.currentWorkingState.completedMilestones.map((m) => (
                      <div
                        key={m.order}
                        className="p-3 bg-black/40 border border-emerald-500/20 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            Milestone {m.order}: {m.title}
                          </span>
                          <span className="font-mono text-emerald-400 font-semibold">${m.amount.toFixed(2)}</span>
                        </div>
                        {m.deliverableUrl && (
                          <div className="text-zinc-400 text-[11px] flex items-center gap-1 font-mono">
                            <span>Live Staging:</span>
                            <a
                              href={m.deliverableUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#DAF99C] underline inline-flex items-center gap-0.5"
                            >
                              {m.deliverableUrl}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                        <div className="pt-1 flex flex-wrap gap-1.5">
                          {m.verifiedCriteria.map((c, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-800 text-[10px] text-emerald-300 font-mono"
                            >
                              &check; {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-black/40 border border-white/5 text-xs text-zinc-400">
                      No milestones were completed before abandonment. The replacement engineer starts from Day 0 scaffold.
                    </div>
                  )}
                </div>

                {/* Tech Stack & Assets */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-[11px] font-mono uppercase text-zinc-400 mb-1.5">Confirmed Tech Stack:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {brief.currentWorkingState.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-white/5 border border-white/10 text-zinc-300 font-mono text-[11px]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-mono uppercase text-zinc-400 mb-1.5">Entry Points / Repos:</div>
                    <div className="space-y-1">
                      {brief.currentWorkingState.entryPointsAndAssets.map((asset, i) => (
                        <div key={i} className="text-zinc-300 font-mono text-[11px] truncate">
                          &bull; {asset}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Remaining Scope to Deliver */}
              <div className="space-y-3 p-4 bg-[#1C1D20] border border-white/10 rounded-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold">
                    <Terminal className="h-4 w-4" />
                    <span>2. Remaining Scope to Deliver</span>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">
                    Remaining Budget: ${brief.financialSummary.remainingScopeBudget.toFixed(2)} USD
                  </span>
                </div>

                <div className="space-y-3">
                  {brief.remainingScope.uncompletedMilestones.map((m) => (
                    <div key={m.order} className="p-3 bg-black/40 border border-amber-500/20 text-xs space-y-2">
                      <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                        <span className="font-semibold text-white">
                          Milestone {m.order}: {m.title}
                        </span>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="text-amber-300 font-bold">${m.amount.toFixed(2)} USD</span>
                          <span className="text-zinc-500">&bull;</span>
                          <span className="text-zinc-400">{m.durationDays}d</span>
                        </div>
                      </div>
                      <p className="text-zinc-400 text-xs leading-relaxed">{m.description}</p>
                      <div>
                        <div className="text-[10px] font-mono uppercase text-zinc-500 mb-1">
                          Acceptance Criteria Required for Release:
                        </div>
                        <div className="space-y-1">
                          {m.pendingCriteria.map((c, i) => (
                            <div key={i} className="flex items-start gap-2 text-zinc-300 text-[11px]">
                              <span className="text-amber-400 font-mono">&bull;</span>
                              <span>{c}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {brief.remainingScope.knownRisksAndBlockers.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[11px] font-mono uppercase text-zinc-400 mb-1">Known Handover Pitfalls:</div>
                    <div className="space-y-1">
                      {brief.remainingScope.knownRisksAndBlockers.map((risk, i) => (
                        <div key={i} className="text-xs text-amber-200/90 flex items-start gap-2">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span>{risk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Section 3: Replacement Action Plan */}
              <div className="space-y-3 p-4 bg-[#1C1D20] border border-white/10 rounded-none">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  <Sparkles className="h-4 w-4" />
                  <span>3. Replacement Action Roadmap</span>
                </div>
                <div className="space-y-2">
                  {brief.replacementActionPlan.map((step, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-200">
                      <span className="flex h-4 w-4 rounded-none bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-300 items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step.replace(/^\d+\.\s*/, "")}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Raw Markdown Tab */
            <div className="relative">
              <pre className="p-4 bg-black/60 border border-white/10 text-xs font-mono text-zinc-200 whitespace-pre-wrap leading-relaxed overflow-x-auto rounded-none">
                {brief.markdownTakeoverDoc}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#1C1D20] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-zinc-400">
            Share this brief directly on Upwork, Contra, or X to hire a replacement contributor within hours.
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white border border-white/10 rounded-none bg-black/40 hover:bg-black/80 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="lime-button inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-none transition-all active:scale-[0.98]"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copied Brief!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Handoff Brief</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
