"use client";

import type { InsightsInput } from "@/lib/derive/insights";
import { exposure, typeMix } from "@/lib/derive/insights";
import { TakeawayCard, Block } from "@/components/insights/TakeawayCard";
import { ShareBar, RankedBars } from "@/components/insights/bars";
import type { DrillTarget } from "@/components/insights/DrillSheet";
import { lookupContract } from "@/lib/selectors";
import { fmtMoney, fmtMoneyFull, fmtPercent } from "@/lib/format";

export function ExposureTab({
  input,
  onDrill,
}: {
  input: InsightsInput;
  onDrill: (t: DrillTarget) => void;
}) {
  const exp = exposure(input);
  const mix = typeMix(input);
  const top = exp.concentration[0];

  const drillValue = (title: string, ids: string[], description?: string) =>
    onDrill({
      title,
      description,
      rows: ids.map((id) => {
        const c = lookupContract(id)!;
        return {
          contractId: id,
          fieldIds: c.fields
            .filter((f) => ["total_value", "payment_schedule"].includes(f.key))
            .map((f) => f.id),
        };
      }),
    });

  return (
    <div className="space-y-4">
      <TakeawayCard>
        {fmtMoneyFull(exp.total)} in total contract value —{" "}
        {top ? (
          <>
            {top.label} alone is {fmtPercent(top.share)} of it
          </>
        ) : null}
        , and {fmtMoneyFull(exp.unverifiedValue)} sits on contracts with terms still
        awaiting verification.
      </TakeawayCard>

      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() =>
            drillValue(
              "Total contract value",
              input.contracts.filter((c) => c.valueUsd > 0).map((c) => c.id),
              "EUR normalized at 1.08"
            )
          }
          className="rounded-lg border bg-card p-4 text-left transition-colors hover:border-primary/40"
        >
          <p className="text-2xl font-semibold tabular-nums">{fmtMoney(exp.total)}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Total contract value</p>
        </button>
        <button
          type="button"
          onClick={() =>
            onDrill({
              title: "Value awaiting verification",
              description:
                "Contracts whose extracted terms include unreviewed low-confidence fields — verify them to firm these numbers up.",
              rows: exp.unverifiedIds.map((id) => {
                const c = lookupContract(id)!;
                return {
                  contractId: id,
                  fieldIds: c.fields
                    .filter((f) => f.confidence < 0.75)
                    .map((f) => f.id),
                };
              }),
            })
          }
          className="rounded-lg border bg-card p-4 text-left transition-colors hover:border-trust-medium"
        >
          <p className="text-2xl font-semibold tabular-nums text-trust-medium">
            {fmtMoney(exp.unverifiedValue)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            On contracts awaiting verification
          </p>
        </button>
        <button
          type="button"
          onClick={() => top && drillValue(`Exposure to ${top.label}`, top.ids)}
          className="rounded-lg border bg-card p-4 text-left transition-colors hover:border-primary/40"
        >
          <p className="text-2xl font-semibold tabular-nums">
            {top ? fmtPercent(top.share) : "—"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Top counterparty concentration{top ? ` — ${top.label}` : ""}
          </p>
        </button>
      </div>

      <Block title="Spend concentration — top counterparties">
        <RankedBars
          format={(v) => fmtMoney(v)}
          rows={exp.concentration.slice(0, 6).map((c) => ({
            label: c.label,
            value: c.value,
            sublabel: fmtPercent(c.share),
            onClick: () => drillValue(`Exposure to ${c.label}`, c.ids),
          }))}
        />
      </Block>

      <Block title="Value by contract type">
        <ShareBar
          format={(v) => fmtMoney(v)}
          segments={mix
            .filter((m) => m.value > 0)
            .map((m) => ({
              label: m.label,
              value: m.value,
              onClick: () => drillValue(`${m.label} contracts`, m.ids),
            }))}
        />
      </Block>
    </div>
  );
}
