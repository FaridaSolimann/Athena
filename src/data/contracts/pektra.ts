import type { Contract } from "@/data/types";

// c-002 — Pektra Business Intelligence Platform Subscription.
// Steady mid-size SaaS renewal: auto-renews Oct 15, 2026 for another year at
// $94,800; 30-day notice window puts the deadline at Sep 15, 2026. Pektra also
// owes an SSO + audit-log-export deliverable by Sep 1, 2026.

export const pektra: Contract = {
  id: "c-002",
  title: "Business Intelligence Platform Subscription",
  counterparty: "Pektra Analytics, Inc.",
  counterpartyCategory: "Analytics software",
  type: "SaaS",
  status: "active",
  valueUsd: 94_800,
  effectiveDate: "2025-10-16",
  expirationDate: "2026-10-15",
  autoRenew: true,
  noticeDays: 30,
  renewalTermMonths: 12,
  ingestedAt: "2026-06-05",
  fields: [
    {
      id: "c-002:contract_type",
      contractId: "c-002",
      key: "contract_type",
      label: "Contract type",
      group: "Overview",
      value: { kind: "text", value: "SaaS subscription" },
      confidence: 0.98,
      source: {
        sectionId: "c-002-s1",
        excerpt:
          "This Business Intelligence Platform Subscription Agreement (the “Agreement”)",
      },
    },
    {
      id: "c-002:counterparty",
      contractId: "c-002",
      key: "counterparty",
      label: "Counterparty",
      group: "Overview",
      value: { kind: "text", value: "Pektra Analytics, Inc." },
      confidence: 0.98,
      source: {
        sectionId: "c-002-s1",
        excerpt:
          "Pektra Analytics, Inc., a Delaware corporation with offices at 2201 Bryant Street, San Francisco, CA 94110 (“Pektra”)",
      },
    },
    {
      id: "c-002:effective_date",
      contractId: "c-002",
      key: "effective_date",
      label: "Effective date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2025-10-16" },
      confidence: 0.97,
      source: {
        sectionId: "c-002-s2",
        excerpt: "commence on October 16, 2025 (the “Effective Date”)",
      },
    },
    {
      id: "c-002:expiration_date",
      contractId: "c-002",
      key: "expiration_date",
      label: "Expiration date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2026-10-15" },
      confidence: 0.96,
      source: {
        sectionId: "c-002-s2",
        excerpt:
          "continue for an initial term of twelve (12) months through October 15, 2026 (the “Initial Term”)",
      },
    },
    {
      id: "c-002:auto_renew",
      contractId: "c-002",
      key: "auto_renew",
      label: "Auto-renewal",
      group: "Term & renewal",
      value: { kind: "boolean", value: true },
      confidence: 0.95,
      source: {
        sectionId: "c-002-s2",
        excerpt:
          "this Agreement shall automatically renew for successive renewal terms of twelve (12) months each",
      },
    },
    {
      id: "c-002:renewal_date",
      contractId: "c-002",
      key: "renewal_date",
      label: "Renewal date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2026-10-15" },
      confidence: 0.94,
      source: {
        sectionId: "c-002-s2",
        excerpt: "Upon expiration of the Initial Term and each renewal term",
      },
    },
    {
      id: "c-002:notice_days",
      contractId: "c-002",
      key: "notice_days",
      label: "Non-renewal notice window",
      group: "Term & renewal",
      value: { kind: "duration", days: 30, raw: "thirty (30) days" },
      confidence: 0.95,
      source: {
        sectionId: "c-002-s2",
        excerpt:
          "written notice of non-renewal at least thirty (30) days prior to the end of the then-current term",
      },
    },
    {
      id: "c-002:notice_deadline",
      contractId: "c-002",
      key: "notice_deadline",
      label: "Notice deadline",
      group: "Term & renewal",
      value: { kind: "date", iso: "2026-09-15" },
      confidence: 0.85,
      source: {
        sectionId: "c-002-s2",
        excerpt:
          "written notice of non-renewal at least thirty (30) days prior to the end of the then-current term",
      },
      note: "Computed: October 15, 2026 term end − 30 days.",
    },
    {
      id: "c-002:term_length",
      contractId: "c-002",
      key: "term_length",
      label: "Renewal term length",
      group: "Term & renewal",
      value: { kind: "duration", days: 365, raw: "twelve (12) months" },
      confidence: 0.94,
      source: {
        sectionId: "c-002-s2",
        excerpt: "successive renewal terms of twelve (12) months each",
      },
    },
    {
      id: "c-002:total_value",
      contractId: "c-002",
      key: "total_value",
      label: "Total contract value",
      group: "Financial",
      value: { kind: "money", usd: 94_800 },
      confidence: 0.88,
      source: {
        sectionId: "c-002-s3",
        excerpt: "a monthly subscription fee of $7,900, invoiced monthly in advance",
      },
      note: "Computed: $7,900 monthly fee × 12-month term = $94,800.",
    },
    {
      id: "c-002:payment_schedule",
      contractId: "c-002",
      key: "payment_schedule",
      label: "Payment schedule",
      group: "Financial",
      value: { kind: "text", value: "Monthly in advance, net 30" },
      confidence: 0.96,
      source: {
        sectionId: "c-002-s3",
        excerpt:
          "invoiced monthly in advance and payable net thirty (30) days from the date of invoice",
      },
    },
    {
      id: "c-002:liability_cap",
      contractId: "c-002",
      key: "liability_cap",
      label: "Liability cap",
      group: "Legal terms",
      value: { kind: "money", usd: 94_800 },
      confidence: 0.93,
      source: {
        sectionId: "c-002-s10",
        excerpt:
          "shall not exceed the total fees paid or payable by Customer in the twelve (12) months preceding the event giving rise to the claim",
      },
      note: "12 months of fees = $94,800 at current pricing.",
    },
    {
      id: "c-002:governing_law",
      contractId: "c-002",
      key: "governing_law",
      label: "Governing law",
      group: "Legal terms",
      value: { kind: "text", value: "California" },
      confidence: 0.97,
      source: {
        sectionId: "c-002-s12",
        excerpt:
          "governed by and construed in accordance with the laws of the State of California",
      },
    },
    {
      id: "c-002:confidentiality",
      contractId: "c-002",
      key: "confidentiality",
      label: "Confidentiality",
      group: "Legal terms",
      value: {
        kind: "text",
        value: "Mutual; survives 3 years after termination",
      },
      confidence: 0.94,
      source: {
        sectionId: "c-002-s6",
        excerpt:
          "obligations under this Section 6 shall survive for three (3) years following expiration or termination of this Agreement",
      },
    },
  ],
  obligations: [
    {
      id: "c-002:ob-monthly-payment",
      contractId: "c-002",
      title: "Monthly subscription payment ($7,900)",
      owedBy: "us",
      recurrence: "monthly",
      description:
        "Monthly fee of $7,900 invoiced in advance and payable net 30 from the invoice date.",
      source: {
        sectionId: "c-002-s3",
        excerpt:
          "invoiced monthly in advance and payable net thirty (30) days from the date of invoice",
      },
    },
    {
      id: "c-002:ob-sso-audit-export",
      contractId: "c-002",
      title: "Pektra: deliver SSO integration and audit-log export",
      owedBy: "them",
      dueDate: "2026-09-01",
      description:
        "Pektra must enable SAML 2.0 single sign-on and scheduled audit-log export for Vantora's production workspace by September 1, 2026, at no additional charge.",
      source: {
        sectionId: "c-002-s4",
        excerpt:
          "Pektra shall deliver and enable single sign-on (SAML 2.0) integration and a scheduled audit-log export capability for Customer's production workspace no later than September 1, 2026",
      },
    },
    {
      id: "c-002:ob-usage-trueup",
      contractId: "c-002",
      title: "Usage true-up at renewal",
      owedBy: "them",
      recurrence: "annual",
      dueDate: "2026-09-15",
      description:
        "Pektra delivers a usage true-up statement at least 30 days before each renewal term; any overage is invoiced at Order Form rates and paid under Section 3.",
      source: {
        sectionId: "c-002-s5",
        excerpt:
          "Pektra shall deliver to Customer a usage true-up statement reconciling licensed seats and query volume against actual usage during the then-current term",
      },
    },
  ],
  risks: [
    {
      id: "c-002:risk-autorenew",
      contractId: "c-002",
      kind: "auto_renewal_trap",
      severity: "medium",
      summary:
        "30-day notice window ahead of the October 15 renewal — non-renewal notice must reach Pektra by September 15, 2026.",
      fieldId: "c-002:notice_deadline",
    },
  ],
  milestones: [],
  document: {
    filename: "Pektra_BI_Subscription_2025.pdf",
    format: "pdf",
    pages: 11,
    sections: [
      {
        id: "c-002-s1",
        number: "1",
        heading: "Parties; Definitions",
        paragraphs: [
          "This Business Intelligence Platform Subscription Agreement (the “Agreement”) is entered into by and between Vantora Labs, Inc., a Delaware corporation with offices at 4120 Delgany Street, Denver, CO 80216 (“Customer”), and Pektra Analytics, Inc., a Delaware corporation with offices at 2201 Bryant Street, San Francisco, CA 94110 (“Pektra”).",
          "“Service” means Pektra's hosted business intelligence platform, including dashboarding, scheduled reporting, and embedded analytics modules, as described in Order Form PA-2025-1142. Capitalized terms not otherwise defined have the meanings given in this Section 1.",
        ],
      },
      {
        id: "c-002-s2",
        number: "2",
        heading: "Term; Automatic Renewal",
        paragraphs: [
          "The term of this Agreement shall commence on October 16, 2025 (the “Effective Date”) and shall continue for an initial term of twelve (12) months through October 15, 2026 (the “Initial Term”).",
          "Upon expiration of the Initial Term and each renewal term, this Agreement shall automatically renew for successive renewal terms of twelve (12) months each, at the pricing then in effect under Section 3, unless either party delivers written notice of non-renewal at least thirty (30) days prior to the end of the then-current term. Notice of non-renewal shall be delivered in accordance with Section 12.2 and shall be effective only upon receipt.",
        ],
      },
      {
        id: "c-002-s3",
        number: "3",
        heading: "Fees; Payment",
        paragraphs: [
          "Customer shall pay Pektra a monthly subscription fee of $7,900, invoiced monthly in advance and payable net thirty (30) days from the date of invoice. Fees are stated and payable in U.S. dollars and are exclusive of applicable taxes.",
          "Amounts not received when due shall accrue interest at the lesser of one percent (1%) per month or the maximum rate permitted by law. Pektra may adjust pricing for any renewal term by written notice given no later than sixty (60) days before the start of such term.",
        ],
      },
      {
        id: "c-002-s4",
        number: "4",
        heading: "Services; Implementation Deliverables",
        paragraphs: [
          "Pektra shall provide the Service in material conformance with its documentation and shall make the Service available to Customer's authorized users for the number of licensed seats stated in Order Form PA-2025-1142.",
          "As a condition of Customer's continued subscription, Pektra shall deliver and enable single sign-on (SAML 2.0) integration and a scheduled audit-log export capability for Customer's production workspace no later than September 1, 2026, at no additional charge to Customer. Pektra shall provide Customer written confirmation upon completion of each deliverable, and Customer shall have ten (10) business days to verify the deliverables against the acceptance criteria in Exhibit B. Failure to deliver either capability by such date shall constitute a material breach of this Agreement for purposes of Section 11.",
        ],
      },
      {
        id: "c-002-s5",
        number: "5",
        heading: "Usage; True-Up",
        paragraphs: [
          "No later than thirty (30) days prior to the start of each renewal term, Pektra shall deliver to Customer a usage true-up statement reconciling licensed seats and query volume against actual usage during the then-current term. Any overage identified in the true-up statement shall be invoiced at the per-unit rates set forth in Order Form PA-2025-1142 and paid in accordance with Section 3, and Customer may reduce licensed seats for the upcoming renewal term by written notice delivered before the renewal date.",
        ],
      },
      {
        id: "c-002-s6",
        number: "6",
        heading: "Confidentiality",
        paragraphs: [
          "Each party shall protect the other party's Confidential Information with at least the degree of care it uses for its own confidential information of like kind, and in no event less than reasonable care. Confidential Information may be used solely to perform under, or exercise rights granted by, this Agreement, and the obligations under this Section 6 shall survive for three (3) years following expiration or termination of this Agreement.",
        ],
      },
      {
        id: "c-002-s7",
        number: "7",
        heading: "Data; Intellectual Property",
        paragraphs: [
          "As between the parties, Customer retains all right, title, and interest in and to Customer Data, including all reports and visualizations generated from Customer Data. Pektra retains all right, title, and interest in and to the Service and all related software, templates, and documentation.",
        ],
      },
      {
        id: "c-002-s8",
        number: "8",
        heading: "Warranties",
        paragraphs: [
          "Each party warrants that it has the authority to enter into this Agreement. Pektra warrants that the Service will perform materially in accordance with its documentation. EXCEPT AS EXPRESSLY STATED, THE SERVICE IS PROVIDED “AS IS” AND PEKTRA DISCLAIMS ALL OTHER WARRANTIES, EXPRESS OR IMPLIED.",
        ],
      },
      {
        id: "c-002-s9",
        number: "9",
        heading: "Indemnification",
        paragraphs: [
          "Pektra shall defend Customer against any third-party claim alleging that the Service infringes a U.S. patent, copyright, or trademark, and shall indemnify Customer against amounts finally awarded or agreed in settlement, provided Customer gives prompt notice and reasonable cooperation.",
        ],
      },
      {
        id: "c-002-s10",
        number: "10",
        heading: "Limitation of Liability",
        paragraphs: [
          "EXCEPT FOR BREACHES OF SECTION 6 OR AMOUNTS PAYABLE UNDER SECTION 9, EACH PARTY'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT shall not exceed the total fees paid or payable by Customer in the twelve (12) months preceding the event giving rise to the claim. IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES.",
        ],
      },
      {
        id: "c-002-s11",
        number: "11",
        heading: "Termination",
        paragraphs: [
          "Either party may terminate this Agreement for material breach upon thirty (30) days' written notice if such breach remains uncured at the end of the notice period. Upon termination, Customer Data shall be made available for export in a machine-readable format for thirty (30) days.",
        ],
      },
      {
        id: "c-002-s12",
        number: "12",
        heading: "General; Governing Law",
        paragraphs: [
          "This Agreement is governed by and construed in accordance with the laws of the State of California, without regard to its conflicts of law principles. The parties consent to the exclusive jurisdiction of the state and federal courts located in San Francisco County, California.",
          "12.2 Notices. Notices must be in writing and delivered to the addresses in Section 1, with a copy to legal@vantoralabs.com and notices@pektra.io respectively, and are effective upon receipt.",
        ],
      },
    ],
  },
};
