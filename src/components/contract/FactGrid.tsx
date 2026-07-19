"use client";

import type { Contract, FieldGroup } from "@/data/types";
import { TrustedFact } from "@/components/trust/TrustedFact";
import { Separator } from "@/components/ui/separator";

const GROUP_ORDER: FieldGroup[] = ["Overview", "Term & renewal", "Financial", "Legal terms"];

/** All extracted terms, grouped, each rendered as a TrustedFact row. */
export function FactGrid({ contract }: { contract: Contract }) {
  return (
    <div className="space-y-5">
      {GROUP_ORDER.map((group) => {
        const fields = contract.fields.filter((f) => f.group === group);
        if (fields.length === 0) return null;
        return (
          <section key={group}>
            <h3 className="mb-1 text-[12.5px] font-semibold uppercase tracking-wide text-muted-foreground">
              {group}
            </h3>
            <div className="rounded-lg border bg-card px-4">
              {fields.map((f, i) => (
                <div key={f.id}>
                  {i > 0 && <Separator />}
                  <TrustedFact contractId={contract.id} fieldId={f.id} variant="row" />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
