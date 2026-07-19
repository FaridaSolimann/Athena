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

interface UiState {
  clausePeek: ClausePeekTarget | null;
  openClausePeek: (target: ClausePeekTarget) => void;
  closeClausePeek: () => void;
}

export const useUi = create<UiState>((set) => ({
  clausePeek: null,
  openClausePeek: (target) => set({ clausePeek: target }),
  closeClausePeek: () => set({ clausePeek: null }),
}));
