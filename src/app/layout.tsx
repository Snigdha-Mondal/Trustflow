import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trustflow | Freelance Milestone Escrow with Autonomous AI Inspection",
  description:
    "Freelance milestone escrow without payment anxiety or ghosting. Powered by PayPal, automated AI deliverable inspection, and interactive Bryntum Gantt timelines.",
  openGraph: {
    title: "Trustflow — Freelance Milestone Escrow",
    description:
      "Automated milestone escrow powered by PayPal Orders & Payouts APIs with a 72-Hour Silence-Means-Yes guarantee.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#141517] text-[#F8F9FA] antialiased selection:bg-[#DAF99C] selection:text-[#0E1012]">
        {children}
      </body>
    </html>
  );
}

