"use client";

import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GlobalSearch } from "@/components/shell/GlobalSearch";

const TITLES: Array<[prefix: string, title: string]> = [
  ["/insights", "Insights"],
  ["/tasks", "Tasks & Alerts"],
  ["/explore", "Explore"],
  ["/settings", "Settings"],
  ["/contracts", "Repository"],
  ["/", "Repository"],
];

export function TopBar() {
  const pathname = usePathname();
  const title =
    TITLES.find(([p]) => (p === "/" ? pathname === "/" : pathname.startsWith(p)))?.[1] ??
    "Athena";

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-header px-6">
      <h1 className="min-w-32 text-[15px] font-semibold tracking-tight">{title}</h1>
      <div className="flex flex-1 justify-center">
        <GlobalSearch />
      </div>
      <div className="flex min-w-32 items-center justify-end gap-3">
        <Avatar className="size-7">
          <AvatarFallback className="bg-accent text-[11px] font-semibold text-accent-foreground">
            PR
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
