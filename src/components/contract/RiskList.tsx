"use client";

import { ShieldAlert } from "lucide-react";
import type { Contract } from "@/data/types";
import { SourceChip } from "@/components/trust/SourceChip";
import { cn } from "@/lib/utils";

const KIND_LABEL: Record<string, string> = {
  auto_renewal_trap: "Auto-renewal trap",
  low_liability_cap: "Low liability cap",
  absent_liability_cap: "No liability cap",
  ambiguous_liability_cap: "Ambiguous liability cap",
  exclusivity: "Exclusivity",
  termination_for_convenience: "One-sided termination",
  unusual_indemnity: "Unusual indemnity",
  penalty: "Penalty terms",
};

/** Clause-level risk flags — the legal layer of the contract. */
export function RiskList({ contract }: { contract: Contract }) {
  if (contract.risks.length === 0) return null;
  return (
    <section>
      <h3 className="mb-1 text-[12.5px] font-semibold uppercase tracking-wide text-muted-foreground">
        Risk flags
      </h3>
      <div className="space-y-2">
        {contract.risks.map((r) => {
          const field = r.fieldId ? contract.fields.find((f) => f.id === r.fieldId) : null;
          return (
            <div
              key={r.id}
              className={cn(
                "rounded-lg border p-3",
                r.severity === "high" ? "border-trust-low/30 bg-trust-low-bg/40" : "bg-card"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-2.5">
                  <ShieldAlert
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      r.severity === "high" ? "text-trust-low" : "text-trust-medium"
                    )}
                  />
                  <div>
                    <p className="text-[13px] font-medium">
                      {KIND_LABEL[r.kind] ?? r.kind}
                      <span
                        className={cn(
                          "ml-2 rounded-full px-1.5 py-0.5 text-[10.5px] font-medium uppercase tracking-wide",
                          r.severity === "high"
                            ? "bg-trust-low-bg text-trust-low"
                            : "bg-trust-medium-bg text-trust-medium"
                        )}
                      >
                        {r.severity}
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {r.summary}
                    </p>
                  </div>
                </div>
                {field?.source && (
                  <SourceChip
                    contractId={contract.id}
                    fieldId={field.id}
                    title={KIND_LABEL[r.kind]}
                    className="shrink-0"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
