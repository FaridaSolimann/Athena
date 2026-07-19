"use client";

import { toast } from "sonner";
import { HardDrive, MessageSquare, CalendarDays, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOverlay } from "@/lib/store";
import { cn } from "@/lib/utils";

const INTEGRATIONS = [
  {
    id: "gdrive",
    name: "Google Drive",
    icon: HardDrive,
    purpose: "Watch shared folders and pull new contracts in automatically.",
  },
  {
    id: "slack",
    name: "Slack",
    icon: MessageSquare,
    purpose: "Route alerts and approval requests to the right channel.",
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: CalendarDays,
    purpose: "Push renewal and notice deadlines onto owners' calendars.",
  },
  {
    id: "email",
    name: "Email",
    icon: Mail,
    purpose: "Forward signed agreements to a workspace address for ingestion.",
  },
] as const;

export function IntegrationsSection() {
  const integrations = useOverlay((s) => s.integrations);
  const setIntegration = useOverlay((s) => s.setIntegration);

  return (
    <section className="rounded-lg border bg-card p-4">
      <h3 className="text-[13.5px] font-semibold">Integrations</h3>
      <p className="mb-3 text-xs text-muted-foreground">
        Bring contracts in, and push deadlines out.
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        {INTEGRATIONS.map((it) => {
          const connected = integrations[it.id] === "connected";
          return (
            <div key={it.id} className="flex items-start justify-between gap-3 rounded-md border p-3">
              <div className="flex min-w-0 items-start gap-2.5">
                <it.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="flex items-center gap-2 text-[13px] font-medium">
                    {it.name}
                    {connected && (
                      <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-trust-high">
                        <span className="size-1.5 rounded-full bg-trust-high" />
                        Connected
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted-foreground">
                    {it.purpose}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className={cn("h-7 shrink-0 px-2.5 text-xs", connected && "text-muted-foreground")}
                onClick={() => {
                  setIntegration(it.id, connected ? "disconnected" : "connected");
                  toast(connected ? `${it.name} disconnected` : `${it.name} connected`, {
                    description: connected ? undefined : it.purpose,
                  });
                }}
              >
                {connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
