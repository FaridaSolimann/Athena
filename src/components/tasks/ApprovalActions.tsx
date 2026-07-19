"use client";

import Link from "next/link";
import { toast } from "sonner";
import { BadgeCheck, PencilLine, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WorkItem } from "@/data/types";
import { CURRENT_USER_ID, getContract } from "@/data";
import { useOverlay } from "@/lib/store";

/** Approve / edit-then-approve / reject for items awaiting approval.
 * Approving IS verifying: the same store write powers both surfaces. */
export function ApprovalActions({ item }: { item: WorkItem }) {
  const verifyField = useOverlay((s) => s.verifyField);
  const verifications = useOverlay((s) => s.fieldVerifications);
  const overrideWorkItem = useOverlay((s) => s.overrideWorkItem);

  if (!item.needsApproval || item.approvalStatus !== "awaiting") return null;
  const contract = getContract(item.contractId);
  const pending = (item.fieldIds ?? []).filter(
    (id) =>
      verifications[id]?.status !== "confirmed" &&
      verifications[id]?.status !== "corrected"
  );

  const approveAll = () => {
    pending.forEach((fieldId) =>
      verifyField(fieldId, { status: "confirmed", by: CURRENT_USER_ID })
    );
    toast.success("Extraction approved", {
      description: `${pending.length} ${pending.length === 1 ? "term" : "terms"} on ${contract?.title ?? "the contract"} confirmed as extracted.`,
    });
  };

  const reject = () => {
    pending.forEach((fieldId) =>
      verifyField(fieldId, { status: "rejected", by: CURRENT_USER_ID })
    );
    overrideWorkItem(item.id, { approvalStatus: "rejected" });
    toast(`Extraction rejected`, {
      description: "Flagged terms stay unverified until corrected values are entered.",
    });
  };

  return (
    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
      <Button variant="outline" className="h-7 px-2.5 text-xs" onClick={approveAll}>
        <BadgeCheck className="size-3 text-trust-verified" />
        Approve
      </Button>
      <Button asChild variant="outline" className="h-7 px-2.5 text-xs">
        <Link href={`/contracts/${item.contractId}`}>
          <PencilLine className="size-3" />
          Review & edit
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="h-7 px-2 text-xs text-muted-foreground hover:text-trust-low"
        onClick={reject}
      >
        <X className="size-3" />
        Reject
      </Button>
    </div>
  );
}
