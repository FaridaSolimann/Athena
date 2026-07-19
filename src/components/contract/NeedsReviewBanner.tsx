"use client";

import { CircleAlert } from "lucide-react";
import type { Contract } from "@/data/types";
import type { EffectiveField } from "@/lib/selectors";
import { TrustedFact } from "@/components/trust/TrustedFact";

/** Surfaces the fields awaiting human review, with inline verify actions. */
export function NeedsReviewBanner({
  contract,
  fields,
}: {
  contract: Contract;
  fields: EffectiveField[];
}) {
  const pending = fields.filter((ef) => ef.needsReview && ef.trust !== "verified");
  if (pending.length === 0) return null;

  return (
    <div className="rounded-lg border border-trust-medium/40 bg-trust-medium-bg/50 p-4">
      <div className="mb-2.5 flex items-center gap-2">
        <CircleAlert className="size-4 text-trust-medium" />
        <p className="text-[13.5px] font-medium">
          {pending.length} {pending.length === 1 ? "term needs" : "terms need"} review
        </p>
        <p className="text-xs text-muted-foreground">
          Confirm or correct against the source — verified terms flow into every total.
        </p>
      </div>
      <div className="space-y-2">
        {pending.map((ef) => (
          <TrustedFact
            key={ef.field.id}
            contractId={contract.id}
            fieldId={ef.field.id}
            variant="review"
            showVerify
          />
        ))}
      </div>
    </div>
  );
}
