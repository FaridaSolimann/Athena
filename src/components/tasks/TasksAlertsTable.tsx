"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import {
  BellRing,
  SquareCheckBig,
  ChevronRight,
  ArrowUpRight,
  Mail,
  MessageSquare,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WorkItem, WorkItemStatus } from "@/data/types";
import { getContract } from "@/data";
import { useOverlay } from "@/lib/store";
import { AssigneePicker } from "@/components/tasks/AssigneePicker";
import { ApprovalActions } from "@/components/tasks/ApprovalActions";
import { TrustedFact } from "@/components/trust/TrustedFact";
import { fmtDateShort, fmtRelative } from "@/lib/format";
import { daysFromToday } from "@/lib/demo-clock";
import { cn } from "@/lib/utils";

const PRIORITY_STYLE = {
  critical: "bg-trust-low text-white",
  high: "bg-trust-low-bg text-trust-low",
  medium: "bg-trust-medium-bg text-trust-medium",
  low: "bg-muted text-muted-foreground",
} as const;

function DueCell({ item }: { item: WorkItem }) {
  if (!item.dueDate) return <span className="text-muted-foreground">—</span>;
  const days = daysFromToday(item.dueDate);
  const done = item.status === "done" || item.status === "dismissed";
  const overdue = !done && days < 0;
  return (
    <span
      className={cn(
        "text-xs tabular-nums",
        overdue
          ? "font-semibold text-trust-low"
          : days <= 21 && !done
            ? "font-medium text-foreground"
            : "text-muted-foreground"
      )}
    >
      {fmtDateShort(item.dueDate)}
      <span className="ml-1 font-normal text-muted-foreground">
        {overdue ? `· ${-days}d overdue` : `· ${fmtRelative(item.dueDate)}`}
      </span>
    </span>
  );
}

export function TasksAlertsTable({ items }: { items: WorkItem[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const overrideWorkItem = useOverlay((s) => s.overrideWorkItem);

  if (items.length === 0) {
    return (
      <div className="rounded-lg border py-16 text-center text-sm text-muted-foreground">
        Nothing needs attention here.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-8" />
            <TableHead className="w-[36%]">Item</TableHead>
            <TableHead>Due</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const contract = item.contractId ? getContract(item.contractId) : undefined;
            const isOpen = expanded === item.id;
            const awaiting = item.needsApproval && item.approvalStatus === "awaiting";
            return (
              <Fragment key={item.id}>
                <TableRow
                  className={cn("cursor-pointer", isOpen && "bg-accent/40")}
                  onClick={() => setExpanded(isOpen ? null : item.id)}
                >
                  <TableCell className="pl-3 pr-0">
                    <div className="flex items-center gap-1">
                      <ChevronRight
                        className={cn(
                          "size-3.5 text-muted-foreground transition-transform",
                          isOpen && "rotate-90"
                        )}
                      />
                      {item.kind === "alert" ? (
                        <BellRing className="size-3.5 text-trust-medium" />
                      ) : (
                        <SquareCheckBig className="size-3.5 text-primary" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p
                      className={cn(
                        "text-[13.5px] font-medium leading-tight",
                        (item.status === "done" || item.status === "dismissed") &&
                          "text-muted-foreground line-through decoration-muted-foreground/40"
                      )}
                    >
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                      {contract?.title ?? (item.manual ? "No linked contract" : null)}
                      {awaiting && (
                        <span className="ml-2 rounded-full bg-trust-medium-bg px-1.5 py-0.5 text-[10.5px] font-medium text-trust-medium">
                          Awaiting approval
                        </span>
                      )}
                      {item.manual && (
                        <span className="ml-2 rounded-full bg-muted px-1.5 py-0.5 text-[10.5px] font-medium">
                          Manual
                        </span>
                      )}
                      {item.notifyChannels?.includes("slack") && (
                        <span
                          title="Notifies via Slack (preview — connect in Settings)"
                          className="ml-2 inline-flex items-center gap-1 rounded-full bg-accent px-1.5 py-0.5 text-[10.5px] font-medium text-accent-foreground"
                        >
                          <MessageSquare className="size-2.5" />
                          Slack
                        </span>
                      )}
                      {item.notifyChannels?.includes("email") && (
                        <span
                          title="Notifies via Email (preview — connect in Settings)"
                          className="ml-1.5 inline-flex items-center gap-1 rounded-full bg-accent px-1.5 py-0.5 text-[10.5px] font-medium text-accent-foreground"
                        >
                          <Mail className="size-2.5" />
                          Email
                        </span>
                      )}
                    </p>
                  </TableCell>
                  <TableCell><DueCell item={item} /></TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide",
                        PRIORITY_STYLE[item.priority]
                      )}
                    >
                      {item.priority}
                    </span>
                  </TableCell>
                  <TableCell>
                    <AssigneePicker
                      value={item.assignee}
                      onChange={(ref) => overrideWorkItem(item.id, { assignee: ref })}
                    />
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={item.status}
                      onValueChange={(v) =>
                        overrideWorkItem(item.id, { status: v as WorkItemStatus })
                      }
                    >
                      <SelectTrigger size="sm" className="h-7 w-[130px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                        <SelectItem value="dismissed">Dismissed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
                {isOpen && (
                  <TableRow className="bg-accent/20 hover:bg-accent/20">
                    <TableCell />
                    <TableCell colSpan={5} className="py-3">
                      <p className="max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
                        {item.detail}
                      </p>
                      {item.contractId && item.fieldIds && item.fieldIds.length > 0 && (
                        <div className="mt-3 grid max-w-2xl gap-2">
                          {item.fieldIds.map((fid) => (
                            <TrustedFact
                              key={fid}
                              contractId={item.contractId!}
                              fieldId={fid}
                              variant="review"
                              showVerify={awaiting}
                            />
                          ))}
                        </div>
                      )}
                      <div className="mt-3 flex items-center gap-3">
                        <ApprovalActions item={item} />
                        {item.contractId && (
                          <Link
                            href={`/contracts/${item.contractId}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                          >
                            Open contract
                            <ArrowUpRight className="size-3" />
                          </Link>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
