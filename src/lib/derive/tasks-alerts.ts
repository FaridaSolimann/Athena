import type {
  AssigneeRef,
  Contract,
  Priority,
  WorkItem,
} from "@/data/types";
import type { Verification } from "@/lib/store";
import { addDays, daysFromToday, TODAY_ISO } from "@/lib/demo-clock";
import { fmtDate, fmtMoneyFull } from "@/lib/format";

// Tasks & alerts are never seeded — they are a pure function of the contracts,
// the workspace clock, and the verification overlay. Deterministic IDs let
// user overrides survive re-derivation, and verifying a field visibly
// resolves the task that asked for it.

const user = (id: string): AssigneeRef => ({ kind: "user", id });
const team = (id: string): AssigneeRef => ({ kind: "team", id });

/** Who watches which renewal — procurement owns vendor spend, legal owns NDAs. */
const RENEWAL_OWNERS: Record<string, AssigneeRef> = {
  "c-001": user("u-nadia"),
  "c-002": user("u-ben"),
  "c-003": user("u-ben"),
  "c-015": user("u-nadia"),
  "c-016": user("u-nadia"),
};

function renewalPriority(days: number): Priority {
  if (days <= 21) return "critical";
  if (days <= 60) return "high";
  if (days <= 120) return "medium";
  return "low";
}

const RISK_TASK_KINDS = new Set([
  "absent_liability_cap",
  "low_liability_cap",
  "unusual_indemnity",
  "exclusivity",
]);

const RISK_LABEL: Record<string, string> = {
  absent_liability_cap: "Missing liability cap",
  low_liability_cap: "Inadequate liability cap",
  unusual_indemnity: "Reversed indemnity",
  exclusivity: "Exclusivity grant",
};

export function deriveWorkItems(
  contracts: Contract[],
  verifications: Record<string, Verification>
): WorkItem[] {
  const items: WorkItem[] = [];

  for (const c of contracts) {
    const noticeField = c.fields.find((f) => f.key === "notice_deadline");
    const noticeIso = noticeField?.value.kind === "date" ? noticeField.value.iso : null;

    // 1. Renewal / option notice deadlines (auto-renewals and the lease option).
    if (noticeIso) {
      const days = daysFromToday(noticeIso);
      if (days >= -14 && days <= 240) {
        const stake = c.valueUsd > 0 ? ` ${fmtMoneyFull(c.valueUsd)} at stake.` : "";
        items.push({
          id: `alert:${c.id}:renewal-notice`,
          kind: "alert",
          contractId: c.id,
          title: c.autoRenew
            ? `Renewal notice deadline — ${c.counterparty}`
            : `Option notice deadline — ${c.counterparty}`,
          detail: c.autoRenew
            ? `Auto-renews${c.renewalTermMonths ? ` for ${c.renewalTermMonths} months` : ""} unless written notice is delivered by ${fmtDate(noticeIso)}.${stake}`
            : `Written notice due by ${fmtDate(noticeIso)} to exercise or decline.`,
          dueDate: noticeIso,
          priority: renewalPriority(days),
          status: "open",
          assignee: RENEWAL_OWNERS[c.id] ?? (c.id === "c-010" ? user("u-ingrid") : team("t-procurement")),
          needsApproval: false,
          fieldIds: noticeField ? [noticeField.id] : undefined,
        });
      }
    }

    // 2. Expirations needing a decision (no auto-renewal).
    if (!c.autoRenew && c.expirationDate && c.status !== "expired") {
      const days = daysFromToday(c.expirationDate);
      if (days >= 0 && days <= 180) {
        const isNda = c.type === "NDA";
        if (isNda) {
          items.push({
            id: `alert:${c.id}:expiration`,
            kind: "alert",
            contractId: c.id,
            title: `NDA expires — ${c.counterparty}`,
            detail: `Expires ${fmtDate(c.expirationDate)}. Confirm whether ongoing discussions need an extension.`,
            dueDate: c.expirationDate,
            priority: "low",
            status: "open",
            assignee: user("u-tomas"),
            needsApproval: false,
          });
        } else if (c.valueUsd >= 100_000) {
          items.push({
            id: `task:${c.id}:expiration-decision`,
            kind: "task",
            contractId: c.id,
            title: `Renew, rebid, or let lapse — ${c.counterparty}`,
            detail: `${c.title} ends ${fmtDate(c.expirationDate)} with no automatic renewal. A decision is needed before the term runs out.`,
            dueDate: addDays(c.expirationDate, -45),
            priority: days <= 90 ? "high" : "medium",
            status: "open",
            assignee: RENEWAL_OWNERS[c.id] ?? team("t-procurement"),
            needsApproval: false,
          });
        }
      }
    }

    // 3. Unpaid payment milestones on the horizon.
    for (const m of c.milestones) {
      if (m.paid) continue;
      const days = daysFromToday(m.dueDate);
      if (days >= -14 && days <= 180) {
        items.push({
          id: `alert:${c.id}:milestone:${m.id.split(":").pop()}`,
          kind: "alert",
          contractId: c.id,
          title: `Milestone payment — ${m.label}`,
          detail: `${fmtMoneyFull(m.amountUsd)} due ${fmtDate(m.dueDate)} under ${c.title}.`,
          dueDate: m.dueDate,
          priority: days <= 45 ? "high" : "medium",
          status: "open",
          assignee: user("u-marcus"),
          needsApproval: false,
        });
      }
    }

    // 4. Low-confidence extractions → verification task (enters approval queue).
    const pendingFieldIds = c.fields
      .filter(
        (f) =>
          f.confidence < 0.75 &&
          verifications[f.id]?.status !== "confirmed" &&
          verifications[f.id]?.status !== "corrected"
      )
      .map((f) => f.id);
    const everLow = c.fields.filter((f) => f.confidence < 0.75);
    if (everLow.length > 0 && c.status !== "expired") {
      const done = pendingFieldIds.length === 0;
      items.push({
        id: `task:${c.id}:verify`,
        kind: "task",
        contractId: c.id,
        title: `Verify ${everLow.length} extracted ${everLow.length === 1 ? "term" : "terms"} — ${c.counterparty}`,
        detail: done
          ? `All flagged terms on ${c.title} have been reviewed.`
          : `${pendingFieldIds.length} of ${everLow.length} flagged ${everLow.length === 1 ? "term" : "terms"} on ${c.title} still ${pendingFieldIds.length === 1 ? "needs" : "need"} review against the source document.`,
        dueDate:
          daysFromToday(c.ingestedAt) > -5
            ? addDays(c.ingestedAt, 5)
            : addDays(TODAY_ISO, 14),
        priority: "high",
        status: done ? "done" : "open",
        assignee: user("u-tomas"),
        needsApproval: true,
        approvalStatus: done ? "approved" : "awaiting",
        fieldIds: everLow.map((f) => f.id),
      });
    }

    // 5. High-signal risk flags → review tasks for Legal.
    for (const r of c.risks) {
      if (!RISK_TASK_KINDS.has(r.kind) || c.status === "expired") continue;
      items.push({
        id: `task:${c.id}:risk:${r.kind}`,
        kind: "task",
        contractId: c.id,
        title: `${RISK_LABEL[r.kind]} — ${c.counterparty}`,
        detail: r.summary,
        dueDate: addDays(TODAY_ISO, r.severity === "high" ? 45 : 75),
        priority: r.severity === "high" ? "high" : "medium",
        status: "open",
        assignee: r.severity === "high" ? user("u-priya") : user("u-tomas"),
        needsApproval: false,
        fieldIds: r.fieldId ? [r.fieldId] : undefined,
      });
    }

    // 6. Dated one-off obligations we owe in the next 90 days (recurring items
    // live on the Insights timeline instead; renewal notices covered above).
    for (const o of c.obligations) {
      if (!o.dueDate || o.owedBy !== "us" || c.status === "expired") continue;
      if (o.dueDate === noticeIso) continue;
      if (c.milestones.some((m) => m.dueDate === o.dueDate)) continue;
      const days = daysFromToday(o.dueDate);
      if (days < 0 || days > 90 || o.recurrence === "monthly") continue;
      items.push({
        id: `alert:${c.id}:obligation:${o.id.split(":").pop()}`,
        kind: "alert",
        contractId: c.id,
        title: o.title,
        detail: `${o.description} (${c.counterparty})`,
        dueDate: o.dueDate,
        priority: days <= 30 ? "high" : "medium",
        status: "open",
        assignee: c.type === "Lease" ? user("u-ingrid") : team("t-procurement"),
        needsApproval: false,
      });
    }
  }

  return items;
}
