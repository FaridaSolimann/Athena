// Server-side assembly of an uploaded contract: verify every quote against
// the document text (anti-hallucination), compute provenance offsets,
// normalize values in code, and emit a Contract in exactly the seed shape so
// the whole trust UI works on it unchanged.
import type {
  Contract,
  ContractType,
  ExtractedField,
  FieldGroup,
  FieldKey,
} from "@/data/types";
import { addDays, TODAY_ISO } from "@/lib/demo-clock";
import { normalizeField } from "@/lib/extraction/normalize";

export interface RawExtraction {
  title: string;
  counterparty: string;
  contractType: ContractType;
  fields: { field: FieldKey; rawValue: string; sourceQuote: string; confidence: number }[];
}

const FIELD_META: Record<string, { label: string; group: FieldGroup }> = {
  contract_type: { label: "Contract type", group: "Overview" },
  counterparty: { label: "Counterparty", group: "Overview" },
  effective_date: { label: "Effective date", group: "Term & renewal" },
  expiration_date: { label: "Expiration date", group: "Term & renewal" },
  renewal_date: { label: "Renewal date", group: "Term & renewal" },
  notice_deadline: { label: "Notice deadline", group: "Term & renewal" },
  auto_renew: { label: "Auto-renewal", group: "Term & renewal" },
  notice_days: { label: "Non-renewal notice window", group: "Term & renewal" },
  term_length: { label: "Term length", group: "Term & renewal" },
  total_value: { label: "Total contract value", group: "Financial" },
  payment_schedule: { label: "Payment schedule", group: "Financial" },
  liability_cap: { label: "Liability cap", group: "Legal terms" },
  governing_law: { label: "Governing law", group: "Legal terms" },
  confidentiality: { label: "Confidentiality", group: "Legal terms" },
  ip_ownership: { label: "IP ownership", group: "Legal terms" },
  indemnification: { label: "Indemnification", group: "Legal terms" },
  termination: { label: "Termination", group: "Legal terms" },
  sla: { label: "Service level", group: "Legal terms" },
  exclusivity: { label: "Exclusivity", group: "Legal terms" },
  insurance: { label: "Insurance", group: "Legal terms" },
};

const collapse = (s: string) => s.replace(/\s+/g, " ").trim();

/** Chunk raw extracted text into paragraph strings (whitespace-collapsed —
 * quotes are matched in the same collapsed space). */
function chunkParagraphs(text: string): string[] {
  let parts = text.split(/\n\s*\n/).map(collapse).filter((p) => p.length > 0);
  // Scanned/flat PDFs often have no blank lines — fall back to line groups.
  if (parts.length < 4) {
    const lines = text.split(/\n/).map(collapse).filter(Boolean);
    parts = [];
    for (let i = 0; i < lines.length; i += 4) {
      parts.push(lines.slice(i, i + 4).join(" "));
    }
  }
  return parts.filter((p) => p.length > 0);
}

/** Ensure some paragraph contains the quote; merge adjacent paragraphs when a
 * quote spans a chunk boundary. Returns the paragraph list (possibly merged)
 * or null when the quote isn't in the document at all. */
function ensureQuoteInParagraphs(paragraphs: string[], quote: string): string[] | null {
  if (paragraphs.some((p) => p.includes(quote))) return paragraphs;
  const joined = paragraphs.join(" ");
  if (!joined.includes(quote)) return null;
  // find the span of paragraphs covering the quote and merge them
  for (let start = 0; start < paragraphs.length; start++) {
    let acc = paragraphs[start];
    for (let end = start + 1; end < paragraphs.length && acc.length < quote.length + paragraphs[start].length + 4000; end++) {
      acc = `${acc} ${paragraphs[end]}`;
      if (acc.includes(quote)) {
        return [
          ...paragraphs.slice(0, start),
          acc,
          ...paragraphs.slice(end + 1),
        ];
      }
    }
  }
  return null;
}

export function assembleContract(input: {
  raw: RawExtraction;
  text: string;
  filename: string;
  format: "pdf" | "docx";
  pages: number;
}): Contract {
  const { raw, text, filename, format, pages } = input;
  const id = `custom-${Date.now()}`;
  const sectionId = `${id}-s1`;
  let paragraphs = chunkParagraphs(text);
  const collapsedDoc = collapse(text);

  const fields: ExtractedField[] = [];
  const seen = new Set<string>();
  for (const f of raw.fields) {
    const meta = FIELD_META[f.field];
    if (!meta || seen.has(f.field)) continue;
    seen.add(f.field);

    const quote = collapse(f.sourceQuote ?? "");
    let confidence = Math.max(0.05, Math.min(1, f.confidence ?? 0.5));
    let source: ExtractedField["source"] = null;
    let verifyNote: string | undefined;

    if (quote && collapsedDoc.includes(quote)) {
      const merged = ensureQuoteInParagraphs(paragraphs, quote);
      if (merged) {
        paragraphs = merged;
        source = { sectionId, excerpt: quote.slice(0, 400) };
        // long quotes truncated for display must still resolve
        if (!paragraphs.some((p) => p.includes(source!.excerpt))) source = { sectionId, excerpt: quote };
      }
    }
    if (!source) {
      // The quote isn't verbatim in the document — never present it as solid.
      confidence = Math.min(confidence, 0.45);
      verifyNote = "The extractor's quote could not be verified against the document — review required.";
    }

    const normalized = normalizeField(f.field, f.rawValue ?? "");
    if (normalized.degraded) confidence = Math.min(confidence, 0.65);

    fields.push({
      id: `${id}:${f.field}`,
      contractId: id,
      key: f.field,
      label: meta.label,
      group: meta.group,
      value: normalized.value,
      confidence: Number(confidence.toFixed(2)),
      source,
      note: [normalized.note, verifyNote].filter(Boolean).join(" ") || undefined,
    });
  }

  // Scalars for list views and derived alerts — read from normalized fields.
  const val = (key: FieldKey) => fields.find((x) => x.key === key)?.value;
  const money = val("total_value");
  const eff = val("effective_date");
  const exp = val("expiration_date");
  const autoRenew = val("auto_renew");
  const notice = val("notice_days");

  const expirationIso = exp?.kind === "date" ? exp.iso : null;
  const noticeDays = notice?.kind === "duration" ? notice.days : undefined;
  const isAutoRenew = autoRenew?.kind === "boolean" ? autoRenew.value : false;

  // Computed in code, never by the model: the real cutoff date.
  if (isAutoRenew && expirationIso && noticeDays && !seen.has("notice_deadline")) {
    const noticeField = fields.find((x) => x.key === "notice_days");
    fields.push({
      id: `${id}:notice_deadline`,
      contractId: id,
      key: "notice_deadline",
      label: "Notice deadline",
      group: "Term & renewal",
      value: { kind: "date", iso: addDays(expirationIso, -noticeDays) },
      confidence: Math.min(0.85, noticeField?.confidence ?? 0.8),
      source: noticeField?.source ?? null,
      note: `Computed: ${expirationIso} term end − ${noticeDays} days' notice.`,
    });
  }

  const needsReview = fields.some((x) => x.confidence < 0.75);

  return {
    id,
    title: raw.title?.slice(0, 90) || filename.replace(/\.(pdf|docx?)$/i, ""),
    counterparty: raw.counterparty?.slice(0, 80) || "Unknown counterparty",
    counterpartyCategory: "Uploaded document",
    type: raw.contractType ?? "Vendor",
    status: needsReview ? "needs_review" : "active",
    valueUsd: money?.kind === "money" ? money.usd : 0,
    valueOriginal: money?.kind === "money" ? money.original : undefined,
    effectiveDate: eff?.kind === "date" ? eff.iso : TODAY_ISO,
    expirationDate: expirationIso,
    autoRenew: isAutoRenew,
    noticeDays,
    ingestedAt: TODAY_ISO,
    fields,
    obligations: [],
    risks: [],
    milestones: [],
    document: {
      filename,
      format,
      pages,
      sections: [
        {
          id: sectionId,
          number: "1",
          heading: "Extracted document text",
          paragraphs,
        },
      ],
    },
  };
}
