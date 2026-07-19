"use client";

import { useMemo, useState } from "react";
import { useEffectiveContracts } from "@/lib/selectors";
import {
  FiltersBar,
  DEFAULT_FILTERS,
  type RepositoryFilters,
} from "@/components/repository/FiltersBar";
import { ContractsTable } from "@/components/repository/ContractsTable";
import { UploadDropzone } from "@/components/repository/UploadDropzone";
import { daysFromToday } from "@/lib/demo-clock";

export default function RepositoryPage() {
  const contracts = useEffectiveContracts();
  const [filters, setFilters] = useState<RepositoryFilters>(DEFAULT_FILTERS);

  const rows = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return contracts.filter((r) => {
      if (q && !`${r.contract.title} ${r.contract.counterparty}`.toLowerCase().includes(q))
        return false;
      if (filters.type !== "all" && r.contract.type !== filters.type) return false;
      if (filters.status !== "all" && r.status !== filters.status) return false;
      if (filters.renewal !== "all") {
        const f = r.contract.fields.find((x) => x.key === "renewal_date");
        const iso = f?.value.kind === "date" ? f.value.iso : null;
        if (!iso) return false;
        const days = daysFromToday(iso);
        if (days < 0 || days > Number(filters.renewal)) return false;
      }
      return true;
    });
  }, [contracts, filters]);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-6">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Contracts</h2>
          <p className="text-[13px] text-muted-foreground">
            {contracts.length} agreements · every extracted term traceable to its source
          </p>
        </div>
      </div>
      <div className="mb-4">
        <UploadDropzone />
      </div>
      <div className="mb-3">
        <FiltersBar filters={filters} onChange={setFilters} />
      </div>
      <ContractsTable rows={rows} />
    </div>
  );
}
