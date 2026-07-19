"use client";

import { useEffect, useState } from "react";
import { useOverlay } from "@/lib/store";

/** Rehydrates the persisted overlay after mount so server and first client
 * render agree, then reveals the app. Prevents localStorage/SSR mismatches. */
export function HydrationGate({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    useOverlay.persist.rehydrate();
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="h-8 w-64 animate-pulse rounded-md bg-muted" />
        <div className="h-48 w-full animate-pulse rounded-md bg-muted" />
      </div>
    );
  }
  return <>{children}</>;
}
