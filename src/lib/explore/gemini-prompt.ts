// Server-only: system instruction + response schema for the Gemini translation
// call. The model sees the vocabulary of the workspace (fields, types,
// counterparty names) but is never asked for — and never returns — an answer.
import { Type, type Schema } from "@google/genai";
import { ALL_CONTRACTS } from "@/data";
import { TODAY_ISO } from "@/lib/demo-clock";
import { PLAN_FIELDS, PLAN_OPS, SCOPE_KINDS } from "@/lib/explore/plan";

const FIELD_DOCS: Record<string, string> = {
  contract_type: "text — one of the contract types listed below",
  counterparty: "text — the other party's name",
  effective_date: "date (YYYY-MM-DD)",
  expiration_date: "date the current term ends",
  renewal_date: "date an auto-renewing contract renews",
  notice_deadline: "last day to send non-renewal/option notice",
  auto_renew: "boolean — renews automatically unless notice is sent",
  notice_days: "number — days of notice required",
  term_length: "number — renewal term length in days",
  total_value: "money (USD) — total contract value",
  payment_schedule: "text — how and when payments are made",
  liability_cap: "money (USD) — aggregate liability cap",
  governing_law: "text — jurisdiction (New York, California, Delaware, Colorado, Texas, Germany)",
  confidentiality: "text — confidentiality terms",
  ip_ownership: "text — IP ownership terms",
  indemnification: "text — indemnity terms (present-op matches unusual-indemnity risks)",
  termination: "text — termination rights (present-op matches one-sided convenience rights)",
  sla: "text — service level commitments",
  exclusivity: "text — exclusivity grants (present-op matches exclusivity risks)",
  insurance: "text — insurance requirements",
  status: "virtual text — active | needs_review | expired",
};

export function buildSystemInstruction(): string {
  const counterparties = [...new Set(ALL_CONTRACTS.map((c) => c.counterparty))];
  const types = [...new Set(ALL_CONTRACTS.map((c) => c.type))];

  return `You translate questions about a company's contract repository into a QueryPlan JSON object. You NEVER answer the question, NEVER compute values, and NEVER write prose — a deterministic engine executes your plan against the real data.

Today is ${TODAY_ISO}.

FIELDS (the only ones that exist):
${PLAN_FIELDS.map((f) => `- ${f}: ${FIELD_DOCS[f]}`).join("\n")}

CONTRACT TYPES: ${types.join(", ")}
COUNTERPARTIES: ${counterparties.join("; ")}

OPS: ${PLAN_OPS.join(", ")}.
- Prefer within_days (value = number of days from today) over before/after for future windows; never do date arithmetic yourself.
- absent = the extractor found the field missing or unreadable (no value needed).
- present = the field exists / the matching risk exists (no value needed). Use for "which contracts have exclusivity / one-sided termination / unusual indemnity".

SCOPES (use intent "lookup" with scope instead of filters for these question shapes):
- renewals: "what renews / comes up for renewal in the next N days"
- payments_due: "what payments / invoices / milestones are due"
- needs_review: "what terms are low-confidence / unverified / need review"
- families: "master agreements and their SOWs / related contracts"

RULES:
- filters are ANDed. For a single value use "value"; for "any of" use "values" as an array of strings (e.g. "vendor contracts" colloquially includes SaaS: {"field":"contract_type","op":"eq","values":["Vendor","SaaS"]}).
- population defaults to "active". Use "all" ONLY for expired-contract questions, whole-portfolio totals, or governing-law lookups.
- For "total value/exposure/spend with <counterparty>" use intent "aggregate", aggregate {"fn":"sum","field":"total_value"}, and a counterparty contains filter.
- show = 1-4 fields worth citing on each result row.
- All filter values must be strings in the JSON (numbers as digits, booleans as "true"/"false").
- If the question is not answerable from these fields and scopes, return exactly {"unsupported": true}.

EXAMPLES:
Q: "Which vendor contracts have a liability cap below $1M?"
{"intent":"filter","filters":[{"field":"liability_cap","op":"lt","value":"1000000"},{"field":"contract_type","op":"eq","values":["Vendor","SaaS"]}],"show":["liability_cap","total_value"]}

Q: "What comes up for renewal this quarter?"
{"intent":"lookup","filters":[],"scope":{"kind":"renewals","days":91},"show":["renewal_date","notice_deadline","total_value"]}

Q: "How much are we committed to with Torvane?"
{"intent":"aggregate","filters":[{"field":"counterparty","op":"contains","value":"Torvane"}],"aggregate":{"fn":"sum","field":"total_value"},"show":["total_value","payment_schedule"]}

Q: "What's the best pizza in Denver?"
{"unsupported": true}`;
}

// Values are declared as strings (structured output can't express unions);
// validatePlan coerces them deterministically on both server and client.
export const PLAN_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    unsupported: { type: Type.BOOLEAN, nullable: true },
    intent: {
      type: Type.STRING,
      enum: ["filter", "aggregate", "compare", "lookup"],
      nullable: true,
    },
    filters: {
      type: Type.ARRAY,
      nullable: true,
      items: {
        type: Type.OBJECT,
        properties: {
          field: { type: Type.STRING, enum: [...PLAN_FIELDS] },
          op: { type: Type.STRING, enum: [...PLAN_OPS] },
          value: { type: Type.STRING, nullable: true },
          values: {
            type: Type.ARRAY,
            nullable: true,
            items: { type: Type.STRING },
          },
        },
        required: ["field", "op"],
      },
    },
    aggregate: {
      type: Type.OBJECT,
      nullable: true,
      properties: {
        fn: { type: Type.STRING, enum: ["sum", "count", "avg", "max", "min"] },
        field: { type: Type.STRING, enum: [...PLAN_FIELDS], nullable: true },
      },
      required: ["fn"],
    },
    groupBy: { type: Type.STRING, enum: [...PLAN_FIELDS], nullable: true },
    scope: {
      type: Type.OBJECT,
      nullable: true,
      properties: {
        kind: { type: Type.STRING, enum: [...SCOPE_KINDS] },
        days: { type: Type.NUMBER, nullable: true },
      },
      required: ["kind"],
    },
    population: { type: Type.STRING, enum: ["active", "all"], nullable: true },
    show: {
      type: Type.ARRAY,
      nullable: true,
      items: { type: Type.STRING, enum: [...PLAN_FIELDS] },
    },
    sort: {
      type: Type.OBJECT,
      nullable: true,
      properties: {
        field: { type: Type.STRING, enum: [...PLAN_FIELDS] },
        dir: { type: Type.STRING, enum: ["asc", "desc"] },
      },
      required: ["field", "dir"],
    },
    limit: { type: Type.NUMBER, nullable: true },
  },
};
