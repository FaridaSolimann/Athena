import type { Contract, RiskKind } from "@/data/types";
import type { Verification } from "@/lib/store";
import { effectiveField } from "@/lib/selectors";
import { addDays, daysFromToday, TODAY_ISO } from "@/lib/demo-clock";
import { fmtDate, fmtMoneyFull, fmtPercent } from "@/lib/format";
import type { PlanField, PlanFilter, QueryPlan } from "@/lib/explore/plan";

// The shared deterministic engine. Whether a plan came from Gemini or from
// the pattern matcher, THIS code computes every row and every number in the
// answer — against effective state (seed ⊕ overlay), so human corrections
// change answers on both paths. Results are facts; facts carry provenance.

export interface ExploreRow {
  contractId: string;
  /** Fields that justify this row — rendered as cited TrustedFacts. */
  fieldIds: string[];
  note?: string;
}

export interface ExploreResult {
  /** How Athena read the question — the inspectable plan line. */
  interpretation: string;
  /** The one-sentence answer with computed numbers. */
  answer: string;
  rows: ExploreRow[];
}

export interface ExploreContext {
  contracts: Contract[]; // visible (seed + uploaded)
  verifications: Record<string, Verification>;
}

// ---- helpers over effective state ----

export function effValue(ctx: ExploreContext, c: Contract, key: string) {
  const f = c.fields.find((x) => x.key === key);
  if (!f) return null;
  return { field: f, eff: effectiveField(f, ctx.verifications[f.id]) };
}

export function effMoney(ctx: ExploreContext, c: Contract, key: string): number | null {
  const r = effValue(ctx, c, key);
  if (!r) return null;
  return r.eff.value.kind === "money" ? r.eff.value.usd : null;
}

export function effDate(ctx: ExploreContext, c: Contract, key: string): string | null {
  const r = effValue(ctx, c, key);
  if (!r) return null;
  return r.eff.value.kind === "date" ? r.eff.value.iso : null;
}

export const fid = (c: Contract, key: string) => c.fields.find((f) => f.key === key)?.id;

export const cited = (c: Contract, ...keys: string[]) =>
  keys.map((k) => fid(c, k)).filter((x): x is string => !!x);

export const list = (n: number, singular: string) =>
  `${n} ${n === 1 ? singular : singular + "s"}`;

const activeOf = (ctx: ExploreContext) => ctx.contracts.filter((c) => c.status !== "expired");

/** `present` on these fields also matches the risk flag when no field exists. */
const RISK_FOR_FIELD: Partial<Record<PlanField, RiskKind>> = {
  exclusivity: "exclusivity",
  termination: "termination_for_convenience",
  indemnification: "unusual_indemnity",
};

// ---- field resolution ----

type Resolved =
  | { kind: "number"; num: number; trust?: string }
  | { kind: "date"; iso: string; trust?: string }
  | { kind: "text"; text: string; trust?: string }
  | { kind: "boolean"; bool: boolean; trust?: string }
  | { kind: "missing" }
  | { kind: "ambiguous" }
  | { kind: "none" };

function resolve(ctx: ExploreContext, c: Contract, field: PlanField): Resolved {
  if (field === "status") return { kind: "text", text: c.status };
  if (field === "counterparty") return { kind: "text", text: c.counterparty };
  if (field === "contract_type") return { kind: "text", text: c.type };

  const r = effValue(ctx, c, field);
  if (!r) {
    // fall back to contract-level scalars where they exist
    if (field === "auto_renew") return { kind: "boolean", bool: c.autoRenew };
    if (field === "expiration_date" && c.expirationDate)
      return { kind: "date", iso: c.expirationDate };
    return { kind: "none" };
  }
  const trust = r.eff.trust;
  const v = r.eff.value;
  switch (v.kind) {
    case "money": return { kind: "number", num: v.usd, trust };
    case "duration": return { kind: "number", num: v.days, trust };
    case "date": return { kind: "date", iso: v.iso, trust };
    case "boolean": return { kind: "boolean", bool: v.value, trust };
    case "text": return { kind: "text", text: v.value, trust };
    case "missing": return { kind: "missing" };
    case "ambiguous": return { kind: "ambiguous" };
  }
}

function matchFilter(ctx: ExploreContext, c: Contract, f: PlanFilter): boolean {
  const r = resolve(ctx, c, f.field);
  switch (f.op) {
    case "absent":
      return r.kind === "missing" || r.kind === "ambiguous";
    case "present":
      if (r.kind !== "none" && r.kind !== "missing") return true;
      const riskKind = RISK_FOR_FIELD[f.field];
      return !!riskKind && c.risks.some((x) => x.kind === riskKind);
    case "eq":
    case "neq": {
      const values = Array.isArray(f.value) ? f.value : [f.value];
      let hit = false;
      if (r.kind === "text")
        hit = values.some((v) => String(v).toLowerCase() === r.text.toLowerCase());
      else if (r.kind === "boolean")
        hit = values.some((v) => v === r.bool || String(v).toLowerCase() === String(r.bool));
      else if (r.kind === "number") hit = values.some((v) => Number(v) === r.num);
      else if (r.kind === "date") hit = values.some((v) => String(v) === r.iso);
      return f.op === "eq" ? hit : !hit;
    }
    case "contains":
      return r.kind === "text" && r.text.toLowerCase().includes(String(f.value).toLowerCase());
    case "lt": return r.kind === "number" && r.num < Number(f.value);
    case "lte": return r.kind === "number" && r.num <= Number(f.value);
    case "gt": return r.kind === "number" && r.num > Number(f.value);
    case "gte": return r.kind === "number" && r.num >= Number(f.value);
    case "before": return r.kind === "date" && r.iso < String(f.value);
    case "after": return r.kind === "date" && r.iso > String(f.value);
    case "within_days": {
      if (r.kind !== "date") return false;
      const d = daysFromToday(r.iso);
      return d >= 0 && d <= Number(f.value);
    }
  }
}

// ---- execution ----

export interface ExecResult {
  rows: ExploreRow[];
  /** Enrichment rows appended after the direct matches (e.g. missing caps). */
  relatedCount: number;
  agg?: {
    fn: string;
    value: number;
    count: number;
    lowTotal: number;
    lowCount: number;
  };
  groups?: { label: string; ids: string[] }[];
  /** Scope executors compose their own sentence. */
  scopeAnswer?: string;
}

function rowNote(ctx: ExploreContext, c: Contract, plan: QueryPlan): string | undefined {
  for (const f of plan.filters) {
    const r = resolve(ctx, c, f.field);
    if (f.op === "absent") {
      if (r.kind === "missing") return `No ${f.field.replace(/_/g, " ")} clause found`;
      if (r.kind === "ambiguous") return `${f.field.replace(/_/g, " ")} ambiguous — may be absent`;
    }
    if (f.op === "eq" && r.kind === "boolean" && r.trust === "low") {
      return "Suspected — clause partially illegible";
    }
    if (f.op === "present") {
      const riskKind = RISK_FOR_FIELD[f.field];
      const risk = riskKind && c.risks.find((x) => x.kind === riskKind);
      if (risk) return risk.summary;
    }
    if (f.op === "within_days" && r.kind === "date") return fmtDate(r.iso);
    if (f.op === "eq" && f.field === "expiration_date") continue;
  }
  // expiring auto-renewers deserve the warning even when auto_renew isn't filtered
  if (
    plan.filters.some((f) => f.field === "expiration_date" && f.op === "within_days") &&
    c.autoRenew
  ) {
    return "Auto-renews unless notice is sent";
  }
  return undefined;
}

export function executePlan(plan: QueryPlan, ctx: ExploreContext): ExecResult {
  if (plan.scope) return executeScope(plan, ctx);

  const population = plan.population === "all" ? ctx.contracts : activeOf(ctx);
  const matched = population.filter((c) => plan.filters.every((f) => matchFilter(ctx, c, f)));

  // groupBy / compare
  if (plan.groupBy) {
    const groups = new Map<string, string[]>();
    for (const c of matched) {
      const r = resolve(ctx, c, plan.groupBy);
      const label = r.kind === "text" ? r.text : r.kind === "number" ? String(r.num) : "Unknown";
      groups.set(label, [...(groups.get(label) ?? []), c.id]);
    }
    return {
      rows: matched.map((c) => ({ contractId: c.id, fieldIds: cited(c, ...plan.show) })),
      relatedCount: 0,
      groups: [...groups.entries()]
        .map(([label, ids]) => ({ label, ids }))
        .sort((a, b) => b.ids.length - a.ids.length),
    };
  }

  let rows: ExploreRow[] = matched.map((c) => ({
    contractId: c.id,
    fieldIds: cited(c, ...plan.show),
    note: rowNote(ctx, c, plan),
  }));

  // Enrichment: a "cap below X" question should also surface contracts with
  // NO readable cap — absence is worse than a low number.
  let relatedCount = 0;
  const capFilter = plan.filters.find(
    (f) => f.field === "liability_cap" && (f.op === "lt" || f.op === "lte")
  );
  if (capFilter) {
    const others = plan.filters.filter((f) => f !== capFilter);
    const related = population.filter(
      (c) =>
        !matched.includes(c) &&
        others.every((f) => matchFilter(ctx, c, f)) &&
        (() => {
          const r = resolve(ctx, c, "liability_cap");
          return r.kind === "missing" || r.kind === "ambiguous";
        })()
    );
    rows = [
      ...rows,
      ...related.map((c) => ({
        contractId: c.id,
        fieldIds: cited(c, "liability_cap"),
        note:
          resolve(ctx, c, "liability_cap").kind === "missing"
            ? "No cap at all — worse than a low one"
            : "Ambiguous cap — needs review",
      })),
    ];
    relatedCount = related.length;
  }

  // sort / limit (applies to the direct matches; related rows stay appended)
  if (plan.sort) {
    const dir = plan.sort.dir === "desc" ? -1 : 1;
    const key = (row: ExploreRow) => {
      const c = ctx.contracts.find((x) => x.id === row.contractId)!;
      const r = resolve(ctx, c, plan.sort!.field);
      if (r.kind === "number") return r.num;
      if (r.kind === "date") return r.iso;
      if (r.kind === "text") return r.text;
      return "";
    };
    rows = [...rows].sort((a, b) => {
      const ka = key(a);
      const kb = key(b);
      return (ka < kb ? -1 : ka > kb ? 1 : 0) * dir;
    });
  }
  if (plan.limit) rows = rows.slice(0, plan.limit);

  // aggregate with the two-bucket trust split
  let agg: ExecResult["agg"];
  if (plan.intent === "aggregate" && plan.aggregate) {
    const field = plan.aggregate.field ?? "total_value";
    const values: { v: number; low: boolean }[] = [];
    for (const c of matched) {
      const r = effValue(ctx, c, field);
      let v: number | null = null;
      let low = false;
      if (r && r.eff.value.kind === "money") {
        v = r.eff.value.usd;
        low = r.eff.trust === "low";
      } else if (r && r.eff.value.kind === "duration") {
        v = r.eff.value.days;
        low = r.eff.trust === "low";
      } else if (field === "total_value") {
        v = c.valueUsd;
      }
      if (v !== null) values.push({ v, low });
    }
    const nums = values.map((x) => x.v);
    const fn = plan.aggregate.fn;
    const value =
      fn === "count"
        ? matched.length
        : fn === "sum"
          ? nums.reduce((s, x) => s + x, 0)
          : fn === "avg"
            ? nums.length
              ? nums.reduce((s, x) => s + x, 0) / nums.length
              : 0
            : fn === "max"
              ? Math.max(0, ...nums)
              : nums.length
                ? Math.min(...nums)
                : 0;
    agg = {
      fn,
      value,
      count: matched.length,
      lowTotal: values.filter((x) => x.low).reduce((s, x) => s + x.v, 0),
      lowCount: values.filter((x) => x.low).length,
    };
  }

  return { rows, relatedCount, agg };
}

// ---- scope executors (the four questions that aren't row-filters) ----

function executeScope(plan: QueryPlan, ctx: ExploreContext): ExecResult {
  const kind = plan.scope!.kind;
  const days = plan.scope!.days;

  if (kind === "renewals") {
    const window = days ?? 90;
    const horizon = addDays(TODAY_ISO, window);
    const rows: ExploreRow[] = [];
    for (const c of activeOf(ctx)) {
      if (!c.autoRenew) continue;
      const renewal = effDate(ctx, c, "renewal_date");
      const notice = effDate(ctx, c, "notice_deadline");
      const inWindow =
        (renewal && renewal <= horizon && daysFromToday(renewal) >= 0) ||
        (notice && notice <= horizon && daysFromToday(notice) >= 0);
      if (inWindow)
        rows.push({
          contractId: c.id,
          fieldIds: cited(c, ...(plan.show.length ? plan.show : ["renewal_date", "notice_deadline", "total_value"])),
          note:
            notice && daysFromToday(notice) >= 0 && notice <= horizon
              ? `Notice due ${fmtDate(notice)}`
              : undefined,
        });
    }
    rows.sort((a, b) => {
      const da = effDate(ctx, ctx.contracts.find((c) => c.id === a.contractId)!, "notice_deadline") ?? "9999";
      const db = effDate(ctx, ctx.contracts.find((c) => c.id === b.contractId)!, "notice_deadline") ?? "9999";
      return da.localeCompare(db);
    });
    const first =
      rows[0] &&
      effDate(ctx, ctx.contracts.find((c) => c.id === rows[0].contractId)!, "notice_deadline");
    return {
      rows,
      relatedCount: 0,
      scopeAnswer: `${list(rows.length, "contract")} renew${rows.length === 1 ? "s" : ""} or hit${rows.length === 1 ? "s" : ""} a notice deadline in the next ${window} days — the earliest cutoff is ${first ? fmtDate(first) : "—"}.`,
    };
  }

  if (kind === "payments_due") {
    const window = days ?? 60;
    const horizon = addDays(TODAY_ISO, window);
    const rows: ExploreRow[] = [];
    for (const c of activeOf(ctx)) {
      for (const m of c.milestones) {
        if (!m.paid && m.dueDate >= TODAY_ISO && m.dueDate <= horizon)
          rows.push({
            contractId: c.id,
            fieldIds: cited(c, "payment_schedule"),
            note: `${m.label}: ${fmtMoneyFull(m.amountUsd)} due ${fmtDate(m.dueDate)}`,
          });
      }
      for (const o of c.obligations) {
        if (
          o.owedBy === "us" &&
          o.dueDate &&
          o.dueDate >= TODAY_ISO &&
          o.dueDate <= horizon &&
          /pay|rent|invoice|prepay/i.test(o.title)
        )
          rows.push({
            contractId: c.id,
            fieldIds: cited(c, "payment_schedule"),
            note: `${o.title} — due ${fmtDate(o.dueDate)}`,
          });
      }
    }
    return {
      rows,
      relatedCount: 0,
      scopeAnswer: `${list(rows.length, "dated payment")} fall${rows.length === 1 ? "s" : ""} due in the next ${window} days, on top of recurring monthly invoices.`,
    };
  }

  if (kind === "needs_review") {
    const rows = ctx.contracts
      .map((c) => {
        const pending = c.fields.filter(
          (f) =>
            f.confidence < 0.75 &&
            ctx.verifications[f.id]?.status !== "confirmed" &&
            ctx.verifications[f.id]?.status !== "corrected"
        );
        return pending.length
          ? {
              contractId: c.id,
              fieldIds: pending.map((f) => f.id),
              note: `${pending.length} flagged ${pending.length === 1 ? "term" : "terms"}`,
            }
          : null;
      })
      .filter((r): r is ExploreRow & { note: string } => !!r);
    const total = rows.reduce((s, r) => s + r.fieldIds.length, 0);
    return {
      rows,
      relatedCount: 0,
      scopeAnswer: rows.length
        ? `${list(total, "term")} across ${list(rows.length, "contract")} still need${total === 1 ? "s" : ""} review — verifying them upgrades every number they feed.`
        : "Nothing is awaiting review — every flagged term has been verified.",
    };
  }

  // families
  const parents = ctx.contracts.filter((p) => ctx.contracts.some((c) => c.familyParentId === p.id));
  const rows = parents.flatMap((p) => [
    { contractId: p.id, fieldIds: cited(p, "liability_cap"), note: "Master agreement" },
    ...ctx.contracts
      .filter((c) => c.familyParentId === p.id)
      .map((c) => ({
        contractId: c.id,
        fieldIds: cited(c, "total_value"),
        note: `Governed by ${p.title}`,
      })),
  ]);
  const kids = rows.length - parents.length;
  const parentCap = parents[0] ? effMoney(ctx, parents[0], "liability_cap") : null;
  return {
    rows,
    relatedCount: 0,
    scopeAnswer: `${list(parents.length, "master agreement")} with ${list(kids, "child SOW")}${parentCap ? ` — the family shares one ${fmtMoneyFull(parentCap)} aggregate liability cap` : ""}.`,
  };
}

// ---- answer templating ----

export function answerFor(plan: QueryPlan, exec: ExecResult, ctx: ExploreContext): string {
  if (exec.scopeAnswer) return exec.scopeAnswer;

  // Keyless parity: name the contracts (and their matched figures) inline so
  // the deterministic answer reads like prose, not just a count.
  const enumerated = (sentence: string): string => {
    const direct = exec.rows.slice(0, exec.rows.length - exec.relatedCount);
    if (direct.length === 0 || direct.length > 6) return sentence;
    const parts = direct
      .slice(0, 4)
      .map((r) => {
        const c = ctx.contracts.find((x) => x.id === r.contractId);
        if (!c) return null;
        const short = c.counterparty.replace(/,? ?\b(Inc|LLC|Corp|GmbH|Co|Partners|Group)\b\.?,?.*$/i, "").trim().replace(/,$/, "");
        for (const key of plan.show) {
          const m = effMoney(ctx, c, key);
          if (m !== null) return `${short} (${fmtMoneyFull(m)})`;
        }
        return short;
      })
      .filter((x): x is string => !!x);
    if (parts.length === 0) return sentence;
    const more = direct.length - parts.length;
    return `${sentence.replace(/\.$/, "")}: ${parts.join(", ")}${more > 0 ? `, and ${more} more` : ""}.`;
  };

  // aggregate
  if (plan.intent === "aggregate" && exec.agg) {
    const a = exec.agg;
    if (a.fn === "count") return `${list(a.count, "contract")} match${a.count === 1 ? "es" : ""}.`;
    const lowClause =
      a.lowTotal > 0
        ? ` — ${fmtMoneyFull(a.lowTotal)} of that rests on ${list(a.lowCount, "low-confidence term")} still awaiting review`
        : "";
    const partyFilter = plan.filters.find((f) => f.field === "counterparty");
    if (partyFilter) {
      const portfolio = activeOf(ctx).reduce(
        (s, c) => s + (effMoney(ctx, c, "total_value") ?? c.valueUsd),
        0
      );
      return `${fmtMoneyFull(a.value)} across ${list(a.count, "contract")} with ${String(partyFilter.value)} — ${fmtPercent(portfolio ? a.value / portfolio : 0)} of the active portfolio${lowClause}.`;
    }
    // whole-population total → name the concentration leader
    const merged = new Map<string, number>();
    const population = plan.population === "all" ? ctx.contracts : activeOf(ctx);
    for (const c of population) {
      const key = c.counterparty.includes("Torvane") ? "Torvane Consulting Group" : c.counterparty;
      merged.set(key, (merged.get(key) ?? 0) + (effMoney(ctx, c, "total_value") ?? c.valueUsd));
    }
    const top = [...merged.entries()].sort((x, y) => y[1] - x[1])[0];
    return `${fmtMoneyFull(a.value)} across ${list(a.count, "contract")} — the largest concentration is ${top?.[0]} at ${fmtPercent(a.value ? (top?.[1] ?? 0) / a.value : 0)}${lowClause}.`;
  }

  // compare / groupBy
  if (exec.groups) {
    const label = plan.groupBy === "governing_law" ? "Governing law" : plan.groupBy;
    return `${label} spans ${exec.groups.length} distinct ${plan.groupBy === "governing_law" ? "jurisdictions" : "values"} across ${list(exec.rows.length, plan.population === "all" ? "contract" : "active contract")}.`;
  }

  // filter — pick the template from the leading filter's shape
  const direct = exec.rows.length - exec.relatedCount;
  const popNoun = plan.population === "all" ? "contract" : "active contract";

  const absent = plan.filters.find((f) => f.op === "absent");
  if (absent) {
    const ambiguous = exec.rows.filter((r) => r.note?.includes("ambiguous")).length;
    const firm = exec.rows.length - ambiguous;
    return enumerated(
      `${list(firm, popNoun)} ${firm === 1 ? "has" : "have"} no ${absent.field.replace(/_/g, " ")} at all${ambiguous ? `, and ${ambiguous} more ${ambiguous === 1 ? "is" : "are"} ambiguous` : ""}.`
    );
  }

  const statusEq = plan.filters.find((f) => f.field === "status" && f.op === "eq");
  if (statusEq) {
    return `${list(exec.rows.length, "contract")} in the repository ${exec.rows.length === 1 ? "has" : "have"} ${String(statusEq.value)}${statusEq.value === "expired" ? "" : " status"}.`;
  }

  const expWindow = plan.filters.find((f) => f.field === "expiration_date" && f.op === "within_days");
  if (expWindow) {
    const renewing = exec.rows.filter((r) => r.note === "Auto-renews unless notice is sent").length;
    return `${list(direct, "contract")} end${direct === 1 ? "s" : ""} within ${Number(expWindow.value)} days — ${renewing} of them will auto-renew unless notice is sent first.`;
  }

  const noticeWindow = plan.filters.find((f) => f.field === "notice_deadline" && f.op === "within_days");
  if (noticeWindow) {
    return direct
      ? `${list(direct, "notice deadline")} in the next ${Number(noticeWindow.value)} days — the first is ${exec.rows[0]?.note ?? "—"}.`
      : `No notice deadlines fall in the next ${Number(noticeWindow.value)} days.`;
  }

  const capBound = plan.filters.find(
    (f) => f.field === "liability_cap" && ["lt", "lte", "gt", "gte"].includes(f.op)
  );
  if (capBound) {
    const above = capBound.op.startsWith("g");
    const typeFilter = plan.filters.find((f) => f.field === "contract_type");
    const noun = typeFilter
      ? `${(Array.isArray(typeFilter.value) ? typeFilter.value[0] : String(typeFilter.value)).toLowerCase()} contract`
      : "contract";
    const base = enumerated(
      `${list(direct, noun)} cap${direct === 1 ? "s" : ""} liability ${above ? "above" : "below"} ${fmtMoneyFull(Number(capBound.value))}.`
    );
    return `${base.replace(/\.$/, "")}${exec.relatedCount ? ` — ${exec.relatedCount} more ${exec.relatedCount === 1 ? "has" : "have"} no readable cap at all` : ""}.`;
  }

  const autoRenew = plan.filters.find((f) => f.field === "auto_renew" && f.op === "eq");
  if (autoRenew) {
    const suspected = exec.rows.filter((r) => r.note?.startsWith("Suspected")).length;
    const firm = exec.rows.length - suspected;
    return `${list(firm, "contract")} auto-renew${firm === 1 ? "s" : ""}${suspected ? `, plus ${suspected} suspected evergreen renewal that couldn't be read cleanly` : ""}.`;
  }

  const law = plan.filters.find((f) => f.field === "governing_law" && f.op === "contains");
  if (law) {
    return enumerated(
      `${list(exec.rows.length, "contract")} ${exec.rows.length === 1 ? "is" : "are"} governed by ${String(law.value)} law.`
    );
  }

  const present = plan.filters.find((f) => f.op === "present");
  if (present) {
    const flagged = exec.rows.filter((r) => r.note).length;
    const label = present.field.replace(/_/g, " ");
    if (present.field === "exclusivity") {
      return exec.rows.length
        ? enumerated(
            `${list(exec.rows.length, "contract")} grant${exec.rows.length === 1 ? "s" : ""} exclusivity — check the territory scope before signing anything nearby.`
          )
        : "No exclusivity obligations found in the portfolio.";
    }
    return enumerated(
      `${list(exec.rows.length, "contract")} ${exec.rows.length === 1 ? "has" : "have"} notable ${label} terms${flagged ? ` — including ${flagged} flagged as unusual or one-sided` : ""}.`
    );
  }

  return enumerated(`${list(exec.rows.length, popNoun)} match${exec.rows.length === 1 ? "es" : ""}.`);
}

// ---- the inspectable plan line ----

const MONEY_FIELDS = new Set(["liability_cap", "total_value"]);

function fmtFilterValue(f: PlanFilter): string {
  if (Array.isArray(f.value)) return f.value.join(" or ");
  if (typeof f.value === "number" && MONEY_FIELDS.has(f.field)) return fmtMoneyFull(f.value);
  if (typeof f.value === "boolean") return f.value ? "yes" : "no";
  return String(f.value ?? "");
}

const OP_SYMBOL: Record<string, string> = {
  lt: "<", lte: "≤", gt: ">", gte: "≥", eq: "=", neq: "≠",
  contains: "contains", before: "before", after: "after",
};

export function describePlan(plan: QueryPlan): string {
  if (plan.scope) {
    const d = plan.scope.days;
    const label = {
      renewals: `renewals${d ? ` within ${d} days` : ""}`,
      payments_due: `payments due${d ? ` within ${d} days` : ""}`,
      needs_review: "terms awaiting review",
      families: "contract families",
    }[plan.scope.kind];
    return `scope: ${label}`;
  }

  const parts = plan.filters.map((f) => {
    if (f.op === "absent") return `${f.field} is missing`;
    if (f.op === "present") return `has ${f.field.replace(/_/g, " ")} terms`;
    if (f.op === "within_days") return `${f.field} within ${f.value} days`;
    return `${f.field} ${OP_SYMBOL[f.op] ?? f.op} ${fmtFilterValue(f)}`;
  });

  let line = "";
  if (plan.intent === "aggregate" && plan.aggregate) {
    line = `${plan.aggregate.fn}(${plan.aggregate.field ?? "total_value"})`;
    if (parts.length) line += ` WHERE ${parts.join(" AND ")}`;
  } else {
    line = parts.join(" AND ") || "all contracts";
    if (plan.groupBy) line += ` GROUP BY ${plan.groupBy}`;
  }
  if (plan.population === "all") line += " · all contracts (incl. expired)";
  return line;
}
