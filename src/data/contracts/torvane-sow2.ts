import type { Contract } from "@/data/types";

// c-006 — Torvane SOW #2: Managed Analytics Operations (child of c-004).
// $58,000/month × 36 months = $2,088,000 (derived total). The demo-touched
// clause is the recurring deliverable: Torvane's monthly analytics-operations
// report due by the fifth (5th) business day of each month. Cap per MSA.

export const torvaneSow2: Contract = {
  id: "c-006",
  title: "SOW #2 — Managed Analytics Operations",
  counterparty: "Torvane Consulting Group LLC",
  counterpartyCategory: "IT consulting",
  type: "SOW",
  status: "active",
  valueUsd: 2_088_000,
  effectiveDate: "2025-07-01",
  expirationDate: "2028-06-30",
  autoRenew: false,
  familyParentId: "c-004",
  ingestedAt: "2026-06-03",
  fields: [
    {
      id: "c-006:contract_type",
      contractId: "c-006",
      key: "contract_type",
      label: "Contract type",
      group: "Overview",
      value: { kind: "text", value: "Statement of work" },
      confidence: 0.98,
      source: {
        sectionId: "c-006-s1",
        excerpt: "This Statement of Work #2 (this “SOW”)",
      },
    },
    {
      id: "c-006:counterparty",
      contractId: "c-006",
      key: "counterparty",
      label: "Counterparty",
      group: "Overview",
      value: { kind: "text", value: "Torvane Consulting Group LLC" },
      confidence: 0.98,
      source: {
        sectionId: "c-006-s1",
        excerpt: "Torvane Consulting Group LLC (“Torvane”)",
      },
    },
    {
      id: "c-006:effective_date",
      contractId: "c-006",
      key: "effective_date",
      label: "Effective date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2025-07-01" },
      confidence: 0.97,
      source: {
        sectionId: "c-006-s3",
        excerpt: "commence on July 1, 2025 (the “SOW Effective Date”)",
      },
    },
    {
      id: "c-006:expiration_date",
      contractId: "c-006",
      key: "expiration_date",
      label: "Expiration date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2028-06-30" },
      confidence: 0.96,
      source: {
        sectionId: "c-006-s3",
        excerpt: "continue for thirty-six (36) months through June 30, 2028",
      },
    },
    {
      id: "c-006:auto_renew",
      contractId: "c-006",
      key: "auto_renew",
      label: "Auto-renewal",
      group: "Term & renewal",
      value: { kind: "boolean", value: false },
      confidence: 0.95,
      source: {
        sectionId: "c-006-s3",
        excerpt:
          "This SOW does not renew; any extension shall be by written change order executed by both parties",
      },
    },
    {
      id: "c-006:term_length",
      contractId: "c-006",
      key: "term_length",
      label: "Term length",
      group: "Term & renewal",
      value: { kind: "duration", days: 1095, raw: "thirty-six (36) months" },
      confidence: 0.94,
      source: {
        sectionId: "c-006-s3",
        excerpt: "thirty-six (36) months",
      },
    },
    {
      id: "c-006:total_value",
      contractId: "c-006",
      key: "total_value",
      label: "Total contract value",
      group: "Financial",
      value: { kind: "money", usd: 2_088_000 },
      confidence: 0.86,
      source: {
        sectionId: "c-006-s4",
        excerpt: "a monthly fee of $58,000",
      },
      note: "Computed: $58,000 monthly fee × 36-month term.",
    },
    {
      id: "c-006:payment_schedule",
      contractId: "c-006",
      key: "payment_schedule",
      label: "Payment schedule",
      group: "Financial",
      value: { kind: "text", value: "Monthly in arrears, net 30" },
      confidence: 0.96,
      source: {
        sectionId: "c-006-s4",
        excerpt:
          "Torvane shall invoice monthly in arrears, and undisputed invoices shall be due within thirty (30) days of receipt",
      },
    },
    {
      id: "c-006:liability_cap",
      contractId: "c-006",
      key: "liability_cap",
      label: "Liability cap",
      group: "Legal terms",
      value: { kind: "text", value: "Per MSA — $2,000,000 aggregate" },
      confidence: 0.88,
      source: {
        sectionId: "c-006-s8",
        excerpt:
          "subject to the aggregate limitation of liability set forth in Section 9 of the MSA",
      },
      note: "Cap lives in the parent MSA (c-004): $2,000,000 aggregate across the MSA and all SOWs.",
    },
    {
      id: "c-006:governing_law",
      contractId: "c-006",
      key: "governing_law",
      label: "Governing law",
      group: "Legal terms",
      value: { kind: "text", value: "New York" },
      confidence: 0.95,
      source: {
        sectionId: "c-006-s8",
        excerpt:
          "This SOW is governed by the laws of the State of New York in accordance with Section 12 of the MSA",
      },
    },
    {
      id: "c-006:sla",
      contractId: "c-006",
      key: "sla",
      label: "Service level",
      group: "Legal terms",
      value: {
        kind: "text",
        value: "P1 incidents: acknowledge in 15 min, restore in 4 hrs (measured monthly)",
      },
      confidence: 0.93,
      source: {
        sectionId: "c-006-s6",
        excerpt:
          "acknowledge priority-one incidents within fifteen (15) minutes and shall restore affected pipelines within four (4) hours, measured monthly",
      },
    },
    {
      id: "c-006:termination",
      contractId: "c-006",
      key: "termination",
      label: "Termination",
      group: "Legal terms",
      value: {
        kind: "text",
        value: "Per MSA — Vantora may terminate for convenience on 30 days' notice",
      },
      confidence: 0.82,
      source: {
        sectionId: "c-006-s3",
        excerpt: "unless earlier terminated in accordance with the MSA",
      },
      note: "Termination rights are inherited from the parent MSA (c-004), Section 11.",
    },
  ],
  obligations: [
    {
      id: "c-006:ob-monthly-report",
      contractId: "c-006",
      title: "Torvane: monthly analytics-operations report",
      owedBy: "them",
      recurrence: "monthly",
      description:
        "Torvane delivers a written analytics-operations report for the preceding month — pipeline availability, incidents, data-quality metrics, ticket volumes, and a forward-looking risk assessment — by the fifth (5th) business day of each month.",
      source: {
        sectionId: "c-006-s5",
        excerpt:
          "No later than the fifth (5th) business day of each calendar month, Torvane shall deliver to Customer a written analytics-operations report covering the preceding month",
      },
    },
    {
      id: "c-006:ob-monthly-payment",
      contractId: "c-006",
      title: "Monthly managed-services fee ($58,000)",
      owedBy: "us",
      recurrence: "monthly",
      description:
        "Vantora pays the $58,000 monthly fee, invoiced in arrears and due within 30 days of receipt.",
      source: {
        sectionId: "c-006-s4",
        excerpt:
          "Customer shall pay Torvane a monthly fee of $58,000 for the managed services described in this SOW",
      },
    },
  ],
  risks: [],
  milestones: [],
  document: {
    filename: "Torvane_SOW2_Managed_Analytics_Ops.pdf",
    format: "pdf",
    pages: 8,
    sections: [
      {
        id: "c-006-s1",
        number: "1",
        heading: "Engagement; Relationship to Master Agreement",
        paragraphs: [
          "This Statement of Work #2 (this “SOW”) is entered into as of July 1, 2025 by and between Vantora Labs, Inc. (“Customer”) and Torvane Consulting Group LLC (“Torvane”) pursuant to the Master Services Agreement between the parties dated March 1, 2025 (the “MSA”). This SOW is incorporated into and governed by the MSA, and capitalized terms not defined herein have the meanings given in the MSA.",
        ],
      },
      {
        id: "c-006-s2",
        number: "2",
        heading: "Managed Services Scope",
        paragraphs: [
          "Torvane shall operate Customer's analytics environment on a managed-services basis, including pipeline monitoring and incident response, dashboard and semantic-layer maintenance, data-quality management, and stakeholder reporting support, in each case in accordance with the run-book agreed by the parties and updated from time to time by mutual written consent.",
        ],
      },
      {
        id: "c-006-s3",
        number: "3",
        heading: "Term",
        paragraphs: [
          "This SOW shall commence on July 1, 2025 (the “SOW Effective Date”) and shall continue for thirty-six (36) months through June 30, 2028, unless earlier terminated in accordance with the MSA. This SOW does not renew; any extension shall be by written change order executed by both parties.",
        ],
      },
      {
        id: "c-006-s4",
        number: "4",
        heading: "Fees; Invoicing",
        paragraphs: [
          "Customer shall pay Torvane a monthly fee of $58,000 for the managed services described in this SOW. Torvane shall invoice monthly in arrears, and undisputed invoices shall be due within thirty (30) days of receipt. Fees are stated and payable in U.S. dollars and are exclusive of applicable taxes.",
        ],
      },
      {
        id: "c-006-s5",
        number: "5",
        heading: "Monthly Operations Report",
        paragraphs: [
          "No later than the fifth (5th) business day of each calendar month, Torvane shall deliver to Customer a written analytics-operations report covering the preceding month, including pipeline availability and incident summaries, data-quality metrics against agreed thresholds, ticket volumes and resolution times, and a forward-looking risk and capacity assessment. The report shall be delivered to Customer's designated engagement owner in the format agreed in the run-book.",
        ],
      },
      {
        id: "c-006-s6",
        number: "6",
        heading: "Service Levels",
        paragraphs: [
          "Torvane shall acknowledge priority-one incidents within fifteen (15) minutes and shall restore affected pipelines within four (4) hours, measured monthly. Torvane's performance against these service levels shall be reported in the monthly analytics-operations report described in Section 5.",
        ],
      },
      {
        id: "c-006-s7",
        number: "7",
        heading: "Personnel",
        paragraphs: [
          "Torvane shall staff the engagement with a designated engagement manager and a named operations team identified in the run-book. Torvane shall not replace the engagement manager without Customer's prior written consent, not to be unreasonably withheld.",
        ],
      },
      {
        id: "c-006-s8",
        number: "8",
        heading: "Limitation of Liability; General",
        paragraphs: [
          "Liability under this SOW is subject to the aggregate limitation of liability set forth in Section 9 of the MSA, which applies across the MSA and all Statements of Work taken together and is not enlarged by this SOW. This SOW is governed by the laws of the State of New York in accordance with Section 12 of the MSA.",
        ],
      },
    ],
  },
};
