import type { Contract } from "@/data/types";

// c-013 — Mutual NDA with Quillon Therapeutics (prospective partner).
// Expires August 31, 2026 — 43 days from the workspace clock — which feeds a
// low-priority expiration alert (derived, not seeded). Confidentiality
// survives five years from disclosure.

export const quillonNda: Contract = {
  id: "c-013",
  title: "Mutual Non-Disclosure Agreement",
  counterparty: "Quillon Therapeutics, Inc.",
  counterpartyCategory: "Prospective partner",
  type: "NDA",
  status: "active",
  valueUsd: 0,
  effectiveDate: "2024-09-01",
  expirationDate: "2026-08-31",
  autoRenew: false,
  ingestedAt: "2026-06-04",
  fields: [
    {
      id: "c-013:contract_type",
      contractId: "c-013",
      key: "contract_type",
      label: "Contract type",
      group: "Overview",
      value: { kind: "text", value: "Mutual NDA" },
      confidence: 0.98,
      source: {
        sectionId: "c-013-s1",
        excerpt: "This Mutual Non-Disclosure Agreement (the “Agreement”)",
      },
    },
    {
      id: "c-013:counterparty",
      contractId: "c-013",
      key: "counterparty",
      label: "Counterparty",
      group: "Overview",
      value: { kind: "text", value: "Quillon Therapeutics, Inc." },
      confidence: 0.98,
      source: {
        sectionId: "c-013-s1",
        excerpt:
          "Quillon Therapeutics, Inc., a Delaware corporation with offices at 6200 Lookout Road, Building 2, Boulder, CO 80301 (“Quillon”)",
      },
    },
    {
      id: "c-013:effective_date",
      contractId: "c-013",
      key: "effective_date",
      label: "Effective date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2024-09-01" },
      confidence: 0.97,
      source: {
        sectionId: "c-013-s1",
        excerpt: "entered into as of September 1, 2024 (the “Effective Date”)",
      },
    },
    {
      id: "c-013:expiration_date",
      contractId: "c-013",
      key: "expiration_date",
      label: "Expiration date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2026-08-31" },
      confidence: 0.96,
      source: {
        sectionId: "c-013-s5",
        excerpt:
          "continue for a period of two (2) years, expiring on August 31, 2026",
      },
    },
    {
      id: "c-013:auto_renew",
      contractId: "c-013",
      key: "auto_renew",
      label: "Auto-renewal",
      group: "Term & renewal",
      value: { kind: "boolean", value: false },
      confidence: 0.95,
      source: {
        sectionId: "c-013-s5",
        excerpt: "This Agreement does not renew automatically",
      },
    },
    {
      id: "c-013:term_length",
      contractId: "c-013",
      key: "term_length",
      label: "Term length",
      group: "Term & renewal",
      value: { kind: "duration", days: 730, raw: "two (2) years" },
      confidence: 0.95,
      source: {
        sectionId: "c-013-s5",
        excerpt: "continue for a period of two (2) years",
      },
    },
    {
      id: "c-013:confidentiality",
      contractId: "c-013",
      key: "confidentiality",
      label: "Confidentiality survival",
      group: "Legal terms",
      value: { kind: "text", value: "Survives 5 years from disclosure" },
      confidence: 0.94,
      source: {
        sectionId: "c-013-s5",
        excerpt:
          "shall survive for a period of five (5) years from the date of disclosure",
      },
    },
    {
      id: "c-013:liability_cap",
      contractId: "c-013",
      key: "liability_cap",
      label: "Liability cap",
      group: "Legal terms",
      value: { kind: "text", value: "Uncapped" },
      confidence: 0.9,
      source: null,
      note: "The agreement contains no limitation of liability — typical for NDAs, where uncapped exposure for confidentiality breaches is the market norm. Not a risk indicator.",
    },
    {
      id: "c-013:governing_law",
      contractId: "c-013",
      key: "governing_law",
      label: "Governing law",
      group: "Legal terms",
      value: { kind: "text", value: "Colorado" },
      confidence: 0.97,
      source: {
        sectionId: "c-013-s7",
        excerpt:
          "governed by and construed in accordance with the laws of the State of Colorado",
      },
    },
  ],
  obligations: [
    {
      id: "c-013:ob-return",
      contractId: "c-013",
      title: "Return or destroy Confidential Information at expiration",
      owedBy: "us",
      dueDate: "2026-08-31",
      description:
        "When the Agreement expires on August 31, 2026 (or on Quillon's earlier written request), all of Quillon's Confidential Information — including copies, extracts, and summaries — must be promptly returned or destroyed. If partnership discussions are still ongoing, an extension should be agreed in writing before expiration.",
      source: {
        sectionId: "c-013-s6",
        excerpt:
          "Upon the expiration or earlier termination of this Agreement, or upon the written request of the disclosing party, the receiving party shall promptly return or destroy all Confidential Information of the disclosing party",
      },
    },
  ],
  risks: [],
  milestones: [],
  document: {
    filename: "Quillon_Mutual_NDA_2024.pdf",
    format: "pdf",
    pages: 5,
    sections: [
      {
        id: "c-013-s1",
        number: "1",
        heading: "Parties; Purpose",
        paragraphs: [
          "This Mutual Non-Disclosure Agreement (the “Agreement”) is entered into as of September 1, 2024 (the “Effective Date”), by and between Vantora Labs, Inc., a Delaware corporation with offices at 4120 Delgany Street, Denver, CO 80216 (“Vantora”), and Quillon Therapeutics, Inc., a Delaware corporation with offices at 6200 Lookout Road, Building 2, Boulder, CO 80301 (“Quillon”).",
          "The parties wish to evaluate a potential research data collaboration (the “Purpose”), and in connection with that evaluation each party may disclose to the other certain non-public business, scientific, and technical information.",
        ],
      },
      {
        id: "c-013-s2",
        number: "2",
        heading: "Confidential Information",
        paragraphs: [
          "“Confidential Information” means all non-public information disclosed by a party (the “disclosing party”) to the other party (the “receiving party”), whether oral, written, or electronic, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure, including research protocols, datasets, product candidates, business plans, and the existence and status of the parties' discussions.",
        ],
      },
      {
        id: "c-013-s3",
        number: "3",
        heading: "Obligations of the Parties",
        paragraphs: [
          "Each party shall (a) hold the other party's Confidential Information in strict confidence, (b) use such Confidential Information solely for the Purpose, and (c) not disclose such Confidential Information to any third party other than its directors, officers, employees, and professional advisors who have a need to know for the Purpose and who are bound by confidentiality obligations at least as protective as those set forth herein.",
        ],
      },
      {
        id: "c-013-s4",
        number: "4",
        heading: "Exclusions; Compelled Disclosure",
        paragraphs: [
          "Confidential Information does not include information that (a) is or becomes publicly available through no breach of this Agreement, (b) was rightfully known to the receiving party prior to disclosure, (c) is rightfully received from a third party without restriction, or (d) is independently developed without use of the disclosing party's Confidential Information. A receiving party may disclose Confidential Information to the extent required by law, provided it gives prompt notice (where legally permitted) and reasonably cooperates in any effort to seek protective treatment.",
        ],
      },
      {
        id: "c-013-s5",
        number: "5",
        heading: "Term; Survival",
        paragraphs: [
          "This Agreement shall commence on the Effective Date and continue for a period of two (2) years, expiring on August 31, 2026. Each party's obligations with respect to Confidential Information disclosed during the term shall survive for a period of five (5) years from the date of disclosure.",
          "This Agreement does not renew automatically; any extension must be agreed in a writing signed by both parties.",
        ],
      },
      {
        id: "c-013-s6",
        number: "6",
        heading: "Return or Destruction",
        paragraphs: [
          "Upon the expiration or earlier termination of this Agreement, or upon the written request of the disclosing party, the receiving party shall promptly return or destroy all Confidential Information of the disclosing party, including all copies, extracts, and summaries, and shall certify such destruction in writing upon request; provided that the receiving party may retain one archival copy solely to the extent required for legal or regulatory compliance, which copy remains subject to this Agreement.",
        ],
      },
      {
        id: "c-013-s7",
        number: "7",
        heading: "General; Governing Law",
        paragraphs: [
          "No license under any patent, copyright, trademark, or trade secret is granted by this Agreement, and nothing herein obligates either party to proceed with any transaction. This Agreement is governed by and construed in accordance with the laws of the State of Colorado, without regard to its conflicts of law principles. Each party acknowledges that unauthorized disclosure may cause irreparable harm for which monetary damages are inadequate, and the disclosing party is entitled to seek injunctive relief in addition to any other remedies available at law or in equity.",
        ],
      },
    ],
  },
};
