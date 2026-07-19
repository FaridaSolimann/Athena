import type { Contract } from "@/data/types";

// c-017 — Calder & Finch brand & content retainer. Expired May 31, 2026
// (~7 weeks before the workspace clock); no renewal. Clean, high-confidence
// extraction; one trailing wind-down obligation (asset archive handover).

export const calderFinch: Contract = {
  id: "c-017",
  title: "Brand & Content Retainer",
  counterparty: "Calder & Finch Creative LLC",
  counterpartyCategory: "Marketing agency",
  type: "Vendor",
  status: "expired",
  valueUsd: 187_000,
  effectiveDate: "2025-06-01",
  expirationDate: "2026-05-31",
  autoRenew: false,
  ingestedAt: "2026-06-04",
  fields: [
    {
      id: "c-017:contract_type",
      contractId: "c-017",
      key: "contract_type",
      label: "Contract type",
      group: "Overview",
      value: { kind: "text", value: "Marketing services retainer" },
      confidence: 0.97,
      source: {
        sectionId: "c-017-s1",
        excerpt: "This Brand & Content Retainer Agreement (the “Agreement”)",
      },
    },
    {
      id: "c-017:counterparty",
      contractId: "c-017",
      key: "counterparty",
      label: "Counterparty",
      group: "Overview",
      value: { kind: "text", value: "Calder & Finch Creative LLC" },
      confidence: 0.97,
      source: {
        sectionId: "c-017-s1",
        excerpt:
          "Calder & Finch Creative LLC, a Colorado limited liability company with offices at 2560 Walnut Street, Boulder, CO 80302 (“Agency”)",
      },
    },
    {
      id: "c-017:effective_date",
      contractId: "c-017",
      key: "effective_date",
      label: "Effective date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2025-06-01" },
      confidence: 0.96,
      source: {
        sectionId: "c-017-s2",
        excerpt: "commence on June 1, 2025 (the “Effective Date”)",
      },
    },
    {
      id: "c-017:expiration_date",
      contractId: "c-017",
      key: "expiration_date",
      label: "Expiration date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2026-05-31" },
      confidence: 0.96,
      source: {
        sectionId: "c-017-s2",
        excerpt:
          "continue for a term of twelve (12) months through May 31, 2026, on which date it shall expire",
      },
    },
    {
      id: "c-017:auto_renew",
      contractId: "c-017",
      key: "auto_renew",
      label: "Auto-renewal",
      group: "Term & renewal",
      value: { kind: "boolean", value: false },
      confidence: 0.95,
      source: {
        sectionId: "c-017-s2",
        excerpt: "This Agreement shall not renew automatically",
      },
    },
    {
      id: "c-017:total_value",
      contractId: "c-017",
      key: "total_value",
      label: "Total contract value",
      group: "Financial",
      value: { kind: "money", usd: 187_000 },
      confidence: 0.95,
      source: {
        sectionId: "c-017-s4",
        excerpt:
          "a total retainer of $187,000 for the twelve-month term",
      },
    },
    {
      id: "c-017:payment_schedule",
      contractId: "c-017",
      key: "payment_schedule",
      label: "Payment schedule",
      group: "Financial",
      value: { kind: "text", value: "Monthly retainer $15,583, net 30" },
      confidence: 0.95,
      source: {
        sectionId: "c-017-s4",
        excerpt:
          "monthly installments of $15,583, invoiced on the first business day of each month and payable net thirty (30) days",
      },
    },
    {
      id: "c-017:liability_cap",
      contractId: "c-017",
      key: "liability_cap",
      label: "Liability cap",
      group: "Legal terms",
      value: { kind: "money", usd: 187_000 },
      confidence: 0.93,
      source: {
        sectionId: "c-017-s7",
        excerpt:
          "shall not exceed the total fees actually paid by Client to Agency under this Agreement",
      },
      note: "Fees paid over the full term = $187,000.",
    },
    {
      id: "c-017:ip_ownership",
      contractId: "c-017",
      key: "ip_ownership",
      label: "IP ownership",
      group: "Legal terms",
      value: { kind: "text", value: "Work product assigned to Vantora on payment" },
      confidence: 0.94,
      source: {
        sectionId: "c-017-s5",
        excerpt:
          "all Deliverables shall be deemed works made for hire and are hereby assigned to Client upon payment in full",
      },
    },
    {
      id: "c-017:governing_law",
      contractId: "c-017",
      key: "governing_law",
      label: "Governing law",
      group: "Legal terms",
      value: { kind: "text", value: "Colorado" },
      confidence: 0.97,
      source: {
        sectionId: "c-017-s9",
        excerpt:
          "governed by and construed in accordance with the laws of the State of Colorado",
      },
    },
  ],
  obligations: [
    {
      id: "c-017:ob-asset-archive",
      contractId: "c-017",
      title: "Calder & Finch: deliver final asset archive and brand guidelines",
      owedBy: "them",
      dueDate: "2026-06-30",
      description:
        "Within 30 days of the May 31, 2026 expiration, Agency delivers the complete asset archive (source files, fonts, licenses) and the final brand guidelines document.",
      source: {
        sectionId: "c-017-s8",
        excerpt:
          "deliver to Client a complete archive of all final Deliverables, source files, and the then-current brand guidelines within thirty (30) days of expiration",
      },
    },
  ],
  risks: [],
  milestones: [],
  document: {
    filename: "CalderFinch_Brand_Content_Retainer_2025.pdf",
    format: "pdf",
    pages: 8,
    sections: [
      {
        id: "c-017-s1",
        number: "1",
        heading: "Parties; Engagement",
        paragraphs: [
          "This Brand & Content Retainer Agreement (the “Agreement”) is entered into by and between Vantora Labs, Inc., a Delaware corporation with offices at 4120 Delgany Street, Denver, CO 80216 (“Client”), and Calder & Finch Creative LLC, a Colorado limited liability company with offices at 2560 Walnut Street, Boulder, CO 80302 (“Agency”).",
          "Client engages Agency, on a retained basis, to provide brand strategy, content production, and design services as described in Section 3 and the monthly scope memoranda agreed by the parties from time to time.",
        ],
      },
      {
        id: "c-017-s2",
        number: "2",
        heading: "Term",
        paragraphs: [
          "The term of this Agreement shall commence on June 1, 2025 (the “Effective Date”) and shall continue for a term of twelve (12) months through May 31, 2026, on which date it shall expire unless earlier terminated under Section 6.",
          "This Agreement shall not renew automatically. Any renewal requires a written agreement signed by both parties.",
        ],
      },
      {
        id: "c-017-s3",
        number: "3",
        heading: "Services; Deliverables",
        paragraphs: [
          "Agency shall provide up to one hundred twenty (120) hours per month of brand strategy, copywriting, design, and content production services (“Services”), delivering the assets identified in each monthly scope memorandum (“Deliverables”). Unused hours do not roll over. Requests exceeding the monthly allocation require a written change order at Agency's then-standard rates.",
        ],
      },
      {
        id: "c-017-s4",
        number: "4",
        heading: "Fees; Payment",
        paragraphs: [
          "Client shall pay Agency a total retainer of $187,000 for the twelve-month term, payable in monthly installments of $15,583, invoiced on the first business day of each month and payable net thirty (30) days from receipt of invoice. Pre-approved out-of-pocket expenses are billed at cost, without markup.",
        ],
      },
      {
        id: "c-017-s5",
        number: "5",
        heading: "Ownership of Work Product",
        paragraphs: [
          "Upon Client's payment of the fees corresponding to a Deliverable, all Deliverables shall be deemed works made for hire and are hereby assigned to Client upon payment in full, excluding Agency's pre-existing tools, templates, and methodologies, for which Agency grants Client a perpetual, royalty-free license as embedded in the Deliverables.",
        ],
      },
      {
        id: "c-017-s6",
        number: "6",
        heading: "Termination",
        paragraphs: [
          "Either party may terminate this Agreement for material breach upon fifteen (15) days' written notice if such breach remains uncured at the end of the notice period. Client may terminate for convenience upon sixty (60) days' written notice, in which case Client remains responsible for retainer installments through the effective date of termination.",
        ],
      },
      {
        id: "c-017-s7",
        number: "7",
        heading: "Limitation of Liability",
        paragraphs: [
          "EXCEPT FOR BREACHES OF CONFIDENTIALITY OR AGENCY'S INDEMNIFICATION OBLIGATIONS, EACH PARTY'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT shall not exceed the total fees actually paid by Client to Agency under this Agreement. NEITHER PARTY SHALL BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES.",
        ],
      },
      {
        id: "c-017-s8",
        number: "8",
        heading: "Expiration; Wind-Down",
        paragraphs: [
          "Upon expiration or termination of this Agreement, Agency shall deliver to Client a complete archive of all final Deliverables, source files, and the then-current brand guidelines within thirty (30) days of expiration or termination, in industry-standard formats, together with a schedule of any third-party licenses embedded in the Deliverables.",
        ],
      },
      {
        id: "c-017-s9",
        number: "9",
        heading: "General; Governing Law",
        paragraphs: [
          "This Agreement is governed by and construed in accordance with the laws of the State of Colorado, without regard to its conflicts of law principles. The parties consent to the exclusive jurisdiction of the state and federal courts located in Denver, Colorado. This Agreement constitutes the entire agreement of the parties with respect to its subject matter.",
        ],
      },
    ],
  },
};
