"use client";

import { BadgeCheck, CircleAlert, CircleDashed, XCircle } from "lucide-react";
import type { EffectiveField } from "@/lib/selectors";
import { USERS } from "@/data";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/** The trust signal on every extracted value. Verification visibly upgrades
 * it from a confidence estimate to a named human sign-off. */
export function ConfidenceBadge({
  ef,
  compact = false,
}: {
  ef: EffectiveField;
  compact?: boolean;
}) {
  const pct = Math.round(ef.field.confidence * 100);

  if (ef.trust === "verified") {
    const by = USERS.find((u) => u.id === ef.verification?.by);
    const label = compact ? "Verified" : `Verified · ${by?.name.split(" ")[0] ?? "you"}`;
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1 rounded-full bg-trust-verified-bg px-1.5 py-0.5 text-[11px] font-medium text-trust-verified">
            <BadgeCheck className="size-3" />
            {label}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {ef.verification?.status === "corrected" ? "Corrected" : "Confirmed"} by{" "}
          {by?.name ?? "a reviewer"} — treated as ground truth.
        </TooltipContent>
      </Tooltip>
    );
  }

  if (ef.trust === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-trust-low-bg px-1.5 py-0.5 text-[11px] font-medium text-trust-low">
        <XCircle className="size-3" />
        Rejected
      </span>
    );
  }

  if (ef.field.value.kind === "missing") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-dashed px-1.5 py-0.5 text-[11px] font-medium text-trust-missing">
        <CircleDashed className="size-3" />
        Not found
      </span>
    );
  }

  if (ef.trust === "low") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-trust-low-bg px-1.5 py-0.5 text-[11px] font-medium text-trust-low">
        <CircleAlert className="size-3" />
        {compact ? `${pct}%` : `Low · ${pct}%`}
      </span>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-[11px] font-medium tabular-nums",
            ef.trust === "high" ? "text-muted-foreground" : "text-trust-medium"
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              ef.trust === "high" ? "bg-trust-high" : "bg-trust-medium"
            )}
          />
          {pct}%
        </span>
      </TooltipTrigger>
      <TooltipContent>
        AI-extracted at {pct}% confidence — click the source to verify.
      </TooltipContent>
    </Tooltip>
  );
}
