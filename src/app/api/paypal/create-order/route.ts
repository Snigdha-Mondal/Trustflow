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

    const order = await createPayPalOrder({
      amount: contract.totalBudget,
      currency: contract.currency,
      description: `Trustflow Escrow: ${contract.title}`,
      contractId: contract.id,
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

