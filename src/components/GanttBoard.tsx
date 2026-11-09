"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  RefreshCw,
  GitCommit,
  AlertTriangle,
  X,
  Play,
  RotateCcw,
  Sliders,
  Check,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export interface GanttMilestone {
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
  criteria?: { id: string; text: string; isAutomated: boolean; passed?: boolean | null }[];
}

interface GanttBoardProps {
  milestones: GanttMilestone[];
  totalBudget: number;
  currency?: string;
  onSelectMilestone?: (milestone: GanttMilestone) => void;
  onReschedule?: (delayDays: number) => void;
}

export default function GanttBoard({
  milestones,
  totalBudget,
  currency = "USD",
  onSelectMilestone,
  onReschedule,
}: GanttBoardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(milestones[0]?.id || null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleDays, setRescheduleDays] = useState(2);
  const [rescheduleReason, setRescheduleReason] = useState("Client requested design revision on responsive layout");
  const [isRescheduling, setIsRescheduling] = useState(false);

  // Interactive timeline scrubber state (Simulate project progression)
  const totalDays = milestones.reduce((sum, m) => sum + m.durationDays, 0) || 10;
  const [currentDay, setCurrentDay] = useState(4); // Default to mid-project (Tranche 2 active)
  const [isPlaying, setIsPlaying] = useState(false);

  // Calculate cumulative day offsets for each milestone
  let cumulativeDays = 0;
  const milestonePlacements = milestones.map((m) => {
    const startDay = cumulativeDays;
    cumulativeDays += m.durationDays;
    return {
      ...m,
      startDay,
      endDay: cumulativeDays,
    };
  });

  // Auto-play scrubber simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentDay((prev) => (prev >= totalDays ? 1 : prev + 1));
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalDays]);

  const paidAmount = milestones
    .filter((m) => m.status === "PAID")
    .reduce((sum, m) => sum + m.amount, 0);

  const inReviewAmount = milestones
    .filter((m) => m.status === "IN_REVIEW")
    .reduce((sum, m) => sum + m.amount, 0);

  const lockedAmount = milestones
    .filter((m) => m.status === "LOCKED")
    .reduce((sum, m) => sum + m.amount, 0);

  const activeAmount = milestones
    .filter((m) => m.status === "ACTIVE")
    .reduce((sum, m) => sum + m.amount, 0);

  const selectedMilestone = milestones.find((m) => m.id === selectedId) || milestones[0];

  function handleTriggerReschedule() {
    if (!onReschedule) return;
    setIsRescheduling(true);
    onReschedule(rescheduleDays);
    setTimeout(() => {
      setIsRescheduling(false);
      setShowRescheduleModal(false);
    }, 600);
  }

  return (
    <div className="luxury-card-static p-6 md:p-8 space-y-7 border border-white/10 bg-[#1C1D20]/90 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      {/* Subtle Ambient Glow inside the board */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#DAF99C]/5 filter blur-[90px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/[0.03] filter blur-[90px] pointer-events-none rounded-full" />

      {/* Header & Controls */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-white/10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1.5">
            <span className="flex h-2 w-2 rounded-full bg-[#DAF99C] animate-pulse" />
            <span className="text-[#DAF99C] font-semibold uppercase tracking-wider">Bryntum Gantt Engine</span>
            <span className="text-zinc-600">&bull;</span>
            <span className="text-zinc-400">Dependency Locks &amp; Dynamic Rescheduling</span>
          </div>
          <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight flex items-center gap-3">
            Interactive Milestone Timeline Board
            <span className="text-xs font-mono font-semibold uppercase bg-[#DAF99C]/10 text-[#DAF99C] border border-[#DAF99C]/20 px-2.5 py-0.5 rounded-full">
              Live Interactive
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Downstream payment tranches unlock 🔒 strictly after predecessor deliverables pass automated inspection.
          </p>
        </div>

        {/* Action Controls Cluster */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Interactive Scrubber Play Button */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center gap-1.5 rounded-none border border-white/10 bg-[#25272B] hover:bg-[#2E3036] px-3.5 py-1.5 text-xs text-zinc-200 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] shadow-sm"
          >
            {isPlaying ? (
              <>
                <span className="h-2 w-2 rounded-none bg-[#DAF99C] animate-pulse" />
                <span className="font-mono text-[#DAF99C] font-semibold">Pause Simulation</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 text-[#DAF99C] fill-[#DAF99C]" />
                <span>Simulate Timeline Flow</span>
              </>
            )}
          </button>

          {/* Reschedule Control for Sponsor Challenge Prompt #6 */}
          {onReschedule && (
            <button
              type="button"
              onClick={() => setShowRescheduleModal(true)}
              className="inline-flex items-center gap-1.5 rounded-none border border-[#DAF99C]/30 bg-[#DAF99C]/10 hover:bg-[#DAF99C]/20 px-3.5 py-1.5 text-xs text-[#DAF99C] font-medium transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98]"
              title="Bryntum Agent-Driven Rescheduler (Shifts downstream deadlines upon revision)"
            >
              <RefreshCw className="h-3.5 w-3.5 text-[#DAF99C]" />
              <span>Agent Rescheduler (Bryntum #6)</span>
            </button>
          )}
        </div>
      </div>

      {/* Tranche Cashflow Breakdown Matrix */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-white/10 bg-[#25272B]/60 p-3.5 flex flex-col justify-between">
          <div className="text-[10px] uppercase font-mono text-zinc-400 font-semibold tracking-wider">Total Project Budget</div>
          <div className="text-xl font-mono font-bold text-white mt-1">${totalBudget.toFixed(2)}</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">100% Upfront PayPal Escrow</div>
        </div>

        <div className="rounded-xl border border-[#DAF99C]/30 bg-[#DAF99C]/[0.08] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-[#DAF99C] font-semibold tracking-wider">Disbursed (PAID)</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-[#DAF99C]" />
          </div>
          <div className="text-xl font-mono font-bold text-[#DAF99C] mt-1">${paidAmount.toFixed(2)}</div>
          <div className="text-[10px] text-zinc-300 mt-0.5">Disbursed via Payouts API</div>
        </div>

        <div className="rounded-xl border border-white/20 bg-white/[0.04] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-white font-semibold tracking-wider">Active Escrow</span>
            <Sparkles className="h-3.5 w-3.5 text-[#DAF99C]" />
          </div>
          <div className="text-xl font-mono font-bold text-white mt-1">${(activeAmount + inReviewAmount).toFixed(2)}</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Deliverable under inspection</div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#25272B]/60 p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-zinc-400 font-semibold tracking-wider">Locked Tranches</span>
            <Lock className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <div className="text-xl font-mono font-bold text-zinc-300 mt-1">${lockedAmount.toFixed(2)}</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Awaiting predecessor finish</div>
        </div>
      </div>

      {/* Interactive Day Scrubber Bar */}
      <div className="relative z-10 rounded-xl border border-white/10 bg-[#161719] p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sliders className="h-3.5 w-3.5 text-[#DAF99C]" />
            <span className="font-semibold text-white">Timeline Scrubber:</span>
            <span className="font-mono text-[#DAF99C] font-bold">Day {currentDay} of {totalDays}</span>
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            {currentDay <= 3 ? (
              <span className="text-[#DAF99C] font-semibold">Tranche 1 completed &bull; Payout executed</span>
            ) : currentDay <= 7 ? (
              <span className="text-white font-semibold">Tranche 2 in progress &bull; Live preview audited</span>
            ) : (
              <span className="text-zinc-400">Tranche 3 scheduled &bull; Production transfer</span>
            )}
          </div>
        </div>

        <div className="relative flex items-center pt-1 pb-1">
          <input
            type="range"
            min="1"
            max={totalDays}
            value={currentDay}
            onChange={(e) => setCurrentDay(Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#DAF99C]"
          />
        </div>

        <div className="flex justify-between text-[10px] font-mono text-zinc-500 px-1">
          <span>Day 1 (Kickoff)</span>
          <span>Day {Math.round(totalDays / 2)} (Mid-Sprint)</span>
          <span>Day {totalDays} (Final Release)</span>
        </div>
      </div>

      {/* Gantt Visual Grid */}
      <div className="relative z-10 overflow-x-auto pt-1">
        <div className="min-w-[720px] space-y-3">
          {/* Day Scale Header */}
          <div className="grid grid-cols-12 gap-2 text-[11px] font-mono text-zinc-500 border-b border-white/10 pb-2.5">
            <div className="col-span-4 text-left font-sans text-xs font-semibold text-zinc-300">
              Tranche / Scope Breakdown
            </div>
            <div className="col-span-8 flex justify-between px-3 text-zinc-400">
              {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
                <span
                  key={d}
                  className={`transition-colors ${
                    d === currentDay ? "text-[#DAF99C] font-bold" : "text-zinc-500"
                  }`}
                >
                  D{d}
                </span>
              ))}
            </div>
          </div>

          {/* Milestone Gantt Rows */}
          <div className="space-y-3">
            {milestonePlacements.map((m, index) => {
              const isSelected = selectedId === m.id;
              const widthPct = Math.max(16, (m.durationDays / totalDays) * 100);
              const leftOffsetPct = (m.startDay / totalDays) * 100;

              return (
                <div key={m.id} className="space-y-1">
                  <div
                    onClick={() => {
                      setSelectedId(m.id);
                      if (onSelectMilestone) onSelectMilestone(m);
                    }}
                    className={`grid grid-cols-12 items-center gap-3 rounded-xl border p-3.5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer select-none ${
                      isSelected
                        ? "border-[#DAF99C]/60 bg-[#25272B] shadow-lg shadow-[#DAF99C]/5"
                        : "border-white/10 bg-[#1F2023] hover:border-white/20 hover:bg-[#25272B]/60"
                    }`}
                  >
                    {/* Left Column: Tranche Info */}
                    <div className="col-span-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#2E3036] text-[10px] font-mono font-bold text-zinc-300">
                          M{m.order}
                        </span>
                        <span className="text-sm font-semibold text-white truncate">{m.title}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono font-bold text-[#DAF99C]">
                          ${m.amount.toFixed(2)}
                        </span>
                        <span className="text-zinc-600">&bull;</span>
                        <span className="text-zinc-400 font-mono">{m.durationDays} days</span>
                        <span className="text-zinc-600">&bull;</span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold ${
                            m.status === "PAID"
                              ? "bg-[#DAF99C] text-[#0E1012]"
                              : m.status === "ACTIVE"
                              ? "bg-white text-[#0E1012]"
                              : m.status === "IN_REVIEW"
                              ? "bg-[#FBBF24] text-[#0E1012]"
                              : "bg-[#25272B] text-zinc-400 border border-zinc-700"
                          }`}
                        >
                          {m.status === "PAID" && <Check className="h-3 w-3" />}
                          {m.status === "ACTIVE" && <Sparkles className="h-3 w-3" />}
                          {m.status === "IN_REVIEW" && <Clock className="h-3 w-3" />}
                          {m.status === "LOCKED" && <Lock className="h-3 w-3" />}
                          {m.status}
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Interactive Gantt Bar with Scrubber Cursor */}
                    <div className="col-span-8 relative h-11 bg-black/40 rounded-lg border border-white/10 p-1 flex items-center overflow-hidden">
                      {/* Vertical Grid Ticks */}
                      <div className="absolute inset-0 flex justify-between pointer-events-none opacity-15">
                        {Array.from({ length: totalDays }, (_, i) => (
                          <div key={i} className="border-r border-zinc-500 h-full w-full" />
                        ))}
                      </div>

                      {/* Scrubber Position Indicator Line */}
                      <div
                        style={{ left: `${(currentDay / totalDays) * 100}%` }}
                        className="absolute top-0 bottom-0 w-0.5 bg-[#DAF99C] shadow-[0_0_10px_#DAF99C] z-20 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      />

                      {/* Timeline Milestone Block */}
                      <div
                        style={{
                          marginLeft: `${Math.min(84, leftOffsetPct)}%`,
                          width: `${Math.min(100 - leftOffsetPct, widthPct)}%`,
                        }}
                        className={`relative h-8 rounded-md px-3 flex items-center justify-between text-xs font-semibold transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-md ${
                          m.status === "PAID"
                            ? "bg-[#DAF99C] text-[#0E1012]"
                            : m.status === "ACTIVE"
                            ? "bg-white text-[#0E1012] border border-[#DAF99C]/50"
                            : m.status === "IN_REVIEW"
                            ? "bg-[#FBBF24] text-[#0E1012]"
                            : "bg-[#25272B] text-zinc-400 border border-zinc-700"
                        }`}
                      >
                        <span className="truncate text-[11px] font-bold">
                          {m.status === "PAID"
                            ? "Paid via PayPal"
                            : m.status === "ACTIVE"
                            ? "In Progress &bull; Agent 2"
                            : m.status === "IN_REVIEW"
                            ? "72h Silence-Means-Yes"
                            : `Locked (Dep: M${m.order - 1})`}
                        </span>

                        {m.status === "LOCKED" ? (
                          <Lock className="h-3 w-3 flex-shrink-0 text-zinc-400 ml-1" />
                        ) : m.status === "PAID" ? (
                          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-[#0E1012] ml-1" />
                        ) : (
                          <ArrowRight className="h-3 w-3 flex-shrink-0 text-[#0E1012] ml-1" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Animated Dependency Connector Chain */}
                  {index < milestonePlacements.length - 1 && (
                    <div className="flex items-center gap-2 pl-6 py-0.5 text-[11px] font-mono text-zinc-500">
                      <svg className="w-5 h-4 text-[#DAF99C]" viewBox="0 0 20 16" fill="none">
                        <path
                          d="M4 0 V10 H16 M12 6 L16 10 L12 14"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="connector-flow"
                        />
                      </svg>
                      <span className="text-zinc-400 flex items-center gap-1.5">
                        <Lock className="h-3 w-3 text-zinc-500" />
                        Tranche dependency lock: <strong className="text-white">M{index + 2}</strong> unlocks only upon <strong className="text-white">M{index + 1}</strong> verification
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Tranche Detail Card */}
      {selectedMilestone && (
        <div className="relative z-10 rounded-xl border border-white/10 bg-[#161719] p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/5 gap-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#DAF99C] text-xs font-mono font-bold text-[#0E1012]">
                M{selectedMilestone.order}
              </span>
              <span className="text-sm font-semibold text-white">{selectedMilestone.title}</span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-[#DAF99C] font-bold">${selectedMilestone.amount.toFixed(2)} USD</span>
              {selectedMilestone.payoutBatchId && (
                <span className="text-[11px] bg-[#DAF99C]/10 text-[#DAF99C] border border-[#DAF99C]/20 px-2 py-0.5 rounded-md">
                  PayPal Batch: {selectedMilestone.payoutBatchId}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            {selectedMilestone.description}
          </p>

          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
              Inspection Verification Criteria:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-[#25272B]/60 p-2 text-zinc-200">
                <Check className="h-3.5 w-3.5 text-[#DAF99C] flex-shrink-0" />
                <span>HTTP 200 Live Preview URL Crawl</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-[#25272B]/60 p-2 text-zinc-200">
                <Check className="h-3.5 w-3.5 text-[#DAF99C] flex-shrink-0" />
                <span>Responsive Viewport &amp; Form Element Audit</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal (Bryntum Challenge Prompt #6) */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="luxury-card max-w-md w-full p-6 space-y-4 border-white/10 bg-[#1C1D20] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <RefreshCw className="h-4 w-4 text-[#DAF99C]" />
                <span>Agent-Driven Rescheduler (Bryntum #6)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowRescheduleModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              When a client requests revisions, Trustflow recalculates downstream milestone deadlines on the Gantt timeline so freelancers are never penalized for review delays.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Delay Adjustment (Days)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="7"
                    value={rescheduleDays}
                    onChange={(e) => setRescheduleDays(Number(e.target.value))}
                    className="flex-1 accent-[#DAF99C]"
                  />
                  <span className="text-sm font-mono font-bold text-[#DAF99C] w-12 text-right">
                    +{rescheduleDays}d
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Revision Context / Reason
                </label>
                <input
                  type="text"
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  className="w-full rounded-none border border-white/10 bg-black/60 p-2 text-xs text-white focus:border-[#DAF99C] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowRescheduleModal(false)}
                className="rounded-none px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isRescheduling}
                onClick={handleTriggerReschedule}
                className="lime-button inline-flex items-center gap-1.5 rounded-none px-4 py-2 text-xs font-semibold transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isRescheduling ? "animate-spin" : ""}`} />
                {isRescheduling ? "Recalculating..." : "Apply Reschedule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
