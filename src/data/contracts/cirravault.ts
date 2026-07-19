import type { Contract } from "@/data/types";

// c-001 — Cirravault Cloud Data Platform Subscription.
// The urgent renewal beat: auto-renews Sep 30, 2026 into a NEW 36-month term;
// 60-day notice puts the real deadline at Aug 1, 2026 — 13 days from the
// workspace clock. Missing it commits ~$756K.

export const cirravault: Contract = {
  id: "c-001",
  title: "Cloud Data Platform Subscription Agreement",
  counterparty: "Cirravault Systems, Inc.",
  counterpartyCategory: "Cloud infrastructure",
  type: "SaaS",
  status: "active",
  valueUsd: 756_000,
  effectiveDate: "2023-10-01",
  expirationDate: "2026-09-30",
  autoRenew: true,
  noticeDays: 60,
  renewalTermMonths: 36,
  ingestedAt: "2026-06-02",
  fields: [
    {
      id: "c-001:contract_type",
      contractId: "c-001",
      key: "contract_type",
      label: "Contract type",
      group: "Overview",
      value: { kind: "text", value: "SaaS subscription" },
      confidence: 0.98,
      source: {
        sectionId: "c-001-s1",
        excerpt:
          "This Cloud Data Platform Subscription Agreement (the “Agreement”)",
      },
    },
    {
      id: "c-001:counterparty",
      contractId: "c-001",
      key: "counterparty",
      label: "Counterparty",
      group: "Overview",
      value: { kind: "text", value: "Cirravault Systems, Inc." },
      confidence: 0.98,
      source: {
        sectionId: "c-001-s1",
        excerpt:
          "Cirravault Systems, Inc., a Delaware corporation with offices at 550 Harrison Avenue, Boston, MA 02118 (“Cirravault”)",
      },
    },
    {
      id: "c-001:effective_date",
      contractId: "c-001",
      key: "effective_date",
      label: "Effective date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2023-10-01" },
      confidence: 0.97,
      source: {
        sectionId: "c-001-s2",
        excerpt: "commence on October 1, 2023 (the “Effective Date”)",
      },
    },
    {
      id: "c-001:expiration_date",
      contractId: "c-001",
      key: "expiration_date",
      label: "Expiration date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2026-09-30" },
      confidence: 0.96,
      source: {
        sectionId: "c-001-s2",
        excerpt:
          "continue for an initial term of thirty-six (36) months through September 30, 2026 (the “Initial Term”)",
      },
    },
    {
      id: "c-001:auto_renew",
      contractId: "c-001",
      key: "auto_renew",
      label: "Auto-renewal",
      group: "Term & renewal",
      value: { kind: "boolean", value: true },
      confidence: 0.95,
      source: {
        sectionId: "c-001-s2",
        excerpt:
          "this Agreement shall automatically renew for successive renewal terms of thirty-six (36) months each",
      },
    },
    {
      id: "c-001:renewal_date",
      contractId: "c-001",
      key: "renewal_date",
      label: "Renewal date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2026-09-30" },
      confidence: 0.94,
      source: {
        sectionId: "c-001-s2",
        excerpt: "Upon expiration of the Initial Term and each renewal term",
      },
    },
    {
      id: "c-001:notice_days",
      contractId: "c-001",
      key: "notice_days",
      label: "Non-renewal notice window",
      group: "Term & renewal",
      value: { kind: "duration", days: 60, raw: "sixty (60) days" },
      confidence: 0.95,
      source: {
        sectionId: "c-001-s2",
        excerpt:
          "written notice of non-renewal at least sixty (60) days prior to the end of the then-current term",
      },
    },
    {
      id: "c-001:notice_deadline",
      contractId: "c-001",
      key: "notice_deadline",
      label: "Notice deadline",
      group: "Term & renewal",
      value: { kind: "date", iso: "2026-08-01" },
      confidence: 0.88,
      source: {
        sectionId: "c-001-s2",
        excerpt:
          "written notice of non-renewal at least sixty (60) days prior to the end of the then-current term",
      },
      note: "Computed: September 30, 2026 term end − 60 days' notice.",
    },
    {
      id: "c-001:term_length",
      contractId: "c-001",
      key: "term_length",
      label: "Renewal term length",
      group: "Term & renewal",
      value: { kind: "duration", days: 1095, raw: "thirty-six (36) months" },
      confidence: 0.94,
      source: {
        sectionId: "c-001-s2",
        excerpt: "successive renewal terms of thirty-six (36) months each",
      },
    },
    {
      id: "c-001:total_value",
      contractId: "c-001",
      key: "total_value",
      label: "Total contract value",
      group: "Financial",
      value: { kind: "money", usd: 756_000 },
      confidence: 0.91,
      source: {
        sectionId: "c-001-s3",
        excerpt:
          "an annual subscription fee of $252,000, payable annually in advance",
      },
      note: "Computed: $252,000 annual fee × 36-month term.",
    },
    {
      id: "c-001:payment_schedule",
      contractId: "c-001",
      key: "payment_schedule",
      label: "Payment schedule",
      group: "Financial",
      value: { kind: "text", value: "Annual prepay, due October 1" },
      confidence: 0.96,
      source: {
        sectionId: "c-001-s3",
        excerpt:
          "payable annually in advance on or before October 1 of each contract year",
      },
    },
    {
      id: "c-001:liability_cap",
      contractId: "c-001",
      key: "liability_cap",
      label: "Liability cap",
      group: "Legal terms",
      value: { kind: "money", usd: 252_000 },
      confidence: 0.93,
      source: {
        sectionId: "c-001-s9",
        excerpt:
          "shall not exceed the total fees paid by Customer in the twelve (12) months preceding the event giving rise to the claim",
      },
      note: "12 months of fees ≈ $252,000 at current pricing.",
    },
    {
      id: "c-001:governing_law",
      contractId: "c-001",
      key: "governing_law",
      label: "Governing law",
      group: "Legal terms",
      value: { kind: "text", value: "Delaware" },
      confidence: 0.97,
      source: {
        sectionId: "c-001-s12",
        excerpt:
          "governed by and construed in accordance with the laws of the State of Delaware",
      },
    },
    {
      id: "c-001:sla",
      contractId: "c-001",
      key: "sla",
      label: "Service level",
      group: "Legal terms",
      value: { kind: "text", value: "99.9% monthly uptime, service credits" },
      confidence: 0.94,
      source: {
        sectionId: "c-001-s4",
        excerpt:
          "maintain availability of the Service of at least 99.9% measured monthly",
      },
    },
  ],
  obligations: [
    {
      id: "c-001:ob-notice",
      contractId: "c-001",
      title: "Deliver non-renewal notice (or accept a new 36-month term)",
      owedBy: "us",
      dueDate: "2026-08-01",
      description:
        "Written notice of non-renewal must reach Cirravault by August 1, 2026. Otherwise the agreement renews automatically for 36 months at ~$756,000.",
      source: {
        sectionId: "c-001-s2",
        excerpt:
          "written notice of non-renewal at least sixty (60) days prior to the end of the then-current term",
      },
    },
    {
      id: "c-001:ob-prepay",
      contractId: "c-001",
      title: "Annual subscription prepayment ($252,000)",
      owedBy: "us",
      recurrence: "annual",
      dueDate: "2026-10-01",
      description:
        "Annual fee of $252,000 payable in advance each October 1 (falls away if non-renewal notice is delivered).",
      source: {
        sectionId: "c-001-s3",
        excerpt:
          "payable annually in advance on or before October 1 of each contract year",
      },
    },
    {
      id: "c-001:ob-usage-report",
      contractId: "c-001",
      title: "Cirravault: quarterly usage report",
      owedBy: "them",
      recurrence: "quarterly",
      description:
        "Cirravault delivers a usage and availability report within 15 days of each calendar quarter end.",
      source: {
        sectionId: "c-001-s4",
        excerpt:
          "furnish Customer a usage and availability report within fifteen (15) days following the close of each calendar quarter",
      },
    },
  ],
  risks: [
    {
      id: "c-001:risk-autorenew",
      contractId: "c-001",
      kind: "auto_renewal_trap",
      severity: "high",
      summary:
        "60-day notice window with a 36-month renewal term — missing August 1 commits ~$756K through 2029.",
      fieldId: "c-001:notice_deadline",
    },
  ],
  milestones: [],
  document: {
    filename: "Cirravault_Cloud_Data_Platform_Subscription_2023.pdf",
    format: "pdf",
    pages: 14,
    sections: [
      {
        id: "c-001-s1",
        number: "1",
        heading: "Parties; Definitions",
        paragraphs: [
          "This Cloud Data Platform Subscription Agreement (the “Agreement”) is entered into by and between Vantora Labs, Inc., a Delaware corporation with offices at 4120 Delgany Street, Denver, CO 80216 (“Customer”), and Cirravault Systems, Inc., a Delaware corporation with offices at 550 Harrison Avenue, Boston, MA 02118 (“Cirravault”).",
          "“Service” means Cirravault's hosted cloud data platform, including managed ingestion pipelines, warehouse compute, and associated documentation, as described in Order Form CV-2023-0847. Capitalized terms not defined inline have the meanings given in this Section 1.",
        ],
      },
      {
        id: "c-001-s2",
        number: "2",
        heading: "Term; Automatic Renewal",
        paragraphs: [
          "The term of this Agreement shall commence on October 1, 2023 (the “Effective Date”) and shall continue for an initial term of thirty-six (36) months through September 30, 2026 (the “Initial Term”).",
          "Upon expiration of the Initial Term and each renewal term, this Agreement shall automatically renew for successive renewal terms of thirty-six (36) months each, at the pricing then in effect under Section 3, unless either party delivers written notice of non-renewal at least sixty (60) days prior to the end of the then-current term. Notice of non-renewal shall be delivered in accordance with Section 12.3 and shall be effective only upon receipt.",
        ],
      },
      {
        id: "c-001-s3",
        number: "3",
        heading: "Fees; Payment",
        paragraphs: [
          "Customer shall pay Cirravault an annual subscription fee of $252,000, payable annually in advance on or before October 1 of each contract year. Fees are stated and payable in U.S. dollars and are exclusive of applicable taxes.",
          "Amounts not received when due shall accrue interest at the lesser of one percent (1%) per month or the maximum rate permitted by law. Cirravault may increase the annual fee for any renewal term by written notice given no later than ninety (90) days before the start of such term.",
        ],
      },
      {
        id: "c-001-s4",
        number: "4",
        heading: "Service Levels",
        paragraphs: [
          "Cirravault shall maintain availability of the Service of at least 99.9% measured monthly, excluding scheduled maintenance windows announced at least seventy-two (72) hours in advance. Customer's sole and exclusive remedy for Cirravault's failure to meet this availability commitment is the service credits set forth in Schedule 2.",
          "Cirravault shall furnish Customer a usage and availability report within fifteen (15) days following the close of each calendar quarter.",
        ],
      },
      {
        id: "c-001-s5",
        number: "5",
        heading: "Confidentiality",
        paragraphs: [
          "Each party shall protect the other party's Confidential Information with at least the degree of care it uses for its own confidential information of like kind, and in no event less than reasonable care. Confidential Information may be used solely to perform under, or exercise rights granted by, this Agreement.",
        ],
      },
      {
        id: "c-001-s6",
        number: "6",
        heading: "Data; Intellectual Property",
        paragraphs: [
          "As between the parties, Customer retains all right, title, and interest in and to Customer Data. Cirravault retains all right, title, and interest in and to the Service and all related software and documentation. No rights are granted except as expressly set forth herein.",
        ],
      },
      {
        id: "c-001-s7",
        number: "7",
        heading: "Warranties",
        paragraphs: [
          "Each party warrants that it has the authority to enter into this Agreement. Cirravault warrants that the Service will perform materially in accordance with its documentation. EXCEPT AS EXPRESSLY STATED, THE SERVICE IS PROVIDED “AS IS” AND CIRRAVAULT DISCLAIMS ALL OTHER WARRANTIES, EXPRESS OR IMPLIED.",
        ],
      },
      {
        id: "c-001-s8",
        number: "8",
        heading: "Indemnification",
        paragraphs: [
          "Cirravault shall defend Customer against any third-party claim alleging that the Service infringes a U.S. patent, copyright, or trademark, and shall indemnify Customer against amounts finally awarded or agreed in settlement, provided Customer gives prompt notice and reasonable cooperation.",
        ],
      },
      {
        id: "c-001-s9",
        number: "9",
        heading: "Limitation of Liability",
        paragraphs: [
          "EXCEPT FOR BREACHES OF SECTION 5 OR AMOUNTS PAYABLE UNDER SECTION 8, EACH PARTY'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT shall not exceed the total fees paid by Customer in the twelve (12) months preceding the event giving rise to the claim. IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES.",
        ],
      },
      {
        id: "c-001-s10",
        number: "10",
        heading: "Insurance",
        paragraphs: [
          "Cirravault shall maintain commercially reasonable insurance coverage, including technology errors and omissions coverage of not less than $2,000,000 in the aggregate, for the duration of the term.",
        ],
      },
      {
        id: "c-001-s11",
        number: "11",
        heading: "Termination",
        paragraphs: [
          "Either party may terminate this Agreement for material breach upon thirty (30) days' written notice if such breach remains uncured at the end of the notice period. Upon termination, Customer Data shall be made available for export for thirty (30) days.",
        ],
      },
      {
        id: "c-001-s12",
        number: "12",
        heading: "General; Governing Law",
        paragraphs: [
          "This Agreement is governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflicts of law principles. The parties consent to the exclusive jurisdiction of the state and federal courts located in Wilmington, Delaware.",
          "12.3 Notices. Notices must be in writing and delivered to the addresses in Section 1, with a copy to legal@vantoralabs.com and notices@cirravault.com respectively, and are effective upon receipt.",
        ],
      },
    ],
  },
};
