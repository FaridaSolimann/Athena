"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { CloudUpload, FileText, LoaderCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useOverlay } from "@/lib/store";
import { MockExtractionEngine } from "@/lib/extraction/mock-engine";
import type { StageEvent } from "@/lib/extraction/engine";
import { cn } from "@/lib/utils";

interface LiveJob {
  id: string;
  filename: string;
  sizeLabel: string;
  stage: "uploading" | "extracting";
  progress: number;
  statusLine: string;
}

function sizeLabel(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${Math.round(bytes / 1_000)} KB`;
  return `${bytes} B`;
}

const ACCEPTED = /\.(pdf|docx?|PDF|DOCX?)$/;

export function UploadDropzone() {
  const [dragOver, setDragOver] = useState(false);
  const [jobs, setJobs] = useState<LiveJob[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!ACCEPTED.test(file.name)) {
      toast.error("Unsupported file type", {
        description: "Athena accepts PDF and Word documents.",
      });
      return;
    }
    const jobId = `job-${Date.now()}`;
    const job: LiveJob = {
      id: jobId,
      filename: file.name,
      sizeLabel: sizeLabel(file.size),
      stage: "uploading",
      progress: 0,
      statusLine: "",
    };
    setJobs((j) => [...j, job]);

    const engine = new MockExtractionEngine(
      () => useOverlay.getState().uploadedContractIds
    );
    const onStage = (e: StageEvent) =>
      setJobs((all) =>
        all.map((x) =>
          x.id === jobId
            ? e.stage === "uploading"
              ? { ...x, stage: "uploading", progress: e.progress }
              : { ...x, stage: "extracting", statusLine: e.statusLine }
            : x
        )
      );

    engine
      .extract({ name: file.name, size: file.size, mimeType: file.type }, onStage)
      .then((result) => {
        setJobs((all) => all.filter((x) => x.id !== jobId));
        if (result.outcome === "duplicate") {
          toast(`Already in the repository`, {
            description: `${file.name} matches “${result.matchTitle}” — nothing new to extract.`,
          });
          return;
        }
        const c = result.contract;
        useOverlay.getState().startUpload({
          id: jobId,
          filename: file.name,
          sizeLabel: sizeLabel(file.size),
          stage: "extracting",
          contractId: c.id,
          startedAt: Date.now(),
        });
        useOverlay.getState().completeUpload(jobId);
        const low = c.fields.filter((f) => f.confidence < 0.75).length;
        if (result.outcome === "needs_review") {
          toast.warning(`${c.fields.length} terms extracted — ${low} need review`, {
            description: `${c.title} was added and its flagged terms are in the approval queue.`,
          });
        } else {
          toast.success(`${c.fields.length} terms extracted`, {
            description: `${c.title} is ready.`,
          });
        }
      });
  }, []);

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer items-center justify-center gap-3 rounded-lg border border-dashed px-4 py-5 transition-colors",
          dragOver
            ? "border-primary bg-accent"
            : "bg-muted/30 hover:border-input hover:bg-muted/50"
        )}
      >
        <CloudUpload className="size-5 text-muted-foreground" />
        <div className="text-center">
          <p className="text-[13.5px] font-medium">
            Drop a contract here, or <span className="text-primary">browse</span>
          </p>
          <p className="text-xs text-muted-foreground">
            PDF or Word — terms, dates, and obligations extracted on arrival
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {jobs.map((job) => (
        <div
          key={job.id}
          className="mt-2 flex items-center gap-3 rounded-lg border bg-card px-4 py-3"
        >
          <FileText className="size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium">{job.filename}</p>
            {job.stage === "uploading" ? (
              <Progress value={job.progress * 100} className="mt-1.5 h-1.5" />
            ) : (
              <p className="mt-0.5 text-xs text-muted-foreground">{job.statusLine}</p>
            )}
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-primary">
            <LoaderCircle className="size-3.5 animate-spin" />
            {job.stage === "uploading" ? "Uploading" : "Extracting"}
          </span>
          <span className="shrink-0 text-[11px] text-muted-foreground">{job.sizeLabel}</span>
        </div>
      ))}
    </div>
  );
}
