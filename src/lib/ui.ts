"use client";

import { create } from "zustand";
import type { SourceRef } from "@/data/types";

/** Ephemeral UI state (never persisted): the global clause-peek sheet. */
export interface ClausePeekTarget {
  contractId: string;
  /** When peeking a field, its id — the sheet shows value + trust context. */
  fieldId?: string;
  /** Direct ref (obligations, risks) when there is no field. */
  ref?: SourceRef;
  title?: string;
}

/** Health of the live Gemini paths, reported by whichever call ran last.
 * "ok" clears the indicator; anything else lights it up in the top bar. */
export type AiHealth = "ok" | "no_key" | "rate_limited" | "unavailable";

interface UiState {
  clausePeek: ClausePeekTarget | null;
  openClausePeek: (target: ClausePeekTarget) => void;
  closeClausePeek: () => void;
  aiHealth: AiHealth;
  aiHealthAt: number;
  reportAiHealth: (health: AiHealth) => void;
}

export const useUi = create<UiState>((set) => ({
  clausePeek: null,
  openClausePeek: (target) => set({ clausePeek: target }),
  closeClausePeek: () => set({ clausePeek: null }),
  aiHealth: "ok",
  aiHealthAt: 0,
  reportAiHealth: (health) => set({ aiHealth: health, aiHealthAt: Date.now() }),
}));

/** Map a server fallback reason onto the indicator. */
export function reportAiReason(reason: unknown) {
  const r = String(reason ?? "");
  if (r === "no_key") useUi.getState().reportAiHealth("no_key");
  else if (r === "rate_limited") useUi.getState().reportAiHealth("rate_limited");
  else if (["timeout", "api_error", "invalid", "invalid_plan"].includes(r))
    useUi.getState().reportAiHealth("unavailable");
  // out_of_scope / unreadable are not health problems
}
