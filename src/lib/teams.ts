"use client";

import { useMemo } from "react";
import type { Team } from "@/data/types";
import { TEAMS } from "@/data";
import { useOverlay } from "@/lib/store";

/** Seed teams ⊕ user-created teams ⊕ membership edits. */
export function useTeams(): Team[] {
  const customTeams = useOverlay((s) => s.customTeams);
  const memberOverrides = useOverlay((s) => s.teamMemberOverrides);

  return useMemo(
    () =>
      [...TEAMS, ...customTeams].map((t) => ({
        ...t,
        memberIds: memberOverrides[t.id] ?? t.memberIds,
      })),
    [customTeams, memberOverrides]
  );
}
