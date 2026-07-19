// Core data model. Seed data is immutable; everything the user does lives in
// a separate overlay (src/lib/store.ts) merged at read time (src/lib/selectors.ts).

export type ISODate = string; // YYYY-MM-DD

export type ContractType =
  | "SaaS"
  | "MSA"
  | "SOW"
  | "NDA"
  | "Vendor"
  | "Employment"
  | "Lease"
  | "Partnership";

export type ContractStatus = "active" | "needs_review" | "expired";

/** Where a value came from in the source document. Offsets are resolved from
 * `excerpt` at load time so citations are correct by construction. */
export interface SourceRef {
  sectionId: string;
  /** Verbatim substring of one of the section's paragraphs. */
  excerpt: string;
}

/** Resolved at load time by src/data/index.ts. */
export interface ResolvedSourceRef extends SourceRef {
  paragraphIndex: number;
  charStart: number;
  charEnd: number;
}

export type FieldValue =
  | { kind: "money"; usd: number; original?: { amount: number; currency: string; fxRate: number } }
  | { kind: "date"; iso: ISODate }
  | { kind: "duration"; days: number; raw: string }
  | { kind: "boolean"; value: boolean }
  | { kind: "text"; value: string }
  | { kind: "missing"; expected: string }
  | { kind: "ambiguous"; candidates: { reading: string; value: string }[] };

export type FieldKey =
  | "contract_type"
  | "counterparty"
  | "effective_date"
  | "expiration_date"
  | "renewal_date"
  | "notice_deadline"
  | "auto_renew"
  | "notice_days"
  | "term_length"
  | "total_value"
  | "payment_schedule"
  | "liability_cap"
  | "governing_law"
  | "confidentiality"
  | "ip_ownership"
  | "indemnification"
  | "termination"
  | "sla"
  | "exclusivity"
  | "insurance";

export type FieldGroup = "Overview" | "Term & renewal" | "Financial" | "Legal terms";

export interface ExtractedField {
  id: string; // `${contractId}:${key}`
  contractId: string;
  key: FieldKey;
  label: string;
  group: FieldGroup;
  value: FieldValue;
  /** 0..1 — <0.75 means needsReview. */
  confidence: number;
  /** null = the extractor looked and found nothing (renders as an honest gap). */
  source: SourceRef | null;
  /** Extractor's note shown in review UIs ("could also read $128,000"). */
  note?: string;
}

export type ObligationParty = "us" | "them";

export interface Obligation {
  id: string;
  contractId: string;
  title: string;
  /** Which side owes it. "us" = Vantora. */
  owedBy: ObligationParty;
  dueDate?: ISODate;
  /** e.g. "monthly", "quarterly", "annual" — recurring items with no single due date. */
  recurrence?: string;
  description: string;
  source?: SourceRef;
}

export type RiskKind =
  | "auto_renewal_trap"
  | "low_liability_cap"
  | "absent_liability_cap"
  | "ambiguous_liability_cap"
  | "exclusivity"
  | "termination_for_convenience"
  | "unusual_indemnity"
  | "penalty";

export interface RiskFlag {
  id: string;
  contractId: string;
  kind: RiskKind;
  severity: "high" | "medium" | "low";
  summary: string;
  /** Field whose evidence backs this risk, if any. */
  fieldId?: string;
}

export interface PaymentMilestone {
  id: string;
  contractId: string;
  label: string;
  amountUsd: number;
  dueDate: ISODate;
  paid?: boolean;
}

export interface DocumentSection {
  id: string; // `${contractId}-s${number}` e.g. "c-001-s2"
  number: string; // "2", "4.2", "Exhibit A"
  heading: string;
  paragraphs: string[];
}

export interface ContractDocument {
  filename: string;
  format: "pdf" | "docx";
  pages: number;
  /** Present only for scanned documents; <0.7 explains low extraction confidence. */
  ocrQuality?: number;
  sections: DocumentSection[];
}

export interface Contract {
  id: string;
  title: string;
  counterparty: string;
  counterpartyCategory: string;
  type: ContractType;
  status: ContractStatus;
  /** USD-normalized total value for the current term. 0 for NDAs/umbrella MSAs. */
  valueUsd: number;
  valueOriginal?: { amount: number; currency: string; fxRate: number };
  effectiveDate: ISODate;
  /** null = unknown (illegible) or open-ended (at-will employment). */
  expirationDate: ISODate | null;
  autoRenew: boolean;
  noticeDays?: number;
  renewalTermMonths?: number;
  /** Parent contract id for families (SOWs point at their MSA). */
  familyParentId?: string;
  /** When the workspace ingested it (relative framing in the UI). */
  ingestedAt: ISODate;
  fields: ExtractedField[];
  obligations: Obligation[];
  risks: RiskFlag[];
  milestones: PaymentMilestone[];
  document: ContractDocument;
}

// ---- People & workspace ----

export interface User {
  id: string;
  name: string;
  initials: string;
  role: string;
  teamId: string;
  email: string;
}

export interface Team {
  id: string;
  name: string;
  memberIds: string[];
}

export type AssigneeRef =
  | { kind: "user"; id: string }
  | { kind: "team"; id: string };

// ---- Derived work items (never seeded; see src/lib/derive) ----

export type WorkItemKind = "alert" | "task";
export type WorkItemStatus = "open" | "in_progress" | "done" | "dismissed";
export type ApprovalStatus = "awaiting" | "approved" | "rejected";
export type Priority = "critical" | "high" | "medium" | "low";

export interface WorkItem {
  id: string; // deterministic, e.g. "alert:c-001:renewal-notice"
  kind: WorkItemKind;
  contractId: string;
  title: string;
  detail: string;
  dueDate?: ISODate;
  priority: Priority;
  status: WorkItemStatus;
  assignee?: AssigneeRef;
  needsApproval: boolean;
  approvalStatus?: ApprovalStatus;
  /** Fields this item is about (verify-tasks); drives approval↔verification linkage. */
  fieldIds?: string[];
  manual?: boolean;
}
