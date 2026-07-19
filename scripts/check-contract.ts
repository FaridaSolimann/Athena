// Validate a single seed contract file: source-span integrity + structural sanity.
// Usage: npx tsx scripts/check-contract.ts src/data/contracts/cirravault.ts
import path from "node:path";
import type { Contract, SourceRef } from "../src/data/types";

async function main() {
  const rel = process.argv[2];
  if (!rel) {
    console.error("usage: npx tsx scripts/check-contract.ts <path-to-contract-file>");
    process.exit(2);
  }
  const mod = await import(path.resolve(rel));
  const contracts = Object.values(mod).filter(
    (v): v is Contract => !!v && typeof v === "object" && "fields" in (v as object)
  );
  if (contracts.length === 0) {
    console.error(`FAIL: ${rel} exports no Contract`);
    process.exit(1);
  }

  let failures = 0;
  const fail = (msg: string) => {
    failures++;
    console.error(`  ✗ ${msg}`);
  };

  for (const c of contracts) {
    console.log(`${c.id} — ${c.title}`);
    const sections = new Map(c.document.sections.map((s) => [s.id, s]));

    const checkRef = (owner: string, ref: SourceRef | null | undefined) => {
      if (!ref) return;
      const section = sections.get(ref.sectionId);
      if (!section) return fail(`${owner}: section ${ref.sectionId} not found`);
      const hits = section.paragraphs.filter((p) => p.includes(ref.excerpt));
      if (hits.length === 0)
        return fail(`${owner}: excerpt not found verbatim in ${ref.sectionId}: "${ref.excerpt.slice(0, 60)}…"`);
    };

    for (const f of c.fields) {
      if (f.id !== `${c.id}:${f.key}`) fail(`field id ${f.id} ≠ ${c.id}:${f.key}`);
      if (f.contractId !== c.id) fail(`field ${f.id} has contractId ${f.contractId}`);
      if (f.confidence < 0 || f.confidence > 1) fail(`field ${f.id} confidence out of range`);
      if (f.value.kind === "missing" && f.source !== null)
        fail(`field ${f.id} is 'missing' but has a source`);
      checkRef(`field ${f.id}`, f.source);
    }
    for (const o of c.obligations) {
      if (o.contractId !== c.id) fail(`obligation ${o.id} contractId mismatch`);
      checkRef(`obligation ${o.id}`, o.source);
    }
    for (const r of c.risks) {
      if (r.fieldId && !c.fields.some((f) => f.id === r.fieldId))
        fail(`risk ${r.id} references unknown field ${r.fieldId}`);
    }
    for (const m of c.milestones) {
      if (m.contractId !== c.id) fail(`milestone ${m.id} contractId mismatch`);
    }
    const dup = c.fields.map((f) => f.key).filter((k, i, a) => a.indexOf(k) !== i);
    if (dup.length) fail(`duplicate field keys: ${dup.join(", ")}`);
    console.log(
      `  ${c.fields.length} fields, ${c.obligations.length} obligations, ${c.risks.length} risks, ${c.document.sections.length} sections`
    );
  }

  if (failures) {
    console.error(`\nFAIL: ${failures} problem(s)`);
    process.exit(1);
  }
  console.log("OK");
}

main();
