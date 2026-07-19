"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderOpen,
  ChartNoAxesColumn,
  BellRing,
  Telescope,
  Settings,
  Landmark,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Repository", icon: FolderOpen },
  { href: "/insights", label: "Insights", icon: ChartNoAxesColumn },
  { href: "/explore", label: "Explore", icon: Telescope },
  { href: "/tasks", label: "Tasks & Alerts", icon: BellRing },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[220px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <Link
        href="/"
        className="flex h-14 items-center gap-2.5 px-5 transition-opacity hover:opacity-80"
      >
        <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Landmark className="size-4" strokeWidth={2.2} />
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          Athena
        </span>
      </Link>
      <nav className="mt-2 flex flex-1 flex-col gap-0.5 px-3">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/" || pathname.startsWith("/contracts")
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13.5px] font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
                active && "bg-sidebar-accent text-foreground"
              )}
            >
              {active && (
                <span className="absolute -left-3 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-foreground" />
              )}
              <Icon className="size-4" strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border px-5 py-3.5">
        <p className="text-xs font-medium text-foreground">Vantora Labs</p>
        <p className="text-[11px] text-muted-foreground">Contract workspace</p>
      </div>
    </aside>
  );
}
