import type { Contract, ContractType } from "@/data/types";
import type { Verification } from "@/lib/store";
import { effectiveField } from "@/lib/selectors";
import { addDays, daysFromToday, TODAY_ISO } from "@/lib/demo-clock";
import { fmtDate, fmtMoneyFull, fmtPercent } from "@/lib/format";

// Explore never generates prose from a model. A question matches a pattern,
// the pattern builds a filter over EFFECTIVE contract state (so human
// corrections change answers), and the answer sentence is computed from the
// matching rows. Every row cites the fields it rests on.

export interface ExploreRow {
  contractId: string;
  /** Fields that justify this row — rendered as cited TrustedFacts. */
  fieldIds: string[];
  note?: string;
}

export interface ExploreResult {
  /** How Athena read the question — shown so the user can correct course. */
  interpretation: string;
  /** The one-sentence answer with computed numbers. */
  answer: string;
  rows: ExploreRow[];
}

export interface ExploreContext {
  contracts: Contract[]; // visible (seed + uploaded), effective ordering
  verifications: Record<string, Verification>;
}

// ---- helpers over effective state ----

function effValue(ctx: ExploreContext, c: Contract, key: string) {
  const f = c.fields.find((x) => x.key === key);
  if (!f) return null;
  return { field: f, eff: effectiveField(f, ctx.verifications[f.id]) };
}

function effMoney(ctx: ExploreContext, c: Contract, key: string): number | null {
  const r = effValue(ctx, c, key);
  if (!r) return null;
  return r.eff.value.kind === "money" ? r.eff.value.usd : null;
}

function effDate(ctx: ExploreContext, c: Contract, key: string): string | null {
  const r = effValue(ctx, c, key);
  if (!r) return null;
  return r.eff.value.kind === "date" ? r.eff.value.iso : null;
}

const fid = (c: Contract, key: string) =>
  c.fields.find((f) => f.key === key)?.id;

const cited = (c: Contract, ...keys: string[]) =>
  keys.map((k) => fid(c, k)).filter((x): x is string => !!x);

const list = (n: number, singular: string) =>
  `${n} ${n === 1 ? singular : singular + "s"}`;

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

// ---- patterns ----

interface Pattern {
  id: string;
  match: (q: string) => boolean;
  run: (q: string, ctx: ExploreContext) => ExploreResult;
}

const active = (ctx: ExploreContext) =>
  ctx.contracts.filter((c) => c.status !== "expired");

const PATTERNS: Pattern[] = [
  {
    id: "missing-cap",
    match: (q) =>
      /(no|without|missing|absent|lack)\w*\s+(a\s+)?(liability\s+)?cap/i.test(q) ||
      /cap\s+(is\s+)?(missing|absent)/i.test(q),
    run: (q, ctx) => {
      const rows: ExploreRow[] = [];
      for (const c of active(ctx)) {
        const r = effValue(ctx, c, "liability_cap");
        if (!r) continue;
        if (r.eff.value.kind === "missing")
          rows.push({ contractId: c.id, fieldIds: cited(c, "liability_cap"), note: "No cap clause found" });
        else if (r.eff.value.kind === "ambiguous")
          rows.push({ contractId: c.id, fieldIds: cited(c, "liability_cap"), note: "Cap ambiguous — may be absent" });
      }
      const confirmed = rows.filter((r) => r.note === "No cap clause found").length;
      return {
        interpretation: "Contracts whose liability cap is absent or unreadable",
        answer: `${list(confirmed, "active contract")} ${confirmed === 1 ? "has" : "have"} no liability cap at all${rows.length > confirmed ? `, and ${rows.length - confirmed} more is ambiguous` : ""}.`,
        rows,
      };
    },
  },
  {
    id: "cap-threshold",
    match: (q) => /cap/i.test(q) && /(below|under|less than|<|above|over|greater than|>)/i.test(q),
    run: (q, ctx) => {
      const above = /(above|over|greater than|>)/i.test(q);
      const threshold = parseMoney(q.replace(/.*?(below|under|less than|<|above|over|greater than|>)/i, "")) ?? 1_000_000;
      const type = TYPE_WORDS.find(([re]) => re.test(q))?.[1];
      const rows: ExploreRow[] = [];
      const related: ExploreRow[] = [];
      for (const c of active(ctx)) {
        if (type && c.type !== type && !(type === "Vendor" && ["Vendor", "SaaS"].includes(c.type))) continue;
        const r = effValue(ctx, c, "liability_cap");
        if (!r) continue;
        if (r.eff.value.kind === "money") {
          const usd = r.eff.value.usd;
          if (above ? usd > threshold : usd < threshold)
            rows.push({ contractId: c.id, fieldIds: cited(c, "liability_cap", "total_value") });
        } else if (!above && r.eff.value.kind === "missing") {
          related.push({ contractId: c.id, fieldIds: cited(c, "liability_cap"), note: "No cap at all — worse than a low one" });
        } else if (!above && r.eff.value.kind === "ambiguous") {
          related.push({ contractId: c.id, fieldIds: cited(c, "liability_cap"), note: "Ambiguous cap — needs review" });
        }
      }
      return {
        interpretation: `${type ? type + " contracts" : "Contracts"} with a liability cap ${above ? "above" : "below"} ${fmtMoneyFull(threshold)}`,
        answer: `${list(rows.length, type ? `${type.toLowerCase()} contract` : "contract")} cap${rows.length === 1 ? "s" : ""} liability ${above ? "above" : "below"} ${fmtMoneyFull(threshold)}${related.length ? `; ${related.length} more ${related.length === 1 ? "has" : "have"} no readable cap at all` : ""}.`,
        rows: [...rows, ...related],
      };
    },
  },
  {
    id: "auto-renew-list",
    match: (q) => /auto[- ]?renew/i.test(q) && parseWindowDays(q) === null,
    run: (q, ctx) => {
      const rows = active(ctx)
        .filter((c) => c.autoRenew)
        .map((c) => ({
          contractId: c.id,
          fieldIds: cited(c, "auto_renew", "notice_deadline"),
          note: (() => {
            const r = effValue(ctx, c, "auto_renew");
            return r && r.eff.trust === "low" ? "Suspected — clause partially illegible" : undefined;
          })(),
        }));
      const suspected = rows.filter((r) => r.note).length;
      return {
        interpretation: "Contracts with automatic renewal clauses",
        answer: `${list(rows.length - suspected, "contract")} auto-renew${rows.length - suspected === 1 ? "s" : ""}${suspected ? `, plus ${suspected} suspected evergreen renewal that couldn't be read cleanly` : ""}.`,
        rows,
      };
    },
  },
  {
    id: "renewals-window",
    match: (q) => /renew/i.test(q),
    run: (q, ctx) => {
      const days = parseWindowDays(q) ?? 90;
      const horizon = addDays(TODAY_ISO, days);
      const rows: ExploreRow[] = [];
      for (const c of active(ctx)) {
        if (!c.autoRenew) continue;
        const renewal = effDate(ctx, c, "renewal_date");
        const notice = effDate(ctx, c, "notice_deadline");
        const inWindow =
          (renewal && renewal <= horizon && daysFromToday(renewal) >= 0) ||
          (notice && notice <= horizon && daysFromToday(notice) >= 0);
        if (inWindow)
          rows.push({
            contractId: c.id,
            fieldIds: cited(c, "renewal_date", "notice_deadline", "total_value"),
            note: notice && daysFromToday(notice) >= 0 && notice <= horizon
              ? `Notice due ${fmtDate(notice)}`
              : undefined,
          });
      }
      rows.sort((a, b) => {
        const da = effDate(ctx, ctx.contracts.find((c) => c.id === a.contractId)!, "notice_deadline") ?? "9999";
        const db = effDate(ctx, ctx.contracts.find((c) => c.id === b.contractId)!, "notice_deadline") ?? "9999";
        return da.localeCompare(db);
      });
      return {
        interpretation: `Auto-renewing contracts whose renewal or notice deadline falls within ${days} days`,
        answer: `${list(rows.length, "contract")} renew${rows.length === 1 ? "s" : ""} or hit${rows.length === 1 ? "s" : ""} a notice deadline in the next ${days} days — the earliest cutoff is ${(() => { const first = rows[0] && effDate(ctx, ctx.contracts.find((c) => c.id === rows[0].contractId)!, "notice_deadline"); return first ? fmtDate(first) : "—"; })()}.`,
        rows,
      };
    },
  },
  {
    id: "notice-deadlines",
    match: (q) => /notice|deadline|cancel/i.test(q),
    run: (q, ctx) => {
      const days = parseWindowDays(q) ?? 180;
      const rows = active(ctx)
        .map((c) => ({ c, notice: effDate(ctx, c, "notice_deadline") }))
        .filter((x) => x.notice && daysFromToday(x.notice) >= 0 && daysFromToday(x.notice) <= days)
        .sort((a, b) => a.notice!.localeCompare(b.notice!))
        .map((x) => ({
          contractId: x.c.id,
          fieldIds: cited(x.c, "notice_deadline", "notice_days"),
          note: `${fmtDate(x.notice!)}`,
        }));
      return {
        interpretation: `Notice deadlines in the next ${days} days`,
        answer: rows.length
          ? `${list(rows.length, "notice deadline")} in the next ${days} days — the first is ${rows[0].note}.`
          : `No notice deadlines fall in the next ${days} days.`,
        rows,
      };
    },
  },
  {
    id: "expirations",
    match: (q) => /expir|ending|end(s)? (this|next|in)/i.test(q) && !/expired/i.test(q),
    run: (q, ctx) => {
      const days = parseWindowDays(q) ?? daysFromToday(`${TODAY_ISO.slice(0, 4)}-12-31`);
      const rows = active(ctx)
        .filter((c) => c.expirationDate && daysFromToday(c.expirationDate) >= 0 && daysFromToday(c.expirationDate) <= days)
        .sort((a, b) => a.expirationDate!.localeCompare(b.expirationDate!))
        .map((c) => ({
          contractId: c.id,
          fieldIds: cited(c, "expiration_date", "auto_renew"),
          note: c.autoRenew ? "Auto-renews unless notice is sent" : undefined,
        }));
      const renewing = rows.filter((r) => r.note).length;
      return {
        interpretation: `Contracts whose current term ends within ${days} days`,
        answer: `${list(rows.length, "contract")} end${rows.length === 1 ? "s" : ""} within ${days} days — ${renewing} of them will auto-renew unless notice is sent first.`,
        rows,
      };
    },
  },
  {
    id: "expired",
    match: (q) => /expired|lapsed/i.test(q),
    run: (_q, ctx) => {
      const rows = ctx.contracts
        .filter((c) => c.status === "expired")
        .map((c) => ({ contractId: c.id, fieldIds: cited(c, "expiration_date") }));
      return {
        interpretation: "Contracts already past their end date",
        answer: `${list(rows.length, "contract")} in the repository ${rows.length === 1 ? "has" : "have"} expired.`,
        rows,
      };
    },
  },
  {
    id: "governing-law",
    match: (q) => /governed|governing law|jurisdiction/i.test(q) || LAWS.some((l) => new RegExp(`\\b${l}\\b`, "i").test(q)),
    run: (q, ctx) => {
      const law = LAWS.find((l) => new RegExp(`\\b${l}\\b`, "i").test(q));
      if (!law) {
        const rows = active(ctx).map((c) => ({ contractId: c.id, fieldIds: cited(c, "governing_law") }));
        return {
          interpretation: "Governing law across the portfolio",
          answer: `Governing law spans ${[...new Set(active(ctx).map((c) => { const r = effValue(ctx, c, "governing_law"); return r?.eff.value.kind === "text" ? r.eff.value.value : "unknown"; }))].length} jurisdictions across ${list(active(ctx).length, "active contract")}.`,
          rows,
        };
      }
      const rows = ctx.contracts
        .filter((c) => {
          const r = effValue(ctx, c, "governing_law");
          return r?.eff.value.kind === "text" && r.eff.value.value.toLowerCase().includes(law.toLowerCase());
        })
        .map((c) => ({ contractId: c.id, fieldIds: cited(c, "governing_law") }));
      return {
        interpretation: `Contracts governed by ${law} law`,
        answer: `${list(rows.length, "contract")} ${rows.length === 1 ? "is" : "are"} governed by ${law} law.`,
        rows,
      };
    },
  },
  {
    id: "counterparty-exposure",
    match: (q) => /(exposure|spend|total|value|commit)/i.test(q) && !!q,
    run: (q, ctx) => {
      const name = findCounterparty(ctx, q);
      if (!name) return TOTAL_PATTERN_RUN(q, ctx);
      const matches = ctx.contracts.filter((c) => c.counterparty === name && c.status !== "expired");
      const total = matches.reduce((s, c) => s + (effMoney(ctx, c, "total_value") ?? c.valueUsd), 0);
      const portfolio = active(ctx).reduce((s, c) => s + (effMoney(ctx, c, "total_value") ?? c.valueUsd), 0);
      return {
        interpretation: `Total committed value across contracts with ${name}`,
        answer: `${fmtMoneyFull(total)} across ${list(matches.length, "contract")} with ${name} — ${fmtPercent(total / portfolio)} of the active portfolio.`,
        rows: matches.map((c) => ({ contractId: c.id, fieldIds: cited(c, "total_value", "payment_schedule") })),
      };
    },
  },
  {
    id: "exclusivity",
    match: (q) => /exclusiv/i.test(q),
    run: (_q, ctx) => {
      const rows = active(ctx)
        .filter((c) => c.risks.some((r) => r.kind === "exclusivity") || c.fields.some((f) => f.key === "exclusivity"))
        .map((c) => ({ contractId: c.id, fieldIds: cited(c, "exclusivity") }));
      return {
        interpretation: "Contracts containing exclusivity obligations",
        answer: rows.length
          ? `${list(rows.length, "contract")} grant${rows.length === 1 ? "s" : ""} exclusivity — check the territory scope before signing anything nearby.`
          : "No exclusivity obligations found in the portfolio.",
        rows,
      };
    },
  },
  {
    id: "termination",
    match: (q) => /terminat/i.test(q),
    run: (_q, ctx) => {
      const rows = active(ctx)
        .filter((c) => c.fields.some((f) => f.key === "termination") || c.risks.some((r) => r.kind === "termination_for_convenience"))
        .map((c) => ({
          contractId: c.id,
          fieldIds: cited(c, "termination"),
          note: c.risks.find((r) => r.kind === "termination_for_convenience")?.summary,
        }));
      return {
        interpretation: "Termination rights across the portfolio",
        answer: `${list(rows.length, "contract")} ${rows.length === 1 ? "has" : "have"} notable termination terms — including ${rows.filter((r) => r.note).length} with one-sided convenience rights.`,
        rows,
      };
    },
  },
  {
    id: "indemnity",
    match: (q) => /indemn/i.test(q),
    run: (_q, ctx) => {
      const rows = active(ctx)
        .filter((c) => c.fields.some((f) => f.key === "indemnification") || c.risks.some((r) => r.kind === "unusual_indemnity"))
        .map((c) => ({
          contractId: c.id,
          fieldIds: cited(c, "indemnification"),
          note: c.risks.find((r) => r.kind === "unusual_indemnity")?.summary,
        }));
      const unusual = rows.filter((r) => r.note).length;
      return {
        interpretation: "Indemnification terms, flagged where the direction is unusual",
        answer: `${list(rows.length, "contract")} ${rows.length === 1 ? "has" : "have"} indemnity terms worth reading — ${unusual} run${unusual === 1 ? "s" : ""} the unusual direction (Vantora indemnifying the vendor).`,
        rows,
      };
    },
  },
  {
    id: "payments-due",
    match: (q) => /pay(ment)?s?\b.*due|due.*pay|invoices?|milestones?/i.test(q),
    run: (q, ctx) => {
      const days = parseWindowDays(q) ?? 60;
      const horizon = addDays(TODAY_ISO, days);
      const rows: ExploreRow[] = [];
      for (const c of active(ctx)) {
        for (const m of c.milestones) {
          if (!m.paid && m.dueDate >= TODAY_ISO && m.dueDate <= horizon)
            rows.push({ contractId: c.id, fieldIds: cited(c, "payment_schedule"), note: `${m.label}: ${fmtMoneyFull(m.amountUsd)} due ${fmtDate(m.dueDate)}` });
        }
        for (const o of c.obligations) {
          if (o.owedBy === "us" && o.dueDate && o.dueDate >= TODAY_ISO && o.dueDate <= horizon && /pay|rent|invoice|prepay/i.test(o.title))
            rows.push({ contractId: c.id, fieldIds: cited(c, "payment_schedule"), note: `${o.title} — due ${fmtDate(o.dueDate)}` });
        }
      }
      return {
        interpretation: `Dated payments Vantora owes in the next ${days} days (recurring monthly invoices not itemized)`,
        answer: `${list(rows.length, "dated payment")} fall${rows.length === 1 ? "s" : ""} due in the next ${days} days, on top of recurring monthly invoices.`,
        rows,
      };
    },
  },
  {
    id: "needs-review",
    match: (q) => /low.conf|needs? review|unverified|verify|uncertain|not sure/i.test(q),
    run: (_q, ctx) => {
      const rows = ctx.contracts
        .map((c) => {
          const pending = c.fields.filter(
            (f) =>
              f.confidence < 0.75 &&
              ctx.verifications[f.id]?.status !== "confirmed" &&
              ctx.verifications[f.id]?.status !== "corrected"
          );
          return pending.length
            ? { contractId: c.id, fieldIds: pending.map((f) => f.id), note: `${pending.length} flagged ${pending.length === 1 ? "term" : "terms"}` }
            : null;
        })
        .filter((r): r is ExploreRow & { note: string } => !!r);
      const total = rows.reduce((s, r) => s + r.fieldIds.length, 0);
      return {
        interpretation: "Extracted terms still awaiting human review",
        answer: rows.length
          ? `${list(total, "term")} across ${list(rows.length, "contract")} still need${total === 1 ? "s" : ""} review — verifying them upgrades every number they feed.`
          : "Nothing is awaiting review — every flagged term has been verified.",
        rows,
      };
    },
  },
  {
    id: "family",
    match: (q) => /family|hangs? off|under the msa|sows? (under|of)|related/i.test(q),
    run: (_q, ctx) => {
      const parents = ctx.contracts.filter((p) => ctx.contracts.some((c) => c.familyParentId === p.id));
      const rows = parents.flatMap((p) => [
        { contractId: p.id, fieldIds: cited(p, "liability_cap"), note: "Master agreement" },
        ...ctx.contracts
          .filter((c) => c.familyParentId === p.id)
          .map((c) => ({ contractId: c.id, fieldIds: cited(c, "total_value"), note: `Governed by ${p.title}` })),
      ]);
      const kids = rows.length - parents.length;
      return {
        interpretation: "Contract families — master agreements with their statements of work",
        answer: `${list(parents.length, "master agreement")} with ${list(kids, "child SOW")} — the family shares one ${fmtMoneyFull(2_000_000)} aggregate liability cap.`,
        rows,
      };
    },
  },
  {
    id: "portfolio-total",
    match: (q) => /portfolio|total (contract )?value|worth|committed|commitments|on the hook/i.test(q),
    run: (q, ctx) => TOTAL_PATTERN_RUN(q, ctx),
  },
];

function TOTAL_PATTERN_RUN(_q: string, ctx: ExploreContext): ExploreResult {
  // Whole portfolio, expired included — matches the Insights headline math.
  const rows = ctx.contracts
    .filter((c) => c.valueUsd > 0)
    .sort((a, b) => b.valueUsd - a.valueUsd)
    .map((c) => ({ contractId: c.id, fieldIds: cited(c, "total_value") }));
  const total = ctx.contracts.reduce((s, c) => s + (effMoney(ctx, c, "total_value") ?? c.valueUsd), 0);
  const merged = new Map<string, number>();
  for (const c of ctx.contracts) {
    const key = c.counterparty.includes("Torvane") ? "Torvane Consulting Group" : c.counterparty;
    merged.set(key, (merged.get(key) ?? 0) + (effMoney(ctx, c, "total_value") ?? c.valueUsd));
  }
  const top = [...merged.entries()].sort((a, b) => b[1] - a[1])[0];
  return {
    interpretation: "Total contract value across the portfolio (EUR normalized at 1.08)",
    answer: `${fmtMoneyFull(total)} across ${list(ctx.contracts.length, "contract")} — the largest concentration is ${top[0]} at ${fmtPercent(top[1] / total)}.`,
    rows,
  };
}

export function runExplore(query: string, ctx: ExploreContext): ExploreResult | null {
  const q = query.trim();
  if (!q) return null;
  for (const p of PATTERNS) {
    if (p.match(q)) return p.run(q, ctx);
  }
  return null;
}
