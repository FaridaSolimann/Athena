"use client";

import { use, useMemo } from "react";
import { useSearchParams, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffectiveContract } from "@/lib/selectors";
import { StatusChip } from "@/components/repository/StatusChip";
import { CreateItemDialog } from "@/components/tasks/CreateItemDialog";
import { AtAGlance } from "@/components/contract/AtAGlance";
import { FactGrid } from "@/components/contract/FactGrid";
import { ObligationsList } from "@/components/contract/ObligationsList";
import { RiskList } from "@/components/contract/RiskList";
import { NeedsReviewBanner } from "@/components/contract/NeedsReviewBanner";
import { DocumentPane } from "@/components/trust/DocumentPane";
import { fmtDate } from "@/lib/format";

export default function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const focusFieldId = searchParams.get("field");
  const effective = useEffectiveContract(id);

  const highlights = useMemo(
    () =>
      effective
        ? effective.contract.fields
            .map((f) => f.source)
            .filter((s): s is NonNullable<typeof s> => !!s)
        : [],
    [effective]
  );

  if (!effective) notFound();
  const { contract, status, fields } = effective;

  const activeRef =
    (focusFieldId && contract.fields.find((f) => f.id === focusFieldId)?.source) || null;

  return (
    <div className="mx-auto w-full max-w-[1360px] px-6 py-5">
      <Link
        href="/"
        className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3" />
        Repository
      </Link>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{contract.title}</h2>
          <p className="mt-0.5 flex items-center gap-2.5 text-[13px] text-muted-foreground">
            <span>{contract.counterparty}</span>
            <span>·</span>
            <span>{contract.type}</span>
            <span>·</span>
            <StatusChip status={status} />
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <p className="text-xs text-muted-foreground">
            Added {fmtDate(contract.ingestedAt)}
          </p>
          <CreateItemDialog
            defaultContractId={contract.id}
            trigger={
              <Button variant="outline" className="h-8 px-3 text-[13px]">
                <Plus className="size-3.5" />
                Task / Alert
              </Button>
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-6">
        <div className="space-y-5">
          <AtAGlance contract={contract} />
          <NeedsReviewBanner contract={contract} fields={fields} />
          <FactGrid contract={contract} />
          <ObligationsList contract={contract} />
          <RiskList contract={contract} />
        </div>
        <div className="relative">
          <div className="sticky top-0 max-h-[calc(100dvh-6.5rem)] overflow-y-auto rounded-lg border bg-card p-4">
            <DocumentPane
              contract={contract}
              highlights={highlights}
              activeRef={activeRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
