"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ExploreRow } from "@/lib/explore/engine";
import { getContract } from "@/data";
import { StatusChip } from "@/components/repository/StatusChip";
import { TrustedFact } from "@/components/trust/TrustedFact";
import { effectiveStatus } from "@/lib/selectors";
import { useOverlay } from "@/lib/store";

/** One contract in an Explore answer: identity + the cited facts behind it. */
export function ResultCard({ row }: { row: ExploreRow }) {
  const verifications = useOverlay((s) => s.fieldVerifications);
  const contract = getContract(row.contractId);
  if (!contract) return null;

  return (
    <div className="rounded-lg border bg-card p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/contracts/${contract.id}`}
            className="text-[13.5px] font-medium leading-tight hover:text-primary hover:underline"
          >
            {contract.title}
          </Link>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {contract.counterparty} · {contract.type}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <StatusChip status={effectiveStatus(contract, verifications)} />
          <Link
            href={`/contracts/${contract.id}`}
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
      {row.note && (
        <p className="mt-1.5 text-xs font-medium text-trust-medium">{row.note}</p>
      )}
      {row.fieldIds.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t pt-2">
          {row.fieldIds.slice(0, 4).map((fid) => (
            <TrustedFact key={fid} contractId={contract.id} fieldId={fid} variant="chip" />
          ))}
        </div>
      )}
    </div>
  );
}
