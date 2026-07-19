import type { Contract } from "@/data/types";

// c-008 — Bramblewood Facilities Services Agreement.
// The trivially-low-cap beat: §9 caps Bramblewood's liability at three months'
// fees ($23,250) against premises-damage exposure and ~$93K/yr of spend.

export const bramblewood: Contract = {
  id: "c-008",
  title: "Facilities Services Agreement",
  counterparty: "Bramblewood Facilities Group",
  counterpartyCategory: "Facilities",
  type: "Vendor",
  status: "active",
  valueUsd: 186_000,
  effectiveDate: "2025-09-01",
  expirationDate: "2027-08-31",
  autoRenew: false,
  ingestedAt: "2026-06-08",
  fields: [
    {
      id: "c-008:contract_type",
      contractId: "c-008",
      key: "contract_type",
      label: "Contract type",
      group: "Overview",
      value: { kind: "text", value: "Vendor services agreement" },
      confidence: 0.97,
      source: {
        sectionId: "c-008-s1",
        excerpt: "This Facilities Services Agreement (the “Agreement”)",
      },
    },
    {
      id: "c-008:counterparty",
      contractId: "c-008",
      key: "counterparty",
      label: "Counterparty",
      group: "Overview",
      value: { kind: "text", value: "Bramblewood Facilities Group" },
      confidence: 0.97,
      source: {
        sectionId: "c-008-s1",
        excerpt:
          "Bramblewood Facilities Group, LLC, a Colorado limited liability company with offices at 2210 Wynkoop Court, Suite 300, Denver, CO 80202 (“Bramblewood”)",
      },
    },
    {
      id: "c-008:effective_date",
      contractId: "c-008",
      key: "effective_date",
      label: "Effective date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2025-09-01" },
      confidence: 0.96,
      source: {
        sectionId: "c-008-s3",
        excerpt: "commence on September 1, 2025 (the “Effective Date”)",
      },
    },
    {
      id: "c-008:expiration_date",
      contractId: "c-008",
      key: "expiration_date",
      label: "Expiration date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2027-08-31" },
      confidence: 0.95,
      source: {
        sectionId: "c-008-s3",
        excerpt:
          "continue for a term of twenty-four (24) months through August 31, 2027",
      },
    },
    {
      id: "c-008:auto_renew",
      contractId: "c-008",
      key: "auto_renew",
      label: "Auto-renewal",
      group: "Term & renewal",
      value: { kind: "boolean", value: false },
      confidence: 0.93,
      source: {
        sectionId: "c-008-s3",
        excerpt:
          "This Agreement does not renew automatically and shall expire at the end of the term",
      },
    },
    {
      id: "c-008:total_value",
      contractId: "c-008",
      key: "total_value",
      label: "Total contract value",
      group: "Financial",
      value: { kind: "money", usd: 186_000 },
      confidence: 0.88,
      source: {
        sectionId: "c-008-s4",
        excerpt: "a fixed monthly fee of $7,750",
      },
      note: "Computed: $7,750 × 24 months",
    },
    {
      id: "c-008:payment_schedule",
      contractId: "c-008",
      key: "payment_schedule",
      label: "Payment schedule",
      group: "Financial",
      value: { kind: "text", value: "Monthly, net 15" },
      confidence: 0.96,
      source: {
        sectionId: "c-008-s4",
        excerpt:
          "due net fifteen (15) days from the invoice date",
      },
    },
    {
      id: "c-008:liability_cap",
      contractId: "c-008",
      key: "liability_cap",
      label: "Liability cap",
      group: "Legal terms",
      value: { kind: "money", usd: 23_250 },
      confidence: 0.93,
      source: {
        sectionId: "c-008-s9",
        excerpt:
          "shall not exceed an amount equal to three (3) months of fees paid or payable by Customer under this Agreement",
      },
      note: "Three months' fees = $23,250 at $7,750/mo — low relative to ~$93,000 annual spend and premises-damage exposure.",
    },
    {
      id: "c-008:insurance",
      contractId: "c-008",
      key: "insurance",
      label: "Insurance",
      group: "Legal terms",
      value: {
        kind: "text",
        value: "CGL $2M aggregate; workers' compensation at statutory limits",
      },
      confidence: 0.94,
      source: {
        sectionId: "c-008-s6",
        excerpt:
          "commercial general liability insurance with limits of not less than $1,000,000 per occurrence and $2,000,000 in the aggregate",
      },
    },
    {
      id: "c-008:governing_law",
      contractId: "c-008",
      key: "governing_law",
      label: "Governing law",
      group: "Legal terms",
      value: { kind: "text", value: "Colorado" },
      confidence: 0.97,
      source: {
        sectionId: "c-008-s10",
        excerpt:
          "governed by and construed in accordance with the laws of the State of Colorado",
      },
    },
  ],
  obligations: [
    {
      id: "c-008:ob-services",
      contractId: "c-008",
      title: "Bramblewood: weekly janitorial and maintenance services",
      owedBy: "them",
      recurrence: "weekly",
      description:
        "Bramblewood performs janitorial and routine maintenance services at the Denver premises each week per the Exhibit B service schedule.",
      source: {
        sectionId: "c-008-s2",
        excerpt:
          "perform janitorial and routine maintenance services at the Premises on a weekly basis in accordance with the service schedule set forth in Exhibit B",
      },
    },
  ],
  risks: [
    {
      id: "c-008:risk-lowcap",
      contractId: "c-008",
      kind: "low_liability_cap",
      severity: "high",
      summary:
        "$23,250 cap (3 months' fees) vs ~$93,000 annual spend and premises-damage exposure",
      fieldId: "c-008:liability_cap",
    },
  ],
  milestones: [],
  document: {
    filename: "Bramblewood_Facilities_Services_2025.pdf",
    format: "pdf",
    pages: 10,
    sections: [
      {
        id: "c-008-s1",
        number: "1",
        heading: "Parties",
        paragraphs: [
          "This Facilities Services Agreement (the “Agreement”) is entered into by and between Vantora Labs, Inc., a Delaware corporation with offices at 4120 Delgany Street, Denver, CO 80216 (“Customer”), and Bramblewood Facilities Group, LLC, a Colorado limited liability company with offices at 2210 Wynkoop Court, Suite 300, Denver, CO 80202 (“Bramblewood”).",
          "“Premises” means Customer's office and lab facility located at 4120 Delgany Street, Denver, CO 80216, including common areas designated in Exhibit A.",
        ],
      },
      {
        id: "c-008-s2",
        number: "2",
        heading: "Services",
        paragraphs: [
          "Bramblewood shall perform janitorial and routine maintenance services at the Premises on a weekly basis in accordance with the service schedule set forth in Exhibit B, including floor care, waste removal, restroom servicing, lighting maintenance, and minor plumbing and HVAC filter service.",
          "Bramblewood shall supply all labor, equipment, and consumable supplies required to perform the Services, except for specialty consumables identified in Exhibit B as Customer-provided.",
        ],
      },
      {
        id: "c-008-s3",
        number: "3",
        heading: "Term",
        paragraphs: [
          "The term of this Agreement shall commence on September 1, 2025 (the “Effective Date”) and shall continue for a term of twenty-four (24) months through August 31, 2027. This Agreement does not renew automatically and shall expire at the end of the term unless extended by a written amendment signed by both parties.",
        ],
      },
      {
        id: "c-008-s4",
        number: "4",
        heading: "Fees; Payment",
        paragraphs: [
          "Customer shall pay Bramblewood a fixed monthly fee of $7,750 for the Services, invoiced monthly in advance. Undisputed invoiced amounts are due net fifteen (15) days from the invoice date. Fees are exclusive of applicable taxes.",
          "Services outside the Exhibit B schedule, including event support and emergency call-outs, shall be billed at the hourly rates set forth in Exhibit C and invoiced with the next monthly invoice.",
        ],
      },
      {
        id: "c-008-s5",
        number: "5",
        heading: "Access; Conduct at the Premises",
        paragraphs: [
          "Customer shall provide Bramblewood personnel with badge access to the Premises during the service windows specified in Exhibit B. Bramblewood personnel shall comply with Customer's posted safety and security policies while at the Premises, including escort requirements for lab areas.",
        ],
      },
      {
        id: "c-008-s6",
        number: "6",
        heading: "Insurance",
        paragraphs: [
          "Bramblewood shall maintain, at its expense, commercial general liability insurance with limits of not less than $1,000,000 per occurrence and $2,000,000 in the aggregate, workers' compensation insurance at statutory limits, and employer's liability coverage of not less than $500,000. Certificates of insurance shall be furnished to Customer upon request.",
        ],
      },
      {
        id: "c-008-s7",
        number: "7",
        heading: "Confidentiality",
        paragraphs: [
          "Bramblewood shall keep confidential any non-public information observed or received in the course of performing the Services and shall not remove documents, media, or equipment from the Premises. Confidential information may be used solely to perform under this Agreement.",
        ],
      },
      {
        id: "c-008-s8",
        number: "8",
        heading: "Indemnification",
        paragraphs: [
          "Each party shall defend and indemnify the other against third-party claims for bodily injury, death, or damage to tangible property to the extent caused by the indemnifying party's negligence or willful misconduct, provided the indemnified party gives prompt notice and reasonable cooperation.",
        ],
      },
      {
        id: "c-008-s9",
        number: "9",
        heading: "Limitation of Liability",
        paragraphs: [
          "EXCEPT FOR AMOUNTS PAYABLE UNDER SECTION 8, EACH PARTY'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT shall not exceed an amount equal to three (3) months of fees paid or payable by Customer under this Agreement. IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES.",
        ],
      },
      {
        id: "c-008-s10",
        number: "10",
        heading: "General; Governing Law",
        paragraphs: [
          "This Agreement is governed by and construed in accordance with the laws of the State of Colorado, without regard to its conflicts of law principles. The parties consent to the exclusive jurisdiction of the state and federal courts located in Denver, Colorado.",
          "Notices must be in writing and delivered to the addresses in Section 1, with a copy to legal@vantoralabs.com and accounts@bramblewoodfg.com respectively, and are effective upon receipt.",
        ],
      },
    ],
  },
};
