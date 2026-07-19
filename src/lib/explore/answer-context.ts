// The bridge between retrieval and generation. After a plan executes locally,
// this builds the ONLY context the answer-writing model is allowed to see:
// contract names, already-normalized field values, clause snippets, and any
// code-computed aggregate. The model phrases; it never computes.
import type { Contract } from "@/data/types";
import { resolveSourceRef } from "@/data";
import { lookupContract } from "@/lib/selectors";
import { effectiveField } from "@/lib/selectors";
import { fmtFieldValue, fmtMoneyFull } from "@/lib/format";
import type { QueryPlan } from "@/lib/explore/plan";
import type { ExecResult, ExploreContext } from "@/lib/explore/execute";

export interface AnswerContextRow {
  contractId: string;
  contract: string;
  counterparty: string;
  /** Normalized display values for the fields this row cites. */
  values: { field: string; value: string }[];
  /** Verbatim clause snippet backing the primary cited field. */
  snippet?: string;
  note?: string;
}

export interface AnswerContext {
  rows: AnswerContextRow[];
  /** Code-computed figure — the model must state it verbatim, never recompute. */
  aggregate?: { fn: string; value: string; count: number };
  /** How the plan was read, for the model's orientation only. */
  interpretation: string;
  truncated: boolean;
}

const MAX_ROWS = 10;
const SNIPPET_CHARS = 220;

export function buildAnswerContext(
  plan: QueryPlan,
  exec: ExecResult,
  ctx: ExploreContext,
  interpretation: string
): AnswerContext {
  const rows: AnswerContextRow[] = [];
  for (const row of exec.rows.slice(0, MAX_ROWS)) {
    const contract = lookupContract(row.contractId);
    if (!contract) continue;

    const values: { field: string; value: string }[] = [];
    let snippet: string | undefined;
    for (const fieldId of row.fieldIds.slice(0, 4)) {
      const field = contract.fields.find((f) => f.id === fieldId);
      if (!field) continue;
      const eff = effectiveField(field, ctx.verifications[field.id]);
      values.push({ field: field.label, value: fmtFieldValue(eff.value) });
      if (!snippet && field.source) {
        const resolved = resolveSourceRef(contract as Contract, field.source);
        if (resolved) snippet = field.source.excerpt.slice(0, SNIPPET_CHARS);
      }
    }

    rows.push({
      contractId: contract.id,
      contract: contract.title,
      counterparty: contract.counterparty,
      values,
      snippet,
      note: row.note,
    });
  }

  return {
    rows,
    aggregate: exec.agg
      ? {
          fn: exec.agg.fn,
          value:
            exec.agg.fn === "count"
              ? String(exec.agg.count)
              : fmtMoneyFull(exec.agg.value),
          count: exec.agg.count,
        }
      : undefined,
    interpretation,
    truncated: exec.rows.length > MAX_ROWS,
  };
}

/** The numbers guardrail: every dollar figure and bare number in the prose
 * must appear somewhere in the supplied context. One invented number kills
 * the whole sentence — the deterministic template takes over. */
export function proseNumbersAreGrounded(prose: string, context: AnswerContext): boolean {
  const haystack = JSON.stringify(context).replace(/[,\s]/g, "");
  const numbers = prose.match(/\$?[\d][\d,,.]*(?:\s*(?:million|M|K|k))?%?/g) ?? [];
  for (const raw of numbers) {
    // strip separators AND trailing sentence punctuation the regex drags in
    const cleaned = raw.replace(/[,\s]/g, "").replace(/[.]+$/, "");
    if (!cleaned || /^[.$]*$/.test(cleaned)) continue;
    // tiny counts (≤ context row count) are fine — "3 contracts"
    const asInt = Number(cleaned.replace(/[$%MKk]/g, ""));
    if (!cleaned.includes("$") && Number.isInteger(asInt) && asInt <= Math.max(context.rows.length, context.aggregate?.count ?? 0)) {
      continue;
    }
    if (!haystack.includes(cleaned)) return false;
  }
  return true;
}
