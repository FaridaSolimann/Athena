// Validate the Explore matcher against the corpus test set.
// Run: npm run check-explore
import { ALL_CONTRACTS } from "../src/data";
import {
  buildFallbackPlan,
  runExplore,
  type ExploreContext,
} from "../src/lib/explore/engine";
import { validatePlan } from "../src/lib/explore/plan";
import { describePlan } from "../src/lib/explore/execute";

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

// Every fallback plan must pass the same validation Gemini plans face —
// the matcher is a permanent conformance test of the DSL.
for (const c of CASES) {
  const plan = buildFallbackPlan(c.q, ctx);
  if (!plan) {
    failures++;
    console.error(`✗ no fallback plan for: ${c.q}`);
    continue;
  }
  const v = validatePlan(plan);
  if (!v.ok) {
    failures++;
    console.error(`✗ fallback plan fails validation for "${c.q}": ${v.error}`);
  }
}
console.log("✓ all fallback plans pass validatePlan");

// Hostile/malformed plans must be rejected (what a misbehaving model sends).
const BAD_PLANS: [string, unknown][] = [
  ["unknown field", { intent: "filter", filters: [{ field: "salary", op: "gt", value: "1" }], show: [] }],
  ["unknown op", { intent: "filter", filters: [{ field: "total_value", op: "regex", value: ".*" }], show: [] }],
  ["bad intent", { intent: "delete", filters: [{ field: "total_value", op: "gt", value: "1" }], show: [] }],
  ["unsupported flag", { unsupported: true }],
  ["non-object", "DROP TABLE contracts"],
  ["empty plan", { intent: "filter", filters: [], show: ["total_value"] }],
  ["oversize window", { intent: "filter", filters: [{ field: "expiration_date", op: "within_days", value: "99999" }], show: [] }],
];
for (const [label, bad] of BAD_PLANS) {
  const v = validatePlan(bad);
  if (v.ok) {
    failures++;
    console.error(`✗ bad plan accepted: ${label}`);
  }
}
console.log("✓ malformed plans are rejected");

// Value coercion: models send strings.
const coerced = validatePlan({
  intent: "filter",
  filters: [
    { field: "liability_cap", op: "lt", value: "1000000" },
    { field: "auto_renew", op: "eq", value: "true" },
  ],
  show: ["liability_cap"],
});
if (!coerced.ok || coerced.plan.filters[0].value !== 1_000_000 || coerced.plan.filters[1].value !== true) {
  failures++;
  console.error("✗ string values not coerced to number/boolean");
} else {
  console.log("✓ string values coerce to number/boolean");
}

// The numbers guardrail: prose may only state figures present in the
// retrieved context; one invented number kills the sentence.
import { proseNumbersAreGrounded, type AnswerContext } from "../src/lib/explore/answer-context";
const GUARD_CTX: AnswerContext = {
  rows: [
    { contractId: "c-005", contract: "SOW #1", counterparty: "Torvane Consulting Group LLC", values: [{ field: "Total contract value", value: "$456,000" }] },
    { contractId: "c-006", contract: "SOW #2", counterparty: "Torvane Consulting Group LLC", values: [{ field: "Total contract value", value: "$2,088,000" }] },
  ],
  aggregate: { fn: "sum", value: "$2,544,000", count: 3 },
  interpretation: "sum(total_value)",
  truncated: false,
};
const GUARD_CASES: [string, string, boolean][] = [
  ["verbatim figures + trailing period", "Our total exposure is $2,544,000. SOW #1 is $456,000 and SOW #2 is $2,088,000.", true],
  ["invented total", "Our total exposure is $2,600,000 across these contracts.", false],
  ["recomputed/rounded figure", "That's about $2.5M in total.", false],
  ["small counts allowed", "3 contracts with Torvane make up the total of $2,544,000.", true],
];
for (const [label, prose, expected] of GUARD_CASES) {
  if (proseNumbersAreGrounded(prose, GUARD_CTX) !== expected) {
    failures++;
    console.error(`✗ guardrail: ${label} (expected ${expected})`);
  }
}
console.log("✓ prose numbers guardrail");

// The inspectable plan line stays human-readable.
const golden = buildFallbackPlan("Which vendor contracts have a liability cap below $1M?", ctx);
const goldenLine = golden ? describePlan(golden) : "";
if (goldenLine !== "liability_cap < $1,000,000 AND contract_type = Vendor or SaaS") {
  failures++;
  console.error(`✗ describePlan golden mismatch: "${goldenLine}"`);
} else {
  console.log("✓ describePlan golden line");
}

console.log(failures ? `\nFAIL — ${failures}` : "\nAll explore cases pass.");
process.exit(failures ? 1 : 0);
