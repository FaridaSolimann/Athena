import type { Contract } from "@/data/types";

// c-014 — Tessellate Energy Partners strategic partnership & reseller agreement.
// The exclusivity beat: Tessellate holds an EXCLUSIVE reseller grant for
// Vantora's wildfire risk models across eight Mountain West states through
// mid-2028 — blocking direct sales and any other channel partner there.

export const tessellate: Contract = {
  id: "c-014",
  title: "Strategic Partnership & Reseller Agreement",
  counterparty: "Tessellate Energy Partners LLC",
  counterpartyCategory: "Channel partner",
  type: "Partnership",
  status: "active",
  valueUsd: 275_000,
  effectiveDate: "2025-06-01",
  expirationDate: "2028-05-31",
  autoRenew: false,
  ingestedAt: "2026-06-15",
  fields: [
    {
      id: "c-014:contract_type",
      contractId: "c-014",
      key: "contract_type",
      label: "Contract type",
      group: "Overview",
      value: { kind: "text", value: "Partnership & reseller agreement" },
      confidence: 0.97,
      source: {
        sectionId: "c-014-s1",
        excerpt:
          "This Strategic Partnership & Reseller Agreement (the “Agreement”)",
      },
    },
    {
      id: "c-014:counterparty",
      contractId: "c-014",
      key: "counterparty",
      label: "Counterparty",
      group: "Overview",
      value: { kind: "text", value: "Tessellate Energy Partners LLC" },
      confidence: 0.98,
      source: {
        sectionId: "c-014-s1",
        excerpt:
          "Tessellate Energy Partners LLC, a Utah limited liability company with offices at 2180 South Meridian Way, Salt Lake City, UT 84104 (“Tessellate”)",
      },
    },
    {
      id: "c-014:effective_date",
      contractId: "c-014",
      key: "effective_date",
      label: "Effective date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2025-06-01" },
      confidence: 0.96,
      source: {
        sectionId: "c-014-s2",
        excerpt: "commence on June 1, 2025 (the “Effective Date”)",
      },
    },
    {
      id: "c-014:expiration_date",
      contractId: "c-014",
      key: "expiration_date",
      label: "Expiration date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2028-05-31" },
      confidence: 0.96,
      source: {
        sectionId: "c-014-s2",
        excerpt:
          "continue for a term of thirty-six (36) months through May 31, 2028 (the “Term”)",
      },
    },
    {
      id: "c-014:auto_renew",
      contractId: "c-014",
      key: "auto_renew",
      label: "Auto-renewal",
      group: "Term & renewal",
      value: { kind: "boolean", value: false },
      confidence: 0.94,
      source: {
        sectionId: "c-014-s2",
        excerpt: "This Agreement shall not renew automatically",
      },
    },
    {
      id: "c-014:term_length",
      contractId: "c-014",
      key: "term_length",
      label: "Term length",
      group: "Term & renewal",
      value: { kind: "duration", days: 1095, raw: "thirty-six (36) months" },
      confidence: 0.95,
      source: {
        sectionId: "c-014-s2",
        excerpt: "a term of thirty-six (36) months",
      },
    },
    {
      id: "c-014:total_value",
      contractId: "c-014",
      key: "total_value",
      label: "Total contract value",
      group: "Financial",
      value: { kind: "money", usd: 275_000 },
      confidence: 0.84,
      source: {
        sectionId: "c-014-s5",
        excerpt:
          "a minimum of $275,000 in aggregate co-marketing expenditures over the thirty-six (36) month Term",
      },
      note: "Minimum committed co-marketing spend over the 36-month term",
    },
    {
      id: "c-014:payment_schedule",
      contractId: "c-014",
      key: "payment_schedule",
      label: "Referral revenue share",
      group: "Financial",
      value: { kind: "text", value: "15% referral share, remitted quarterly" },
      confidence: 0.93,
      source: {
        sectionId: "c-014-s4",
        excerpt:
          "a referral fee equal to fifteen percent (15%) of Net Revenue actually received by Vantora from Qualified Referrals, remitted quarterly",
      },
    },
    {
      id: "c-014:exclusivity",
      contractId: "c-014",
      key: "exclusivity",
      label: "Exclusivity",
      group: "Legal terms",
      value: { kind: "text", value: "Exclusive reseller — Mountain West region" },
      confidence: 0.83,
      source: {
        sectionId: "c-014-s3",
        excerpt:
          "appoints Tessellate as its sole and exclusive reseller of the Wildfire Risk Models in the Territory for the duration of the Term",
      },
      note: "Scope inferred from the defined Territory in §3.2",
    },
    {
      id: "c-014:liability_cap",
      contractId: "c-014",
      key: "liability_cap",
      label: "Liability cap",
      group: "Legal terms",
      value: { kind: "money", usd: 500_000 },
      confidence: 0.95,
      source: {
        sectionId: "c-014-s9",
        excerpt:
          "SHALL NOT EXCEED FIVE HUNDRED THOUSAND DOLLARS ($500,000)",
      },
    },
    {
      id: "c-014:governing_law",
      contractId: "c-014",
      key: "governing_law",
      label: "Governing law",
      group: "Legal terms",
      value: { kind: "text", value: "Delaware" },
      confidence: 0.97,
      source: {
        sectionId: "c-014-s12",
        excerpt:
          "governed by and construed in accordance with the laws of the State of Delaware",
      },
    },
  ],
  obligations: [
    {
      id: "c-014:ob-true-up",
      contractId: "c-014",
      title: "Annual co-marketing true-up",
      owedBy: "us",
      recurrence: "annual",
      dueDate: "2027-03-31",
      description:
        "By March 31 each year, reconcile actual co-marketing expenditures against the $275,000 committed minimum; any shortfall must be cured within 60 days.",
      source: {
        sectionId: "c-014-s5",
        excerpt:
          "No later than March 31 of each calendar year, the parties shall conduct an annual true-up of co-marketing expenditures against the committed minimum",
      },
    },
    {
      id: "c-014:ob-pipeline-review",
      contractId: "c-014",
      title: "Quarterly joint pipeline review",
      owedBy: "us",
      recurrence: "quarterly",
      dueDate: "2026-10-05",
      description:
        "Hold the quarterly pipeline review with Tessellate during the first two weeks of each calendar quarter — joint sales pipeline, forecast, and marketing calendar.",
      source: {
        sectionId: "c-014-s6",
        excerpt:
          "quarterly pipeline review meetings during the first two (2) weeks of each calendar quarter",
      },
    },
  ],
  risks: [
    {
      id: "c-014:risk-exclusivity",
      contractId: "c-014",
      kind: "exclusivity",
      severity: "high",
      summary:
        "Exclusive Mountain West reseller grant blocks direct sales and other channel partners in eight states until mid-2028",
      fieldId: "c-014:exclusivity",
    },
  ],
  milestones: [],
  document: {
    filename: "Tessellate_Partnership_Reseller_2025.pdf",
    format: "pdf",
    pages: 15,
    sections: [
      {
        id: "c-014-s1",
        number: "1",
        heading: "Parties; Purpose; Definitions",
        paragraphs: [
          "This Strategic Partnership & Reseller Agreement (the “Agreement”) is entered into by and between Vantora Labs, Inc., a Delaware corporation with offices at 4120 Delgany Street, Denver, CO 80216 (“Vantora”), and Tessellate Energy Partners LLC, a Utah limited liability company with offices at 2180 South Meridian Way, Salt Lake City, UT 84104 (“Tessellate”).",
          "“Wildfire Risk Models” means Vantora's proprietary wildfire risk assessment models, associated APIs, and reporting tools made generally available for utility and insurance customers, as further described in Exhibit A. “Qualified Referral” means a prospective customer introduced by Tessellate and registered in accordance with Section 4.2. “Net Revenue” means gross amounts actually received by Vantora from a Qualified Referral, less taxes, refunds, and third-party pass-through costs.",
        ],
      },
      {
        id: "c-014-s2",
        number: "2",
        heading: "Term",
        paragraphs: [
          "The term of this Agreement shall commence on June 1, 2025 (the “Effective Date”) and shall continue for a term of thirty-six (36) months through May 31, 2028 (the “Term”), unless earlier terminated in accordance with Section 11.",
          "This Agreement shall not renew automatically. Any renewal or extension of the Term requires a written amendment executed by authorized representatives of both parties no later than ninety (90) days prior to expiration.",
        ],
      },
      {
        id: "c-014-s3",
        number: "3",
        heading: "Exclusive Appointment; Territory",
        paragraphs: [
          "3.1 Exclusive Appointment. Subject to the terms and conditions of this Agreement, Vantora hereby appoints Tessellate as its sole and exclusive reseller of the Wildfire Risk Models in the Territory for the duration of the Term, and Tessellate accepts such appointment. During the Term, Vantora shall not, directly or indirectly, market, sell, or license the Wildfire Risk Models to end customers located in the Territory, and shall not appoint any other reseller, distributor, sales agent, or channel partner with respect to the Territory. Vantora shall refer to Tessellate all inbound inquiries originating from prospective customers located in the Territory within five (5) business days of receipt.",
          "3.2 Territory. “Territory” means the Mountain West region of the United States, consisting of the States of Colorado, Utah, Wyoming, Montana, Idaho, New Mexico, Arizona, and Nevada. Tessellate shall not actively solicit customers located outside the Territory without Vantora's prior written consent, provided that unsolicited inbound inquiries from outside the Territory may be referred to Vantora for direct handling.",
          "3.3 Reservation. Nothing in this Section 3 restricts Vantora's sale of products other than the Wildfire Risk Models, or its performance under agreements with customers located outside the Territory, including national accounts whose headquarters are outside the Territory.",
        ],
      },
      {
        id: "c-014-s4",
        number: "4",
        heading: "Referral Fees; Revenue Share",
        paragraphs: [
          "4.1 Referral Fee. Vantora shall pay Tessellate a referral fee equal to fifteen percent (15%) of Net Revenue actually received by Vantora from Qualified Referrals, remitted quarterly within thirty (30) days following the close of each calendar quarter, accompanied by a reasonably detailed statement of the underlying transactions.",
          "4.2 Deal Registration. Tessellate shall register each prospective customer through Vantora's partner portal. A registration is valid for one hundred eighty (180) days and may be extended upon evidence of active pursuit. Disputes over registration priority shall be escalated to the Steering Committee under Section 6.",
        ],
      },
      {
        id: "c-014-s5",
        number: "5",
        heading: "Co-Marketing Commitments",
        paragraphs: [
          "The parties shall jointly commit a minimum of $275,000 in aggregate co-marketing expenditures over the thirty-six (36) month Term, allocated approximately evenly across contract years and split equally between the parties unless otherwise agreed in an annual marketing plan. Qualifying expenditures include trade show sponsorships, joint webinars, case-study production, and demand-generation campaigns approved in the annual marketing plan.",
          "No later than March 31 of each calendar year, the parties shall conduct an annual true-up of co-marketing expenditures against the committed minimum, and any shortfall attributable to a party shall be cured by additional qualifying spend within sixty (60) days of the true-up.",
        ],
      },
      {
        id: "c-014-s6",
        number: "6",
        heading: "Governance; Pipeline Reviews",
        paragraphs: [
          "The parties shall establish a Steering Committee of two (2) representatives from each party, which shall meet at least semi-annually to review overall performance of the partnership. The parties shall additionally hold quarterly pipeline review meetings during the first two (2) weeks of each calendar quarter to review the joint sales pipeline, revenue forecast, deal registrations, and the co-marketing calendar.",
        ],
      },
      {
        id: "c-014-s7",
        number: "7",
        heading: "Trademarks; Branding",
        paragraphs: [
          "Each party grants the other a limited, non-exclusive, non-transferable license to use its trademarks solely in connection with approved co-marketing activities under this Agreement, subject to the granting party's brand guidelines. All goodwill arising from such use inures to the benefit of the trademark owner.",
        ],
      },
      {
        id: "c-014-s8",
        number: "8",
        heading: "Confidentiality",
        paragraphs: [
          "Each party shall protect the other party's Confidential Information with at least the degree of care it uses for its own confidential information of like kind, and in no event less than reasonable care. Confidential Information may be used solely to perform under, or exercise rights granted by, this Agreement, and pipeline and pricing information shared under Section 6 is Confidential Information of the disclosing party.",
        ],
      },
      {
        id: "c-014-s9",
        number: "9",
        heading: "Limitation of Liability",
        paragraphs: [
          "EXCEPT FOR BREACHES OF SECTION 8 OR AMOUNTS PAYABLE UNDER SECTION 10, EACH PARTY'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL NOT EXCEED FIVE HUNDRED THOUSAND DOLLARS ($500,000). IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS.",
        ],
      },
      {
        id: "c-014-s10",
        number: "10",
        heading: "Indemnification",
        paragraphs: [
          "Vantora shall defend Tessellate against any third-party claim alleging that the Wildfire Risk Models, as provided by Vantora and used as permitted hereunder, infringe a U.S. patent, copyright, or trademark, and shall indemnify Tessellate against amounts finally awarded or agreed in settlement. Tessellate shall defend and indemnify Vantora against claims arising from representations made by Tessellate beyond those authorized in Vantora's published documentation.",
        ],
      },
      {
        id: "c-014-s11",
        number: "11",
        heading: "Termination",
        paragraphs: [
          "Either party may terminate this Agreement for material breach upon thirty (30) days' written notice if such breach remains uncured at the end of the notice period. Vantora may terminate the exclusivity granted in Section 3.1 (without terminating the Agreement) upon sixty (60) days' written notice if Tessellate fails to meet the minimum registered-pipeline thresholds set forth in Exhibit B for two (2) consecutive quarters.",
        ],
      },
      {
        id: "c-014-s12",
        number: "12",
        heading: "General; Governing Law",
        paragraphs: [
          "This Agreement is governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflicts of law principles. The parties consent to the exclusive jurisdiction of the state and federal courts located in Wilmington, Delaware. Neither party may assign this Agreement without the other party's prior written consent, except to a successor in connection with a merger or sale of substantially all assets.",
        ],
      },
    ],
  },
};
