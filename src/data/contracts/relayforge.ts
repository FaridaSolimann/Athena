import type { Contract } from "@/data/types";

// c-003 — Relayforge Incident Management Platform Subscription.
// Second one-year term (renewed once from a Dec 2024 start). The renewal
// clause carries an 8% price escalator on each renewal, so letting the
// Nov 30, 2026 auto-renewal ride costs ~$4,608 more next year. 45-day notice
// puts the deadline at Oct 16, 2026. 99.95% uptime SLA with service credits.

export const relayforge: Contract = {
  id: "c-003",
  title: "Incident Management Platform Subscription",
  counterparty: "Relayforge, Inc.",
  counterpartyCategory: "DevOps tooling",
  type: "SaaS",
  status: "active",
  valueUsd: 57_600,
  effectiveDate: "2025-12-01",
  expirationDate: "2026-11-30",
  autoRenew: true,
  noticeDays: 45,
  renewalTermMonths: 12,
  ingestedAt: "2026-06-05",
  fields: [
    {
      id: "c-003:contract_type",
      contractId: "c-003",
      key: "contract_type",
      label: "Contract type",
      group: "Overview",
      value: { kind: "text", value: "SaaS subscription" },
      confidence: 0.98,
      source: {
        sectionId: "c-003-s1",
        excerpt:
          "This Incident Management Platform Subscription Agreement (the “Agreement”)",
      },
    },
    {
      id: "c-003:counterparty",
      contractId: "c-003",
      key: "counterparty",
      label: "Counterparty",
      group: "Overview",
      value: { kind: "text", value: "Relayforge, Inc." },
      confidence: 0.98,
      source: {
        sectionId: "c-003-s1",
        excerpt:
          "Relayforge, Inc., a Delaware corporation with offices at 660 Townsend Street, San Francisco, CA 94103 (“Relayforge”)",
      },
    },
    {
      id: "c-003:effective_date",
      contractId: "c-003",
      key: "effective_date",
      label: "Effective date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2025-12-01" },
      confidence: 0.87,
      source: {
        sectionId: "c-003-s2",
        excerpt:
          "second annual term, which runs from December 1, 2025 through November 30, 2026 (the “Current Term”)",
      },
      note: "Start of the current (second) annual term; the agreement originally commenced December 1, 2024 and has renewed once.",
    },
    {
      id: "c-003:expiration_date",
      contractId: "c-003",
      key: "expiration_date",
      label: "Expiration date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2026-11-30" },
      confidence: 0.95,
      source: {
        sectionId: "c-003-s2",
        excerpt:
          "runs from December 1, 2025 through November 30, 2026 (the “Current Term”)",
      },
    },
    {
      id: "c-003:auto_renew",
      contractId: "c-003",
      key: "auto_renew",
      label: "Auto-renewal",
      group: "Term & renewal",
      value: { kind: "boolean", value: true },
      confidence: 0.95,
      source: {
        sectionId: "c-003-s2",
        excerpt:
          "this Agreement shall automatically renew for successive renewal terms of twelve (12) months each",
      },
    },
    {
      id: "c-003:renewal_date",
      contractId: "c-003",
      key: "renewal_date",
      label: "Renewal date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2026-11-30" },
      confidence: 0.94,
      source: {
        sectionId: "c-003-s2",
        excerpt: "Upon expiration of the Current Term and each renewal term",
      },
    },
    {
      id: "c-003:notice_days",
      contractId: "c-003",
      key: "notice_days",
      label: "Non-renewal notice window",
      group: "Term & renewal",
      value: { kind: "duration", days: 45, raw: "forty-five (45) days" },
      confidence: 0.95,
      source: {
        sectionId: "c-003-s2",
        excerpt:
          "written notice of non-renewal at least forty-five (45) days prior to the end of the then-current term",
      },
    },
    {
      id: "c-003:notice_deadline",
      contractId: "c-003",
      key: "notice_deadline",
      label: "Notice deadline",
      group: "Term & renewal",
      value: { kind: "date", iso: "2026-10-16" },
      confidence: 0.86,
      source: {
        sectionId: "c-003-s2",
        excerpt:
          "written notice of non-renewal at least forty-five (45) days prior to the end of the then-current term",
      },
      note: "Computed: November 30, 2026 term end − 45 days.",
    },
    {
      id: "c-003:term_length",
      contractId: "c-003",
      key: "term_length",
      label: "Renewal term length",
      group: "Term & renewal",
      value: { kind: "duration", days: 365, raw: "twelve (12) months" },
      confidence: 0.94,
      source: {
        sectionId: "c-003-s2",
        excerpt: "successive renewal terms of twelve (12) months each",
      },
    },
    {
      id: "c-003:total_value",
      contractId: "c-003",
      key: "total_value",
      label: "Total contract value",
      group: "Financial",
      value: { kind: "money", usd: 57_600 },
      confidence: 0.88,
      source: {
        sectionId: "c-003-s3",
        excerpt: "a monthly subscription fee of $4,800, invoiced monthly in advance",
      },
      note: "Computed: $4,800 monthly fee × 12-month term = $57,600. A renewal on December 1, 2026 would carry an 8% escalator (~$62,208/year).",
    },
    {
      id: "c-003:payment_schedule",
      contractId: "c-003",
      key: "payment_schedule",
      label: "Payment schedule",
      group: "Financial",
      value: { kind: "text", value: "Monthly in advance, net 30" },
      confidence: 0.96,
      source: {
        sectionId: "c-003-s3",
        excerpt:
          "invoiced monthly in advance and payable net thirty (30) days from the date of invoice",
      },
    },
    {
      id: "c-003:termination",
      contractId: "c-003",
      key: "termination",
      label: "Renewal price escalator",
      group: "Legal terms",
      value: {
        kind: "text",
        value: "Fees increase 8% automatically at each renewal",
      },
      confidence: 0.92,
      source: {
        sectionId: "c-003-s2",
        excerpt:
          "Upon each renewal, the then-current fees shall increase by eight percent (8%)",
      },
      note: "Escalator compounds each year the agreement auto-renews; the only way to avoid it is non-renewal notice by October 16, 2026.",
    },
    {
      id: "c-003:liability_cap",
      contractId: "c-003",
      key: "liability_cap",
      label: "Liability cap",
      group: "Legal terms",
      value: { kind: "money", usd: 57_600 },
      confidence: 0.93,
      source: {
        sectionId: "c-003-s10",
        excerpt:
          "shall not exceed the total fees paid or payable by Customer in the twelve (12) months preceding the event giving rise to the claim",
      },
      note: "12 months of fees = $57,600 at current pricing.",
    },
    {
      id: "c-003:governing_law",
      contractId: "c-003",
      key: "governing_law",
      label: "Governing law",
      group: "Legal terms",
      value: { kind: "text", value: "California" },
      confidence: 0.97,
      source: {
        sectionId: "c-003-s12",
        excerpt:
          "governed by and construed in accordance with the laws of the State of California",
      },
    },
    {
      id: "c-003:sla",
      contractId: "c-003",
      key: "sla",
      label: "Service level",
      group: "Legal terms",
      value: { kind: "text", value: "99.95% monthly uptime, service credits" },
      confidence: 0.94,
      source: {
        sectionId: "c-003-s4",
        excerpt:
          "maintain availability of the Service of at least 99.95% measured monthly",
      },
    },
  ],
  obligations: [
    {
      id: "c-003:ob-monthly-payment",
      contractId: "c-003",
      title: "Monthly subscription payment ($4,800)",
      owedBy: "us",
      recurrence: "monthly",
      description:
        "Monthly fee of $4,800 invoiced in advance and payable net 30 from the invoice date.",
      source: {
        sectionId: "c-003-s3",
        excerpt:
          "invoiced monthly in advance and payable net thirty (30) days from the date of invoice",
      },
    },
    {
      id: "c-003:ob-uptime-sla",
      contractId: "c-003",
      title: "Relayforge: 99.95% uptime SLA",
      owedBy: "them",
      recurrence: "monthly",
      description:
        "Relayforge must maintain 99.95% monthly availability; misses accrue service credits under Schedule 1 as Vantora's exclusive remedy.",
      source: {
        sectionId: "c-003-s4",
        excerpt:
          "maintain availability of the Service of at least 99.95% measured monthly",
      },
    },
  ],
  risks: [
    {
      id: "c-003:risk-escalator",
      contractId: "c-003",
      kind: "penalty",
      severity: "medium",
      summary:
        "8% price escalator applies automatically on each renewal — riding the December 1, 2026 renewal raises fees to ~$62,208/year, compounding annually.",
      fieldId: "c-003:termination",
    },
    {
      id: "c-003:risk-autorenew",
      contractId: "c-003",
      kind: "auto_renewal_trap",
      severity: "medium",
      summary:
        "45-day notice window ahead of the November 30 renewal — non-renewal notice must reach Relayforge by October 16, 2026 to avoid the escalated term.",
      fieldId: "c-003:notice_deadline",
    },
  ],
  milestones: [],
  document: {
    filename: "Relayforge_Incident_Mgmt_Renewal_2025.pdf",
    format: "pdf",
    pages: 12,
    sections: [
      {
        id: "c-003-s1",
        number: "1",
        heading: "Parties; Definitions",
        paragraphs: [
          "This Incident Management Platform Subscription Agreement (the “Agreement”) is entered into by and between Vantora Labs, Inc., a Delaware corporation with offices at 4120 Delgany Street, Denver, CO 80216 (“Customer”), and Relayforge, Inc., a Delaware corporation with offices at 660 Townsend Street, San Francisco, CA 94103 (“Relayforge”).",
          "“Service” means Relayforge's hosted incident management platform, including on-call scheduling, alert routing, escalation policies, and postmortem tooling, as described in Order Form RF-2024-0311. Capitalized terms not otherwise defined have the meanings given in this Section 1.",
        ],
      },
      {
        id: "c-003-s2",
        number: "2",
        heading: "Term; Automatic Renewal; Fee Escalation",
        paragraphs: [
          "This Agreement commenced on December 1, 2024 and, having renewed once in accordance with this Section 2, is now in its second annual term, which runs from December 1, 2025 through November 30, 2026 (the “Current Term”).",
          "Upon expiration of the Current Term and each renewal term, this Agreement shall automatically renew for successive renewal terms of twelve (12) months each, unless either party delivers written notice of non-renewal at least forty-five (45) days prior to the end of the then-current term. Upon each renewal, the then-current fees shall increase by eight percent (8%), effective as of the first day of the applicable renewal term, without any requirement of further notice, invoice adjustment approval, or amendment. Notice of non-renewal shall be delivered in accordance with Section 12.2 and shall be effective only upon receipt.",
        ],
      },
      {
        id: "c-003-s3",
        number: "3",
        heading: "Fees; Payment",
        paragraphs: [
          "Customer shall pay Relayforge a monthly subscription fee of $4,800, invoiced monthly in advance and payable net thirty (30) days from the date of invoice. Fees are stated and payable in U.S. dollars and are exclusive of applicable taxes, which Customer shall pay where required.",
          "Amounts not received when due shall accrue interest at the lesser of one percent (1%) per month or the maximum rate permitted by law. Fee increases for renewal terms are governed exclusively by Section 2.",
        ],
      },
      {
        id: "c-003-s4",
        number: "4",
        heading: "Service Levels",
        paragraphs: [
          "Relayforge shall maintain availability of the Service of at least 99.95% measured monthly, excluding scheduled maintenance windows announced at least seventy-two (72) hours in advance. If availability falls below 99.95% in any calendar month, Customer shall be entitled to the service credits set forth in Schedule 1, which credits are Customer's sole and exclusive remedy for any failure to meet the availability commitment.",
          "Relayforge shall publish monthly availability figures to its status dashboard and, upon Customer's request, furnish a signed availability report for any calendar month within ten (10) business days.",
        ],
      },
      {
        id: "c-003-s5",
        number: "5",
        heading: "Support",
        paragraphs: [
          "Relayforge shall provide 24×7 support for Severity 1 incidents with a thirty (30) minute initial response target, and business-hours support for all other severities as described in the support policy referenced in Order Form RF-2024-0311.",
        ],
      },
      {
        id: "c-003-s6",
        number: "6",
        heading: "Confidentiality",
        paragraphs: [
          "Each party shall protect the other party's Confidential Information with at least the degree of care it uses for its own confidential information of like kind, and in no event less than reasonable care. Confidential Information may be used solely to perform under, or exercise rights granted by, this Agreement.",
        ],
      },
      {
        id: "c-003-s7",
        number: "7",
        heading: "Data; Intellectual Property",
        paragraphs: [
          "As between the parties, Customer retains all right, title, and interest in and to Customer Data, including incident records and postmortem content authored by Customer's users. Relayforge retains all right, title, and interest in and to the Service and all related software and documentation.",
        ],
      },
      {
        id: "c-003-s8",
        number: "8",
        heading: "Warranties",
        paragraphs: [
          "Each party warrants that it has the authority to enter into this Agreement. Relayforge warrants that the Service will perform materially in accordance with its documentation. EXCEPT AS EXPRESSLY STATED, THE SERVICE IS PROVIDED “AS IS” AND RELAYFORGE DISCLAIMS ALL OTHER WARRANTIES, EXPRESS OR IMPLIED.",
        ],
      },
      {
        id: "c-003-s9",
        number: "9",
        heading: "Indemnification",
        paragraphs: [
          "Relayforge shall defend Customer against any third-party claim alleging that the Service infringes a U.S. patent, copyright, or trademark, and shall indemnify Customer against amounts finally awarded or agreed in settlement, provided Customer gives prompt notice and reasonable cooperation.",
        ],
      },
      {
        id: "c-003-s10",
        number: "10",
        heading: "Limitation of Liability",
        paragraphs: [
          "EXCEPT FOR BREACHES OF SECTION 6 OR AMOUNTS PAYABLE UNDER SECTION 9, EACH PARTY'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT shall not exceed the total fees paid or payable by Customer in the twelve (12) months preceding the event giving rise to the claim. IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES.",
        ],
      },
      {
        id: "c-003-s11",
        number: "11",
        heading: "Termination",
        paragraphs: [
          "Either party may terminate this Agreement for material breach upon thirty (30) days' written notice if such breach remains uncured at the end of the notice period. Upon termination, Customer Data shall be made available for export in a machine-readable format for thirty (30) days.",
        ],
      },
      {
        id: "c-003-s12",
        number: "12",
        heading: "General; Governing Law",
        paragraphs: [
          "This Agreement is governed by and construed in accordance with the laws of the State of California, without regard to its conflicts of law principles. The parties consent to the exclusive jurisdiction of the state and federal courts located in San Francisco County, California.",
          "12.2 Notices. Notices must be in writing and delivered to the addresses in Section 1, with a copy to legal@vantoralabs.com and contracts@relayforge.com respectively, and are effective upon receipt.",
        ],
      },
    ],
  },
};
