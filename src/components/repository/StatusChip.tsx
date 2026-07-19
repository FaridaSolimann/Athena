import { cn } from "@/lib/utils";

const STYLES = {
  active: { dot: "bg-trust-high", label: "Active", cls: "text-foreground" },
  needs_review: { dot: "bg-trust-medium", label: "Needs review", cls: "text-trust-medium" },
  expired: { dot: "bg-muted-foreground/50", label: "Expired", cls: "text-muted-foreground" },
  uploading: { dot: "bg-primary animate-pulse", label: "Uploading", cls: "text-primary" },
  extracting: { dot: "bg-primary animate-pulse", label: "Extracting", cls: "text-primary" },
} as const;

export function StatusChip({ status }: { status: keyof typeof STYLES }) {
  const s = STYLES[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[12.5px] font-medium", s.cls)}>
      <span className={cn("size-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}
