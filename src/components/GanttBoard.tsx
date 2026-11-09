"use client";

import React, { useState } from "react";
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

  // Calculate timeline start and total duration in days
  const totalDays = milestones.reduce((sum, m) => sum + m.durationDays, 0) || 10;
  const daysArray = Array.from({ length: totalDays + 2 }, (_, i) => i + 1);

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

  const paidAmount = milestones
    .filter((m) => m.status === "PAID")
    .reduce((sum, m) => sum + m.amount, 0);

  const inReviewAmount = milestones
    .filter((m) => m.status === "IN_REVIEW")
    .reduce((sum, m) => sum + m.amount, 0);

  const lockedAmount = milestones
    .filter((m) => m.status === "LOCKED")
    .reduce((sum, m) => sum + m.amount, 0);

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
    <div className="trustflow-card p-6 md:p-8 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-zinc-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Bryntum Gantt Engine &bull; Tranche Dependency &amp; Rescheduling Model
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
            Interactive Milestone Timeline Board
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Downstream payment tranches are locked 🔒 until predecessor deliverables pass inspection.
          </p>
        </div>

        {/* Reschedule Control for Sponsor Challenge Prompt #6 */}
        {onReschedule && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowRescheduleModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/90 hover:border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 transition-quick active:scale-95 shadow-sm"
              title="Bryntum Agent-Driven Rescheduler (Shifts downstream deadlines upon revision)"
            >
              <RefreshCw className="h-3.5 w-3.5 text-blue-400" />
              <span>Agent Rescheduler (Bryntum #6)</span>
            </button>
          </div>
        )}
      </div>

      {/* Tranche Cashflow Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-mono text-emerald-400 font-semibold">Disbursed Tranches</div>
            <div className="text-lg font-mono font-bold text-white">${paidAmount.toFixed(2)}</div>
          </div>
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
        </div>

        <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-mono text-amber-400 font-semibold">In Review (72h Timer)</div>
            <div className="text-lg font-mono font-bold text-white">${inReviewAmount.toFixed(2)}</div>
          </div>
          <Clock className="h-5 w-5 text-amber-400" />
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-mono text-zinc-400 font-semibold">Locked in Escrow</div>
            <div className="text-lg font-mono font-bold text-white">${lockedAmount.toFixed(2)}</div>
          </div>
          <Lock className="h-5 w-5 text-zinc-400" />
        </div>
      </div>

      {/* Gantt Visual Grid */}
      <div className="overflow-x-auto pt-2">
        <div className="min-w-[700px] space-y-4">
          {/* Day Scale Header */}
          <div className="grid grid-cols-12 gap-1 text-[11px] font-mono text-zinc-500 border-b border-zinc-800 pb-2">
            <div className="col-span-4 text-left font-sans text-xs font-semibold text-zinc-400">
              Tranche / Deliverable
            </div>
            <div className="col-span-8 flex justify-between px-2">
              <span>Day 1 (Kickoff)</span>
              <span>Day {Math.round(totalDays / 2)}</span>
              <span>Day {totalDays} (Delivery)</span>
            </div>
          </div>

          {/* Milestone Gantt Rows */}
          <div className="space-y-4">
            {milestonePlacements.map((m, index) => {
              const isSelected = selectedId === m.id;
              const widthPct = Math.max(14, (m.durationDays / totalDays) * 100);
              const leftOffsetPct = (m.startDay / totalDays) * 100;

              return (
                <div key={m.id} className="space-y-1">
                  <div
                    onClick={() => {
                      setSelectedId(m.id);
                      if (onSelectMilestone) onSelectMilestone(m);
                    }}
                    className={`grid grid-cols-12 items-center gap-2 rounded-xl border p-3.5 transition-quick cursor-pointer ${
                      isSelected
                        ? "border-blue-500/80 bg-zinc-900/90 shadow-md"
                        : "border-zinc-800/80 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-900/40"
                    }`}
                  >
                    {/* Left Column: Tranche Info */}
                    <div className="col-span-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-bold text-zinc-300">
                          M{m.order}
                        </span>
                        <span className="text-sm font-semibold text-white truncate">{m.title}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono font-bold text-emerald-400">
                          ${m.amount.toFixed(2)}
                        </span>
                        <span className="text-zinc-500">&bull;</span>
                        <span className="text-zinc-400">{m.durationDays}d</span>
                        <span className="text-zinc-500">&bull;</span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            m.status === "PAID"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800/50"
                              : m.status === "ACTIVE"
                              ? "bg-blue-950 text-blue-400 border border-blue-800/50 animate-pulse"
                              : m.status === "IN_REVIEW"
                              ? "bg-amber-950 text-amber-400 border border-amber-800/50"
                              : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                          }`}
                        >
                          {m.status === "PAID" && <CheckCircle2 className="h-3 w-3" />}
                          {m.status === "ACTIVE" && <Sparkles className="h-3 w-3" />}
                          {m.status === "IN_REVIEW" && <Clock className="h-3 w-3" />}
                          {m.status === "LOCKED" && <Lock className="h-3 w-3" />}
                          {m.status}
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Interactive Gantt Bar */}
                    <div className="col-span-8 relative h-10 bg-zinc-900/60 rounded-lg border border-zinc-800/50 p-1 flex items-center overflow-hidden">
                      {/* Background Day Ticks */}
                      <div className="absolute inset-0 flex justify-between pointer-events-none opacity-10">
                        {daysArray.map((d) => (
                          <div key={d} className="border-r border-zinc-600 h-full w-full" />
                        ))}
                      </div>

                      {/* Timeline Bar */}
                      <div
                        style={{
                          marginLeft: `${Math.min(84, leftOffsetPct)}%`,
                          width: `${Math.min(100 - leftOffsetPct, widthPct)}%`,
                        }}
                        className={`relative h-7 rounded-md px-3 flex items-center justify-between text-xs font-medium transition-decelerate shadow-sm ${
                          m.status === "PAID"
                            ? "bg-emerald-600 text-white"
                            : m.status === "ACTIVE"
                            ? "bg-blue-600 text-white shadow-blue-500/20"
                            : m.status === "IN_REVIEW"
                            ? "bg-amber-600 text-white"
                            : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                        }`}
                      >
                        <span className="truncate text-[11px]">
                          {m.status === "PAID"
                            ? "Paid via PayPal"
                            : m.status === "ACTIVE"
                            ? "Deliverable Ready"
                            : m.status === "IN_REVIEW"
                            ? "72h Client Review"
                            : `Locked (Dep: M${m.order - 1})`}
                        </span>

                        {m.status === "LOCKED" ? (
                          <Lock className="h-3.5 w-3.5 flex-shrink-0 text-zinc-400 ml-1" />
                        ) : m.status === "PAID" ? (
                          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-white ml-1" />
                        ) : (
                          <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-white ml-1" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bryntum Dependency Indicator Line between Tranches */}
                  {index < milestonePlacements.length - 1 && (
                    <div className="flex items-center gap-2 pl-6 py-0.5 text-[10px] font-mono text-zinc-600">
                      <div className="h-2 w-px bg-zinc-700 ml-1" />
                      <span className="text-zinc-500">
                        ↳ Dependency Link: M{index + 2} unlocks only after M{index + 1} completes
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend & Guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-zinc-400 border-t border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span>PAID: Autonomous PayPal Payout dispatched</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          <span>ACTIVE: Freelancer submits deliverable URL</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          <span>72H TIMER: Auto-releases if client is silent</span>
        </div>
      </div>

      {/* Reschedule Modal (Bryntum Challenge Prompt #6) */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="trustflow-card max-w-md w-full p-6 space-y-4 border-zinc-700 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <RefreshCw className="h-4 w-4 text-blue-400" />
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
                    className="flex-1"
                  />
                  <span className="text-sm font-mono font-bold text-blue-400 w-12 text-right">
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
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowRescheduleModal(false)}
                className="rounded-lg px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isRescheduling}
                onClick={handleTriggerReschedule}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-semibold text-white transition-quick active:scale-95 disabled:opacity-50"
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
