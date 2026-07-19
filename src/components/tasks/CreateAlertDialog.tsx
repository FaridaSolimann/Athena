"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AssigneeRef, Priority } from "@/data/types";
import { SEED_CONTRACTS, UPLOAD_QUEUE } from "@/data";
import { useOverlay } from "@/lib/store";
import { AssigneePicker } from "@/components/tasks/AssigneePicker";
import { TODAY_ISO, addDays } from "@/lib/demo-clock";

export function CreateAlertDialog() {
  const addManualItem = useOverlay((s) => s.addManualItem);
  const uploadedIds = useOverlay((s) => s.uploadedContractIds);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [contractId, setContractId] = useState<string>("");
  const [dueDate, setDueDate] = useState(addDays(TODAY_ISO, 14));
  const [priority, setPriority] = useState<Priority>("medium");
  const [assignee, setAssignee] = useState<AssigneeRef | undefined>();

  const contracts = [
    ...SEED_CONTRACTS,
    ...UPLOAD_QUEUE.filter((c) => uploadedIds.includes(c.id)),
  ];

  const create = () => {
    if (!title.trim() || !contractId) {
      toast.error("Give the alert a title and a related contract.");
      return;
    }
    addManualItem({
      id: `manual:${Date.now()}`,
      kind: "alert",
      contractId,
      title: title.trim(),
      detail: "Created manually.",
      dueDate,
      priority,
      status: "open",
      assignee,
      needsApproval: false,
      manual: true,
    });
    toast.success("Alert created");
    setOpen(false);
    setTitle("");
    setContractId("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-8 px-3 text-[13px]">
          <Plus className="size-3.5" />
          New alert
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create alert</DialogTitle>
          <DialogDescription>
            A dated reminder tied to a contract, alongside the auto-generated ones.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chase countersigned amendment"
              className="h-8 text-[13px]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Related contract</Label>
            <Select value={contractId} onValueChange={setContractId}>
              <SelectTrigger size="sm" className="w-full text-[13px]">
                <SelectValue placeholder="Choose a contract" />
              </SelectTrigger>
              <SelectContent>
                {contracts.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title} — {c.counterparty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Trigger date</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
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
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
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
        </div>
        <DialogFooter>
          <Button variant="outline" className="h-8 text-[13px]" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="h-8 text-[13px]" onClick={create}>
            Create alert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
