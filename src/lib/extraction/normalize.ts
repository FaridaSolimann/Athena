// Deterministic normalization of extracted raw values. The model quotes;
// THIS code turns quotes into typed values. Anything it can't resolve cleanly
// is routed to review — never guessed.
import type { FieldKey, FieldValue } from "@/data/types";

/** Dated demo FX rate, consistent with the seed corpus (see NOTES.md). */
export const EURUSD_RATE = 1.08;

const WORD_NUMBERS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
  nine: 9, ten: 10, fifteen: 15, twenty: 20, thirty: 30, forty: 40,
  "forty-five": 45, fifty: 50, sixty: 60, ninety: 90,
  "one hundred twenty": 120, "one hundred eighty": 180,
};

export function parseMoneyUsd(raw: string): FieldValue | null {
  const cleaned = raw.replace(/ /g, " ");
  const m = cleaned.match(/([$€]|EUR|USD)?\s*([\d][\d,]*(?:\.\d+)?)\s*(million|m\b|k\b|thousand)?/i);
  if (!m || !m[2]) return null;
  let amount = parseFloat(m[2].replace(/,/g, ""));
  if (!Number.isFinite(amount) || amount <= 0) return null;
  const suffix = m[3]?.toLowerCase();
  if (suffix?.startsWith("m")) amount *= 1_000_000;
  else if (suffix) amount *= 1_000;
  const isEur = /€|EUR/i.test(cleaned);
  if (isEur) {
    return {
      kind: "money",
      usd: Math.round(amount * EURUSD_RATE),
      original: { amount, currency: "EUR", fxRate: EURUSD_RATE },
    };
  }
  return { kind: "money", usd: Math.round(amount) };
}

/** Formula caps ("fees paid in the trailing twelve months") can't be resolved
 * without more context — they must go to review, not be guessed. */
export function isFormulaAmount(raw: string): boolean {
  return /fees\s+(paid|payable)|preceding|trailing|then.current|prior\s+(12|twelve)|multiple\s+of|times\s+the/i.test(raw);
}

export function parseDurationDays(raw: string): FieldValue | null {
  // "ninety (90) days", "sixty (60) days" — trust the parenthetical digits
  const paren = raw.match(/\((\d{1,4})\)\s*(day|month|week|year)/i);
  const bare = raw.match(/(\d{1,4})\s*(day|month|week|year)/i);
  let n: number | null = null;
  let unit = "day";
  if (paren) {
    n = parseInt(paren[1], 10);
    unit = paren[2].toLowerCase();
  } else if (bare) {
    n = parseInt(bare[1], 10);
    unit = bare[2].toLowerCase();
  } else {
    const word = raw.toLowerCase().match(/\b(one hundred (?:twenty|eighty)|forty-five|[a-z]+)\b\s*\(?\s*(day|month|week|year)/);
    if (word && WORD_NUMBERS[word[1]] !== undefined) {
      n = WORD_NUMBERS[word[1]];
      unit = word[2];
    }
  }
  if (n === null || !Number.isFinite(n) || n <= 0) return null;
  const days = unit.startsWith("month") ? n * 30 : unit.startsWith("week") ? n * 7 : unit.startsWith("year") ? n * 365 : n;
  return { kind: "duration", days, raw: raw.trim().slice(0, 60) };
}

const MONTHS: Record<string, number> = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7,
  august: 8, september: 9, october: 10, november: 11, december: 12,
};

export function parseDateIso(raw: string): FieldValue | null {
  const iso = raw.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (iso) return { kind: "date", iso: iso[0] };
  const written = raw.match(
    /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})/i
  );
  if (written) {
    const mm = String(MONTHS[written[1].toLowerCase()]).padStart(2, "0");
    const dd = String(parseInt(written[2], 10)).padStart(2, "0");
    return { kind: "date", iso: `${written[3]}-${mm}-${dd}` };
  }
  const slash = raw.match(/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/);
  if (slash) {
    // ambiguous day/month order — refuse to guess
    return null;
  }
  return null;
}

export function parseBoolean(raw: string): FieldValue | null {
  if (/\b(no[tn]?\b|shall not|does not|will not)\b.*renew/i.test(raw)) return { kind: "boolean", value: false };
  if (/automatic|auto.?renew|shall renew|successive (renewal )?term/i.test(raw)) return { kind: "boolean", value: true };
  if (/^(yes|true)$/i.test(raw.trim())) return { kind: "boolean", value: true };
  if (/^(no|false)$/i.test(raw.trim())) return { kind: "boolean", value: false };
  return null;
}

const MONEY_FIELDS: FieldKey[] = ["total_value", "liability_cap"];
const DATE_FIELDS: FieldKey[] = ["effective_date", "expiration_date", "renewal_date", "notice_deadline"];
const DURATION_FIELDS: FieldKey[] = ["notice_days", "term_length"];

export interface NormalizedField {
  value: FieldValue;
  /** true when normalization failed and the field must be reviewed. */
  degraded: boolean;
  note?: string;
}

/** raw model output → typed value, or a review-routed text value. */
export function normalizeField(field: FieldKey, rawValue: string): NormalizedField {
  const raw = rawValue.trim();
  if (!raw) {
    return { value: { kind: "missing", expected: field.replace(/_/g, " ") }, degraded: true };
  }

  if (MONEY_FIELDS.includes(field)) {
    if (isFormulaAmount(raw)) {
      return {
        value: {
          kind: "ambiguous",
          candidates: [
            { reading: raw.slice(0, 80), value: "Formula — needs computation" },
            { reading: "No fixed amount stated", value: "Unresolved" },
          ],
        },
        degraded: true,
        note: "Stated as a formula, not a fixed amount — needs review.",
      };
    }
    const money = parseMoneyUsd(raw);
    if (money) {
      return {
        value: money,
        degraded: false,
        note: money.kind === "money" && money.original
          ? `${money.original.currency} ${money.original.amount.toLocaleString("en-US")} → $${money.usd.toLocaleString("en-US")} at ${money.original.fxRate} (rate as of the workspace date)`
          : undefined,
      };
    }
    return { value: { kind: "text", value: raw.slice(0, 80) }, degraded: true, note: "Could not resolve to an amount — needs review." };
  }

  if (DATE_FIELDS.includes(field)) {
    const date = parseDateIso(raw);
    if (date) return { value: date, degraded: false };
    return { value: { kind: "text", value: raw.slice(0, 60) }, degraded: true, note: "Could not resolve to a date — needs review." };
  }

  if (DURATION_FIELDS.includes(field)) {
    const dur = parseDurationDays(raw);
    if (dur) return { value: dur, degraded: false };
    return { value: { kind: "text", value: raw.slice(0, 60) }, degraded: true, note: "Could not resolve to a duration — needs review." };
  }

  if (field === "auto_renew") {
    const b = parseBoolean(raw);
    if (b) return { value: b, degraded: false };
    return { value: { kind: "text", value: raw.slice(0, 60) }, degraded: true, note: "Renewal behavior unclear — needs review." };
  }

  return { value: { kind: "text", value: raw.slice(0, 120) }, degraded: false };
}
