import type { Team, User } from "@/data/types";

// Vantora Labs, Inc. — climate-risk analytics, Denver.
// Priya is the signed-in user throughout.

export const USERS: User[] = [
  {
    id: "u-priya",
    name: "Priya Raghavan",
    initials: "PR",
    role: "General Counsel",
    teamId: "t-legal",
    email: "priya.raghavan@vantoralabs.com",
  },
  {
    id: "u-tomas",
    name: "Tomás Herrera",
    initials: "TH",
    role: "Senior Commercial Counsel",
    teamId: "t-legal",
    email: "tomas.herrera@vantoralabs.com",
  },
  {
    id: "u-nadia",
    name: "Nadia Okafor",
    initials: "NO",
    role: "Procurement Operations Manager",
    teamId: "t-procurement",
    email: "nadia.okafor@vantoralabs.com",
  },
  {
    id: "u-ben",
    name: "Ben Whitfield",
    initials: "BW",
    role: "Procurement Analyst",
    teamId: "t-procurement",
    email: "ben.whitfield@vantoralabs.com",
  },
  {
    id: "u-ingrid",
    name: "Ingrid Solberg",
    initials: "IS",
    role: "VP Finance",
    teamId: "t-finance",
    email: "ingrid.solberg@vantoralabs.com",
  },
  {
    id: "u-marcus",
    name: "Marcus Vale",
    initials: "MV",
    role: "Senior FP&A Analyst",
    teamId: "t-finance",
    email: "marcus.vale@vantoralabs.com",
  },
];

export const TEAMS: Team[] = [
  { id: "t-legal", name: "Legal", memberIds: ["u-priya", "u-tomas"] },
  { id: "t-procurement", name: "Procurement", memberIds: ["u-nadia", "u-ben"] },
  { id: "t-finance", name: "Finance", memberIds: ["u-ingrid", "u-marcus"] },
];

export const CURRENT_USER_ID = "u-priya";

export const WORKSPACE = {
  name: "Vantora Labs",
  legalName: "Vantora Labs, Inc.",
  descriptor: "Contract workspace",
};
