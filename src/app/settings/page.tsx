"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TeamsSection } from "@/components/settings/TeamsSection";
import { IntegrationsSection } from "@/components/settings/IntegrationsSection";
import { USERS, CURRENT_USER_ID, WORKSPACE } from "@/data";
import { useOverlay, resetWorkspaceAndReload } from "@/lib/store";

export default function SettingsPage() {
  const me = USERS.find((u) => u.id === CURRENT_USER_ID)!;
  const profileName = useOverlay((s) => s.profileName);
  const setProfileName = useOverlay((s) => s.setProfileName);
  const [resetOpen, setResetOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 px-6 py-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Settings</h2>
        <p className="text-[13px] text-muted-foreground">
          {WORKSPACE.legalName} workspace
        </p>
      </div>

      <section className="rounded-lg border bg-card p-4">
        <h3 className="mb-3 text-[13.5px] font-semibold">Profile</h3>
        <div className="flex items-center gap-4">
          <Avatar className="size-11">
            <AvatarFallback className="bg-accent text-sm font-semibold">
              {me.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1.5">
            <Label className="text-xs">Display name</Label>
            <Input
              value={profileName ?? me.name}
              onChange={(e) => setProfileName(e.target.value)}
              className="h-8 max-w-xs text-[13px]"
            />
            <p className="text-[11.5px] text-muted-foreground">
              {me.role} · {me.email}
            </p>
          </div>
        </div>
      </section>

      <TeamsSection />
      <IntegrationsSection />

      <section className="rounded-lg border bg-card p-4">
        <h3 className="text-[13.5px] font-semibold">Workspace data</h3>
        <p className="mb-3 text-xs text-muted-foreground">
          Verifications, assignments, uploads, and teams are stored in this browser.
        </p>
        <Dialog open={resetOpen} onOpenChange={setResetOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-8 px-3 text-xs">
              <RotateCcw className="size-3.5" />
              Reset workspace
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Reset workspace?</DialogTitle>
              <DialogDescription>
                Restores Athena to its initial state — verifications, corrections,
                assignments, uploads, custom teams, and integration connections will
                be cleared.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" className="h-8 text-xs" onClick={() => setResetOpen(false)}>
                Cancel
              </Button>
              <Button
                className="h-8 text-xs"
                onClick={() => {
                  toast("Workspace reset");
                  resetWorkspaceAndReload();
                }}
              >
                Reset
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
