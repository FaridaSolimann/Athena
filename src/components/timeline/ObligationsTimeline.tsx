"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import type { InsightsInput } from "@/lib/derive/insights";
import {
  deriveTimelineEvents,
  TIMELINE_RANGE,
  type TimelineEvent,
  type TimelineEventKind,
} from "@/lib/derive/timeline";
import { TrustedFact } from "@/components/trust/TrustedFact";
import { getContract } from "@/data";
import { parseISO, TODAY, daysFromToday, addDays, TODAY_ISO } from "@/lib/demo-clock";
import { fmtDateShort, fmtRelative } from "@/lib/format";
import { cn } from "@/lib/utils";

// The signature interaction: a living horizontal view of everything the
// portfolio will ask of the team — renewals, notice cutoffs, expirations,
// payments — where every dot opens into its plain-language meaning and the
// exact clause behind it.

const LANES: { kind: TimelineEventKind; label: string; y: number; color: string }[] = [
  { kind: "notice", label: "Notice deadlines", y: 64, color: "var(--event-notice)" },
  { kind: "renewal", label: "Renewals", y: 128, color: "var(--event-renewal)" },
  { kind: "expiration", label: "Expirations", y: 192, color: "var(--event-expiration)" },
  { kind: "payment", label: "Payments", y: 256, color: "var(--event-payment)" },
];

const H = 300;
const PAD_L = 132;
const PAD_R = 24;

const PRESETS = [
  { label: "Next 90 days", days: 90 },
  { label: "6 months", days: 183 },
  { label: "12 months", days: 365 },
  { label: "All", days: null },
] as const;

interface Placed {
  ev: TimelineeventAlias;
  x: number;
  y: number;
}
type TimelineeventAlias = TimelineEvent;

interface Cluster {
  x: number;
  y: number;
  events: TimelineEvent[];
  laneColor: string;
}

function glyph(kind: TimelineEventKind, x: number, y: number, color: string, urgent: boolean) {
  switch (kind) {
    case "renewal":
      return <circle cx={x} cy={y} r={5.5} fill={color} />;
    case "notice":
      return (
        <g>
          {urgent && (
            <circle
              cx={x}
              cy={y}
              r={7}
              fill="none"
              stroke="var(--trust-low)"
              strokeWidth={1.5}
              style={{ animation: "athena-urgent-ring 1.6s ease-out infinite" }}
            />
          )}
          <path
            d={`M ${x} ${y - 6} L ${x + 6} ${y} L ${x} ${y + 6} L ${x - 6} ${y} Z`}
            fill={urgent ? "var(--trust-low)" : color}
          />
        </g>
      );
    case "expiration":
      return <rect x={x - 4.5} y={y - 4.5} width={9} height={9} fill={color} rx={1.5} />;
    case "payment":
      return (
        <g>
          <circle cx={x} cy={y} r={5.5} fill="none" stroke={color} strokeWidth={1.8} />
          <path
            d={`M ${x - 2.4} ${y} l 1.8 1.9 l 3.2 -3.6`}
            fill="none"
            stroke={color}
            strokeWidth={1.6}
            strokeLinecap="round"
          />
        </g>
      );
  }
}

export function ObligationsTimeline({ input }: { input: InsightsInput }) {
  const events = useMemo(() => deriveTimelineEvents(input), [input]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1000);
  const rangeStart = parseISO(TIMELINE_RANGE.start).getTime();
  const rangeEnd = parseISO(TIMELINE_RANGE.end).getTime();
  const [domain, setDomain] = useState<[number, number]>([
    parseISO(addDays(TODAY_ISO, -10)).getTime(),
    parseISO(addDays(TODAY_ISO, 183)).getTime(),
  ]);
  const [preset, setPreset] = useState<string>("6 months");
  const [selected, setSelected] = useState<TimelineEvent | null>(null);
  const [hovered, setHovered] = useState<TimelineEvent | null>(null);
  const animRef = useRef<number | null>(null);
  const dragRef = useRef<{ startX: number; domain: [number, number] } | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const animateTo = useCallback(
    (target: [number, number]) => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      const from = domain;
      const t0 = performance.now();
      const D = 250;
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / D);
        const ease = 1 - Math.pow(1 - p, 3);
        setDomain([
          from[0] + (target[0] - from[0]) * ease,
          from[1] + (target[1] - from[1]) * ease,
        ]);
        if (p < 1) animRef.current = requestAnimationFrame(tick);
      };
      animRef.current = requestAnimationFrame(tick);
    },
    [domain]
  );

  const applyPreset = (label: string, days: number | null) => {
    setPreset(label);
    setSelected(null);
    setOpenCluster(null);
    if (days === null) {
      animateTo([rangeStart, rangeEnd]);
    } else {
      animateTo([
        parseISO(addDays(TODAY_ISO, -Math.round(days * 0.06) - 4)).getTime(),
        parseISO(addDays(TODAY_ISO, days)).getTime(),
      ]);
    }
  };

  const x = useCallback(
    (t: number) =>
      PAD_L + ((t - domain[0]) / (domain[1] - domain[0])) * (width - PAD_L - PAD_R),
    [domain, width]
  );

  // Place events; cluster same-lane events that would overlap.
  const { placed, clusters } = useMemo(() => {
    const placed: Placed[] = [];
    const clusters: Cluster[] = [];
    for (const lane of LANES) {
      const laneEvents = events
        .filter((e) => e.kind === lane.kind)
        .map((e) => ({ e, px: x(parseISO(e.date).getTime()) }))
        .filter(({ px }) => px >= PAD_L - 8 && px <= width - PAD_R + 8)
        .sort((a, b) => a.px - b.px);
      let group: { e: TimelineEvent; px: number }[] = [];
      const flush = () => {
        if (group.length === 0) return;
        if (group.length <= 2) {
          group.forEach(({ e, px }, i) =>
            placed.push({ ev: e, x: px, y: lane.y + (i % 2 === 0 ? 0 : -14) })
          );
        } else {
          clusters.push({
            x: group.reduce((s, g) => s + g.px, 0) / group.length,
            y: lane.y,
            events: group.map((g) => g.e),
            laneColor: lane.color,
          });
        }
        group = [];
      };
      for (const item of laneEvents) {
        if (group.length && item.px - group[group.length - 1].px > 16) flush();
        group.push(item);
      }
      flush();
    }
    return { placed, clusters };
  }, [events, x, width]);

  // Month gridlines across the visible domain.
  const months = useMemo(() => {
    const out: { t: number; label: string }[] = [];
    const d = new Date(domain[0]);
    const cur = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
    while (cur.getTime() < domain[1]) {
      if (cur.getTime() >= domain[0]) {
        out.push({
          t: cur.getTime(),
          label: cur.toLocaleString("en-US", { month: "short", timeZone: "UTC" }) +
            (cur.getUTCMonth() === 0 ? ` ${cur.getUTCFullYear()}` : ""),
        });
      }
      cur.setUTCMonth(cur.getUTCMonth() + 1);
    }
    return out;
  }, [domain]);

  // Clustered events usually share a date (monthly payments), so zooming can
  // never separate them — clicking opens a list instead.
  const [openCluster, setOpenCluster] = useState<Cluster | null>(null);

  // Keyboard: step through events chronologically.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const sorted = events;
    const idx = selected ? sorted.findIndex((s) => s.id === selected.id) : -1;
    const next =
      e.key === "ArrowRight"
        ? sorted[Math.min(sorted.length - 1, idx + 1)]
        : sorted[Math.max(0, idx - 1)];
    if (next) {
      setSelected(next);
      const t = parseISO(next.date).getTime();
      if (t < domain[0] || t > domain[1]) {
        const span = domain[1] - domain[0];
        animateTo([t - span / 2, t + span / 2]);
      }
    }
  };

  const todayX = x(TODAY.getTime());
  const selectedPlace =
    selected &&
    (placed.find((p) => p.ev.id === selected.id) ??
      (() => {
        const c = clusters.find((cl) => cl.events.some((e) => e.id === selected.id));
        return c ? { ev: selected, x: c.x, y: c.y } : null;
      })());

  const arc = useMemo(() => {
    const src = hovered ?? selected;
    if (!src?.pairedEventId) return null;
    const from = placed.find((p) => p.ev.id === src.id);
    const to = placed.find((p) => p.ev.id === src.pairedEventId);
    if (!from || !to) return null;
    const mx = (from.x + to.x) / 2;
    return `M ${from.x} ${from.y - 8} Q ${mx} ${Math.min(from.y, to.y) - 46} ${to.x} ${to.y - 8}`;
  }, [hovered, selected, placed]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p.label, p.days)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                preset === p.label
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="text-[11.5px] text-muted-foreground">
          Drag to pan · click any point for its source clause · ← → to step
        </p>
      </div>

      <div
        ref={wrapRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative select-none overflow-hidden rounded-lg border bg-card outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <svg
          width={width}
          height={H}
          onPointerDown={(e) => {
            dragRef.current = { startX: e.clientX, domain: [...domain] as [number, number] };
            (e.target as Element).setPointerCapture?.(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!dragRef.current) return;
            setOpenCluster(null);
            const dx = e.clientX - dragRef.current.startX;
            const span = dragRef.current.domain[1] - dragRef.current.domain[0];
            const shift = (dx / (width - PAD_L - PAD_R)) * span;
            setDomain([dragRef.current.domain[0] - shift, dragRef.current.domain[1] - shift]);
          }}
          onPointerUp={() => (dragRef.current = null)}
          onPointerLeave={() => (dragRef.current = null)}
          className="cursor-grab active:cursor-grabbing"
        >
          {/* month grid */}
          {months.map((m) => (
            <g key={m.t}>
              <line x1={x(m.t)} x2={x(m.t)} y1={26} y2={H - 12} stroke="var(--border)" strokeWidth={1} />
              <text x={x(m.t) + 5} y={18} fontSize={10.5} fill="var(--muted-foreground)">
                {m.label}
              </text>
            </g>
          ))}
          {/* lanes */}
          {LANES.map((lane) => (
            <g key={lane.kind}>
              <line
                x1={PAD_L}
                x2={width - PAD_R}
                y1={lane.y}
                y2={lane.y}
                stroke="var(--border)"
                strokeDasharray="2 4"
              />
              <text x={14} y={lane.y + 3.5} fontSize={11} fontWeight={600} fill="var(--muted-foreground)">
                {lane.label}
              </text>
            </g>
          ))}
          {/* today line */}
          {todayX >= PAD_L && todayX <= width - PAD_R && (
            <g>
              <line
                x1={todayX}
                x2={todayX}
                y1={26}
                y2={H - 12}
                stroke="var(--primary)"
                strokeWidth={1.5}
                style={{ animation: "athena-today-pulse 2.4s ease-in-out infinite" }}
              />
              <rect x={todayX - 19} y={H - 26} width={38} height={16} rx={8} fill="var(--primary)" />
              <text x={todayX} y={H - 14.5} fontSize={9.5} fontWeight={600} fill="white" textAnchor="middle">
                Today
              </text>
            </g>
          )}
          {/* pairing arc */}
          {arc && (
            <path d={arc} fill="none" stroke="var(--event-notice)" strokeWidth={1.4} strokeDasharray="4 3" opacity={0.8} />
          )}
          {/* events */}
          {placed.map((p, i) => {
            const lane = LANES.find((l) => l.kind === p.ev.kind)!;
            const urgent = p.ev.kind === "notice" && daysFromToday(p.ev.date) >= 0 && daysFromToday(p.ev.date) <= 14;
            return (
              <g
                key={p.ev.id}
                style={{ animation: "athena-event-in 300ms ease-out both", animationDelay: `${Math.min(i, 25) * 18}ms` }}
                className="cursor-pointer"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => setSelected(selected?.id === p.ev.id ? null : p.ev)}
                onPointerEnter={() => setHovered(p.ev)}
                onPointerLeave={() => setHovered(null)}
              >
                <circle cx={p.x} cy={p.y} r={12} fill="transparent" />
                {glyph(p.ev.kind, p.x, p.y, lane.color, urgent)}
                {(hovered?.id === p.ev.id || selected?.id === p.ev.id) && (
                  <text
                    x={p.x}
                    y={p.y - (p.ev.kind === "notice" ? 14 : 12)}
                    fontSize={10.5}
                    fontWeight={600}
                    fill="var(--foreground)"
                    textAnchor="middle"
                  >
                    {p.ev.title} · {fmtDateShort(p.ev.date)}
                  </text>
                )}
              </g>
            );
          })}
          {/* clusters */}
          {clusters.map((c, i) => (
            <g
              key={`cl-${i}`}
              className="cursor-pointer"
              style={{ animation: "athena-event-in 300ms ease-out both", animationDelay: `${Math.min(i, 25) * 18}ms` }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => {
                setSelected(null);
                setOpenCluster(openCluster === c ? null : c);
              }}
            >
              <circle cx={c.x} cy={c.y} r={11} fill="var(--card)" stroke={c.laneColor} strokeWidth={1.8} />
              <text x={c.x} y={c.y + 3.5} fontSize={10} fontWeight={700} fill="var(--foreground)" textAnchor="middle">
                {c.events.length}
              </text>
            </g>
          ))}
        </svg>

        {/* cluster list popover */}
        {openCluster && (
          <div
            className="absolute z-10 w-[300px] rounded-lg border bg-popover p-2 shadow-lg"
            style={{
              left: Math.max(8, Math.min(width - 308, openCluster.x - 150)),
              // flip above the point in the lower lanes so the container
              // doesn't clip the list
              ...(openCluster.y > 160
                ? { bottom: H - openCluster.y + 14 }
                : { top: openCluster.y + 16 }),
            }}
          >
            <div className="flex items-center justify-between px-1.5 pb-1.5 pt-0.5">
              <p className="text-[11.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                {openCluster.events.length} events around {fmtDateShort(openCluster.events[0].date)}
              </p>
              <button
                type="button"
                onClick={() => setOpenCluster(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <div className="max-h-52 overflow-y-auto">
              {openCluster.events.map((ev) => (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => {
                    setOpenCluster(null);
                    setSelected(ev);
                  }}
                  className="flex w-full items-center justify-between gap-2 rounded-md px-1.5 py-1.5 text-left transition-colors hover:bg-accent"
                >
                  <span className="truncate text-[12.5px] font-medium">{ev.title}</span>
                  <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                    {fmtDateShort(ev.date)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* event popover */}
        {selected && selectedPlace && (
          <div
            className="absolute z-10 w-[320px] rounded-lg border bg-popover p-3 shadow-lg"
            style={{
              left: Math.max(8, Math.min(width - 328, selectedPlace.x - 160)),
              ...(selectedPlace.y > 160
                ? { bottom: H - selectedPlace.y + 14 }
                : { top: selectedPlace.y + 16 }),
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[13px] font-semibold leading-tight">{selected.title}</p>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {selected.sentence} <span className="font-medium text-foreground">({fmtRelative(selected.date)})</span>
            </p>
            {selected.fieldIds.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selected.fieldIds.slice(0, 3).map((fid) => (
                  <TrustedFact key={fid} contractId={selected.contractId} fieldId={fid} variant="chip" />
                ))}
              </div>
            )}
            <Link
              href={`/contracts/${selected.contractId}`}
              className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Open {getContract(selected.contractId)?.counterparty}
              <ArrowUpRight className="size-3" />
            </Link>
          </div>
        )}
      </div>

      {/* legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-1 text-[11.5px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="var(--event-renewal)" /></svg>
          Renewal
        </span>
        <span className="inline-flex items-center gap-1.5">
          <svg width="12" height="12"><path d="M 6 1 L 11 6 L 6 11 L 1 6 Z" fill="var(--event-notice)" /></svg>
          Notice deadline
        </span>
        <span className="inline-flex items-center gap-1.5">
          <svg width="12" height="12"><path d="M 6 1 L 11 6 L 6 11 L 1 6 Z" fill="var(--trust-low)" /></svg>
          Notice due within 14 days
        </span>
        <span className="inline-flex items-center gap-1.5">
          <svg width="12" height="12"><rect x="1.5" y="1.5" width="9" height="9" rx="1.5" fill="var(--event-expiration)" /></svg>
          Term ends
        </span>
        <span className="inline-flex items-center gap-1.5">
          <svg width="12" height="12">
            <circle cx="6" cy="6" r="5" fill="none" stroke="var(--event-payment)" strokeWidth="1.6" />
            <path d="M 3.8 6 l 1.6 1.7 l 2.9 -3.2" fill="none" stroke="var(--event-payment)" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Payment due
        </span>
        <span className="inline-flex items-center gap-1.5">
          <svg width="14" height="14">
            <circle cx="7" cy="7" r="6" fill="var(--card)" stroke="var(--muted-foreground)" strokeWidth="1.4" />
            <text x="7" y="9.5" fontSize="7.5" fontWeight="700" fill="var(--foreground)" textAnchor="middle">3</text>
          </svg>
          Several events on close dates — click to list them
        </span>
      </div>

      {/* minimap */}
      <div className="px-1">
        <svg
          width={width}
          height={30}
          className="cursor-pointer"
          onPointerDown={(e) => {
            const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
            const px = e.clientX - rect.left;
            const t = rangeStart + (px / width) * (rangeEnd - rangeStart);
            const span = domain[1] - domain[0];
            animateTo([t - span / 2, t + span / 2]);
            setPreset("");
          }}
        >
          <rect x={0} y={10} width={width} height={10} rx={5} fill="var(--muted)" />
          {events.map((e) => {
            const px = ((parseISO(e.date).getTime() - rangeStart) / (rangeEnd - rangeStart)) * width;
            const lane = LANES.find((l) => l.kind === e.kind)!;
            return <circle key={e.id} cx={px} cy={15} r={2} fill={lane.color} opacity={0.75} />;
          })}
          <rect
            x={((domain[0] - rangeStart) / (rangeEnd - rangeStart)) * width}
            y={7}
            width={Math.max(14, ((domain[1] - domain[0]) / (rangeEnd - rangeStart)) * width)}
            height={16}
            rx={6}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={1.5}
          />
        </svg>
      </div>
    </div>
  );
}
