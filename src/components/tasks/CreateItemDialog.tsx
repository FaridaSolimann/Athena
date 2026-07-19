"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AssigneeRef, Priority } from "@/data/types";
import { useOverlay } from "@/lib/store";
import { AssigneePicker } from "@/components/tasks/AssigneePicker";
import { ContractCombobox } from "@/components/tasks/ContractCombobox";
import { TODAY_ISO, addDays } from "@/lib/demo-clock";
import { cn } from "@/lib/utils";

type Tab = "task" | "alert";
type Channel = "slack" | "email";

/** One modal, two tabs — manual tasks and alerts share the same surface and
 * land in the same combined list. Shared fields survive tab switches. */
export function CreateItemDialog({
  defaultTab = "task",
  defaultContractId,
  trigger,
}: {
  defaultTab?: Tab;
  defaultContractId?: string;
  trigger: React.ReactNode;
}) {
  const addManualItem = useOverlay((s) => s.addManualItem);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>(defaultTab);
  // shared across tabs — switching never loses these
  const [title, setTitle] = useState("");
  const [contractId, setContractId] = useState<string | undefined>(defaultContractId);
  const [assignee, setAssignee] = useState<AssigneeRef | undefined>();
  const [priority, setPriority] = useState<Priority>("medium");
  // per-kind fields
  const [dueDate, setDueDate] = useState("");
  const [triggerDate, setTriggerDate] = useState(addDays(TODAY_ISO, 14));
  const [notes, setNotes] = useState("");
  const [channels, setChannels] = useState<Channel[]>([]);

  const canCreate = !!title.trim() && (tab === "task" || !!triggerDate);

  const reset = () => {
    setTab(defaultTab);
    setTitle("");
    setContractId(defaultContractId);
    setAssignee(undefined);
    setPriority("medium");
    setDueDate("");
    setTriggerDate(addDays(TODAY_ISO, 14));
    setNotes("");
    setChannels([]);
  };

  const create = () => {
    if (!canCreate) return;
    addManualItem({
      id: `manual:${Date.now()}`,
      kind: tab,
      contractId,
      title: title.trim(),
      detail: notes.trim() || "Created manually.",
      dueDate: tab === "alert" ? triggerDate : dueDate || undefined,
      priority,
      status: "open",
      assignee,
      needsApproval: false,
      manual: true,
      notes: notes.trim() || undefined,
      notifyChannels: tab === "alert" && channels.length ? channels : undefined,
    });
    toast.success(tab === "task" ? "Task created" : "Alert created");
    setOpen(false);
    reset();
  };

  const toggleChannel = (c: Channel) =>
    setChannels((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) reset();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create {tab}</DialogTitle>
          <DialogDescription>
            Lands in Tasks & Alerts alongside the auto-generated items.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
          <TabsList className="w-full">
            <TabsTrigger value="task" className="flex-1">Task</TabsTrigger>
            <TabsTrigger value="alert" className="flex-1">Alert</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="min-w-0 space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                tab === "task"
                  ? "e.g. Draft Harkline amendment terms"
                  : "e.g. Chase countersigned amendment"
              }
              className="h-8 text-[13px]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">
              Related contract <span className="text-muted-foreground">(optional)</span>
            </Label>
            <ContractCombobox value={contractId} onChange={setContractId} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">
                {tab === "task" ? (
                  <>Due date <span className="text-muted-foreground">(optional)</span></>
                ) : (
                  "Trigger date"
                )}
              </Label>
              <Input
                type="date"
                value={tab === "task" ? dueDate : triggerDate}
                onChange={(e) =>
                  tab === "task" ? setDueDate(e.target.value) : setTriggerDate(e.target.value)
                }
                className="h-8 text-[13px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger size="sm" className="w-full text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Assignee</Label>
            <div>
              <AssigneePicker value={assignee} onChange={setAssignee} />
            </div>
          </div>

          {tab === "task" && (
            <div className="space-y-1.5">
              <Label className="text-xs">
                Notes <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything the assignee should know"
                className="min-h-16 resize-none text-[13px]"
              />
            </div>
          )}

          {tab === "alert" && (
            <div className="space-y-1.5">
              <Label className="text-xs">
                Notify via <span className="text-muted-foreground">(optional)</span>
              </Label>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => toggleChannel("slack")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors",
                    channels.includes("slack")
                      ? "border-primary bg-accent text-foreground"
                      : "text-muted-foreground hover:border-input"
                  )}
                >
                  <MessageSquare className="size-3.5" />
                  Slack
                </button>
                <button
                  type="button"
                  onClick={() => toggleChannel("email")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors",
                    channels.includes("email")
                      ? "border-primary bg-accent text-foreground"
                      : "text-muted-foreground hover:border-input"
                  )}
                >
                  <Mail className="size-3.5" />
                  Email
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Preview — connect Slack or Email in{" "}
                <Link
                  href="/settings"
                  className="underline underline-offset-2 hover:text-foreground"
                  onClick={() => setOpen(false)}
                >
                  Settings › Integrations
                </Link>{" "}
                to enable delivery.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" className="h-8 text-[13px]" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="h-8 text-[13px]" disabled={!canCreate} onClick={create}>
            {tab === "task" ? "Create task" : "Create alert"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
