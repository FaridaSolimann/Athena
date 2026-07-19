"use client";

import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkItems } from "@/lib/selectors";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TasksAlertsTable } from "@/components/tasks/TasksAlertsTable";
import { CreateItemDialog } from "@/components/tasks/CreateItemDialog";
import { useTeams } from "@/lib/teams";
import { USERS } from "@/data";
import { daysFromToday } from "@/lib/demo-clock";

export default function TasksPage() {
  const items = useWorkItems();
  const teams = useTeams();
  const [kind, setKind] = useState<"all" | "alert" | "task" | "approvals">("all");
  const [status, setStatus] = useState<"all" | "open" | "done">("all");
  const [priority, setPriority] = useState<"all" | "critical" | "high" | "medium" | "low">("all");
  const [assignee, setAssignee] = useState<string>("all");
  const [due, setDue] = useState<"all" | "overdue" | "30" | "90">("all");

  const filtered = useMemo(
    () =>
      items.filter((i) => {
        if (kind === "approvals") {
          if (!(i.needsApproval && i.approvalStatus === "awaiting")) return false;
        } else if (kind !== "all" && i.kind !== kind) return false;
        if (status === "open" && !(i.status === "open" || i.status === "in_progress"))
          return false;
        if (status === "done" && !(i.status === "done" || i.status === "dismissed"))
          return false;
        if (priority !== "all" && i.priority !== priority) return false;
        if (assignee !== "all") {
          if (!i.assignee) return false;
          if (`${i.assignee.kind}:${i.assignee.id}` !== assignee) return false;
        }
        if (due !== "all") {
          if (!i.dueDate) return false;
          const days = daysFromToday(i.dueDate);
          if (due === "overdue" && (days >= 0 || i.status === "done")) return false;
          if (due === "30" && (days < 0 || days > 30)) return false;
          if (due === "90" && (days < 0 || days > 90)) return false;
        }
        return true;
      }),
    [items, kind, status, priority, assignee, due]
  );

  const openCount = items.filter(
    (i) => i.status === "open" || i.status === "in_progress"
  ).length;
  const awaitingCount = items.filter(
    (i) => i.needsApproval && i.approvalStatus === "awaiting"
  ).length;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-6">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Tasks & Alerts</h2>
          <p className="text-[13px] text-muted-foreground">
            {openCount} open · {awaitingCount} awaiting approval — generated from the
            contracts themselves.
          </p>
        </div>
        <CreateItemDialog
          trigger={
            <Button className="h-8 px-3 text-[13px]">
              <Plus className="size-3.5" />
              Create
            </Button>
          }
        />
      </div>

      <div className="mb-3 flex items-center gap-2">
        <Select value={kind} onValueChange={(v) => setKind(v as typeof kind)}>
          <SelectTrigger size="sm" className="w-[150px] text-[13px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alerts & tasks</SelectItem>
            <SelectItem value="alert">Alerts</SelectItem>
            <SelectItem value="task">Tasks</SelectItem>
            <SelectItem value="approvals">Awaiting approval</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger size="sm" className="w-[120px] text-[13px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
          <SelectTrigger size="sm" className="w-[130px] text-[13px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any priority</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={assignee} onValueChange={setAssignee}>
          <SelectTrigger size="sm" className="w-[160px] text-[13px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Anyone</SelectItem>
            {USERS.map((u) => (
              <SelectItem key={u.id} value={`user:${u.id}`}>{u.name}</SelectItem>
            ))}
            {teams.map((t) => (
              <SelectItem key={t.id} value={`team:${t.id}`}>{t.name} (team)</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={due} onValueChange={(v) => setDue(v as typeof due)}>
          <SelectTrigger size="sm" className="w-[140px] text-[13px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any due date</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="30">Next 30 days</SelectItem>
            <SelectItem value="90">Next 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <TasksAlertsTable items={filtered} />
    </div>
  );
}
