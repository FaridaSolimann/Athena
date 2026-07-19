"use client";

import { cn } from "@/lib/utils";

// Hand-rolled share visuals — deliberately not a chart library.

const PALETTE = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
  "bg-muted-foreground/40",
];

export interface Segment {
  label: string;
  value: number;
  onClick?: () => void;
}

/** One horizontal stacked bar with a clickable legend. */
export function ShareBar({ segments, format }: { segments: Segment[]; format: (v: number) => string }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full">
        {segments.map((s, i) => (
          <button
            key={s.label}
            type="button"
            onClick={s.onClick}
            title={`${s.label} — ${format(s.value)}`}
            style={{ width: `${(s.value / total) * 100}%` }}
            className={cn(PALETTE[i % PALETTE.length], "transition-opacity hover:opacity-80", s.onClick && "cursor-pointer")}
          />
        ))}
      </div>
      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map((s, i) => (
          <button
            key={s.label}
            type="button"
            onClick={s.onClick}
            className={cn(
              "inline-flex items-center gap-1.5 text-xs",
              s.onClick && "hover:text-primary"
            )}
          >
            <span className={cn("size-2 rounded-full", PALETTE[i % PALETTE.length])} />
            <span className="font-medium">{s.label}</span>
            <span className="text-muted-foreground">{format(s.value)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Ranked rows, each with a proportional bar — the anti-donut. */
export function RankedBars({
  rows,
  format,
  maxRows = 6,
}: {
  rows: { label: string; value: number; sublabel?: string; onClick?: () => void }[];
  format: (v: number) => string;
  maxRows?: number;
}) {
  const max = rows[0]?.value || 1;
  return (
    <div className="space-y-1.5">
      {rows.slice(0, maxRows).map((r) => (
        <button
          key={r.label}
          type="button"
          onClick={r.onClick}
          className={cn(
            "block w-full text-left",
            r.onClick && "group cursor-pointer"
          )}
        >
          <div className="flex items-baseline justify-between gap-3">
            <span className="truncate text-[12.5px] font-medium group-hover:text-primary">
              {r.label}
            </span>
            <span className="shrink-0 text-[12.5px] tabular-nums text-muted-foreground">
              {format(r.value)}
              {r.sublabel && <span className="ml-1.5 text-[11px]">{r.sublabel}</span>}
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
            <div
              className="h-1.5 rounded-full bg-chart-1 transition-all group-hover:bg-chart-4"
              style={{ width: `${Math.max(2, (r.value / max) * 100)}%` }}
            />
          </div>
        </button>
      ))}
    </div>
  );
}
