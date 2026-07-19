"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  AssigneeRef,
  ApprovalStatus,
  FieldValue,
  ISODate,
  Priority,
  Team,
  WorkItem,
  WorkItemStatus,
} from "@/data/types";
import { TODAY_ISO } from "@/lib/demo-clock";

// Everything the user does lives here as an overlay on immutable seed data.
// Selectors (src/lib/selectors.ts) merge the two at read time.

export interface Verification {
  status: "confirmed" | "corrected" | "rejected";
  correctedValue?: FieldValue;
  note?: string;
  by: string; // user id
  at: ISODate;
}

export interface WorkItemOverride {
  status?: WorkItemStatus;
  assignee?: AssigneeRef;
  priority?: Priority;
  approvalStatus?: ApprovalStatus;
}

export interface UploadJob {
  id: string;
  filename: string;
  sizeLabel: string;
  stage: "uploading" | "extracting";
  /** Contract that materializes when this job resolves. */
  contractId: string;
  startedAt: number;
}

export type IntegrationStatus = "connected" | "disconnected";

interface OverlayState {
  fieldVerifications: Record<string, Verification>; // key = field id
  workItemOverrides: Record<string, WorkItemOverride>; // key = work item id
  manualItems: WorkItem[];
  uploadedContractIds: string[];
  inFlightUploads: UploadJob[];
  customTeams: Team[];
  teamMemberOverrides: Record<string, string[]>; // team id -> member ids
  integrations: Record<string, IntegrationStatus>;
  profileName?: string;
  recentQueries: string[];

  verifyField: (fieldId: string, v: Omit<Verification, "at">) => void;
  clearVerification: (fieldId: string) => void;
  overrideWorkItem: (id: string, patch: WorkItemOverride) => void;
  addManualItem: (item: WorkItem) => void;
  startUpload: (job: UploadJob) => void;
  advanceUpload: (jobId: string, stage: "extracting") => void;
  completeUpload: (jobId: string) => void;
  addTeam: (team: Team) => void;
  setTeamMembers: (teamId: string, memberIds: string[]) => void;
  removeTeam: (teamId: string) => void;
  setIntegration: (id: string, status: IntegrationStatus) => void;
  setProfileName: (name: string) => void;
  pushRecentQuery: (q: string) => void;
  resetWorkspace: () => void;
}

const initialData = {
  fieldVerifications: {},
  workItemOverrides: {},
  manualItems: [],
  uploadedContractIds: [],
  inFlightUploads: [],
  customTeams: [],
  teamMemberOverrides: {},
  integrations: {},
  profileName: undefined,
  recentQueries: [],
} satisfies Partial<OverlayState>;

export const useOverlay = create<OverlayState>()(
  persist(
    (set) => ({
      ...initialData,

      verifyField: (fieldId, v) =>
        set((s) => ({
          fieldVerifications: {
            ...s.fieldVerifications,
            [fieldId]: { ...v, at: TODAY_ISO },
          },
        })),
      clearVerification: (fieldId) =>
        set((s) => {
          const next = { ...s.fieldVerifications };
          delete next[fieldId];
          return { fieldVerifications: next };
        }),
      overrideWorkItem: (id, patch) =>
        set((s) => ({
          workItemOverrides: {
            ...s.workItemOverrides,
            [id]: { ...s.workItemOverrides[id], ...patch },
          },
        })),
      addManualItem: (item) =>
        set((s) => ({ manualItems: [...s.manualItems, item] })),
      startUpload: (job) =>
        set((s) => ({ inFlightUploads: [...s.inFlightUploads, job] })),
      advanceUpload: (jobId, stage) =>
        set((s) => ({
          inFlightUploads: s.inFlightUploads.map((j) =>
            j.id === jobId ? { ...j, stage } : j
          ),
        })),
      completeUpload: (jobId) =>
        set((s) => {
          const job = s.inFlightUploads.find((j) => j.id === jobId);
          if (!job) return s;
          return {
            inFlightUploads: s.inFlightUploads.filter((j) => j.id !== jobId),
            uploadedContractIds: s.uploadedContractIds.includes(job.contractId)
              ? s.uploadedContractIds
              : [...s.uploadedContractIds, job.contractId],
          };
        }),
      addTeam: (team) => set((s) => ({ customTeams: [...s.customTeams, team] })),
      setTeamMembers: (teamId, memberIds) =>
        set((s) => ({
          teamMemberOverrides: { ...s.teamMemberOverrides, [teamId]: memberIds },
        })),
      removeTeam: (teamId) =>
        set((s) => ({
          customTeams: s.customTeams.filter((t) => t.id !== teamId),
        })),
      setIntegration: (id, status) =>
        set((s) => ({ integrations: { ...s.integrations, [id]: status } })),
      setProfileName: (name) => set({ profileName: name }),
      pushRecentQuery: (q) =>
        set((s) => ({
          recentQueries: [q, ...s.recentQueries.filter((x) => x !== q)].slice(0, 6),
        })),
      resetWorkspace: () => set({ ...initialData }),
    }),
    {
      name: "athena.v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        fieldVerifications: s.fieldVerifications,
        workItemOverrides: s.workItemOverrides,
        manualItems: s.manualItems,
        uploadedContractIds: s.uploadedContractIds,
        // in-flight uploads intentionally resolve on next load
        customTeams: s.customTeams,
        teamMemberOverrides: s.teamMemberOverrides,
        integrations: s.integrations,
        profileName: s.profileName,
        recentQueries: s.recentQueries,
      }),
    }
  )
);

export function resetWorkspaceAndReload() {
  useOverlay.persist.clearStorage();
  window.location.reload();
}
