import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding demo contract for PayPal AI Hackathon & Bryntum Sponsor Track...");

  // Clean existing demo contract if present
  await prisma.contract.deleteMany({
    where: { title: "SaaS Marketing Site & Lead Funnel (Demo)" },
  });

  const now = new Date();
  const m1Start = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);
  const m1End = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
  const m2Start = now;
  const m2End = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
  const m3Start = m2End;
  const m3End = new Date(m3Start.getTime() + 3 * 24 * 60 * 60 * 1000);

  const contract = await prisma.contract.create({
    data: {
      id: "demo-contract-2026",
      title: "SaaS Marketing Site & Lead Funnel (Demo)",
      description: "Complete Next.js marketing site with pricing tables, responsive layout, and verified lead capture form.",
      totalBudget: 900.0,
      currency: "USD",
      clientEmail: "sarah.founder@startup.io",
      freelancerEmail: "alex.engineer@tech.net",
      status: "FUNDED",
      paypalOrderId: "ORDER_SANDBOX_78912",
      paypalCaptureId: "CAPTURE_SANDBOX_78912",
      milestones: {
        create: [
          {
            id: "ms_demo_01",
            order: 1,
            title: "Design System, Wireframes & Scaffold",
            description: "Scaffold Next.js repository, configure DESIGN.md tokens, and provide responsive wireframes.",
            amount: 300.0,
            durationDays: 3,
            status: "PAID",
            startDate: m1Start,
            endDate: m1End,
            payoutBatchId: "PAYOUTS_BATCH_78912",
            criteria: {
              create: [
                { text: "Design system tokens match specified typography and spacing scale", isAutomated: false, passed: true, evidence: "Client approved design system layout." },
                { text: "Project repository scaffolded with Next.js and TypeScript", isAutomated: true, passed: true, evidence: "Repository initialized with strict TypeScript." },
              ],
            },
          },
          {
            id: "ms_demo_02",
            order: 2,
            title: "Frontend Implementation & Lead Forms",
            description: "Implement responsive views, live routes, interactive forms, and API integrations.",
            amount: 300.0,
            durationDays: 4,
            status: "ACTIVE",
            startDate: m2Start,
            endDate: m2End,
            criteria: {
              create: [
                { text: "Live URL returns HTTP 200 on /, /about, and /pricing", isAutomated: true },
                { text: "Page contains contact form with email validation input", isAutomated: true },
                { text: "Responsive viewport meta tag configured with no horizontal overflow", isAutomated: true },
                { text: "Client visual aesthetic approval", isAutomated: false },
              ],
            },
          },
          {
            id: "ms_demo_03",
            order: 3,
            title: "Production Deployment & Handover",
            description: "Final verification, performance checks, production domain routing, and complete handover documentation.",
            amount: 300.0,
            durationDays: 3,
            status: "LOCKED",
            startDate: m3Start,
            endDate: m3End,
            criteria: {
              create: [
                { text: "Production deployment live with valid HTTPS and active SSL certificate", isAutomated: true },
                { text: "Zero critical console errors on page load", isAutomated: true },
                { text: "Repository README includes complete local setup and deployment steps", isAutomated: true },
              ],
            },
          },
        ],
      },
    },
    include: {
      milestones: {
        include: { criteria: true },
      },
    },
  });

  console.log(`Demo contract created with ID: ${contract.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

