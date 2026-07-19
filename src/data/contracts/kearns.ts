import type { Contract } from "@/data/types";

// c-009 — Kearns Mechanical Equipment Maintenance Agreement (2019 SCAN).
// The deliberately ambiguous legacy contract: OCR quality 0.58, the §2 term
// clause cuts off mid-sentence ("shall automatically renew for succ—"), the
// liability cap is only partially legible, and every extraction lands below
// 0.75 confidence (mean ≈ 0.54). Status needs_review; evergreen renewal
// suspected but unconfirmed.

export const kearns: Contract = {
  id: "c-009",
  title: "Equipment Maintenance Agreement",
  counterparty: "Kearns Mechanical Corp.",
  counterpartyCategory: "Facilities equipment",
  type: "Vendor",
  status: "needs_review",
  valueUsd: 123_000,
  effectiveDate: "2019-05-20",
  expirationDate: null,
  autoRenew: true,
  ingestedAt: "2026-07-11",
  fields: [
    {
      id: "c-009:contract_type",
      contractId: "c-009",
      key: "contract_type",
      label: "Contract type",
      group: "Overview",
      value: { kind: "text", value: "Equipment maintenance agreement" },
      confidence: 0.72,
      source: {
        sectionId: "c-009-s1",
        excerpt: "This Equiprnent Maintenance Agreement (“Agreement”)",
      },
    },
    {
      id: "c-009:counterparty",
      contractId: "c-009",
      key: "counterparty",
      label: "Counterparty",
      group: "Overview",
      value: { kind: "text", value: "Kearns Mechanical Corp." },
      confidence: 0.7,
      source: {
        sectionId: "c-009-s1",
        excerpt: "Kearns Mechanical Corp., a Texas corporation",
      },
      note: "Letterhead partially legible",
    },
    {
      id: "c-009:effective_date",
      contractId: "c-009",
      key: "effective_date",
      label: "Effective date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2019-05-20" },
      confidence: 0.66,
      source: {
        sectionId: "c-009-s2",
        excerpt: "shall take effect on May 20, 2019",
      },
    },
    {
      id: "c-009:expiration_date",
      contractId: "c-009",
      key: "expiration_date",
      label: "Expiration date",
      group: "Term & renewal",
      value: { kind: "missing", expected: "Expiration date" },
      confidence: 0.41,
      source: null,
      note: "Term clause truncated in scan.",
    },
    {
      id: "c-009:auto_renew",
      contractId: "c-009",
      key: "auto_renew",
      label: "Auto-renewal",
      group: "Term & renewal",
      value: { kind: "boolean", value: true },
      confidence: 0.48,
      source: {
        sectionId: "c-009-s2",
        excerpt: "shall automatically renew for succ",
      },
      note: "Renewal sentence cut off — evergreen renewal suspected but unconfirmed.",
    },
    {
      id: "c-009:notice_days",
      contractId: "c-009",
      key: "notice_days",
      label: "Non-renewal notice window",
      group: "Term & renewal",
      value: { kind: "missing", expected: "Non-renewal notice window" },
      confidence: 0.33,
      source: null,
      note: "Any notice requirement is lost in the truncated renewal clause.",
    },
    {
      id: "c-009:total_value",
      contractId: "c-009",
      key: "total_value",
      label: "Total contract value",
      group: "Financial",
      value: { kind: "money", usd: 123_000 },
      confidence: 0.52,
      source: {
        sectionId: "c-009-s3",
        excerpt: "an annual fee of $123,000",
      },
      note: "Could also read $128,000 — digits smudged in §3.",
    },
    {
      id: "c-009:payment_schedule",
      contractId: "c-009",
      key: "payment_schedule",
      label: "Payment schedule",
      group: "Financial",
      value: { kind: "text", value: "Semi-annual invoicing (suspected)" },
      confidence: 0.46,
      source: {
        sectionId: "c-009-s5",
        excerpt: "Invoices shall be subrnitted [illegible] each January and July",
      },
      note: "Payment terms illegible; semi-annual invoicing suspected",
    },
    {
      id: "c-009:liability_cap",
      contractId: "c-009",
      key: "liability_cap",
      label: "Liability cap",
      group: "Legal terms",
      value: {
        kind: "ambiguous",
        candidates: [
          {
            reading: "Fees paid in prior 12 months (~$123,000)",
            value: "$123,000",
          },
          { reading: "Uncapped — no limitation located", value: "None found" },
        ],
      },
      confidence: 0.44,
      source: {
        sectionId: "c-009-s6",
        excerpt:
          "aggregate liability [illegible] the fees paid by Customer during the preceding twelve (12) rnonths",
      },
      note: "Limitation section partially illegible.",
    },
    {
      id: "c-009:governing_law",
      contractId: "c-009",
      key: "governing_law",
      label: "Governing law",
      group: "Legal terms",
      value: { kind: "text", value: "Texas" },
      confidence: 0.68,
      source: {
        sectionId: "c-009-s7",
        excerpt: "governed by the laws of the State of Texas",
      },
    },
  ],
  obligations: [
    {
      id: "c-009:ob-maintenance",
      contractId: "c-009",
      title: "Kearns: semi-annual preventive maintenance visits (suspected)",
      owedBy: "them",
      recurrence: "semi-annual",
      description:
        "Kearns appears to owe preventive maintenance visits twice each calendar year on the Schedule A equipment — the visit-count wording is only partially legible in the scan.",
      source: {
        sectionId: "c-009-s4",
        excerpt: "preventive rnaintenance visits [illegible] each calendar year",
      },
    },
  ],
  risks: [
    {
      id: "c-009:risk-evergreen",
      contractId: "c-009",
      kind: "auto_renewal_trap",
      severity: "medium",
      summary: "Suspected evergreen renewal with unknown notice window",
      fieldId: "c-009:auto_renew",
    },
    {
      id: "c-009:risk-cap",
      contractId: "c-009",
      kind: "ambiguous_liability_cap",
      severity: "medium",
      summary:
        "Cap clause partially illegible — could be 12-month fees or absent",
      fieldId: "c-009:liability_cap",
    },
  ],
  milestones: [],
  document: {
    filename: "Kearns_Mechanical_Maintenance_2019_SCAN.pdf",
    format: "pdf",
    pages: 7,
    ocrQuality: 0.58,
    sections: [
      {
        id: "c-009-s1",
        number: "1",
        heading: "Parties",
        paragraphs: [
          "This Equiprnent Maintenance Agreement (“Agreement”) is entered into by and between Vantora Labs, Inc., 4120 Delgany Street, Denver, CO 80216 (“Customer”), and Kearns Mechanical Corp., a Texas corporation with offices at 41 [illegible] Boulevard, Fort Worth, TX 761[illegible] (“Kearns”).",
        ],
      },
      {
        id: "c-009-s2",
        number: "2",
        heading: "Term",
        paragraphs: [
          "This Agreement shall take effect on May 20, 2019 and shall continue for an initial period of [illegible]. Thereafter, this Agreement shall automatically renew for succ— [remainder of paragraph illegible]",
        ],
      },
      {
        id: "c-009-s3",
        number: "3",
        heading: "Fees",
        paragraphs: [
          "Customer shall pay Kearns an annual fee of $123,000 for the services described in Section 4, subject to adjustrnent by Kearns upon [illegible] days written notice prior to each renewal period.",
        ],
      },
      {
        id: "c-009-s4",
        number: "4",
        heading: "Maintenance Services",
        paragraphs: [
          "Kearns shall perform preventive rnaintenance visits [illegible] each calendar year covering the HVAC, chiller, and air-handling equipment listed on Schedule A, and shall provide emergency repair service on a time-and-materials basis. All work shall be performed by qualified technicians in accordance with manufacturer specifications.",
        ],
      },
      {
        id: "c-009-s5",
        number: "5",
        heading: "Payment",
        paragraphs: [
          "Invoices shall be subrnitted [illegible] each January and July, and payrnent shall be due within [illegible] days of receipt. Past-due amounts may accrue interest at [illegible] percent per month or the maximum rate permitted by law.",
        ],
      },
      {
        id: "c-009-s6",
        number: "6",
        heading: "Limitation of Liability",
        paragraphs: [
          "Neither party shall be liable for indirect, incidental, or consequential l0sses arising from this Agreement. Kearns' aggregate liability [illegible] the fees paid by Customer during the preceding twelve (12) rnonths, except [remainder of paragraph illegible]",
        ],
      },
      {
        id: "c-009-s7",
        number: "7",
        heading: "Governing Law",
        paragraphs: [
          "This Agreement shall be governed by the laws of the State of Texas. Any dispute arising hereunder shall be brought in the state or federal courts located in Tarrant County, Texas.",
        ],
      },
    ],
  },
};
