"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PortfolioTab } from "@/components/insights/PortfolioTab";
import { ExposureTab } from "@/components/insights/ExposureTab";
import { LifecycleTab } from "@/components/insights/LifecycleTab";
import { ObligationsTimeline } from "@/components/timeline/ObligationsTimeline";
import { DrillSheet, type DrillTarget } from "@/components/insights/DrillSheet";
import type { InsightsInput } from "@/lib/derive/insights";
import { useEffectiveContracts } from "@/lib/selectors";
import { useOverlay } from "@/lib/store";

const TABS = ["timeline", "overview", "exposure", "lifecycle"] as const;
type Tab = (typeof TABS)[number];

function InsightsInner() {
  const params = useSearchParams();
  // Tab switching is purely client-side (deep links still work via ?tab=);
  // routing through the server for a view toggle would stall if it's slow.
  const [tab, setTab] = useState<Tab>(() =>
    (TABS as readonly string[]).includes(params.get("tab") ?? "")
      ? (params.get("tab") as Tab)
      : "timeline"
  );

  const effective = useEffectiveContracts();
  const verifications = useOverlay((s) => s.fieldVerifications);
  const [drill, setDrill] = useState<DrillTarget | null>(null);

  const input: InsightsInput = useMemo(
    () => ({ contracts: effective.map((e) => e.contract), verifications }),
    [effective, verifications]
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight">Insights</h2>
        <p className="text-[13px] text-muted-foreground">
          What the portfolio has committed to — every number opens into the contracts
          and clauses behind it.
        </p>
      </div>

      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v as Tab);
          // keep the URL shareable without a server round-trip
          window.history.replaceState(null, "", `/insights?tab=${v}`);
        }}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="timeline">Obligations Timeline</TabsTrigger>
          <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
          <TabsTrigger value="exposure">Financial Exposure</TabsTrigger>
          <TabsTrigger value="lifecycle">Lifecycle & Obligations</TabsTrigger>
        </TabsList>
        <TabsContent value="timeline">
          <ObligationsTimeline input={input} />
        </TabsContent>
        <TabsContent value="overview">
          <PortfolioTab input={input} onDrill={setDrill} />
        </TabsContent>
        <TabsContent value="exposure">
          <ExposureTab input={input} onDrill={setDrill} />
        </TabsContent>
        <TabsContent value="lifecycle">
          <LifecycleTab input={input} onDrill={setDrill} />
        </TabsContent>
      </Tabs>

      <DrillSheet target={drill} onClose={() => setDrill(null)} />
    </div>
  );
}

export default function InsightsPage() {
  return (
    <Suspense>
      <InsightsInner />
    </Suspense>
  );
}
