"use client";

import { useEffect, useRef } from "react";
import type { Contract, SourceRef } from "@/data/types";
import { resolveSourceRef } from "@/data";
import { ScanLine, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  contract: Contract;
  /** Spans to mark subtly (each field's provenance). */
  highlights?: SourceRef[];
  /** The span being inspected — marked strongly and scrolled into view. */
  activeRef?: SourceRef | null;
  /** Restrict rendering to the active section only (used in the peek sheet). */
  onlyActiveSection?: boolean;
  className?: string;
}

interface Span {
  start: number;
  end: number;
  active: boolean;
}

function renderParagraph(text: string, spans: Span[]) {
  if (spans.length === 0) return text;
  const sorted = [...spans].sort((a, b) => a.start - b.start);
  const out: React.ReactNode[] = [];
  let cursor = 0;
  sorted.forEach((s, i) => {
    if (s.start < cursor) return; // skip overlaps
    if (s.start > cursor) out.push(text.slice(cursor, s.start));
    out.push(
      <mark key={i} data-athena-highlight={s.active ? "active" : "passive"}>
        {text.slice(s.start, s.end)}
      </mark>
    );
    cursor = s.end;
  });
  if (cursor < text.length) out.push(text.slice(cursor));
  return out;
}

export function DocumentPane({
  contract,
  highlights = [],
  activeRef,
  onlyActiveSection = false,
  className,
}: Props) {
  const activeMarkRef = useRef<HTMLDivElement>(null);
  const resolvedActive = activeRef ? resolveSourceRef(contract, activeRef) : null;

  useEffect(() => {
    if (resolvedActive && activeMarkRef.current) {
      activeMarkRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedActive?.sectionId, resolvedActive?.charStart]);

  const resolvedHighlights = highlights
    .map((h) => resolveSourceRef(contract, h))
    .filter((h): h is NonNullable<typeof h> => !!h);

  const sections = onlyActiveSection && resolvedActive
    ? contract.document.sections.filter((s) => s.id === resolvedActive.sectionId)
    : contract.document.sections;

  const scanned = contract.document.ocrQuality !== undefined;

  return (
    <div className={cn("text-[13px] leading-relaxed", className)}>
      <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
        {scanned ? <ScanLine className="size-3.5" /> : <FileText className="size-3.5" />}
        <span className="truncate font-medium">{contract.document.filename}</span>
        <span>· {contract.document.pages} pages</span>
        {scanned && (
          <span className="rounded-full bg-trust-medium-bg px-2 py-0.5 font-medium text-trust-medium">
            Scanned · OCR quality {Math.round((contract.document.ocrQuality ?? 0) * 100)}%
          </span>
        )}
      </div>
      <div className="space-y-5">
        {sections.map((section) => (
          <section key={section.id}>
            <h4 className="mb-1.5 text-[12.5px] font-semibold tracking-tight">
              {/^(exhibit|order)/i.test(section.number)
                ? section.number
                : `${section.number}.`}{" "}
              {section.heading}
            </h4>
            <div className="space-y-2 text-foreground/80">
              {section.paragraphs.map((p, pi) => {
                const spans: Span[] = [
                  ...resolvedHighlights
                    .filter((h) => h.sectionId === section.id && h.paragraphIndex === pi)
                    .map((h) => ({ start: h.charStart, end: h.charEnd, active: false })),
                ];
                const isActivePara =
                  resolvedActive?.sectionId === section.id &&
                  resolvedActive.paragraphIndex === pi;
                if (isActivePara && resolvedActive) {
                  const idx = spans.findIndex(
                    (s) => s.start === resolvedActive.charStart && s.end === resolvedActive.charEnd
                  );
                  if (idx >= 0) spans[idx] = { ...spans[idx], active: true };
                  else spans.push({
                    start: resolvedActive.charStart,
                    end: resolvedActive.charEnd,
                    active: true,
                  });
                }
                return (
                  <div key={pi} ref={isActivePara ? activeMarkRef : undefined}>
                    <p>{renderParagraph(p, spans)}</p>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
