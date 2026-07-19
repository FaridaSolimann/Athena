"use client";

import { useEffectiveField } from "@/lib/selectors";
import { ConfidenceBadge } from "@/components/trust/ConfidenceBadge";
import { SourceChip } from "@/components/trust/SourceChip";
import { VerifyBar } from "@/components/trust/VerifyBar";
import { fmtFieldValue } from "@/lib/format";
import { useUi } from "@/lib/ui";
import { cn } from "@/lib/utils";

interface Props {
  contractId: string;
  fieldId: string;
  variant?: "row" | "inline" | "chip" | "review";
  showVerify?: boolean;
  className?: string;
}

/** The only way an extracted value renders anywhere in Athena:
 * value + trust state + provenance, resolved through the overlay. */
export function TrustedFact({
  contractId,
  fieldId,
  variant = "inline",
  showVerify = false,
  className,
}: Props) {
  const ef = useEffectiveField(fieldId);
  const openClausePeek = useUi((s) => s.openClausePeek);
  if (!ef) return null;

  const valueText = fmtFieldValue(ef.value);
  const missing = ef.value.kind === "missing";
  const peek = () =>
    openClausePeek({
      contractId,
      fieldId,
      ref: ef.field.source ?? undefined,
      title: ef.field.label,
    });

  if (variant === "chip") {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          peek();
        }}
        className={cn(
          "inline-flex max-w-full items-center gap-1.5 rounded-full border bg-background px-2 py-0.5 text-xs font-medium transition-colors hover:border-primary/40",
          missing && "border-dashed text-muted-foreground",
          className
        )}
      >
        <span className="truncate">{valueText}</span>
        <ConfidenceBadge ef={ef} compact />
      </button>
    );
  }

  if (variant === "inline") {
    return (
      <span className={cn("inline-flex items-center gap-1.5", className)}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            peek();
          }}
          className={cn(
            "text-left font-medium underline decoration-dotted decoration-muted-foreground/50 underline-offset-[3px] hover:text-primary",
            missing && "italic text-muted-foreground no-underline"
          )}
        >
          {valueText}
        </button>
        <ConfidenceBadge ef={ef} compact />
      </span>
    );
  }

  if (variant === "review") {
    return (
      <div className={cn("rounded-lg border bg-card p-3", className)}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{ef.field.label}</p>
            <p className={cn("mt-0.5 text-sm font-semibold", missing && "font-normal italic text-muted-foreground")}>
              {valueText}
            </p>
            {ef.field.note && (
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{ef.field.note}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ConfidenceBadge ef={ef} />
            <SourceChip contractId={contractId} fieldId={fieldId} title={ef.field.label} />
          </div>
        </div>
        {(showVerify || ef.needsReview) && ef.trust !== "verified" && (
          <div className="mt-2.5 border-t pt-2.5">
            <VerifyBar ef={ef} />
          </div>
        )}
      </div>
    );
  }

  // row — contract detail grid
  return (
    <div className={cn("flex items-start justify-between gap-4 py-2.5", className)}>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{ef.field.label}</p>
        <p className={cn("mt-0.5 text-[13.5px] font-medium", missing && "font-normal italic text-muted-foreground")}>
          {valueText}
        </p>
        {ef.field.note && (
          <p className="mt-0.5 max-w-md text-[11.5px] leading-relaxed text-muted-foreground">
            {ef.field.note}
          </p>
        )}
        {(showVerify || ef.needsReview) && ef.trust !== "verified" && (
          <div className="mt-2">
            <VerifyBar ef={ef} size="xs" />
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2 pt-0.5">
        <ConfidenceBadge ef={ef} />
        <SourceChip contractId={contractId} fieldId={fieldId} title={ef.field.label} />
      </div>
    </div>
  );
}
