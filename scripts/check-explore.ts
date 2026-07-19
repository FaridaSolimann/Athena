// Validate the Explore matcher against the corpus test set.
// Run: npx tsx scripts/check-explore.ts
import { ALL_CONTRACTS } from "../src/data";
import { runExplore, type ExploreContext } from "../src/lib/explore/engine";

const ctx: ExploreContext = {
  // Everything except the spare — mirrors post-upload demo state.
  contracts: ALL_CONTRACTS.filter((c) => c.id !== "c-018"),
  verifications: {},
};

const CASES: { q: string; expectRows?: number; expectIds?: string[]; contains?: string }[] = [
  { q: "Which vendor contracts have a liability cap below $1M?", contains: "cap" },
  { q: "What renews in the next 90 days?", expectIds: ["c-001", "c-002", "c-003"] },
  { q: "Which contracts are governed by New York law?", expectRows: 4 },
  { q: "What is our total exposure to Torvane?", contains: "$2,544,000" },
  { q: "Which contracts have no liability cap?", contains: "no liability cap" },
  { q: "What contracts expire this year?", contains: "auto-renew" },
  { q: "Show extracted terms that still need review", contains: "review" },
  { q: "What payments are due in the next 60 days?", contains: "payment" },
  { q: "Which contracts auto-renew?", expectRows: 5 },
  { q: "Which contracts have exclusivity obligations?", expectIds: ["c-014"] },
  { q: "What is our total portfolio value?", contains: "$8,480,000" },
  { q: "What do we spend with Cirravault per year?", contains: "Cirravault" },
  { q: "Which contracts have unusual indemnity terms?", expectIds: ["c-016"] },
  { q: "What are the upcoming notice deadlines?", expectRows: 4 },
];

let failures = 0;
for (const c of CASES) {
  const r = runExplore(c.q, ctx);
  const problems: string[] = [];
  if (!r) {
    problems.push("no pattern matched");
  } else {
    if (c.expectRows !== undefined && r.rows.length !== c.expectRows)
      problems.push(`rows ${r.rows.length} ≠ ${c.expectRows}`);
    if (c.expectIds) {
      const ids = r.rows.map((x) => x.contractId);
      for (const id of c.expectIds)
        if (!ids.includes(id)) problems.push(`missing ${id}`);
    }
    if (c.contains && !r.answer.toLowerCase().includes(c.contains.toLowerCase()))
      problems.push(`answer lacks "${c.contains}": ${r.answer}`);
  }
  if (problems.length) {
    failures++;
    console.error(`✗ ${c.q}\n    ${problems.join("; ")}`);
    if (r) console.error(`    rows: ${r.rows.map((x) => x.contractId).join(", ")}`);
  } else {
    console.log(`✓ ${c.q}`);
  }
}

// Unmatched must stay unmatched (scope card).
const none = runExplore("What's the weather in Denver?", ctx);
if (none) {
  failures++;
  console.error(`✗ off-topic question unexpectedly matched: ${none.interpretation}`);
} else {
  console.log("✓ off-topic question falls to scope card");
}

console.log(failures ? `\nFAIL — ${failures}` : "\nAll explore cases pass.");
process.exit(failures ? 1 : 0);
