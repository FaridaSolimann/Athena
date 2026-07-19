// Seed invariants. Run after ANY seed edit: npm run check-seed
// The demo's headline numbers are hand-reconciled; this keeps them honest.
import { ALL_CONTRACTS, SEED_CONTRACTS, UPLOAD_QUEUE, resolveSourceRef } from "../src/data";
import { deriveTimelineEvents } from "../src/lib/derive/timeline";
import { daysFromToday, TODAY_ISO } from "../src/lib/demo-clock";

let failures = 0;
const check = (name: string, ok: boolean, detail?: string) => {
  if (ok) {
    console.log(`  ✓ ${name}`);
  } else {
    failures++;
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
};

console.log(`check-seed @ ${TODAY_ISO}\n`);

// Portfolio = everything except the spare upload contract (c-018).
const portfolio = ALL_CONTRACTS.filter((c) => c.id !== "c-018");

// 0. Structure
check("17 portfolio contracts", portfolio.length === 17, `got ${portfolio.length}`);
check(
  "unique contract ids",
  new Set(ALL_CONTRACTS.map((c) => c.id)).size === ALL_CONTRACTS.length
);
check(
  "upload queue = Nimbara + spare",
  UPLOAD_QUEUE.length === 2 && UPLOAD_QUEUE[0].id === "c-015"
);
check(
  "Nimbara held out of initial repository",
  !SEED_CONTRACTS.some((c) => c.id === "c-015")
);

// 1. Total portfolio value
const total = portfolio.reduce((s, c) => s + c.valueUsd, 0);
check("total portfolio value = $8,480,000", total === 8_480_000, `got $${total.toLocaleString()}`);

// EUR normalization
const aldervik = portfolio.find((c) => c.id === "c-016");
check(
  "Aldervik EUR 220,000 × 1.08 = $237,600",
  aldervik?.valueUsd === 237_600 &&
    aldervik?.valueOriginal?.amount === 220_000 &&
    aldervik?.valueOriginal?.fxRate === 1.08
);

// 2. Concentration
const torvane = portfolio.filter((c) => c.counterparty.includes("Torvane"));
const torvaneTotal = torvane.reduce((s, c) => s + c.valueUsd, 0);
check("Torvane total = $2,544,000", torvaneTotal === 2_544_000, `got $${torvaneTotal.toLocaleString()}`);
check("Torvane = exactly 30.0% of portfolio", torvaneTotal / total === 0.3, `got ${((torvaneTotal / total) * 100).toFixed(2)}%`);
check("Torvane family = MSA + 2 SOWs", torvane.length === 3 &&
  portfolio.filter((c) => c.familyParentId === "c-004").length === 2);

// 3. Renewal window
const noticeDeadlines = portfolio
  .filter((c) => c.autoRenew)
  .map((c) => {
    const f = c.fields.find((x) => x.key === "notice_deadline");
    return f?.value.kind === "date" ? { id: c.id, iso: f.value.iso } : null;
  })
  .filter((x): x is { id: string; iso: string } => !!x);
const in90 = noticeDeadlines.filter((d) => {
  const days = daysFromToday(d.iso);
  return days >= 0 && days <= 90;
});
check("exactly 3 notice deadlines within 90 days", in90.length === 3, in90.map((d) => `${d.id}:${d.iso}`).join(", "));
const earliest = [...in90].sort((a, b) => a.iso.localeCompare(b.iso))[0];
check("earliest = Cirravault 2026-08-01 (today + 13d)",
  earliest?.id === "c-001" && earliest?.iso === "2026-08-01" && daysFromToday("2026-08-01") === 13);

// 4. Review split
const needsReview = portfolio.filter((c) => c.status === "needs_review");
const nrValue = needsReview.reduce((s, c) => s + c.valueUsd, 0);
check("needs-review contracts = Kearns + Nimbara",
  needsReview.length === 2 && needsReview.every((c) => ["c-009", "c-015"].includes(c.id)));
check("needs-review value = $267,000", nrValue === 267_000, `got $${nrValue.toLocaleString()}`);
check("expired = exactly Calder & Finch",
  portfolio.filter((c) => c.status === "expired").map((c) => c.id).join() === "c-017");

// 5. Confidence shape
const means = portfolio.map((c) => ({
  id: c.id,
  mean: c.fields.reduce((s, f) => s + f.confidence, 0) / c.fields.length,
}));
const lowMean = means.filter((m) => m.mean < 0.7);
check("exactly 1 contract with mean confidence < 0.70 (Kearns)",
  lowMean.length === 1 && lowMean[0].id === "c-009",
  lowMean.map((m) => `${m.id}:${m.mean.toFixed(2)}`).join(", "));
const nimbara = ALL_CONTRACTS.find((c) => c.id === "c-015")!;
const nimbaraLow = nimbara.fields.filter((f) => f.confidence < 0.75);
check("Nimbara has exactly 3 low-confidence fields", nimbaraLow.length === 3,
  nimbaraLow.map((f) => f.key).join(", "));

// 6. Span integrity — every source ref on every contract resolves verbatim.
let badRefs = 0;
for (const c of ALL_CONTRACTS) {
  for (const f of c.fields) {
    if (f.source && !resolveSourceRef(c, f.source)) {
      badRefs++;
      console.error(`    unresolved: ${f.id}`);
    }
    if (f.value.kind === "missing" && f.source !== null) {
      badRefs++;
      console.error(`    missing-with-source: ${f.id}`);
    }
  }
  for (const o of c.obligations) {
    if (o.source && !resolveSourceRef(c, o.source)) {
      badRefs++;
      console.error(`    unresolved: ${o.id}`);
    }
  }
  for (const r of c.risks) {
    if (r.fieldId && !c.fields.some((f) => f.id === r.fieldId)) {
      badRefs++;
      console.error(`    risk→missing field: ${r.id}`);
    }
  }
}
check("every source ref resolves to a verbatim span", badRefs === 0, `${badRefs} bad`);

// 7. Timeline liveliness — the derived Obligations Timeline (with recurrences
// expanded) must cover most months of the next year.
const timelineEvents = deriveTimelineEvents({ contracts: [...portfolio], verifications: {} });
const monthsCovered = new Set(
  timelineEvents
    .filter((e) => {
      const days = daysFromToday(e.date);
      return days >= 0 && days <= 365;
    })
    .map((e) => e.date.slice(0, 7))
);
check("derived timeline events span ≥ 10 distinct months in the next year", monthsCovered.size >= 10,
  `covered: ${[...monthsCovered].sort().join(", ")}`);

console.log(failures ? `\nFAIL — ${failures} invariant(s) broken` : "\nAll invariants hold.");
process.exit(failures ? 1 : 0);
