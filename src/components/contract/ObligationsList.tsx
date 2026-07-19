"use client";

import { CalendarClock, Repeat } from "lucide-react";
import type { Contract } from "@/data/types";
import { SourceChip } from "@/components/trust/SourceChip";
import { fmtDate, fmtRelative } from "@/lib/format";
import { daysFromToday } from "@/lib/demo-clock";
import { cn } from "@/lib/utils";

/** Who owes what, by when — the ops layer of the contract. */
export function ObligationsList({ contract }: { contract: Contract }) {
  if (contract.obligations.length === 0) return null;
  return (
    <section>
      <h3 className="mb-1 text-[12.5px] font-semibold uppercase tracking-wide text-muted-foreground">
        Obligations
      </h3>
      <div className="space-y-2">
        {contract.obligations.map((o) => {
          const days = o.dueDate ? daysFromToday(o.dueDate) : null;
          const urgent = days !== null && days >= 0 && days <= 30;
          return (
            <div key={o.id} className="rounded-lg border bg-card p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13.5px] font-medium leading-tight">
                    {o.title}
                    <span
                      className={cn(
                        "ml-2 rounded-full px-1.5 py-0.5 text-[10.5px] font-medium",
                        o.owedBy === "us"
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {o.owedBy === "us" ? "Vantora owes" : contract.counterparty.split(" ")[0] + " owes"}
                    </span>
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {o.description}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  {o.dueDate && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-xs font-medium",
                        urgent ? "text-trust-low" : "text-muted-foreground"
                      )}
                    >
                      <CalendarClock className="size-3" />
                      {fmtDate(o.dueDate)} · {fmtRelative(o.dueDate)}
                    </span>
                  )}
                  {o.recurrence && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Repeat className="size-3" />
                      {o.recurrence}
                    </span>
                  )}
                  {o.source && (
                    <SourceChip
                      contractId={contract.id}
                      sourceRef={o.source}
                      title={o.title}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
