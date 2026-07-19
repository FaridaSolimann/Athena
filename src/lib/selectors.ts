"use client";

import { useMemo } from "react";
import type { Contract, ExtractedField, FieldValue } from "@/data/types";
import { ALL_CONTRACTS, SEED_CONTRACTS, UPLOAD_QUEUE, getContract } from "@/data";
import { useOverlay, type Verification } from "@/lib/store";
import { confidenceLevel, type ConfidenceLevel } from "@/lib/format";

// Effective state = immutable seed ⊕ user overlay, merged at read time.

/** Resolve ANY contract — seed, upload-queue, or genuinely uploaded (custom).
 * Use this instead of data/index's getContract everywhere UI code resolves an
 * id, so uploaded contracts are first-class citizens. */
export function lookupContract(id: string): Contract | undefined {
  return (
    getContract(id) ??
    useOverlay.getState().customContracts.find((c) => c.id === id)
  );
}

export interface EffectiveField {
  field: ExtractedField;
  verification?: Verification;
  /** Corrected value if any, else the extracted value. */
  value: FieldValue;
  /** "verified" once a human confirmed/corrected; else confidence level. */
  trust: ConfidenceLevel | "verified" | "rejected";
  needsReview: boolean;
}

export function effectiveField(
  field: ExtractedField,
  verification?: Verification
): EffectiveField {
  if (verification?.status === "corrected" && verification.correctedValue) {
    return {
      field,
      verification,
      value: verification.correctedValue,
      trust: "verified",
      needsReview: false,
    };
  }
  if (verification?.status === "confirmed") {
    return { field, verification, value: field.value, trust: "verified", needsReview: false };
  }
  if (verification?.status === "rejected") {
    return { field, verification, value: field.value, trust: "rejected", needsReview: true };
  }
  return {
    field,
    value: field.value,
    trust: confidenceLevel(field.confidence),
    needsReview: field.confidence < 0.75,
  };
}

export function useEffectiveField(fieldId: string): EffectiveField | undefined {
  const verification = useOverlay((s) => s.fieldVerifications[fieldId]);
  const customContracts = useOverlay((s) => s.customContracts);
  return useMemo(() => {
    const contract =
      ALL_CONTRACTS.find((c) => c.fields.some((f) => f.id === fieldId)) ??
      customContracts.find((c) => c.fields.some((f) => f.id === fieldId));
    const field = contract?.fields.find((f) => f.id === fieldId);
    return field ? effectiveField(field, verification) : undefined;
  }, [fieldId, verification, customContracts]);
}

/** Contract status once the overlay is applied: a needs_review contract whose
 * low-confidence fields have all been reviewed becomes active. */
export function effectiveStatus(
  contract: Contract,
  verifications: Record<string, Verification>
): Contract["status"] {
  if (contract.status !== "needs_review") return contract.status;
  const pending = contract.fields.filter(
    (f) => f.confidence < 0.75 && verifications[f.id]?.status !== "confirmed" &&
      verifications[f.id]?.status !== "corrected"
  );
  return pending.length === 0 ? "active" : "needs_review";
}

export interface EffectiveContract {
  contract: Contract;
  status: Contract["status"];
  /** Count of fields still awaiting human review. */
  openReviewCount: number;
  uploaded: boolean;
}

export function useEffectiveContracts(): EffectiveContract[] {
  const verifications = useOverlay((s) => s.fieldVerifications);
  const uploadedIds = useOverlay((s) => s.uploadedContractIds);
  const customContracts = useOverlay((s) => s.customContracts);

  return useMemo(() => {
    const uploaded = uploadedIds
      .map((id) => getContract(id))
      .filter((c): c is Contract => !!c && UPLOAD_QUEUE.some((q) => q.id === c.id));
    // Fresh uploads surface at the top of the repository.
    const visible = [...customContracts, ...[...uploaded].reverse(), ...SEED_CONTRACTS];
    return visible.map((contract) => ({
      contract,
      status: effectiveStatus(contract, verifications),
      openReviewCount: contract.fields.filter(
        (f) =>
          f.confidence < 0.75 &&
          verifications[f.id]?.status !== "confirmed" &&
          verifications[f.id]?.status !== "corrected"
      ).length,
      uploaded: uploadedIds.includes(contract.id),
    }));
  }, [verifications, uploadedIds]);
}

export function useEffectiveContract(id: string):
  | (EffectiveContract & { fields: EffectiveField[] })
  | undefined {
  const verifications = useOverlay((s) => s.fieldVerifications);
  const uploadedIds = useOverlay((s) => s.uploadedContractIds);
  const customContracts = useOverlay((s) => s.customContracts);

  return useMemo(() => {
    const contract = getContract(id) ?? customContracts.find((c) => c.id === id);
    if (!contract) return undefined;
    return {
      contract,
      status: effectiveStatus(contract, verifications),
      openReviewCount: contract.fields.filter(
        (f) =>
          f.confidence < 0.75 &&
          verifications[f.id]?.status !== "confirmed" &&
          verifications[f.id]?.status !== "corrected"
      ).length,
      uploaded:
        uploadedIds.includes(contract.id) ||
        customContracts.some((c) => c.id === contract.id),
      fields: contract.fields.map((f) => effectiveField(f, verifications[f.id])),
    };
  }, [id, verifications, uploadedIds, customContracts]);
}

/** USD value of a field's effective money value (for live aggregates). */
export function moneyOf(value: FieldValue): number | null {
  return value.kind === "money" ? value.usd : null;
}

// ---- Work items (tasks & alerts) ----

import type { WorkItem } from "@/data/types";
import { deriveWorkItems } from "@/lib/derive/tasks-alerts";

const PRIORITY_RANK = { critical: 0, high: 1, medium: 2, low: 3 } as const;

export function useWorkItems(): WorkItem[] {
  const verifications = useOverlay((s) => s.fieldVerifications);
  const uploadedIds = useOverlay((s) => s.uploadedContractIds);
  const customContracts = useOverlay((s) => s.customContracts);
  const overrides = useOverlay((s) => s.workItemOverrides);
  const manualItems = useOverlay((s) => s.manualItems);

  return useMemo(() => {
    const uploaded = uploadedIds
      .map((id) => getContract(id))
      .filter((c): c is Contract => !!c && UPLOAD_QUEUE.some((q) => q.id === c.id));
    const visible = [...SEED_CONTRACTS, ...uploaded, ...customContracts];
    const derived = deriveWorkItems(visible, verifications);
    const all = [...derived, ...manualItems].map((item) => ({
      ...item,
      ...overrides[item.id],
    }));
    return all.sort((a, b) => {
      const open = (x: WorkItem) => (x.status === "open" || x.status === "in_progress" ? 0 : 1);
      if (open(a) !== open(b)) return open(a) - open(b);
      if (PRIORITY_RANK[a.priority] !== PRIORITY_RANK[b.priority])
        return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      return (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999");
    });
  }, [verifications, uploadedIds, customContracts, overrides, manualItems]);
}
