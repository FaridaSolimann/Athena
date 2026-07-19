"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ResultCard } from "@/components/explore/ResultCard";
import type { ExploreRow } from "@/lib/explore/engine";

export interface DrillTarget {
  title: string;
  description?: string;
  rows: ExploreRow[];
}

/** Any Insights number opens into the contracts (and cited facts) behind it. */
export function DrillSheet({
  target,
  onClose,
}: {
  target: DrillTarget | null;
  onClose: () => void;
}) {
  return (
    <Sheet open={!!target} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="flex w-[460px] flex-col gap-0 sm:max-w-[460px]">
        <SheetHeader className="border-b pb-3">
          <SheetTitle className="text-[15px]">{target?.title}</SheetTitle>
          {target?.description && (
            <SheetDescription className="text-[12.5px]">{target.description}</SheetDescription>
          )}
        </SheetHeader>
        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
          {target?.rows.map((row, i) => (
            <ResultCard key={`${row.contractId}-${i}`} row={row} />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
