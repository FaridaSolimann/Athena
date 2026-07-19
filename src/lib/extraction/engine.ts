import type { Contract } from "@/data/types";

// The extraction seam. Phase 1 ships MockExtractionEngine (pre-authored
// contracts, staged timing); a real parser drops in behind this interface
// without touching any UI code.

export interface UploadFileMeta {
  name: string;
  size: number;
  mimeType: string;
}

export type StageEvent =
  | { stage: "uploading"; progress: number } // 0..1
  | { stage: "extracting"; statusLine: string };

export type ExtractionResult =
  | { outcome: "ready" | "needs_review"; contract: Contract }
  | { outcome: "duplicate"; matchTitle: string };

export interface ExtractionEngine {
  extract(
    file: UploadFileMeta,
    onStage: (e: StageEvent) => void
  ): Promise<ExtractionResult>;
}
