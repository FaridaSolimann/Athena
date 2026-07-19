"use client";

import { Quote, CircleOff } from "lucide-react";
import type { Contract, SourceRef } from "@/data/types";
import { lookupContract } from "@/lib/selectors";
import { useUi } from "@/lib/ui";
import { cn } from "@/lib/utils";

/** The provenance affordance: a small pill that opens the exact source clause. */
export function SourceChip({
  contractId,
  fieldId,
  sourceRef,
  title,
  className,
}: {
  contractId: string;
  fieldId?: string;
  sourceRef?: SourceRef | null;
  title?: string;
  className?: string;
}) {
  const openClausePeek = useUi((s) => s.openClausePeek);
  const contract = lookupContract(contractId);
  const ref =
    sourceRef ??
    (fieldId ? contract?.fields.find((f) => f.id === fieldId)?.source : null);

  if (!ref) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-[11px] text-trust-missing",
          className
        )}
      >
        <CircleOff className="size-3" />
        No source found
      </span>
    );
  }

  const section = (contract as Contract | undefined)?.document.sections.find(
    (s) => s.id === ref.sectionId
  );
  const label = section
    ? /^(exhibit|order)/i.test(section.number)
      ? section.number
      : `§${section.number}`
    : "Source";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        openClausePeek({ contractId, fieldId, ref, title });
      }}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border bg-background px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary",
        className
      )}
    >
      <Quote className="size-2.5" />
      {label}
    </button>
  );
}
