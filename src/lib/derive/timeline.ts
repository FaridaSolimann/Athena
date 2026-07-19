import type { Contract } from "@/data/types";
import type { InsightsInput } from "@/lib/derive/insights";
import { addDays, daysFromToday, parseISO, TODAY_ISO } from "@/lib/demo-clock";
import { fmtDate, fmtMoneyFull } from "@/lib/format";

export type TimelineEventKind = "renewal" | "notice" | "expiration" | "payment";

export interface TimelineEvent {
  id: string;
  kind: TimelineEventKind;
  date: string; // ISO
  contractId: string;
  title: string;
  /** Plain-language sentence for the popover. */
  sentence: string;
  /** Fields whose provenance backs this event. */
  fieldIds: string[];
  /** Notice events point at the renewal they protect. */
  pairedEventId?: string;
  amountUsd?: number;
}

const HORIZON_DAYS = 400;
const PAST_DAYS = 21;

function inRange(iso: string): boolean {
  const d = daysFromToday(iso);
  return d >= -PAST_DAYS && d <= HORIZON_DAYS;
}

function fieldIds(c: Contract, ...keys: string[]): string[] {
  return c.fields.filter((f) => keys.includes(f.key)).map((f) => f.id);
}

/** Expand a recurring obligation's due dates across the horizon. */
function expandRecurrence(anchor: string, recurrence: string): string[] {
  const step = recurrence === "monthly" ? 1 : recurrence === "quarterly" ? 3 : recurrence === "annual" ? 12 : 0;
  if (!step) return [anchor];
  const out: string[] = [];
  const a = parseISO(anchor);
  for (let i = -2; i <= 14; i++) {
    const d = new Date(Date.UTC(a.getUTCFullYear(), a.getUTCMonth() + i * step, a.getUTCDate()));
    const iso = d.toISOString().slice(0, 10);
    if (inRange(iso)) out.push(iso);
  }
  return out;
}

export function deriveTimelineEvents({ contracts }: InsightsInput): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  for (const c of contracts) {
    if (c.status === "expired") continue;
    const notice = c.fields.find((f) => f.key === "notice_deadline");
    const noticeIso = notice?.value.kind === "date" ? notice.value.iso : null;
    const renewal = c.fields.find((f) => f.key === "renewal_date");
    const renewalIso = renewal?.value.kind === "date" ? renewal.value.iso : null;

    if (c.autoRenew && renewalIso && inRange(renewalIso)) {
      events.push({
        id: `ev:${c.id}:renewal`,
        kind: "renewal",
        date: renewalIso,
        contractId: c.id,
        title: `${c.counterparty} renews`,
        sentence: `${c.title} auto-renews on ${fmtDate(renewalIso)}${c.renewalTermMonths ? ` for another ${c.renewalTermMonths} months` : ""}${noticeIso ? ` unless notice was given by ${fmtDate(noticeIso)}` : ""}.`,
        fieldIds: fieldIds(c, "renewal_date", "term_length", "total_value"),
      });
    }

    if (noticeIso && inRange(noticeIso)) {
      events.push({
        id: `ev:${c.id}:notice`,
        kind: "notice",
        date: noticeIso,
        contractId: c.id,
        title: `${c.counterparty} notice cutoff`,
        sentence: c.autoRenew
          ? `Last day to send non-renewal notice for ${c.title} — after ${fmtDate(noticeIso)} the renewal locks in.`
          : `Written notice due by ${fmtDate(noticeIso)} on ${c.title}.`,
        fieldIds: fieldIds(c, "notice_deadline", "notice_days"),
        pairedEventId: c.autoRenew && renewalIso ? `ev:${c.id}:renewal` : undefined,
      });
    }

    if (!c.autoRenew && c.expirationDate && inRange(c.expirationDate)) {
      events.push({
        id: `ev:${c.id}:expiration`,
        kind: "expiration",
        date: c.expirationDate,
        contractId: c.id,
        title: `${c.counterparty} term ends`,
        sentence: `${c.title} reaches the end of its term on ${fmtDate(c.expirationDate)} with no automatic renewal.`,
        fieldIds: fieldIds(c, "expiration_date"),
      });
    }

    for (const m of c.milestones) {
      if (!m.paid && inRange(m.dueDate)) {
        events.push({
          id: `ev:${c.id}:pay:${m.id.split(":").pop()}`,
          kind: "payment",
          date: m.dueDate,
          contractId: c.id,
          title: `${fmtMoneyFull(m.amountUsd)} milestone`,
          sentence: `${m.label} — ${fmtMoneyFull(m.amountUsd)} due ${fmtDate(m.dueDate)} under ${c.title}.`,
          fieldIds: fieldIds(c, "payment_schedule", "total_value"),
          amountUsd: m.amountUsd,
        });
      }
    }

    for (const o of c.obligations) {
      if (o.owedBy !== "us") continue;
      if (!/pay|rent|invoice|prepay|fee/i.test(o.title)) continue;
      // Monthly items often state no single due date — anchor to the 1st.
      const anchor =
        o.dueDate ?? (o.recurrence === "monthly" ? `${TODAY_ISO.slice(0, 8)}01` : null);
      if (!anchor) continue;
      const dates = (o.recurrence ? expandRecurrence(anchor, o.recurrence) : [anchor].filter(inRange))
        // never bill past the contract's own term
        .filter((iso) => !c.expirationDate || iso <= c.expirationDate);
      for (const iso of dates) {
        events.push({
          id: `ev:${c.id}:pay:${o.id.split(":").pop()}:${iso}`,
          kind: "payment",
          date: iso,
          contractId: c.id,
          title: o.title.replace(/\s*\(.*\)$/, ""),
          sentence: `${o.description} (${fmtDate(iso)})`,
          fieldIds: fieldIds(c, "payment_schedule"),
        });
      }
    }
  }

  return events.sort((a, b) => a.date.localeCompare(b.date));
}

export const TIMELINE_RANGE = {
  start: addDays(TODAY_ISO, -PAST_DAYS),
  end: addDays(TODAY_ISO, HORIZON_DAYS),
};
