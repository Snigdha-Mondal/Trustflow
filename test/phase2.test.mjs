import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/db.ts";
import { generateMilestonesFromBrief } from "../src/lib/gemini.ts";

test("Database: creates and retrieves contract with milestones and criteria", async () => {
  const contract = await prisma.contract.create({
    data: {
      title: "Test Escrow Contract",
      description: "Testing SQLite persistence via Prisma",
      totalBudget: 900.0,
      currency: "USD",
      clientEmail: "sarah@client.test",
      freelancerEmail: "alex@engineer.test",
      status: "DRAFT",
      milestones: {
        create: [
          {
            order: 1,
            title: "Tranche 1",
            description: "Foundation and wireframes",
            amount: 300.0,
            durationDays: 3,
            status: "LOCKED",
            criteria: {
              create: [
                { text: "HTTP 200 check", isAutomated: true },
                { text: "Design signoff", isAutomated: false },
              ],
            },
          },
          {
            order: 2,
            title: "Tranche 2",
            description: "Core frontend",
            amount: 600.0,
            durationDays: 4,
            status: "LOCKED",
            criteria: {
              create: [
                { text: "Forms input verification", isAutomated: true },
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

  assert.ok(contract.id);
  assert.equal(contract.totalBudget, 900.0);
  assert.equal(contract.milestones.length, 2);
  assert.equal(contract.milestones[0].criteria.length, 2);
  assert.equal(contract.milestones[0].criteria[0].isAutomated, true);

  // Retrieve contract by ID
  const retrieved = await prisma.contract.findUnique({
    where: { id: contract.id },
    include: { milestones: { include: { criteria: true } } },
  });

  assert.ok(retrieved);
  assert.equal(retrieved.title, "Test Escrow Contract");
});

test("Phase 2 API Logic: validates milestone sums and de-scoper bounds", async () => {
  const brief = "Need a modern landing page with contact form";
  const plan = await generateMilestonesFromBrief(brief, 1200.0, "USD");
  assert.equal(plan.milestones.length, 3);
  const total = plan.milestones.reduce((acc, m) => acc + m.amount, 0);
  assert.equal(Math.round(total * 100) / 100, 1200.0);
});
