import type { Contract, ResolvedSourceRef, SourceRef } from "@/data/types";

import { cirravault } from "@/data/contracts/cirravault";
import { pektra } from "@/data/contracts/pektra";
import { relayforge } from "@/data/contracts/relayforge";
import { torvaneMsa } from "@/data/contracts/torvane-msa";
import { torvaneSow1 } from "@/data/contracts/torvane-sow1";
import { torvaneSow2 } from "@/data/contracts/torvane-sow2";
import { harkline } from "@/data/contracts/harkline";
import { bramblewood } from "@/data/contracts/bramblewood";
import { kearns } from "@/data/contracts/kearns";
import { rookeryPoint } from "@/data/contracts/rookery-point";
import { marshEmployment } from "@/data/contracts/marsh-employment";
import { ostranderNda } from "@/data/contracts/ostrander-nda";
import { quillonNda } from "@/data/contracts/quillon-nda";
import { tessellate } from "@/data/contracts/tessellate";
import { nimbara } from "@/data/contracts/nimbara";
import { aldervik } from "@/data/contracts/aldervik";
import { calderFinch } from "@/data/contracts/calder-finch";
import { brightloom } from "@/data/contracts/brightloom";

/** Contracts visible in the Repository from first load. */
export const SEED_CONTRACTS: readonly Contract[] = Object.freeze([
  cirravault,
  pektra,
  relayforge,
  torvaneMsa,
  torvaneSow1,
  torvaneSow2,
  harkline,
  bramblewood,
  kearns,
  rookeryPoint,
  marshEmployment,
  ostranderNda,
  quillonNda,
  tessellate,
  aldervik,
  calderFinch,
]);

/** Pre-authored contracts that materialize through the upload flow, in order. */
export const UPLOAD_QUEUE: readonly Contract[] = Object.freeze([nimbara, brightloom]);

export const ALL_CONTRACTS: readonly Contract[] = Object.freeze([
  ...SEED_CONTRACTS,
  ...UPLOAD_QUEUE,
]);

const byId = new Map(ALL_CONTRACTS.map((c) => [c.id, c]));

export function getContract(id: string): Contract | undefined {
  // Cycled upload ids look like "c-018#2" — resolve to the base contract.
  return byId.get(id) ?? byId.get(id.split("#")[0]);
}

const fieldIndex = new Map(
  ALL_CONTRACTS.flatMap((c) => c.fields.map((f) => [f.id, f] as const))
);

export function getField(fieldId: string) {
  return fieldIndex.get(fieldId);
}

/** Locate a source excerpt inside its section. Returns null if it can't be
 * resolved — check-seed guarantees that never happens for seed data. */
export function resolveSourceRef(
  contract: Contract,
  ref: SourceRef
): ResolvedSourceRef | null {
  const section = contract.document.sections.find((s) => s.id === ref.sectionId);
  if (!section) return null;
  for (let i = 0; i < section.paragraphs.length; i++) {
    const idx = section.paragraphs[i].indexOf(ref.excerpt);
    if (idx >= 0) {
      return {
        ...ref,
        paragraphIndex: i,
        charStart: idx,
        charEnd: idx + ref.excerpt.length,
      };
    }
  }
  return null;
}

export { USERS, TEAMS, CURRENT_USER_ID, WORKSPACE } from "@/data/people";
