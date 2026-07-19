import { UPLOAD_QUEUE } from "@/data";
import type {
  ExtractionEngine,
  ExtractionResult,
  StageEvent,
  UploadFileMeta,
} from "@/lib/extraction/engine";

const EXTRACT_LINES = [
  "Reading document structure…",
  "Identifying parties…",
  "Extracting dates and renewal terms…",
  "Checking liability and indemnity clauses…",
  "Scoring confidence…",
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Ignores file bytes entirely; materializes the next pre-authored contract
 * from the upload queue with convincing staged timing. */
export class MockExtractionEngine implements ExtractionEngine {
  constructor(private alreadyUploaded: () => string[]) {}

  async extract(
    _file: UploadFileMeta,
    onStage: (e: StageEvent) => void
  ): Promise<ExtractionResult> {
    for (let i = 1; i <= 7; i++) {
      onStage({ stage: "uploading", progress: i / 7 });
      await sleep(200);
    }
    for (const line of EXTRACT_LINES) {
      onStage({ stage: "extracting", statusLine: line });
      await sleep(560);
    }
    const uploaded = this.alreadyUploaded();
    const next = UPLOAD_QUEUE.find((c) => !uploaded.includes(c.id));
    if (!next) {
      return { outcome: "duplicate", matchTitle: UPLOAD_QUEUE[UPLOAD_QUEUE.length - 1].title };
    }
    return {
      outcome: next.status === "needs_review" ? "needs_review" : "ready",
      contract: next,
    };
  }
}
