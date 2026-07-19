import type { Contract } from "@/data/types";
import type { Verification } from "@/lib/store";
import { daysFromToday } from "@/lib/demo-clock";

// All Insights numbers derive from effective contract state so drilling into
// any figure lands on the same facts the figure was computed from.

export interface InsightsInput {
  contracts: Contract[];
  verifications: Record<string, Verification>;
}

const FAMILY_GROUP: Record<string, string> = { MSA: "MSA family", SOW: "MSA family" };

export function typeMix({ contracts }: InsightsInput) {
  const groups = new Map<string, { count: number; value: number; ids: string[] }>();
  for (const c of contracts) {
    const key = FAMILY_GROUP[c.type] ?? c.type;
    const g = groups.get(key) ?? { count: 0, value: 0, ids: [] };
    g.count++;
    g.value += c.valueUsd;
    g.ids.push(c.id);
    groups.set(key, g);
  }
  return [...groups.entries()]
    .map(([label, g]) => ({ label, ...g }))
    .sort((a, b) => b.value - a.value);
}

export function statusDistribution({ contracts, verifications }: InsightsInput) {
  const dist = { active: [] as string[], needs_review: [] as string[], expired: [] as string[] };
  for (const c of contracts) {
    if (c.status === "expired") dist.expired.push(c.id);
    else {
      const pending = c.fields.some(
        (f) =>
          f.confidence < 0.75 &&
          verifications[f.id]?.status !== "confirmed" &&
          verifications[f.id]?.status !== "corrected"
      );
      (c.status === "needs_review" && pending ? dist.needs_review : dist.active).push(c.id);
    }
  }
  return dist;
}

export function lawBreakdown({ contracts, verifications }: InsightsInput) {
  const laws = new Map<string, string[]>();
  for (const c of contracts) {
    const f = c.fields.find((x) => x.key === "governing_law");
    let label = "Unknown";
    if (f) {
      const v = verifications[f.id]?.status === "corrected"
        ? verifications[f.id].correctedValue
        : f.value;
      if (v?.kind === "text") label = v.value;
      if (f.confidence < 0.75 && verifications[f.id] === undefined) label = `${label} (unverified)`;
    }
    laws.set(label, [...(laws.get(label) ?? []), c.id]);
  }
  return [...laws.entries()]
    .map(([label, ids]) => ({ label, ids, count: ids.length }))
    .sort((a, b) => b.count - a.count);
}

export function exposure({ contracts, verifications }: InsightsInput) {
  const effValue = (c: Contract) => {
    const f = c.fields.find((x) => x.key === "total_value");
    const v = f && verifications[f.id]?.status === "corrected"
      ? verifications[f.id].correctedValue
      : f?.value;
    return v?.kind === "money" ? v.usd : c.valueUsd;
  };
  const total = contracts.reduce((s, c) => s + effValue(c), 0);

  const unverifiedIds = contracts
    .filter((c) =>
      c.fields.some(
        (f) =>
          f.confidence < 0.75 &&
          verifications[f.id]?.status !== "confirmed" &&
          verifications[f.id]?.status !== "corrected"
      )
    )
    .map((c) => c.id);
  const unverifiedValue = contracts
    .filter((c) => unverifiedIds.includes(c.id))
    .reduce((s, c) => s + effValue(c), 0);

  const byParty = new Map<string, { value: number; ids: string[] }>();
  for (const c of contracts) {
    const key = c.counterparty.includes("Torvane")
      ? "Torvane Consulting Group"
      : c.counterparty;
    const g = byParty.get(key) ?? { value: 0, ids: [] };
    g.value += effValue(c);
    g.ids.push(c.id);
    byParty.set(key, g);
  }
  const concentration = [...byParty.entries()]
    .map(([label, g]) => ({ label, ...g, share: total ? g.value / total : 0 }))
    .filter((x) => x.value > 0)
    .sort((a, b) => b.value - a.value);

  return { total, unverifiedValue, unverifiedIds, concentration };
}

export function lifecycle({ contracts }: InsightsInput) {
  const horizon = contracts
    .filter((c) => c.expirationDate && c.status !== "expired")
    .map((c) => ({
      id: c.id,
      date: c.expirationDate!,
      days: daysFromToday(c.expirationDate!),
      autoRenew: c.autoRenew,
    }))
    .filter((x) => x.days >= 0 && x.days <= 200)
    .sort((a, b) => a.date.localeCompare(b.date));

  const recurring = contracts
    .flatMap((c) =>
      c.obligations
        .filter((o) => o.recurrence && c.status !== "expired")
        .map((o) => ({ contractId: c.id, obligation: o }))
    )
    .sort((a, b) => (a.obligation.recurrence ?? "").localeCompare(b.obligation.recurrence ?? ""));

  const families = contracts
    .filter((p) => contracts.some((c) => c.familyParentId === p.id))
    .map((parent) => ({
      parent,
      children: contracts.filter((c) => c.familyParentId === parent.id),
    }));

  return { horizon, recurring, families };
}
