"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Users, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { USERS, TEAMS } from "@/data";
import { useOverlay } from "@/lib/store";
import { useTeams } from "@/lib/teams";

export function TeamsSection() {
  const teams = useTeams();
  const addTeam = useOverlay((s) => s.addTeam);
  const setTeamMembers = useOverlay((s) => s.setTeamMembers);
  const removeTeam = useOverlay((s) => s.removeTeam);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [memberIds, setMemberIds] = useState<string[]>([]);

  const create = () => {
    if (!name.trim()) {
      toast.error("Give the team a name.");
      return;
    }
    addTeam({ id: `team-${Date.now()}`, name: name.trim(), memberIds });
    toast.success(`Team “${name.trim()}” created`);
    setOpen(false);
    setName("");
    setMemberIds([]);
  };

  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-[13.5px] font-semibold">Teams</h3>
          <p className="text-xs text-muted-foreground">
            Tasks and alerts can be assigned to a whole team.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-8 px-3 text-xs">
              <Plus className="size-3.5" />
              New team
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Create team</DialogTitle>
              <DialogDescription>Name it and pick its members.</DialogDescription>
            </DialogHeader>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vendor Management"
              className="h-8 text-[13px]"
            />
            <div className="space-y-1.5">
              {USERS.map((u) => (
                <label key={u.id} className="flex cursor-pointer items-center gap-2 text-[13px]">
                  <input
                    type="checkbox"
                    checked={memberIds.includes(u.id)}
                    onChange={(e) =>
                      setMemberIds((ids) =>
                        e.target.checked ? [...ids, u.id] : ids.filter((x) => x !== u.id)
                      )
                    }
                  />
                  {u.name}
                  <span className="text-xs text-muted-foreground">{u.role}</span>
                </label>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" className="h-8 text-xs" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button className="h-8 text-xs" onClick={create}>
                Create team
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {teams.map((t) => {
          const seeded = TEAMS.some((s) => s.id === t.id);
          return (
            <div key={t.id} className="flex items-center justify-between rounded-md border px-3 py-2.5">
              <div className="flex items-center gap-2.5">
                <Users className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-[13px] font-medium">{t.name}</p>
                  <p className="text-[11.5px] text-muted-foreground">
                    {t.memberIds.length === 0
                      ? "No members yet"
                      : USERS.filter((u) => t.memberIds.includes(u.id))
                          .map((u) => u.name.split(" ")[0])
                          .join(", ")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-7 px-2.5 text-xs">
                      Members
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {USERS.map((u) => (
                      <DropdownMenuCheckboxItem
                        key={u.id}
                        className="text-xs"
                        checked={t.memberIds.includes(u.id)}
                        onCheckedChange={(checked) =>
                          setTeamMembers(
                            t.id,
                            checked
                              ? [...t.memberIds, u.id]
                              : t.memberIds.filter((x) => x !== u.id)
                          )
                        }
                      >
                        {u.name}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {!seeded && (
                  <Button
                    variant="ghost"
                    className="h-7 px-2 text-muted-foreground hover:text-trust-low"
                    onClick={() => {
                      removeTeam(t.id);
                      toast(`Team “${t.name}” removed`);
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
