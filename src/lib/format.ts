import type { FieldValue } from "@/data/types";
import { daysFromToday, parseISO } from "@/lib/demo-clock";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "$8.48M", "$252K", "$7,900" — compact money for headlines and chips. */
export function fmtMoney(usd: number, opts?: { compact?: boolean }): string {
  const compact = opts?.compact ?? true;
  if (compact && Math.abs(usd) >= 1_000_000) {
    const m = usd / 1_000_000;
    return `$${m >= 10 ? m.toFixed(1) : m.toFixed(2).replace(/0$/, "")}M`;
  }
  if (compact && Math.abs(usd) >= 100_000) {
    return `$${Math.round(usd / 1_000)}K`;
  }
  return `$${usd.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

/** Full-precision money: "$2,544,000". */
export function fmtMoneyFull(usd: number): string {
  return `$${usd.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function fmtOriginalCurrency(amount: number, currency: string): string {
  if (currency === "EUR") return `€${amount.toLocaleString("en-US")}`;
  return `${currency} ${amount.toLocaleString("en-US")}`;
}

/** "Aug 1, 2026" */
export function fmtDate(iso: string): string {
  const d = parseISO(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/** "Aug 1" */
export function fmtDateShort(iso: string): string {
  const d = parseISO(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

/** "in 13 days" / "today" / "12 days ago" */
export function fmtRelative(iso: string): string {
  const days = daysFromToday(iso);
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days === -1) return "yesterday";
  if (days > 0 && days <= 365) return `in ${days} days`;
  if (days < 0 && days >= -90) return `${-days} days ago`;
  return fmtDate(iso);
}

export function fmtPercent(share: number): string {
  const pct = share * 100;
  return `${Number.isInteger(pct) ? pct : pct.toFixed(1)}%`;
}

export type ConfidenceLevel = "high" | "medium" | "low";

export function confidenceLevel(confidence: number): ConfidenceLevel {
  if (confidence >= 0.9) return "high";
  if (confidence >= 0.75) return "medium";
  return "low";
}

export const CONFIDENCE_LABEL: Record<ConfidenceLevel, string> = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
};

/** Render any extracted value for display. */
export function fmtFieldValue(value: FieldValue): string {
  switch (value.kind) {
    case "money": {
      const base = fmtMoneyFull(value.usd);
      return value.original
        ? `${fmtOriginalCurrency(value.original.amount, value.original.currency)} (${base})`
        : base;
    }
    case "date":
      return fmtDate(value.iso);
    case "duration":
      return value.raw;
    case "boolean":
      return value.value ? "Yes" : "No";
    case "text":
      return value.value;
    case "missing":
      return "Not found in document";
    case "ambiguous":
      return value.candidates.map((c) => c.value).join(" or ");
  }
}
