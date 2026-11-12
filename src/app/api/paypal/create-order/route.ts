import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createPayPalOrder } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contractId } = body;

    if (!contractId) {
      return NextResponse.json({ error: "contractId is required" }, { status: 400 });
    }

    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const appUrl = host ? `${protocol}://${host}` : process.env.NEXT_PUBLIC_APP_URL || "https://trustflow-yq0h.onrender.com";

    const order = await createPayPalOrder({
      amount: contract.totalBudget,
      currency: contract.currency,
      description: `Trustflow Escrow: ${contract.title}`,
      contractId: contract.id,
      appUrl,
    });

    await prisma.contract.update({
      where: { id: contractId },
      data: {
        paypalOrderId: order.id,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: unknown) {
    console.error("[PayPal Create Order Error]", error);
    const message = error instanceof Error ? error.message : "Failed to create PayPal order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

