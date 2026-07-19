import type { Contract } from "@/data/types";

// c-007 — Harkline Fulfillment & Freight Services Agreement.
// The uncapped-exposure beat: §9 conspicuously lacks an aggregate liability cap
// on the second-largest vendor relationship (~$1.24M/yr). Also carries an
// asymmetric termination-for-convenience right (Harkline only) and a
// $4,500/month volume shortfall fee.

export const harkline: Contract = {
  id: "c-007",
  title: "Fulfillment & Freight Services Agreement",
  counterparty: "Harkline Logistics Corp.",
  counterpartyCategory: "Logistics",
  type: "Vendor",
  status: "active",
  valueUsd: 1_240_000,
  effectiveDate: "2025-04-01",
  expirationDate: "2027-03-31",
  autoRenew: false,
  ingestedAt: "2026-06-08",
  fields: [
    {
      id: "c-007:contract_type",
      contractId: "c-007",
      key: "contract_type",
      label: "Contract type",
      group: "Overview",
      value: { kind: "text", value: "Vendor services agreement" },
      confidence: 0.97,
      source: {
        sectionId: "c-007-s1",
        excerpt:
          "This Fulfillment & Freight Services Agreement (the “Agreement”)",
      },
    },
    {
      id: "c-007:counterparty",
      contractId: "c-007",
      key: "counterparty",
      label: "Counterparty",
      group: "Overview",
      value: { kind: "text", value: "Harkline Logistics Corp." },
      confidence: 0.97,
      source: {
        sectionId: "c-007-s1",
        excerpt:
          "Harkline Logistics Corp., a New York corporation with offices at 88 Vandervoort Terminal Road, Brooklyn, NY 11222 (“Harkline”)",
      },
    },
    {
      id: "c-007:effective_date",
      contractId: "c-007",
      key: "effective_date",
      label: "Effective date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2025-04-01" },
      confidence: 0.96,
      source: {
        sectionId: "c-007-s3",
        excerpt: "commence on April 1, 2025 (the “Effective Date”)",
      },
    },
    {
      id: "c-007:expiration_date",
      contractId: "c-007",
      key: "expiration_date",
      label: "Expiration date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2027-03-31" },
      confidence: 0.95,
      source: {
        sectionId: "c-007-s3",
        excerpt:
          "continue for an initial term of twenty-four (24) months through March 31, 2027 (the “Initial Term”)",
      },
    },
    {
      id: "c-007:auto_renew",
      contractId: "c-007",
      key: "auto_renew",
      label: "Auto-renewal",
      group: "Term & renewal",
      value: { kind: "boolean", value: false },
      confidence: 0.93,
      source: {
        sectionId: "c-007-s3",
        excerpt: "it does not renew automatically",
      },
    },
    {
      id: "c-007:total_value",
      contractId: "c-007",
      key: "total_value",
      label: "Total contract value",
      group: "Financial",
      value: { kind: "money", usd: 1_240_000 },
      confidence: 0.82,
      source: {
        sectionId: "c-007-s4",
        excerpt:
          "a minimum monthly commitment of $46,000 (the “Minimum Monthly Commitment”)",
      },
      note: "Estimated from $46,000/mo minimum commitment plus trailing average overage",
    },
    {
      id: "c-007:payment_schedule",
      contractId: "c-007",
      key: "payment_schedule",
      label: "Payment schedule",
      group: "Financial",
      value: {
        kind: "text",
        value:
          "Monthly volume-based invoices, net 30; $46,000/mo minimum with $4,500 shortfall fee",
      },
      confidence: 0.93,
      source: {
        sectionId: "c-007-s4",
        excerpt:
          "If Customer's aggregate volume-based fees for any calendar month are less than the Minimum Monthly Commitment, Customer shall pay Harkline a volume shortfall fee of $4,500 for such month",
      },
    },
    {
      id: "c-007:liability_cap",
      contractId: "c-007",
      key: "liability_cap",
      label: "Liability cap",
      group: "Legal terms",
      value: { kind: "missing", expected: "Aggregate liability cap" },
      confidence: 0.81,
      source: null,
      note: "Section 9 disclaims consequential damages but sets no aggregate cap.",
    },
    {
      id: "c-007:termination",
      contractId: "c-007",
      key: "termination",
      label: "Termination",
      group: "Legal terms",
      value: {
        kind: "text",
        value:
          "Harkline may terminate for convenience on 30 days' notice; Vantora has no reciprocal right",
      },
      confidence: 0.84,
      source: {
        sectionId: "c-007-s11",
        excerpt:
          "Harkline may terminate this Agreement for convenience upon thirty (30) days' prior written notice to Customer",
      },
      note: "One-way right: no reciprocal termination-for-convenience right for Customer appears anywhere in the Agreement.",
    },
    {
      id: "c-007:sla",
      contractId: "c-007",
      key: "sla",
      label: "Service level",
      group: "Legal terms",
      value: { kind: "text", value: "≥96% on-time delivery, measured quarterly" },
      confidence: 0.94,
      source: {
        sectionId: "c-007-s6",
        excerpt:
          "maintain an on-time delivery rate of at least ninety-six percent (96%), measured quarterly",
      },
    },
    {
      id: "c-007:governing_law",
      contractId: "c-007",
      key: "governing_law",
      label: "Governing law",
      group: "Legal terms",
      value: { kind: "text", value: "New York" },
      confidence: 0.97,
      source: {
        sectionId: "c-007-s12",
        excerpt:
          "governed by and construed in accordance with the laws of the State of New York",
      },
    },
  ],
  obligations: [
    {
      id: "c-007:ob-forecast",
      contractId: "c-007",
      title: "Quarterly volume forecast to Harkline",
      owedBy: "us",
      dueDate: "2026-10-01",
      recurrence: "quarterly",
      description:
        "Deliver a non-binding rolling volume forecast for the upcoming quarter by the first business day of each calendar quarter. Next due October 1, 2026.",
      source: {
        sectionId: "c-007-s7",
        excerpt:
          "deliver to Harkline a non-binding rolling volume forecast for the upcoming calendar quarter no later than the first business day of each calendar quarter",
      },
    },
    {
      id: "c-007:ob-otd",
      contractId: "c-007",
      title: "Harkline: maintain ≥96% on-time delivery rate",
      owedBy: "them",
      recurrence: "quarterly",
      description:
        "Harkline must maintain an on-time delivery rate of at least 96%, measured quarterly across all completed shipments, and report performance within 15 days of each quarter end.",
      source: {
        sectionId: "c-007-s6",
        excerpt:
          "maintain an on-time delivery rate of at least ninety-six percent (96%), measured quarterly",
      },
    },
  ],
  risks: [
    {
      id: "c-007:risk-nocap",
      contractId: "c-007",
      kind: "absent_liability_cap",
      severity: "high",
      summary:
        "No aggregate liability cap on the second-largest vendor relationship (~$1.24M/yr)",
      fieldId: "c-007:liability_cap",
    },
    {
      id: "c-007:risk-termination",
      contractId: "c-007",
      kind: "termination_for_convenience",
      severity: "medium",
      summary:
        "Asymmetric exit rights: Harkline can walk away on 30 days' notice; Vantora has no reciprocal convenience termination.",
      fieldId: "c-007:termination",
    },
    {
      id: "c-007:risk-shortfall",
      contractId: "c-007",
      kind: "penalty",
      severity: "medium",
      summary:
        "$4,500/month shortfall fee whenever volume-based fees fall below the $46,000 minimum commitment.",
      fieldId: "c-007:payment_schedule",
    },
  ],
  milestones: [],
  document: {
    filename: "Harkline_Fulfillment_Freight_2025.pdf",
    format: "pdf",
    pages: 16,
    sections: [
      {
        id: "c-007-s1",
        number: "1",
        heading: "Parties; Definitions",
        paragraphs: [
          "This Fulfillment & Freight Services Agreement (the “Agreement”) is entered into by and between Vantora Labs, Inc., a Delaware corporation with offices at 4120 Delgany Street, Denver, CO 80216 (“Customer”), and Harkline Logistics Corp., a New York corporation with offices at 88 Vandervoort Terminal Road, Brooklyn, NY 11222 (“Harkline”).",
          "“Services” means the warehousing, order fulfillment, kitting, and freight management services described in Section 2 and Schedule 1. “On-Time Delivery” means tender of a shipment to the end recipient on or before the delivery date quoted at order acceptance.",
        ],
      },
      {
        id: "c-007-s2",
        number: "2",
        heading: "Services",
        paragraphs: [
          "Harkline shall receive, store, pick, pack, and ship Customer's products from Harkline's fulfillment centers, and shall arrange freight with carriers selected in Harkline's reasonable discretion. Harkline shall maintain inventory records and make them available to Customer through Harkline's client portal.",
          "Harkline shall handle Customer inventory with commercially reasonable care and shall maintain warehouse conditions consistent with industry standards for consumer electronics and hardware products.",
        ],
      },
      {
        id: "c-007-s3",
        number: "3",
        heading: "Term",
        paragraphs: [
          "The term of this Agreement shall commence on April 1, 2025 (the “Effective Date”) and shall continue for an initial term of twenty-four (24) months through March 31, 2027 (the “Initial Term”). This Agreement shall expire at the end of the Initial Term unless extended by a written amendment signed by both parties; it does not renew automatically.",
        ],
      },
      {
        id: "c-007-s4",
        number: "4",
        heading: "Fees; Minimum Monthly Commitment; Shortfall Fee",
        paragraphs: [
          "Customer shall pay Harkline the per-order fulfillment fees, storage fees, and freight charges set forth in Schedule 1, based on actual monthly volumes. Fees are stated and payable in U.S. dollars and are exclusive of applicable taxes and carrier surcharges.",
          "Customer's aggregate volume-based fees under this Agreement shall be subject to a minimum monthly commitment of $46,000 (the “Minimum Monthly Commitment”). If Customer's aggregate volume-based fees for any calendar month are less than the Minimum Monthly Commitment, Customer shall pay Harkline a volume shortfall fee of $4,500 for such month, which shall be reflected on the next monthly invoice. The shortfall fee is a service-availability charge and shall not be credited against fees in any subsequent month.",
        ],
      },
      {
        id: "c-007-s5",
        number: "5",
        heading: "Invoicing; Payment",
        paragraphs: [
          "Harkline shall invoice Customer monthly in arrears for all fees and charges accrued during the preceding calendar month. Undisputed amounts are due net thirty (30) days from the invoice date; amounts not received when due shall accrue interest at the lesser of one percent (1%) per month or the maximum rate permitted by law.",
        ],
      },
      {
        id: "c-007-s6",
        number: "6",
        heading: "Service Standards",
        paragraphs: [
          "Harkline shall maintain an on-time delivery rate of at least ninety-six percent (96%), measured quarterly across all completed shipments, excluding delays attributable to carrier force majeure or Customer packaging errors. Harkline shall report performance against this standard within fifteen (15) days following the close of each calendar quarter.",
        ],
      },
      {
        id: "c-007-s7",
        number: "7",
        heading: "Forecasting",
        paragraphs: [
          "Customer shall deliver to Harkline a non-binding rolling volume forecast for the upcoming calendar quarter no later than the first business day of each calendar quarter. Harkline shall use such forecasts to plan warehouse labor and carrier capacity, and shall notify Customer promptly if forecasted volumes exceed available capacity.",
        ],
      },
      {
        id: "c-007-s8",
        number: "8",
        heading: "Confidentiality",
        paragraphs: [
          "Each party shall protect the other party's Confidential Information with at least the degree of care it uses for its own confidential information of like kind, and in no event less than reasonable care. Confidential Information may be used solely to perform under, or exercise rights granted by, this Agreement.",
        ],
      },
      {
        id: "c-007-s9",
        number: "9",
        heading: "Limitation of Liability",
        paragraphs: [
          "IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS OR LOST REVENUE, ARISING OUT OF OR RELATED TO THIS AGREEMENT, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. The exclusions in this Section 9 shall not apply to a party's indemnification obligations under Section 10 or to breaches of Section 8.",
        ],
      },
      {
        id: "c-007-s10",
        number: "10",
        heading: "Indemnification",
        paragraphs: [
          "Each party shall defend and indemnify the other against third-party claims for bodily injury, death, or damage to tangible property to the extent caused by the indemnifying party's negligence or willful misconduct, provided the indemnified party gives prompt notice and reasonable cooperation.",
        ],
      },
      {
        id: "c-007-s11",
        number: "11",
        heading: "Termination",
        paragraphs: [
          "Either party may terminate this Agreement for material breach upon thirty (30) days' written notice if such breach remains uncured at the end of the notice period. Customer may also terminate immediately upon Harkline's insolvency or assignment for the benefit of creditors.",
          "Harkline may terminate this Agreement for convenience upon thirty (30) days' prior written notice to Customer. Upon any such termination, Harkline shall continue to fulfill orders accepted prior to the effective date of termination and shall cooperate in the orderly transfer of Customer inventory to Customer or its designee at Customer's expense.",
        ],
      },
      {
        id: "c-007-s12",
        number: "12",
        heading: "General; Governing Law",
        paragraphs: [
          "This Agreement is governed by and construed in accordance with the laws of the State of New York, without regard to its conflicts of law principles. The parties consent to the exclusive jurisdiction of the state and federal courts located in New York County, New York.",
          "Notices must be in writing and delivered to the addresses in Section 1, with a copy to legal@vantoralabs.com and contracts@harkline.com respectively, and are effective upon receipt.",
        ],
      },
    ],
  },
};
