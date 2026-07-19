import type { Contract } from "@/data/types";

// c-005 — Torvane SOW #1: Data Platform Migration (child of c-004).
// $456,000 fixed fee across three $152,000 milestones (Exhibit A):
// M1 Discovery & architecture (paid May 15, 2026), M2 Migration cutover
// acceptance (Aug 15, 2026), M3 Hypercare completion (Dec 31, 2026).
// Liability cap lives in the parent MSA ($2,000,000 aggregate).

export const torvaneSow1: Contract = {
  id: "c-005",
  title: "SOW #1 — Data Platform Migration",
  counterparty: "Torvane Consulting Group LLC",
  counterpartyCategory: "IT consulting",
  type: "SOW",
  status: "active",
  valueUsd: 456_000,
  effectiveDate: "2026-02-01",
  expirationDate: "2026-12-31",
  autoRenew: false,
  familyParentId: "c-004",
  ingestedAt: "2026-06-03",
  fields: [
    {
      id: "c-005:contract_type",
      contractId: "c-005",
      key: "contract_type",
      label: "Contract type",
      group: "Overview",
      value: { kind: "text", value: "Statement of work" },
      confidence: 0.98,
      source: {
        sectionId: "c-005-s1",
        excerpt: "This Statement of Work #1 (this “SOW”)",
      },
    },
    {
      id: "c-005:counterparty",
      contractId: "c-005",
      key: "counterparty",
      label: "Counterparty",
      group: "Overview",
      value: { kind: "text", value: "Torvane Consulting Group LLC" },
      confidence: 0.98,
      source: {
        sectionId: "c-005-s1",
        excerpt: "Torvane Consulting Group LLC (“Torvane”)",
      },
    },
    {
      id: "c-005:effective_date",
      contractId: "c-005",
      key: "effective_date",
      label: "Effective date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2026-02-01" },
      confidence: 0.97,
      source: {
        sectionId: "c-005-s3",
        excerpt: "commence on February 1, 2026 (the “SOW Effective Date”)",
      },
    },
    {
      id: "c-005:expiration_date",
      contractId: "c-005",
      key: "expiration_date",
      label: "Expiration date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2026-12-31" },
      confidence: 0.96,
      source: {
        sectionId: "c-005-s3",
        excerpt: "continue through December 31, 2026",
      },
    },
    {
      id: "c-005:auto_renew",
      contractId: "c-005",
      key: "auto_renew",
      label: "Auto-renewal",
      group: "Term & renewal",
      value: { kind: "boolean", value: false },
      confidence: 0.95,
      source: {
        sectionId: "c-005-s3",
        excerpt:
          "This SOW does not renew; any extension shall be by written change order executed by both parties",
      },
    },
    {
      id: "c-005:term_length",
      contractId: "c-005",
      key: "term_length",
      label: "Term length",
      group: "Term & renewal",
      value: { kind: "duration", days: 334, raw: "February 1 through December 31, 2026" },
      confidence: 0.86,
      source: {
        sectionId: "c-005-s3",
        excerpt:
          "commence on February 1, 2026 (the “SOW Effective Date”) and shall continue through December 31, 2026",
      },
      note: "Computed: 11-month project term from the stated start and end dates.",
    },
    {
      id: "c-005:total_value",
      contractId: "c-005",
      key: "total_value",
      label: "Total contract value",
      group: "Financial",
      value: { kind: "money", usd: 456_000 },
      confidence: 0.96,
      source: {
        sectionId: "c-005-sA",
        excerpt:
          "The fixed fee of $456,000 is payable in three equal milestones of $152,000 each",
      },
    },
    {
      id: "c-005:payment_schedule",
      contractId: "c-005",
      key: "payment_schedule",
      label: "Payment schedule",
      group: "Financial",
      value: {
        kind: "text",
        value: "Three milestones of $152,000 (May 15 / Aug 15 / Dec 31, 2026)",
      },
      confidence: 0.94,
      source: {
        sectionId: "c-005-sA",
        excerpt:
          "invoiced upon Customer's written acceptance of the corresponding deliverables",
      },
    },
    {
      id: "c-005:liability_cap",
      contractId: "c-005",
      key: "liability_cap",
      label: "Liability cap",
      group: "Legal terms",
      value: { kind: "text", value: "Per MSA — $2,000,000 aggregate" },
      confidence: 0.88,
      source: {
        sectionId: "c-005-s7",
        excerpt:
          "subject to the aggregate limitation of liability set forth in Section 9 of the MSA",
      },
      note: "Cap lives in the parent MSA (c-004): $2,000,000 aggregate across the MSA and all SOWs.",
    },
    {
      id: "c-005:governing_law",
      contractId: "c-005",
      key: "governing_law",
      label: "Governing law",
      group: "Legal terms",
      value: { kind: "text", value: "New York" },
      confidence: 0.95,
      source: {
        sectionId: "c-005-s7",
        excerpt:
          "This SOW is governed by the laws of the State of New York in accordance with Section 12 of the MSA",
      },
    },
    {
      id: "c-005:ip_ownership",
      contractId: "c-005",
      key: "ip_ownership",
      label: "IP ownership",
      group: "Legal terms",
      value: { kind: "text", value: "Deliverables assigned to Vantora per MSA Section 7" },
      confidence: 0.93,
      source: {
        sectionId: "c-005-s2",
        excerpt:
          "All deliverables under this SOW are subject to Section 7 of the MSA and shall be assigned to Customer upon payment of the corresponding milestone fee",
      },
    },
    {
      id: "c-005:termination",
      contractId: "c-005",
      key: "termination",
      label: "Termination",
      group: "Legal terms",
      value: {
        kind: "text",
        value: "Per MSA — Vantora may terminate for convenience on 30 days' notice",
      },
      confidence: 0.82,
      source: {
        sectionId: "c-005-s3",
        excerpt: "unless earlier terminated in accordance with the MSA",
      },
      note: "Termination rights are inherited from the parent MSA (c-004), Section 11.",
    },
  ],
  obligations: [
    {
      id: "c-005:ob-cutover",
      contractId: "c-005",
      title: "Torvane: complete migration cutover",
      owedBy: "them",
      dueDate: "2026-08-01",
      description:
        "Torvane must complete the production migration cutover no later than August 1, 2026, per the project schedule in Section 6.",
      source: {
        sectionId: "c-005-s6",
        excerpt:
          "shall complete the production migration cutover no later than August 1, 2026",
      },
    },
    {
      id: "c-005:ob-acceptance",
      contractId: "c-005",
      title: "Acceptance sign-off on the production cutover",
      owedBy: "us",
      description:
        "Vantora must deliver written acceptance sign-off (or a statement of deficiencies) within ten business days after Torvane completes the production cutover.",
      source: {
        sectionId: "c-005-s5",
        excerpt:
          "Customer shall provide acceptance sign-off within ten (10) business days following completion of the cutover",
      },
    },
  ],
  risks: [],
  milestones: [
    {
      id: "c-005:m1",
      contractId: "c-005",
      label: "M1 — Discovery & architecture",
      amountUsd: 152_000,
      dueDate: "2026-05-15",
      paid: true,
    },
    {
      id: "c-005:m2",
      contractId: "c-005",
      label: "M2 — Migration cutover acceptance",
      amountUsd: 152_000,
      dueDate: "2026-08-15",
    },
    {
      id: "c-005:m3",
      contractId: "c-005",
      label: "M3 — Hypercare completion",
      amountUsd: 152_000,
      dueDate: "2026-12-31",
    },
  ],
  document: {
    filename: "Torvane_SOW1_Data_Platform_Migration.pdf",
    format: "pdf",
    pages: 9,
    sections: [
      {
        id: "c-005-s1",
        number: "1",
        heading: "Engagement; Relationship to Master Agreement",
        paragraphs: [
          "This Statement of Work #1 (this “SOW”) is entered into as of February 1, 2026 by and between Vantora Labs, Inc. (“Customer”) and Torvane Consulting Group LLC (“Torvane”) pursuant to the Master Services Agreement between the parties dated March 1, 2025 (the “MSA”). This SOW is incorporated into and governed by the MSA, and capitalized terms not defined herein have the meanings given in the MSA.",
        ],
      },
      {
        id: "c-005-s2",
        number: "2",
        heading: "Scope of Services",
        paragraphs: [
          "Torvane shall migrate Customer's legacy on-premises data warehouse and associated ingestion pipelines to Customer's cloud data platform, including discovery and target-state architecture, pipeline re-engineering, historical data migration and reconciliation, production cutover, and post-cutover hypercare, as further detailed in Exhibit A.",
          "All deliverables under this SOW are subject to Section 7 of the MSA and shall be assigned to Customer upon payment of the corresponding milestone fee.",
        ],
      },
      {
        id: "c-005-s3",
        number: "3",
        heading: "Term",
        paragraphs: [
          "This SOW shall commence on February 1, 2026 (the “SOW Effective Date”) and shall continue through December 31, 2026, unless earlier terminated in accordance with the MSA. This SOW does not renew; any extension shall be by written change order executed by both parties.",
        ],
      },
      {
        id: "c-005-s4",
        number: "4",
        heading: "Fees; Milestone Payments",
        paragraphs: [
          "In consideration of the Services, Customer shall pay Torvane a fixed fee of $456,000, payable in three milestone payments of $152,000 each upon Customer's acceptance of the corresponding milestone set forth in Exhibit A. Torvane shall invoice each milestone upon acceptance, and undisputed invoices shall be due within thirty (30) days of receipt.",
        ],
      },
      {
        id: "c-005-s5",
        number: "5",
        heading: "Acceptance",
        paragraphs: [
          "Customer shall review each deliverable and provide written acceptance or a statement of deficiencies within ten (10) business days of delivery, and deliverables not rejected within such period shall be deemed accepted. With respect to the production cutover, Customer shall provide acceptance sign-off within ten (10) business days following completion of the cutover.",
        ],
      },
      {
        id: "c-005-s6",
        number: "6",
        heading: "Project Schedule; Cutover",
        paragraphs: [
          "Torvane shall perform the Services in accordance with the project plan agreed during discovery and shall complete the production migration cutover no later than August 1, 2026. Torvane shall provide weekly written status reports throughout the engagement and shall staff the hypercare period through December 31, 2026.",
        ],
      },
      {
        id: "c-005-s7",
        number: "7",
        heading: "Limitation of Liability; General",
        paragraphs: [
          "Liability under this SOW is subject to the aggregate limitation of liability set forth in Section 9 of the MSA, which applies across the MSA and all Statements of Work taken together and is not enlarged by this SOW. This SOW is governed by the laws of the State of New York in accordance with Section 12 of the MSA.",
        ],
      },
      {
        id: "c-005-sA",
        number: "Exhibit A",
        heading: "Milestone Schedule",
        paragraphs: [
          "The fixed fee of $456,000 is payable in three equal milestones of $152,000 each, invoiced upon Customer's written acceptance of the corresponding deliverables.",
          "Milestone M1 — Discovery & architecture: $152,000, payable upon acceptance of the target-state architecture and migration plan, scheduled for May 15, 2026.",
          "Milestone M2 — Migration cutover acceptance: $152,000, payable upon Customer's acceptance of the production migration cutover, scheduled for August 15, 2026.",
          "Milestone M3 — Hypercare completion: $152,000, payable upon completion of the post-cutover hypercare period, scheduled for December 31, 2026.",
        ],
      },
    ],
  },
};
