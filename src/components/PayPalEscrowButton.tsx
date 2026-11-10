"use client";

import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import confetti from "canvas-confetti";
import { ShieldCheck, AlertCircle, CheckCircle2, Lock, Loader2 } from "lucide-react";

interface PayPalEscrowButtonProps {
  contractId: string;
  contractTitle?: string;
  totalBudget: number;
  currency?: string;
  onSuccess: (updatedContract: any) => void;
  onError?: (errorMsg: string) => void;
}

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

  const clientId =
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
    "BAAXGd7tClylzSzM2fAKmpxP5cnhjsGEHlF9ktyUc5bNn6JjlNWp42TmokktVYVv6r0AsbZQFo_AzOalig";

  // createOrder: invokes PayPal SDK order creation with intent: CAPTURE
  const handleCreateOrder = async (data: any, actions: any) => {
    setErrorMessage(null);
    try {
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

      // Backend fallback order creation
      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId }),
      });
      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || "Failed to create PayPal order");
      return orderData.order.id;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Order creation failed";
      console.error("[PayPalEscrowButton createOrder error]", msg);
      setErrorMessage(msg);
      if (onError) onError(msg);
      throw err;
    }
  };

  // onApprove: captures the authorized payment and synchronizes Trustflow database
  const handleApprove = async (data: any, actions: any) => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      let orderId = data?.orderID;

      // Complete capture via SDK actions
      if (actions?.order) {
        const captureDetails = await actions.order.capture();
        orderId = captureDetails.id || orderId;
      }

      // Synchronize with Trustflow backend to set contract status to FUNDED and unlock Milestone 1
      const res = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId,
          orderId,
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
        <div className="rounded-none border border-red-500/30 bg-red-500/10 p-2.5 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
          <span className="truncate">{errorMessage}</span>
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
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pb-1">
            <span className="flex items-center gap-1.5">
              <Lock className="h-3 w-3 text-[#DAF99C]" />
              Upfront PayPal Escrow
            </span>
            <span className="text-white font-bold">${totalBudget.toFixed(2)} {currency}</span>
          </div>

          <PayPalScriptProvider
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
                onError={(err) => {
                  console.error("[PayPalButtons SDK Error]", err);
                  setErrorMessage("PayPal checkout popup encountered an issue. Please try again.");
                }}
              />
            </div>
          </PayPalScriptProvider>
        </div>
      )}
    </div>
  );
}
