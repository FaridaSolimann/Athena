"use client";

import Link from "next/link";
import { CornerDownRight, Repeat } from "lucide-react";
import type { InsightsInput } from "@/lib/derive/insights";
import { lifecycle } from "@/lib/derive/insights";
import { TakeawayCard, Block } from "@/components/insights/TakeawayCard";
import type { DrillTarget } from "@/components/insights/DrillSheet";
import { lookupContract } from "@/lib/selectors";
import { fmtDate, fmtMoney, fmtRelative } from "@/lib/format";
import { cn } from "@/lib/utils";

export function LifecycleTab({
  input,
  onDrill,
}: {
  input: InsightsInput;
  onDrill: (t: DrillTarget) => void;
}) {
  const { horizon, recurring, families } = lifecycle(input);
  const renewing = horizon.filter((h) => h.autoRenew).length;

  return (
    <div className="space-y-4">
      <TakeawayCard>
        {horizon.length} contracts reach the end of their term in the next ~6 months —{" "}
        {renewing} will renew automatically unless notice goes out first, so the real
        deadlines come earlier than the end dates.
      </TakeawayCard>

      <Block title="Upcoming term ends">
        <div className="space-y-1">
          {horizon.map((h) => {
            const c = lookupContract(h.id)!;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() =>
                  onDrill({
                    title: c.title,
                    description: `${c.counterparty} — term ends ${fmtDate(h.date)}`,
                    rows: [
                      {
                        contractId: h.id,
                        fieldIds: c.fields
                          .filter((f) =>
                            ["expiration_date", "auto_renew", "notice_deadline", "total_value"].includes(f.key)
                          )
                          .map((f) => f.id),
                      },
                    ],
                  })
                }
                className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-accent"
              >
                <span className="w-24 shrink-0 text-[12.5px] font-medium tabular-nums">
                  {fmtDate(h.date).replace(", 2026", "").replace(", 2027", " '27")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium">{c.title}</span>
                  <span className="block truncate text-[11.5px] text-muted-foreground">
                    {c.counterparty} · {fmtRelative(h.date)}
                  </span>
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-medium",
                    h.autoRenew
                      ? "bg-trust-medium-bg text-trust-medium"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {h.autoRenew ? "Auto-renews" : "Ends"}
                </span>
              </button>
            );
          })}
        </div>
      </Block>

      <div className="grid grid-cols-2 gap-4">
        <Block title="Contract families">
          {families.map(({ parent, children }) => (
            <div key={parent.id} className="text-[13px]">
              <Link
                href={`/contracts/${parent.id}`}
                className="font-medium hover:text-primary hover:underline"
              >
                {parent.title}
              </Link>
              <p className="text-[11.5px] text-muted-foreground">
                {parent.counterparty} · shared $2,000,000 aggregate liability cap
              </p>
              <div className="mt-1.5 space-y-1.5 border-l pl-3">
                {children.map((c) => (
                  <div key={c.id} className="flex items-start gap-1.5">
                    <CornerDownRight className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <Link
                        href={`/contracts/${c.id}`}
                        className="block truncate text-[12.5px] font-medium hover:text-primary hover:underline"
                      >
                        {c.title}
                      </Link>
                      <p className="text-[11px] text-muted-foreground">
                        {fmtMoney(c.valueUsd)} · ends {fmtDate(c.expirationDate!)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Block>

        <Block title="Recurring obligations">
          <div className="space-y-2">
            {recurring.slice(0, 7).map(({ contractId, obligation }) => {
              const c = lookupContract(contractId)!;
              return (
                <div key={obligation.id} className="flex items-start gap-2">
                  <Repeat className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="truncate text-[12.5px] font-medium">{obligation.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {obligation.recurrence} · {c.counterparty}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Block>
      </div>
    </div>
  );
}
