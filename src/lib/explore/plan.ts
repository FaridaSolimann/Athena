// The QueryPlan DSL — the ONLY thing a model (or the pattern matcher) may
// produce. Plans are validated against these whitelists on the server before
// returning AND on the client before executing; execution itself is always
// local and deterministic, so answers are computed facts, never model output.

export const PLAN_FIELDS = [
  "contract_type",
  "counterparty",
  "effective_date",
  "expiration_date",
  "renewal_date",
  "notice_deadline",
  "auto_renew",
  "notice_days",
  "term_length",
  "total_value",
  "payment_schedule",
  "liability_cap",
  "governing_law",
  "confidentiality",
  "ip_ownership",
  "indemnification",
  "termination",
  "sla",
  "exclusivity",
  "insurance",
  "status", // virtual: contract lifecycle status (active | needs_review | expired)
] as const;
export type PlanField = (typeof PLAN_FIELDS)[number];

export const PLAN_OPS = [
  "lt", "lte", "gt", "gte", "eq", "neq", "contains", "before", "after",
  "within_days", // date field falls within [today, today + N days]
  "absent",      // extractor found the field missing or unreadably ambiguous
  "present",     // field has a readable value (or the matching risk flag exists)
] as const;
export type PlanOp = (typeof PLAN_OPS)[number];

export const SCOPE_KINDS = [
  "renewals",     // auto-renewing contracts whose renewal OR notice date is in window
  "payments_due", // dated milestones + payment obligations we owe in window
  "needs_review", // extracted terms still awaiting human review
  "families",     // master agreements with their child SOWs
] as const;
export type ScopeKind = (typeof SCOPE_KINDS)[number];

export type PlanValue = string | number | boolean | string[];

export interface PlanFilter {
  field: PlanField;
  op: PlanOp;
  /** Omitted for absent/present. string[] means "equals any of". */
  value?: PlanValue;
}

export interface QueryPlan {
  intent: "filter" | "aggregate" | "compare" | "lookup";
  filters: PlanFilter[];
  aggregate?: { fn: "sum" | "count" | "avg" | "max" | "min"; field?: PlanField };
  groupBy?: PlanField;
  /** Escape hatch for questions that aren't row-filters over contracts. */
  scope?: { kind: ScopeKind; days?: number };
  /** Default "active" (excludes expired). */
  population?: "active" | "all";
  /** Fields cited on each result row. */
  show: PlanField[];
  sort?: { field: PlanField; dir: "asc" | "desc" };
  limit?: number;
}

export type PlanValidation =
  | { ok: true; plan: QueryPlan }
  | { ok: false; error: string };

const INTENTS = ["filter", "aggregate", "compare", "lookup"];
const AGG_FNS = ["sum", "count", "avg", "max", "min"];

function isField(x: unknown): x is PlanField {
  return typeof x === "string" && (PLAN_FIELDS as readonly string[]).includes(x);
}

/** Structured output can't express value unions, so models send strings —
 * coerce "1000000" → 1000000 and "true"/"false" → booleans here. */
function coerceValue(v: unknown): PlanValue | undefined {
  if (v === undefined || v === null) return undefined;
  if (typeof v === "number" || typeof v === "boolean") return v;
  if (Array.isArray(v)) {
    const items = v.filter((x): x is string => typeof x === "string");
    return items.length ? items : undefined;
  }
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  if (/^(true|false)$/i.test(t)) return t.toLowerCase() === "true";
  const numeric = t.replace(/[$,\s]/g, "");
  if (/^-?\d+(\.\d+)?$/.test(numeric) && !/^\d{4}-\d{2}-\d{2}$/.test(t)) {
    return Number(numeric);
  }
  return t;
}

export function validatePlan(x: unknown): PlanValidation {
  if (!x || typeof x !== "object" || Array.isArray(x)) {
    return { ok: false, error: "plan is not an object" };
  }
  const raw = x as Record<string, unknown>;

  if (raw.unsupported === true) return { ok: false, error: "out_of_scope" };

  if (typeof raw.intent !== "string" || !INTENTS.includes(raw.intent)) {
    return { ok: false, error: `invalid intent: ${String(raw.intent)}` };
  }

  const filters: PlanFilter[] = [];
  if (raw.filters !== undefined) {
    if (!Array.isArray(raw.filters)) return { ok: false, error: "filters must be an array" };
    if (raw.filters.length > 8) return { ok: false, error: "too many filters" };
    for (const f of raw.filters) {
      if (!f || typeof f !== "object") return { ok: false, error: "filter is not an object" };
      const ff = f as Record<string, unknown>;
      if (!isField(ff.field)) return { ok: false, error: `unknown field: ${String(ff.field)}` };
      if (typeof ff.op !== "string" || !(PLAN_OPS as readonly string[]).includes(ff.op)) {
        return { ok: false, error: `unknown op: ${String(ff.op)}` };
      }
      const op = ff.op as PlanOp;
      // structured output splits single vs any-of into value/values
      const value = coerceValue(ff.value ?? ff.values);
      if (op !== "absent" && op !== "present" && value === undefined) {
        return { ok: false, error: `op ${op} requires a value` };
      }
      if (op === "within_days" && (typeof value !== "number" || value < 0 || value > 3650)) {
        return { ok: false, error: "within_days requires 0–3650" };
      }
      filters.push({ field: ff.field, op, value });
    }
  }

  let aggregate: QueryPlan["aggregate"];
  if (raw.aggregate !== undefined && raw.aggregate !== null) {
    const a = raw.aggregate as Record<string, unknown>;
    if (typeof a.fn !== "string" || !AGG_FNS.includes(a.fn)) {
      return { ok: false, error: `unknown aggregate fn: ${String(a.fn)}` };
    }
    if (a.field !== undefined && a.field !== null && a.field !== "" && !isField(a.field)) {
      return { ok: false, error: `unknown aggregate field: ${String(a.field)}` };
    }
    aggregate = {
      fn: a.fn as NonNullable<QueryPlan["aggregate"]>["fn"],
      field: isField(a.field) ? a.field : undefined,
    };
  }

  let groupBy: PlanField | undefined;
  if (raw.groupBy !== undefined && raw.groupBy !== null && raw.groupBy !== "") {
    if (!isField(raw.groupBy)) return { ok: false, error: `unknown groupBy: ${String(raw.groupBy)}` };
    groupBy = raw.groupBy;
  }

  let scope: QueryPlan["scope"];
  if (raw.scope !== undefined && raw.scope !== null) {
    const s = raw.scope as Record<string, unknown>;
    if (typeof s.kind !== "string" || !(SCOPE_KINDS as readonly string[]).includes(s.kind)) {
      return { ok: false, error: `unknown scope: ${String(s.kind)}` };
    }
    const days = s.days === undefined || s.days === null ? undefined : Number(s.days);
    if (days !== undefined && (!Number.isFinite(days) || days < 0 || days > 3650)) {
      return { ok: false, error: "scope.days requires 0–3650" };
    }
    scope = { kind: s.kind as ScopeKind, days };
  }

  let population: QueryPlan["population"];
  if (raw.population !== undefined && raw.population !== null && raw.population !== "") {
    if (raw.population !== "active" && raw.population !== "all") {
      return { ok: false, error: `unknown population: ${String(raw.population)}` };
    }
    population = raw.population;
  }

  const show: PlanField[] = [];
  if (raw.show !== undefined && raw.show !== null) {
    if (!Array.isArray(raw.show)) return { ok: false, error: "show must be an array" };
    for (const s of raw.show) {
      if (!isField(s)) return { ok: false, error: `unknown show field: ${String(s)}` };
      show.push(s);
    }
  }

  let sort: QueryPlan["sort"];
  if (raw.sort !== undefined && raw.sort !== null) {
    const s = raw.sort as Record<string, unknown>;
    if (!isField(s.field)) return { ok: false, error: `unknown sort field: ${String(s.field)}` };
    if (s.dir !== "asc" && s.dir !== "desc") return { ok: false, error: "sort.dir must be asc|desc" };
    sort = { field: s.field, dir: s.dir };
  }

  let limit: number | undefined;
  if (raw.limit !== undefined && raw.limit !== null) {
    const n = Number(raw.limit);
    if (!Number.isInteger(n) || n < 1 || n > 100) return { ok: false, error: "limit must be 1–100" };
    limit = n;
  }

  if (filters.length === 0 && !aggregate && !groupBy && !scope) {
    return { ok: false, error: "empty plan" };
  }

  return {
    ok: true,
    plan: { intent: raw.intent as QueryPlan["intent"], filters, aggregate, groupBy, scope, population, show: show.slice(0, 6), sort, limit },
  };
}
