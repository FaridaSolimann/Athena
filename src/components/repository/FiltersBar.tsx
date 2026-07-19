"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ContractType } from "@/data/types";

export interface RepositoryFilters {
  query: string;
  type: ContractType | "all";
  status: "all" | "active" | "needs_review" | "expired";
  renewal: "all" | "30" | "90" | "180";
}

export const DEFAULT_FILTERS: RepositoryFilters = {
  query: "",
  type: "all",
  status: "all",
  renewal: "all",
};

const TYPES: (ContractType | "all")[] = [
  "all", "SaaS", "MSA", "SOW", "NDA", "Vendor", "Employment", "Lease", "Partnership",
];

export function FiltersBar({
  filters,
  onChange,
}: {
  filters: RepositoryFilters;
  onChange: (f: RepositoryFilters) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-64">
        <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          placeholder="Filter by name or counterparty"
          className="h-8 pl-8 text-[13px]"
        />
      </div>
      <Select
        value={filters.type}
        onValueChange={(v) => onChange({ ...filters, type: v as RepositoryFilters["type"] })}
      >
        <SelectTrigger size="sm" className="w-[130px] text-[13px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TYPES.map((t) => (
            <SelectItem key={t} value={t}>
              {t === "all" ? "All types" : t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.status}
        onValueChange={(v) => onChange({ ...filters, status: v as RepositoryFilters["status"] })}
      >
        <SelectTrigger size="sm" className="w-[140px] text-[13px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="needs_review">Needs review</SelectItem>
          <SelectItem value="expired">Expired</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={filters.renewal}
        onValueChange={(v) => onChange({ ...filters, renewal: v as RepositoryFilters["renewal"] })}
      >
        <SelectTrigger size="sm" className="w-[170px] text-[13px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any renewal window</SelectItem>
          <SelectItem value="30">Renews within 30 days</SelectItem>
          <SelectItem value="90">Renews within 90 days</SelectItem>
          <SelectItem value="180">Renews within 180 days</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
