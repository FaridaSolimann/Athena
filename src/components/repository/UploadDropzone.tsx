"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { CloudUpload, FileText, LoaderCircle } from "lucide-react";
import { useOverlay } from "@/lib/store";
import { reportAiReason, useUi } from "@/lib/ui";
import { MockExtractionEngine } from "@/lib/extraction/mock-engine";
import type { Contract } from "@/data/types";
import { cn } from "@/lib/utils";

interface LiveJob {
  id: string;
  filename: string;
  sizeLabel: string;
  stage: "uploading" | "extracting";
  statusLine: string;
}

function sizeLabel(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${Math.round(bytes / 1_000)} KB`;
  return `${bytes} B`;
}

const ACCEPTED = /\.(pdf|docx?|PDF|DOCX?)$/;

const EXTRACT_LINES = [
  "Reading document structure…",
  "Identifying parties…",
  "Extracting dates and renewal terms…",
  "Checking liability and indemnity clauses…",
  "Verifying quotes against the document…",
  "Scoring confidence…",
];

/** Minimal sanity check on the server's contract before it enters the store. */
function looksLikeContract(c: unknown): c is Contract {
  const x = c as Contract;
  return (
    !!x &&
    typeof x.id === "string" &&
    Array.isArray(x.fields) &&
    x.fields.length > 0 &&
    !!x.document?.sections?.length
  );
}

export function UploadDropzone() {
  const [dragOver, setDragOver] = useState(false);
  const [jobs, setJobs] = useState<LiveJob[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const inFlightRef = useRef<Set<string>>(new Set());

  const handleFiles = useCallback((files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!ACCEPTED.test(file.name)) {
      toast.error("Unsupported file type", {
        description: "Athena accepts PDF and Word documents.",
      });
      return;
    }
    // drop + change can both fire for one pick — process each file once
    const fileKey = `${file.name}:${file.size}`;
    if (inFlightRef.current.has(fileKey)) return;
    inFlightRef.current.add(fileKey);
    const jobId = `job-${Date.now()}`;
    setJobs((j) => [
      ...j,
      {
        id: jobId,
        filename: file.name,
        sizeLabel: sizeLabel(file.size),
        stage: "uploading",
        statusLine: "",
      },
    ]);

    const setJob = (patch: Partial<LiveJob>) =>
      setJobs((all) => all.map((x) => (x.id === jobId ? { ...x, ...patch } : x)));
    const finishJob = () => {
      inFlightRef.current.delete(fileKey);
      setJobs((all) => all.filter((x) => x.id !== jobId));
    };

    // Rotate honest microcopy while the real extraction runs.
    let line = 0;
    const ticker = setInterval(() => {
      setJob({ stage: "extracting", statusLine: EXTRACT_LINES[line % EXTRACT_LINES.length] });
      line++;
    }, 900);

    const fallbackToQueue = async () => {
      const engine = new MockExtractionEngine(
        () => useOverlay.getState().uploadedContractIds
      );
      const result = await engine.extract(
        { name: file.name, size: file.size, mimeType: file.type },
        () => {}
      );
      clearInterval(ticker);
      finishJob();
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
      toast[low ? "warning" : "success"](
        `${c.fields.length} terms extracted${low ? ` — ${low} need review` : ""}`,
        { description: `${c.title} was added${low ? " and its flagged terms are in the approval queue" : ""}.` }
      );
    };

    const run = async () => {
      try {
        const form = new FormData();
        form.append("file", file);
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 45_000);
        const res = await fetch("/api/extract", {
          method: "POST",
          body: form,
          signal: controller.signal,
        });
        clearTimeout(timer);
        const data = await res.json();

        if (data?.engine === "gemini" && looksLikeContract(data.contract)) {
          clearInterval(ticker);
          finishJob();
          useUi.getState().reportAiHealth("ok");
          const c = data.contract as Contract;
          useOverlay.getState().addCustomContract(c);
          const low = c.fields.filter((f) => f.confidence < 0.75).length;
          toast[low ? "warning" : "success"](
            `${c.fields.length} terms extracted${low ? ` — ${low} need review` : ""}`,
            {
              description: `${c.title} (${c.counterparty}) was added${low ? " with flagged terms in the approval queue" : ""}.`,
            }
          );
          return;
        }
        // no key / unreadable / model error → the pre-authored queue keeps the
        // demo alive (documented in README)
        console.debug("[upload] falling back to queue:", data?.reason ?? "unknown");
        reportAiReason(data?.reason);
        await fallbackToQueue();
      } catch (err) {
        console.debug("[upload] extract call failed:", err);
        await fallbackToQueue();
      }
    };
    void run();
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
            <p className="mt-0.5 text-xs text-muted-foreground">
              {job.stage === "uploading" ? "Uploading…" : job.statusLine}
            </p>
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
