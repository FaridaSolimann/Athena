import type { ContractType } from "@/data/types";
import { daysFromToday, TODAY_ISO } from "@/lib/demo-clock";
import type { QueryPlan } from "@/lib/explore/plan";
import {
  answerFor,
  describePlan,
  executePlan,
  type ExploreContext,
  type ExploreResult,
} from "@/lib/explore/execute";

export type { ExploreContext, ExploreResult, ExploreRow } from "@/lib/explore/execute";

// The deterministic fallback: ~16 curated question patterns, each translating
// to the same QueryPlan DSL that Gemini emits. Both producers feed one shared
// executor (execute.ts), so the UI and the numbers are identical either way.

// ---- slot parsers ----

function parseMoney(q: string): number | null {
  const m = q.match(/\$?\s*([\d][\d,.]*)\s*(million|mm|m\b|k\b|thousand)?/i);
  if (!m) return null;
  let n = parseFloat(m[1].replace(/,/g, ""));
  if (!Number.isFinite(n)) return null;
  const suffix = m[2]?.toLowerCase();
  if (suffix?.startsWith("m")) n *= 1_000_000;
  else if (suffix === "k" || suffix === "thousand") n *= 1_000;
  return n;
}

function parseWindowDays(q: string): number | null {
  const m = q.match(/(\d+)\s*(day|week|month|quarter|year)s?/i);
  if (m) {
    const n = parseInt(m[1], 10);
    const unit = m[2].toLowerCase();
    return unit === "day" ? n : unit === "week" ? n * 7 : unit === "month" ? n * 30 : unit === "quarter" ? n * 91 : n * 365;
  }
  if (/next quarter|this quarter/i.test(q)) return 91;
  if (/this year|by year.end|end of (the )?year/i.test(q)) return daysFromToday(`${TODAY_ISO.slice(0, 4)}-12-31`);
  if (/next year/i.test(q)) return 365;
  return null;
}

const TYPE_WORDS: [RegExp, ContractType][] = [
  [/\bsaas\b|subscription/i, "SaaS"],
  [/\bvendor|services agreement/i, "Vendor"],
  [/\bnda|non.?disclosure/i, "NDA"],
  [/\bmsa\b|master service/i, "MSA"],
  [/\bsow\b|statement of work/i, "SOW"],
  [/\blease\b/i, "Lease"],
  [/employment/i, "Employment"],
  [/partnership|reseller/i, "Partnership"],
];

const LAWS = ["New York", "California", "Delaware", "Colorado", "Texas", "Germany"];

function findCounterparty(ctx: ExploreContext, q: string): string | null {
  const names = [...new Set(ctx.contracts.map((c) => c.counterparty))];
  const ql = q.toLowerCase();
  for (const name of names) {
    const first = name.split(/[\s,]+/)[0].toLowerCase();
    if (first.length >= 4 && ql.includes(first)) return name;
  }
  return null;
}

// ---- patterns → plans ----

interface Pattern {
  id: string;
  match: (q: string) => boolean;
  plan: (q: string, ctx: ExploreContext) => QueryPlan;
}

const PORTFOLIO_TOTAL_PLAN: QueryPlan = {
  intent: "aggregate",
  filters: [],
  aggregate: { fn: "sum", field: "total_value" },
  population: "all",
  show: ["total_value"],
  sort: { field: "total_value", dir: "desc" },
};

const PATTERNS: Pattern[] = [
  {
    id: "missing-cap",
    match: (q) =>
      /(no|without|missing|absent|lack)\w*\s+(a\s+)?(liability\s+)?cap/i.test(q) ||
      /cap\s+(is\s+)?(missing|absent)/i.test(q),
    plan: () => ({
      intent: "filter",
      filters: [{ field: "liability_cap", op: "absent" }],
      show: ["liability_cap"],
    }),
  },
  {
    id: "cap-threshold",
    match: (q) => /cap/i.test(q) && /(below|under|less than|<|above|over|greater than|>)/i.test(q),
    plan: (q) => {
      const above = /(above|over|greater than|>)/i.test(q);
      const threshold =
        parseMoney(q.replace(/.*?(below|under|less than|<|above|over|greater than|>)/i, "")) ??
        1_000_000;
      const type = TYPE_WORDS.find(([re]) => re.test(q))?.[1];
      const filters: QueryPlan["filters"] = [
        { field: "liability_cap", op: above ? "gt" : "lt", value: threshold },
      ];
      if (type) {
        filters.push({
          field: "contract_type",
          op: "eq",
          value: type === "Vendor" ? ["Vendor", "SaaS"] : [type],
        });
      }
      return { intent: "filter", filters, show: ["liability_cap", "total_value"] };
    },
  },
  {
    id: "auto-renew-list",
    match: (q) => /auto[- ]?renew/i.test(q) && parseWindowDays(q) === null,
    plan: () => ({
      intent: "filter",
      filters: [{ field: "auto_renew", op: "eq", value: true }],
      show: ["auto_renew", "notice_deadline"],
    }),
  },
  {
    id: "renewals-window",
    match: (q) => /renew/i.test(q),
    plan: (q) => ({
      intent: "lookup",
      filters: [],
      scope: { kind: "renewals", days: parseWindowDays(q) ?? 90 },
      show: ["renewal_date", "notice_deadline", "total_value"],
    }),
  },
  {
    id: "notice-deadlines",
    match: (q) => /notice|deadline|cancel/i.test(q),
    plan: (q) => ({
      intent: "filter",
      filters: [{ field: "notice_deadline", op: "within_days", value: parseWindowDays(q) ?? 180 }],
      show: ["notice_deadline", "notice_days"],
      sort: { field: "notice_deadline", dir: "asc" },
    }),
  },
  {
    id: "expirations",
    match: (q) => /expir|ending|end(s)? (this|next|in)/i.test(q) && !/expired/i.test(q),
    plan: (q) => ({
      intent: "filter",
      filters: [
        {
          field: "expiration_date",
          op: "within_days",
          value: parseWindowDays(q) ?? daysFromToday(`${TODAY_ISO.slice(0, 4)}-12-31`),
        },
      ],
      show: ["expiration_date", "auto_renew"],
      sort: { field: "expiration_date", dir: "asc" },
    }),
  },
  {
    id: "expired",
    match: (q) => /expired|lapsed/i.test(q),
    plan: () => ({
      intent: "filter",
      filters: [{ field: "status", op: "eq", value: "expired" }],
      population: "all",
      show: ["expiration_date"],
    }),
  },
  {
    id: "governing-law",
    match: (q) =>
      /governed|governing law|jurisdiction/i.test(q) ||
      LAWS.some((l) => new RegExp(`\\b${l}\\b`, "i").test(q)),
    plan: (q) => {
      const law = LAWS.find((l) => new RegExp(`\\b${l}\\b`, "i").test(q));
      if (!law) {
        return {
          intent: "compare",
          filters: [],
          groupBy: "governing_law",
          show: ["governing_law"],
        };
      }
      return {
        intent: "filter",
        filters: [{ field: "governing_law", op: "contains", value: law }],
        population: "all",
        show: ["governing_law"],
      };
    },
  },
  {
    id: "counterparty-exposure",
    match: (q) => /(exposure|spend|total|value|commit)/i.test(q),
    plan: (q, ctx) => {
      const name = findCounterparty(ctx, q);
      if (!name) return PORTFOLIO_TOTAL_PLAN;
      return {
        intent: "aggregate",
        filters: [{ field: "counterparty", op: "contains", value: name }],
        aggregate: { fn: "sum", field: "total_value" },
        show: ["total_value", "payment_schedule"],
      };
    },
  },
  {
    id: "exclusivity",
    match: (q) => /exclusiv/i.test(q),
    plan: () => ({
      intent: "filter",
      filters: [{ field: "exclusivity", op: "present" }],
      show: ["exclusivity"],
    }),
  },
  {
    id: "termination",
    match: (q) => /terminat/i.test(q),
    plan: () => ({
      intent: "filter",
      filters: [{ field: "termination", op: "present" }],
      show: ["termination"],
    }),
  },
  {
    id: "indemnity",
    match: (q) => /indemn/i.test(q),
    plan: () => ({
      intent: "filter",
      filters: [{ field: "indemnification", op: "present" }],
      show: ["indemnification"],
    }),
  },
  {
    id: "payments-due",
    match: (q) => /pay(ment)?s?\b.*due|due.*pay|invoices?|milestones?/i.test(q),
    plan: (q) => ({
      intent: "lookup",
      filters: [],
      scope: { kind: "payments_due", days: parseWindowDays(q) ?? 60 },
      show: ["payment_schedule"],
    }),
  },
  {
    id: "needs-review",
    match: (q) => /low.conf|needs? review|unverified|verify|uncertain|not sure/i.test(q),
    plan: () => ({
      intent: "lookup",
      filters: [],
      scope: { kind: "needs_review" },
      show: [],
    }),
  },
  {
    id: "family",
    match: (q) => /family|hangs? off|under the msa|sows? (under|of)|related/i.test(q),
    plan: () => ({
      intent: "lookup",
      filters: [],
      scope: { kind: "families" },
      show: ["liability_cap", "total_value"],
    }),
  },
  {
    id: "portfolio-total",
    match: (q) => /portfolio|total (contract )?value|worth|committed|commitments|on the hook/i.test(q),
    plan: () => PORTFOLIO_TOTAL_PLAN,
  },
];

/** Deterministic question → plan. Null = out of scope (scope card). */
export function buildFallbackPlan(query: string, ctx: ExploreContext): QueryPlan | null {
  const q = query.trim();
  if (!q) return null;
  for (const p of PATTERNS) {
    if (p.match(q)) return p.plan(q, ctx);
  }
  return null;
}

/** Full fallback pipeline: match → plan → shared executor. */
export function runExplore(query: string, ctx: ExploreContext): ExploreResult | null {
  const plan = buildFallbackPlan(query, ctx);
  if (!plan) return null;
  return runPlan(plan, ctx);
}

/** Execute any validated plan (Gemini's or the matcher's) into a result. */
export function runPlan(plan: QueryPlan, ctx: ExploreContext): ExploreResult {
  const exec = executePlan(plan, ctx);
  return {
    interpretation: describePlan(plan),
    answer: answerFor(plan, exec, ctx),
    rows: exec.rows,
  };
}
