"use client";

import { Users, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AssigneeRef } from "@/data/types";
import { USERS } from "@/data";
import { useTeams } from "@/lib/teams";

export function assigneeName(
  ref: AssigneeRef | undefined,
  teams: { id: string; name: string }[]
): string {
  if (!ref) return "Unassigned";
  if (ref.kind === "user") return USERS.find((u) => u.id === ref.id)?.name ?? "Unknown";
  return teams.find((t) => t.id === ref.id)?.name ?? "Unknown team";
}

/** Person-or-team assignment, used inline in tables and dialogs. */
export function AssigneePicker({
  value,
  onChange,
}: {
  value?: AssigneeRef;
  onChange: (ref: AssigneeRef) => void;
}) {
  const teams = useTeams();
  const label = assigneeName(value, teams);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onClick={(e) => e.stopPropagation()}
        className="inline-flex h-7 max-w-[170px] items-center gap-1.5 rounded-md border bg-background px-2 text-xs font-medium text-foreground transition-colors hover:border-input"
      >
        {value?.kind === "team" && <Users className="size-3 text-muted-foreground" />}
        <span className="truncate">{label}</span>
        <ChevronDown className="size-3 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="max-h-80 w-64 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuLabel className="text-[11px]">People</DropdownMenuLabel>
        {USERS.map((u) => (
          <DropdownMenuItem
            key={u.id}
            className="gap-2.5"
            onClick={() => onChange({ kind: "user", id: u.id })}
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-[9px] font-semibold">
              {u.initials}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-medium">{u.name}</span>
              <span className="block truncate text-[10.5px] text-muted-foreground">
                {u.role}
              </span>
            </span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[11px]">Teams</DropdownMenuLabel>
        {teams.map((t) => (
          <DropdownMenuItem
            key={t.id}
            className="gap-2.5"
            onClick={() => onChange({ kind: "team", id: t.id })}
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted">
              <Users className="size-3 text-muted-foreground" />
            </span>
            <span className="text-xs font-medium">{t.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
