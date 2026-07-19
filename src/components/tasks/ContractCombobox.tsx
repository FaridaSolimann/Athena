"use client";

import { useState } from "react";
import { Check, ChevronDown, FileText, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffectiveContracts } from "@/lib/selectors";
import { cn } from "@/lib/utils";

/** Searchable, optional contract picker for manual tasks and alerts. */
export function ContractCombobox({
  value,
  onChange,
}: {
  value?: string;
  onChange: (contractId: string | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const contracts = useEffectiveContracts();
  const selected = contracts.find((c) => c.contract.id === value)?.contract;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="flex h-8 w-full min-w-0 items-center gap-1.5 rounded-md border bg-background px-2.5 text-[13px] transition-colors hover:border-input"
      >
        <FileText className="size-3.5 shrink-0 text-muted-foreground" />
        <span className={cn("min-w-0 flex-1 truncate text-left", !selected && "text-muted-foreground")}>
          {selected ? `${selected.title} — ${selected.counterparty}` : "None — search contracts…"}
        </span>
        {selected ? (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onChange(undefined);
            }}
            className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground"
          >
            <X className="size-3" />
          </span>
        ) : (
          <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
        )}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[360px] p-0">
        <Command>
          <CommandInput placeholder="Search by name or counterparty…" />
          <CommandList className="max-h-56">
            <CommandEmpty>No contracts match.</CommandEmpty>
            <CommandGroup>
              {contracts.map(({ contract }) => (
                <CommandItem
                  key={contract.id}
                  value={`${contract.title} ${contract.counterparty}`}
                  className="text-xs"
                  onSelect={() => {
                    onChange(contract.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "size-3.5",
                      contract.id === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="min-w-0 flex-1 truncate">{contract.title}</span>
                  <span className="shrink-0 text-[10.5px] text-muted-foreground">
                    {contract.counterparty.split(",")[0]}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
