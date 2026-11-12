import { NextResponse } from "next/server";

export async function GET() {
  const clientId =
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
    process.env.PAYPAL_CLIENT_ID ||
    "BAASOiuRqrR0cWEHEo8mQAoiIcwRs5QiovbmDvP3NYkDUdFUfSj0GMsJRTg6O2IRxti22anIJjnU033W88";

  return NextResponse.json({
    clientId,
    currency: "USD",
    mode: process.env.PAYPAL_MODE || "sandbox",
  });
}

