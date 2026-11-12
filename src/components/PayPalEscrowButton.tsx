"use client";

import React, { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import confetti from "canvas-confetti";
import { AlertCircle, CheckCircle2, Lock, Loader2 } from "lucide-react";

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
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pb-1">
            <span className="flex items-center gap-1.5">
              <Lock className="h-3 w-3 text-[#DAF99C]" />
              Upfront PayPal Escrow
            </span>
            <span className="text-white font-bold">${totalBudget.toFixed(2)} {currency}</span>
          </div>

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
                      "The PayPal checkout popup was closed before completion. Please click the button to try again."
                    );
                  } else {
                    setErrorMessage("PayPal checkout popup encountered an issue. Please try again.");
                  }
                }}
              />
            </div>
          </PayPalScriptProvider>
        </div>
      )}
    </div>
  );
}
