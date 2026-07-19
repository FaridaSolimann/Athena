import type { Contract } from "@/data/types";

// c-004 — Torvane Consulting Group MSA (umbrella for c-005 and c-006).
// Fees live entirely in the SOWs; the demo-touched clauses here are the
// $2,000,000 AGGREGATE liability cap that governs all SOWs, a favorable
// termination-for-convenience right for Vantora, and Torvane's annual
// $2M E&O insurance certificate (next due March 1, 2027).

export const torvaneMsa: Contract = {
  id: "c-004",
  title: "Master Services Agreement",
  counterparty: "Torvane Consulting Group LLC",
  counterpartyCategory: "IT consulting",
  type: "MSA",
  status: "active",
  valueUsd: 0,
  effectiveDate: "2025-03-01",
  expirationDate: "2028-02-29",
  autoRenew: false,
  ingestedAt: "2026-06-03",
  fields: [
    {
      id: "c-004:contract_type",
      contractId: "c-004",
      key: "contract_type",
      label: "Contract type",
      group: "Overview",
      value: { kind: "text", value: "Master services agreement" },
      confidence: 0.98,
      source: {
        sectionId: "c-004-s1",
        excerpt: "This Master Services Agreement (the “Agreement”)",
      },
    },
    {
      id: "c-004:counterparty",
      contractId: "c-004",
      key: "counterparty",
      label: "Counterparty",
      group: "Overview",
      value: { kind: "text", value: "Torvane Consulting Group LLC" },
      confidence: 0.98,
      source: {
        sectionId: "c-004-s1",
        excerpt:
          "Torvane Consulting Group LLC, a New York limited liability company with offices at 228 Varick Street, Suite 410, New York, NY 10014 (“Torvane”)",
      },
    },
    {
      id: "c-004:effective_date",
      contractId: "c-004",
      key: "effective_date",
      label: "Effective date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2025-03-01" },
      confidence: 0.97,
      source: {
        sectionId: "c-004-s3",
        excerpt: "commence on March 1, 2025 (the “Effective Date”)",
      },
    },
    {
      id: "c-004:expiration_date",
      contractId: "c-004",
      key: "expiration_date",
      label: "Expiration date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2028-02-29" },
      confidence: 0.96,
      source: {
        sectionId: "c-004-s3",
        excerpt:
          "continue for an initial term of thirty-six (36) months through February 29, 2028",
      },
    },
    {
      id: "c-004:auto_renew",
      contractId: "c-004",
      key: "auto_renew",
      label: "Auto-renewal",
      group: "Term & renewal",
      value: { kind: "boolean", value: false },
      confidence: 0.95,
      source: {
        sectionId: "c-004-s3",
        excerpt:
          "This Agreement does not renew automatically; any extension shall be by written amendment executed by both parties",
      },
    },
    {
      id: "c-004:term_length",
      contractId: "c-004",
      key: "term_length",
      label: "Term length",
      group: "Term & renewal",
      value: { kind: "duration", days: 1095, raw: "thirty-six (36) months" },
      confidence: 0.94,
      source: {
        sectionId: "c-004-s3",
        excerpt: "an initial term of thirty-six (36) months",
      },
    },
    {
      id: "c-004:total_value",
      contractId: "c-004",
      key: "total_value",
      label: "Total contract value",
      group: "Financial",
      value: { kind: "money", usd: 0 },
      confidence: 0.85,
      source: {
        sectionId: "c-004-s4",
        excerpt:
          "all fees are established exclusively in Statements of Work executed hereunder",
      },
      note: "Fees are set in Statements of Work executed hereunder — the umbrella agreement itself carries no fees.",
    },
    {
      id: "c-004:payment_schedule",
      contractId: "c-004",
      key: "payment_schedule",
      label: "Payment schedule",
      group: "Financial",
      value: { kind: "text", value: "Per SOW; default monthly in arrears, net 30" },
      confidence: 0.93,
      source: {
        sectionId: "c-004-s4",
        excerpt:
          "Torvane shall invoice Customer monthly in arrears, and undisputed invoices shall be due within thirty (30) days of receipt",
      },
    },
    {
      id: "c-004:liability_cap",
      contractId: "c-004",
      key: "liability_cap",
      label: "Liability cap",
      group: "Legal terms",
      value: { kind: "money", usd: 2_000_000 },
      confidence: 0.95,
      source: {
        sectionId: "c-004-s9",
        excerpt:
          "AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT AND ALL STATEMENTS OF WORK EXECUTED HEREUNDER, TAKEN TOGETHER, shall not exceed two million dollars ($2,000,000)",
      },
    },
    {
      id: "c-004:governing_law",
      contractId: "c-004",
      key: "governing_law",
      label: "Governing law",
      group: "Legal terms",
      value: { kind: "text", value: "New York" },
      confidence: 0.97,
      source: {
        sectionId: "c-004-s12",
        excerpt:
          "governed by and construed in accordance with the laws of the State of New York",
      },
    },
    {
      id: "c-004:confidentiality",
      contractId: "c-004",
      key: "confidentiality",
      label: "Confidentiality",
      group: "Legal terms",
      value: { kind: "text", value: "Mutual; survives 5 years post-termination" },
      confidence: 0.94,
      source: {
        sectionId: "c-004-s6",
        excerpt:
          "the obligations of this Section 6 survive for five (5) years following termination or expiration",
      },
    },
    {
      id: "c-004:ip_ownership",
      contractId: "c-004",
      key: "ip_ownership",
      label: "IP ownership",
      group: "Legal terms",
      value: {
        kind: "text",
        value: "Deliverables assigned to Vantora on payment; Torvane keeps pre-existing tools",
      },
      confidence: 0.93,
      source: {
        sectionId: "c-004-s7",
        excerpt:
          "Torvane hereby assigns to Customer all right, title, and interest in and to such deliverables upon payment of the applicable fees",
      },
    },
    {
      id: "c-004:indemnification",
      contractId: "c-004",
      key: "indemnification",
      label: "Indemnification",
      group: "Legal terms",
      value: { kind: "text", value: "Torvane indemnifies for U.S. IP infringement" },
      confidence: 0.93,
      source: {
        sectionId: "c-004-s8",
        excerpt:
          "Torvane shall defend Customer against any third-party claim alleging that a deliverable, as provided by Torvane, infringes a U.S. patent, copyright, or trademark",
      },
    },
    {
      id: "c-004:termination",
      contractId: "c-004",
      key: "termination",
      label: "Termination",
      group: "Legal terms",
      value: {
        kind: "text",
        value: "Vantora may terminate for convenience on 30 days' notice",
      },
      confidence: 0.96,
      source: {
        sectionId: "c-004-s11",
        excerpt:
          "Customer may terminate this Agreement or any Statement of Work, in whole or in part, for convenience upon thirty (30) days' prior written notice to Torvane",
      },
    },
    {
      id: "c-004:insurance",
      contractId: "c-004",
      key: "insurance",
      label: "Insurance",
      group: "Legal terms",
      value: {
        kind: "text",
        value: "E&O $2,000,000; certificate delivered annually by March 1",
      },
      confidence: 0.94,
      source: {
        sectionId: "c-004-s10",
        excerpt:
          "professional liability (errors and omissions) insurance with limits of not less than $2,000,000 per claim and in the aggregate",
      },
    },
  ],
  obligations: [
    {
      id: "c-004:ob-insurance-cert",
      contractId: "c-004",
      title: "Torvane: annual E&O insurance certificate",
      owedBy: "them",
      recurrence: "annual",
      dueDate: "2027-03-01",
      description:
        "Torvane delivers a certificate of insurance evidencing $2,000,000 errors & omissions coverage by March 1 of each calendar year. The 2026 certificate is on file; the next is due March 1, 2027.",
      source: {
        sectionId: "c-004-s10",
        excerpt:
          "Torvane shall deliver to Customer a certificate of insurance evidencing such coverage no later than March 1 of each calendar year during the term",
      },
    },
    {
      id: "c-004:ob-sow-form",
      contractId: "c-004",
      title: "Route all engagements through executed SOWs",
      owedBy: "us",
      description:
        "All services must be ordered through Statements of Work that reference this Agreement and are executed by authorized representatives of both parties.",
      source: {
        sectionId: "c-004-s2",
        excerpt:
          "Each SOW shall reference this Agreement and, upon execution by authorized representatives of both parties, shall be incorporated into and governed by this Agreement",
      },
    },
    {
      id: "c-004:ob-key-personnel",
      contractId: "c-004",
      title: "Torvane: no key-personnel changes without consent",
      owedBy: "them",
      description:
        "Torvane may not replace key personnel identified in a SOW without Vantora's prior written consent, not to be unreasonably withheld.",
      source: {
        sectionId: "c-004-s5",
        excerpt:
          "Torvane shall not replace key personnel identified in a SOW without Customer's prior written consent",
      },
    },
  ],
  risks: [],
  milestones: [],
  document: {
    filename: "Torvane_MSA_2025.pdf",
    format: "pdf",
    pages: 18,
    sections: [
      {
        id: "c-004-s1",
        number: "1",
        heading: "Parties; Structure of Agreement",
        paragraphs: [
          "This Master Services Agreement (the “Agreement”) is entered into as of March 1, 2025 by and between Vantora Labs, Inc., a Delaware corporation with offices at 4120 Delgany Street, Denver, CO 80216 (“Customer”), and Torvane Consulting Group LLC, a New York limited liability company with offices at 228 Varick Street, Suite 410, New York, NY 10014 (“Torvane”).",
          "Torvane shall provide information technology consulting and related professional services (the “Services”) as described in one or more Statements of Work executed pursuant to Section 2. This Agreement establishes the general terms under which all such Services are performed.",
        ],
      },
      {
        id: "c-004-s2",
        number: "2",
        heading: "Statements of Work",
        paragraphs: [
          "The parties may from time to time execute Statements of Work (each, a “SOW”) describing Services, deliverables, schedules, and fees. Each SOW shall reference this Agreement and, upon execution by authorized representatives of both parties, shall be incorporated into and governed by this Agreement.",
          "In the event of a conflict between this Agreement and a SOW, this Agreement shall control unless the SOW expressly identifies the provision of this Agreement to be modified and states the parties' intent to modify it.",
        ],
      },
      {
        id: "c-004-s3",
        number: "3",
        heading: "Term",
        paragraphs: [
          "This Agreement shall commence on March 1, 2025 (the “Effective Date”) and shall continue for an initial term of thirty-six (36) months through February 29, 2028, unless earlier terminated in accordance with Section 11. This Agreement does not renew automatically; any extension shall be by written amendment executed by both parties.",
        ],
      },
      {
        id: "c-004-s4",
        number: "4",
        heading: "Fees; Payment",
        paragraphs: [
          "Fees for the Services shall be set forth in the applicable Statement of Work. Except as expressly stated in a SOW, Torvane shall invoice Customer monthly in arrears, and undisputed invoices shall be due within thirty (30) days of receipt.",
          "This Agreement itself imposes no fee obligation on Customer; all fees are established exclusively in Statements of Work executed hereunder. Fees are stated and payable in U.S. dollars and are exclusive of applicable taxes.",
        ],
      },
      {
        id: "c-004-s5",
        number: "5",
        heading: "Personnel; Performance Standards",
        paragraphs: [
          "Torvane shall perform the Services in a professional and workmanlike manner consistent with generally accepted industry standards, using personnel with suitable skill and experience. Torvane shall not replace key personnel identified in a SOW without Customer's prior written consent, not to be unreasonably withheld.",
        ],
      },
      {
        id: "c-004-s6",
        number: "6",
        heading: "Confidentiality",
        paragraphs: [
          "Each party shall protect the other party's Confidential Information using at least the degree of care it applies to its own confidential information of like kind, and in no event less than reasonable care. Confidential Information may be used solely to perform under, or exercise rights granted by, this Agreement, and the obligations of this Section 6 survive for five (5) years following termination or expiration.",
        ],
      },
      {
        id: "c-004-s7",
        number: "7",
        heading: "Intellectual Property",
        paragraphs: [
          "All deliverables created by Torvane specifically for Customer under a SOW shall be deemed works made for hire, and Torvane hereby assigns to Customer all right, title, and interest in and to such deliverables upon payment of the applicable fees. Torvane retains ownership of its pre-existing tools and methodologies, and grants Customer a perpetual, non-exclusive, royalty-free license to use them as embedded in the deliverables.",
        ],
      },
      {
        id: "c-004-s8",
        number: "8",
        heading: "Indemnification",
        paragraphs: [
          "Torvane shall defend Customer against any third-party claim alleging that a deliverable, as provided by Torvane, infringes a U.S. patent, copyright, or trademark, and shall indemnify Customer against amounts finally awarded or agreed in settlement, provided Customer gives prompt notice and reasonable cooperation.",
        ],
      },
      {
        id: "c-004-s9",
        number: "9",
        heading: "Limitation of Liability",
        paragraphs: [
          "EXCEPT FOR BREACHES OF SECTION 6 OR AMOUNTS PAYABLE UNDER SECTION 8, EACH PARTY'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT AND ALL STATEMENTS OF WORK EXECUTED HEREUNDER, TAKEN TOGETHER, shall not exceed two million dollars ($2,000,000). This cap applies in the aggregate across this Agreement and all Statements of Work and shall not be enlarged by the execution of additional Statements of Work.",
          "IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, OR FOR LOST PROFITS OR LOST DATA, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.",
        ],
      },
      {
        id: "c-004-s10",
        number: "10",
        heading: "Insurance",
        paragraphs: [
          "Torvane shall maintain, at its own expense, professional liability (errors and omissions) insurance with limits of not less than $2,000,000 per claim and in the aggregate, together with commercially reasonable general liability and workers' compensation coverage. Torvane shall deliver to Customer a certificate of insurance evidencing such coverage no later than March 1 of each calendar year during the term.",
        ],
      },
      {
        id: "c-004-s11",
        number: "11",
        heading: "Termination",
        paragraphs: [
          "Customer may terminate this Agreement or any Statement of Work, in whole or in part, for convenience upon thirty (30) days' prior written notice to Torvane. Upon such termination, Customer shall pay for Services performed and non-cancellable expenses reasonably incurred through the effective date of termination, and Torvane shall deliver all work in progress for which Customer has paid.",
          "Either party may terminate this Agreement for material breach upon thirty (30) days' written notice if such breach remains uncured at the end of the notice period.",
        ],
      },
      {
        id: "c-004-s12",
        number: "12",
        heading: "General; Governing Law",
        paragraphs: [
          "This Agreement is governed by and construed in accordance with the laws of the State of New York, without regard to its conflicts of law principles. The parties consent to the exclusive jurisdiction of the state and federal courts located in New York County, New York.",
          "12.3 Notices. Notices must be in writing and delivered to the addresses in Section 1, with a copy to legal@vantoralabs.com and contracts@torvane.com respectively, and are effective upon receipt.",
        ],
      },
    ],
  },
};
