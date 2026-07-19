"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, BellRing, Sparkles } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useEffectiveContracts, useWorkItems } from "@/lib/selectors";

/** Header search: jump to any contract or task, or hand the query to Explore. */
export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const contracts = useEffectiveContracts();
  const items = useWorkItems();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const go = (path: string) => {
    setOpen(false);
    setQuery("");
    router.push(path);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-8 w-full max-w-md items-center gap-2 rounded-md border bg-background px-3 text-[13px] text-muted-foreground transition-colors hover:border-input"
      >
        <Search className="size-3.5" />
        Search contracts, counterparties, tasks…
        <kbd className="ml-auto rounded border bg-muted px-1.5 text-[10px] font-medium">⌘K</kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput
            placeholder="Search, or ask a question…"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
          <CommandEmpty>No matches — try asking in Explore below.</CommandEmpty>
          <CommandGroup heading="Contracts">
            {contracts.map(({ contract }) => (
              <CommandItem
                key={contract.id}
                value={`${contract.title} ${contract.counterparty} ${contract.type}`}
                onSelect={() => go(`/contracts/${contract.id}`)}
              >
                <FileText className="size-3.5 text-muted-foreground" />
                <span className="truncate">{contract.title}</span>
                <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                  {contract.counterparty}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Tasks & alerts">
            {items.slice(0, 8).map((item) => (
              <CommandItem
                key={item.id}
                value={item.title}
                onSelect={() => go("/tasks")}
              >
                <BellRing className="size-3.5 text-muted-foreground" />
                <span className="truncate">{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Ask Athena">
            <CommandItem
              value={`ask-${query || "anything"}`}
              forceMount
              onSelect={() => go(`/explore${query ? `?q=${encodeURIComponent(query)}` : ""}`)}
            >
              <Sparkles className="size-3.5 text-primary" />
              {query ? (
                <span className="truncate">
                  Ask: <span className="font-medium">“{query}”</span>
                </span>
              ) : (
                "Open Explore"
              )}
            </CommandItem>
          </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
