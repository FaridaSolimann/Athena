"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusChip } from "@/components/repository/StatusChip";
import type { EffectiveContract } from "@/lib/selectors";
import { fmtDate, fmtMoneyFull, fmtDateShort, fmtRelative } from "@/lib/format";
import { daysFromToday } from "@/lib/demo-clock";
import { cn } from "@/lib/utils";

function RenewalCell({ c }: { c: EffectiveContract }) {
  const contract = c.contract;
  if (!contract.autoRenew) {
    if (!contract.expirationDate) return <span className="text-muted-foreground">—</span>;
    const days = daysFromToday(contract.expirationDate);
    if (days < 0) return <span className="text-muted-foreground">Ended {fmtDateShort(contract.expirationDate)}</span>;
    return (
      <span className="text-muted-foreground">
        Expires {fmtDateShort(contract.expirationDate)}
      </span>
    );
  }
  const deadlineField = contract.fields.find((f) => f.key === "notice_deadline");
  const iso = deadlineField?.value.kind === "date" ? deadlineField.value.iso : null;
  if (!iso) return <span className="text-trust-medium">Auto-renews · window unknown</span>;
  const days = daysFromToday(iso);
  return (
    <span
      className={cn(
        "font-medium",
        days <= 21 ? "text-trust-low" : days <= 90 ? "text-trust-medium" : "text-muted-foreground"
      )}
    >
      Notice by {fmtDateShort(iso)} · {fmtRelative(iso)}
    </span>
  );
}

export function ContractsTable({ rows }: { rows: EffectiveContract[] }) {
  const router = useRouter();

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border py-16 text-center text-sm text-muted-foreground">
        No contracts match these filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-[30%]">Contract</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead>Renewal</TableHead>
            <TableHead>Added</TableHead>
            <TableHead className="text-right">Review</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow
              key={r.contract.id}
              onClick={() => router.push(`/contracts/${r.contract.id}`)}
              className="cursor-pointer"
            >
              <TableCell>
                <p className="text-[13.5px] font-medium leading-tight">{r.contract.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{r.contract.counterparty}</p>
              </TableCell>
              <TableCell className="text-[13px] text-muted-foreground">{r.contract.type}</TableCell>
              <TableCell><StatusChip status={r.status} /></TableCell>
              <TableCell className="text-right text-[13px] tabular-nums">
                {r.contract.valueUsd > 0 ? fmtMoneyFull(r.contract.valueUsd) : "—"}
              </TableCell>
              <TableCell className="text-[12.5px]"><RenewalCell c={r} /></TableCell>
              <TableCell className="text-[12.5px] tabular-nums text-muted-foreground">
                {fmtDate(r.contract.ingestedAt)}
              </TableCell>
              <TableCell className="text-right">
                {r.openReviewCount > 0 && (
                  <Badge
                    variant="outline"
                    className="border-trust-medium/40 bg-trust-medium-bg text-[11px] font-medium text-trust-medium"
                  >
                    {r.openReviewCount} to review
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
