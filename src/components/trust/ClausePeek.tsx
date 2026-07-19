"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { DocumentPane } from "@/components/trust/DocumentPane";
import { ConfidenceBadge } from "@/components/trust/ConfidenceBadge";
import { VerifyBar } from "@/components/trust/VerifyBar";
import { useUi } from "@/lib/ui";
import { useEffectiveField } from "@/lib/selectors";
import { getContract } from "@/data";
import { fmtFieldValue } from "@/lib/format";

function PeekBody() {
  const target = useUi((s) => s.clausePeek);
  const ef = useEffectiveField(target?.fieldId ?? "");
  if (!target) return null;

  const contract = getContract(target.contractId);
  if (!contract) return null;

  const ref = target.ref ?? ef?.field.source ?? null;
  const title = target.title ?? ef?.field.label ?? "Source clause";

  return (
    <>
      <SheetHeader className="border-b pb-3">
        <SheetTitle className="text-[15px]">{title}</SheetTitle>
        <SheetDescription asChild>
          <div>
            <p className="text-[13px] text-muted-foreground">
              {contract.title} · {contract.counterparty}
            </p>
            {ef && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {fmtFieldValue(ef.value)}
                </span>
                <ConfidenceBadge ef={ef} />
              </div>
            )}
            {ef?.field.note && (
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {ef.field.note}
              </p>
            )}
            {ef && ef.needsReview && ef.trust !== "verified" && (
              <div className="mt-2.5">
                <VerifyBar ef={ef} size="xs" />
              </div>
            )}
          </div>
        </SheetDescription>
      </SheetHeader>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        {ref ? (
          <DocumentPane contract={contract} activeRef={ref} onlyActiveSection />
        ) : (
          <div className="rounded-md border border-dashed p-4 text-[13px] text-muted-foreground">
            No clause in the document supports this term — that absence is itself
            the finding. Open the contract to review the full text.
          </div>
        )}
      </div>
      <div className="border-t p-3">
        <Link
          href={`/contracts/${contract.id}${target.fieldId ? `?field=${encodeURIComponent(target.fieldId)}` : ""}`}
          onClick={() => useUi.getState().closeClausePeek()}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline"
        >
          Open contract
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </>
  );
}

/** Global right-side sheet: the exact source clause behind any fact,
 * reachable from anywhere without losing your place. */
export function ClausePeek() {
  const target = useUi((s) => s.clausePeek);
  const closeClausePeek = useUi((s) => s.closeClausePeek);

  return (
    <Sheet open={!!target} onOpenChange={(open) => !open && closeClausePeek()}>
      <SheetContent side="right" className="flex w-[480px] flex-col gap-0 sm:max-w-[480px]">
        <PeekBody />
      </SheetContent>
    </Sheet>
  );
}
