"use client";

import type { InsightsInput } from "@/lib/derive/insights";
import { typeMix, statusDistribution, lawBreakdown } from "@/lib/derive/insights";
import { TakeawayCard, Block } from "@/components/insights/TakeawayCard";
import { ShareBar, RankedBars } from "@/components/insights/bars";
import type { DrillTarget } from "@/components/insights/DrillSheet";
import { getContract } from "@/data";
import { fmtMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PortfolioTab({
  input,
  onDrill,
}: {
  input: InsightsInput;
  onDrill: (t: DrillTarget) => void;
}) {
  const mix = typeMix(input);
  const dist = statusDistribution(input);
  const laws = lawBreakdown(input);

  const drillIds = (title: string, ids: string[], fieldKey: string, description?: string) =>
    onDrill({
      title,
      description,
      rows: ids.map((id) => {
        const c = getContract(id)!;
        return {
          contractId: id,
          fieldIds: c.fields.filter((f) => f.key === fieldKey).map((f) => f.id),
        };
      }),
    });

  const statusCards = [
    { key: "active", label: "Active", ids: dist.active, cls: "text-trust-high" },
    { key: "needs_review", label: "Needs review", ids: dist.needs_review, cls: "text-trust-medium" },
    { key: "expired", label: "Expired", ids: dist.expired, cls: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-4">
      <TakeawayCard>
        {input.contracts.length} agreements across {mix.length} contract types and{" "}
        {laws.filter((l) => !l.label.includes("unverified")).length} governing
        jurisdictions — {dist.needs_review.length}{" "}
        {dist.needs_review.length === 1 ? "contract" : "contracts"} still{" "}
        {dist.needs_review.length === 1 ? "carries" : "carry"} unverified terms.
      </TakeawayCard>

      <div className="grid grid-cols-3 gap-3">
        {statusCards.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() =>
              drillIds(`${s.label} contracts`, s.ids, "contract_type")
            }
            className="rounded-lg border bg-card p-4 text-left transition-colors hover:border-primary/40"
          >
            <p className={cn("text-2xl font-semibold tabular-nums", s.cls)}>{s.ids.length}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
          </button>
        ))}
      </div>

      <Block title="Contract type mix — by committed value">
        <ShareBar
          format={(v) => fmtMoney(v)}
          segments={mix.map((m) => ({
            label: `${m.label} (${m.count})`,
            value: m.value || m.count * 1000, // NDAs carry no value; keep them visible
            onClick: () =>
              drillIds(`${m.label} contracts`, m.ids, "total_value", `${m.count} agreements`),
          }))}
        />
      </Block>

      <Block title="Governing law">
        <RankedBars
          format={(v) => `${v}`}
          maxRows={8}
          rows={laws.map((l) => ({
            label: l.label,
            value: l.count,
            onClick: () =>
              drillIds(`Governed by ${l.label}`, l.ids, "governing_law"),
          }))}
        />
      </Block>
    </div>
  );
}
