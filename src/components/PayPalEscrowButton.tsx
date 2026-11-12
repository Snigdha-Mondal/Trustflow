"use client";

import React, { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import confetti from "canvas-confetti";
import { AlertCircle, CheckCircle2, Lock, Loader2, Zap } from "lucide-react";

interface PayPalEscrowButtonProps {
  contractId: string;
  contractTitle?: string;
  totalBudget: number;
  currency?: string;
  onSuccess: (updatedContract: any) => void;
  onError?: (errorMsg: string) => void;
}

const DEFAULT_US_SANDBOX_CLIENT_ID =
  "BAASOiuRqrR0cWEHEo8mQAoiIcwRs5QiovbmDvP3NYkDUdFUfSj0GMsJRTg6O2IRxti22anIJjnU033W88";

export default function PayPalEscrowButton({
  contractId,
  contractTitle = "Milestone Escrow Contract",
  totalBudget,
  currency = "USD",
  onSuccess,
  onError,
}: PayPalEscrowButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFunded, setIsFunded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string>(
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || DEFAULT_US_SANDBOX_CLIENT_ID
  );

  // Sync client ID from backend configuration to guarantee matching server credentials
  useEffect(() => {
    fetch("/api/paypal/config")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.clientId) {
          setClientId(data.clientId);
        }
      })
      .catch((err) => {
        console.warn("[PayPalEscrowButton] Could not fetch server config, using fallback client ID:", err);
      });
  }, []);

  // createOrder: invokes backend /api/paypal/create-order using authenticated server credentials
  const handleCreateOrder = async (_data: any, actions: any) => {
    setErrorMessage(null);
    try {
      // 1. Try server-side order creation (cleanest and most secure)
      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId }),
      });

      const orderData = await res.json();
      if (res.ok && orderData.order?.id) {
        return orderData.order.id;
      }

      // 2. Client SDK fallback if backend route returned error
      if (actions?.order) {
        return await actions.order.create({
          intent: "CAPTURE",
          purchase_units: [
            {
              description: `Trustflow Escrow Custody: ${contractTitle}`,
              custom_id: contractId,
              amount: {
                currency_code: currency,
                value: totalBudget.toFixed(2),
              },
            },
          ],
        });
      }

      throw new Error(orderData.error || "Failed to create PayPal escrow order");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Order creation failed";
      console.error("[PayPalEscrowButton createOrder error]", msg);
      if (!msg.includes("Window closed before response") && !msg.includes("popup closed") && !msg.includes("window closed")) {
        setErrorMessage(msg);
        if (onError) onError(msg);
      }
      throw err;
    }
  };

  // onApprove: captures the authorized payment and synchronizes Trustflow database
  const handleApprove = async (data: any, actions: any) => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      let orderId = data?.orderID;
      let captureId: string | undefined;

      // Complete capture via SDK actions
      if (actions?.order) {
        const captureDetails = await actions.order.capture();
        orderId = captureDetails.id || orderId;
        captureId = captureDetails.purchase_units?.[0]?.payments?.captures?.[0]?.id;
      }

      // Synchronize with Trustflow backend to set contract status to FUNDED and unlock Milestone 1
      const res = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId,
          orderId,
          captureId,
        }),
      });

      const captureRes = await res.json();
      if (!res.ok) throw new Error(captureRes.error || "Failed to capture escrow order");

      setIsFunded(true);
      confetti({
        particleCount: 100,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#10B981", "#3B82F6", "#DAF99C"],
      });

      onSuccess(captureRes.contract);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Escrow capture failed";
      console.error("[PayPalEscrowButton onApprove error]", msg);
      setErrorMessage(msg);
      if (onError) onError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // 1-Click Direct Sandbox Funding: creates & captures order via PayPal REST API directly
  const handleDirectFund = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      // 1. Create PayPal Order on backend
      const createRes = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId }),
      });
      const createData = await createRes.json();
      if (!createRes.ok || !createData.order?.id) {
        throw new Error(createData.error || "Failed to create PayPal order");
      }

      // 2. Capture PayPal Order on backend
      const captureRes = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId,
          orderId: createData.order.id,
        }),
      });
      const captureData = await captureRes.json();
      if (!captureRes.ok || !captureData.contract) {
        throw new Error(captureData.error || "Failed to capture PayPal escrow order");
      }

      setIsFunded(true);
      confetti({
        particleCount: 100,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#10B981", "#3B82F6", "#DAF99C"],
      });

      onSuccess(captureData.contract);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Direct escrow funding failed";
      console.error("[Direct Sandbox Fund Error]", msg);
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isFunded) {
    return (
      <div className="rounded-none border border-emerald-500/30 bg-emerald-500/10 p-4 text-center space-y-1">
        <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold text-xs">
          <CheckCircle2 className="h-4 w-4" />
          <span>Escrow Funded Successfully!</span>
        </div>
        <p className="text-[11px] font-mono text-zinc-300">
          ${totalBudget.toFixed(2)} {currency} held safely in PayPal Escrow custody.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {errorMessage && (
        <div className="rounded-none border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-200 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-400" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {isProcessing ? (
        <div className="rounded-none border border-[#DAF99C]/20 bg-[#1C1D20] p-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-[#DAF99C] text-xs font-semibold">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Capturing Escrow Funds into PayPal Vault...</span>
          </div>
          <p className="text-[10px] font-mono text-zinc-400">
            Locking ${totalBudget.toFixed(2)} {currency} &bull; Unlocking Milestone 1
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pb-1">
            <span className="flex items-center gap-1.5">
              <Lock className="h-3 w-3 text-[#DAF99C]" />
              Upfront PayPal Escrow
            </span>
            <span className="text-white font-bold">${totalBudget.toFixed(2)} {currency}</span>
          </div>

          {/* Official PayPal Sandbox Popup Checkout */}
          <PayPalScriptProvider
            key={clientId}
            options={{
              clientId: clientId,
              currency: currency,
              intent: "capture",
            }}
          >
            <div className="relative z-10 w-full min-h-[44px]">
              <PayPalButtons
                style={{
                  color: "gold",
                  shape: "rect",
                  layout: "vertical",
                  label: "paypal",
                  height: 40,
                }}
                disabled={isProcessing}
                createOrder={handleCreateOrder}
                onApprove={handleApprove}
                onCancel={() => {
                  setErrorMessage("Checkout cancelled: The PayPal popup was closed before completing payment.");
                }}
                onError={(err: any) => {
                  const msg = String(err?.message || err || "");
                  console.error("[PayPalButtons SDK Error]", msg, err);
                  if (
                    msg.includes("Window closed before response") ||
                    msg.includes("popup closed") ||
                    msg.includes("window closed")
                  ) {
                    setErrorMessage(
                      "The PayPal checkout popup was closed before completion. You can click PayPal again or use 1-Click Sandbox Fund below."
                    );
                  } else {
                    setErrorMessage("PayPal checkout popup encountered an issue. Please try again.");
                  }
                }}
              />
            </div>
          </PayPalScriptProvider>

          {/* 1-Click Instant Sandbox Escrow Funding Bypass */}
          <div className="pt-1 border-t border-white/10">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleDirectFund}
              className="w-full inline-flex items-center justify-center gap-2 rounded-none border border-[#DAF99C]/50 bg-[#DAF99C]/10 px-3 py-2 text-xs font-mono font-semibold text-[#DAF99C] hover:bg-[#DAF99C] hover:text-[#0E1012] transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
              title="Directly authorize and lock escrow funds via PayPal REST API without relying on browser popup windows"
            >
              <Zap className="h-3.5 w-3.5" />
              1-Click Sandbox Escrow Fund (${totalBudget.toFixed(2)})
            </button>
            <p className="text-[10px] font-mono text-zinc-500 text-center mt-1">
              Direct Sandbox API capture &bull; Bypasses browser popup blockers
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
