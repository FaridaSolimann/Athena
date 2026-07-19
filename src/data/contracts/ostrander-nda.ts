import type { Contract } from "@/data/types";

// c-012 — Mutual NDA with Ostrander Capital Partners (investor diligence).
// Quiet contract: three-year term through March 15, 2027; confidentiality
// survives five years from disclosure; return-or-destroy on written request.

export const ostranderNda: Contract = {
  id: "c-012",
  title: "Mutual Non-Disclosure Agreement",
  counterparty: "Ostrander Capital Partners",
  counterpartyCategory: "Investor",
  type: "NDA",
  status: "active",
  valueUsd: 0,
  effectiveDate: "2024-03-15",
  expirationDate: "2027-03-15",
  autoRenew: false,
  ingestedAt: "2026-06-04",
  fields: [
    {
      id: "c-012:contract_type",
      contractId: "c-012",
      key: "contract_type",
      label: "Contract type",
      group: "Overview",
      value: { kind: "text", value: "Mutual NDA" },
      confidence: 0.98,
      source: {
        sectionId: "c-012-s1",
        excerpt: "This Mutual Non-Disclosure Agreement (the “Agreement”)",
      },
    },
    {
      id: "c-012:counterparty",
      contractId: "c-012",
      key: "counterparty",
      label: "Counterparty",
      group: "Overview",
      value: { kind: "text", value: "Ostrander Capital Partners" },
      confidence: 0.98,
      source: {
        sectionId: "c-012-s1",
        excerpt:
          "Ostrander Capital Partners, L.P., a Delaware limited partnership with offices at 200 Bellevue Parkway, Suite 410, Wilmington, DE 19809 (“Ostrander”)",
      },
    },
    {
      id: "c-012:effective_date",
      contractId: "c-012",
      key: "effective_date",
      label: "Effective date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2024-03-15" },
      confidence: 0.97,
      source: {
        sectionId: "c-012-s1",
        excerpt: "entered into as of March 15, 2024 (the “Effective Date”)",
      },
    },
    {
      id: "c-012:expiration_date",
      contractId: "c-012",
      key: "expiration_date",
      label: "Expiration date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2027-03-15" },
      confidence: 0.96,
      source: {
        sectionId: "c-012-s5",
        excerpt:
          "continue for a period of three (3) years, expiring on March 15, 2027",
      },
    },
    {
      id: "c-012:auto_renew",
      contractId: "c-012",
      key: "auto_renew",
      label: "Auto-renewal",
      group: "Term & renewal",
      value: { kind: "boolean", value: false },
      confidence: 0.95,
      source: {
        sectionId: "c-012-s5",
        excerpt: "This Agreement does not renew automatically",
      },
    },
    {
      id: "c-012:term_length",
      contractId: "c-012",
      key: "term_length",
      label: "Term length",
      group: "Term & renewal",
      value: { kind: "duration", days: 1095, raw: "three (3) years" },
      confidence: 0.95,
      source: {
        sectionId: "c-012-s5",
        excerpt: "continue for a period of three (3) years",
      },
    },
    {
      id: "c-012:confidentiality",
      contractId: "c-012",
      key: "confidentiality",
      label: "Confidentiality survival",
      group: "Legal terms",
      value: { kind: "text", value: "Survives 5 years from disclosure" },
      confidence: 0.94,
      source: {
        sectionId: "c-012-s5",
        excerpt:
          "shall survive for a period of five (5) years from the date of disclosure",
      },
    },
    {
      id: "c-012:liability_cap",
      contractId: "c-012",
      key: "liability_cap",
      label: "Liability cap",
      group: "Legal terms",
      value: { kind: "text", value: "Uncapped" },
      confidence: 0.9,
      source: null,
      note: "The agreement contains no limitation of liability — typical for NDAs, where uncapped exposure for confidentiality breaches is the market norm. Not a risk indicator.",
    },
    {
      id: "c-012:governing_law",
      contractId: "c-012",
      key: "governing_law",
      label: "Governing law",
      group: "Legal terms",
      value: { kind: "text", value: "Delaware" },
      confidence: 0.97,
      source: {
        sectionId: "c-012-s8",
        excerpt:
          "governed by and construed in accordance with the laws of the State of Delaware",
      },
    },
  ],
  obligations: [
    {
      id: "c-012:ob-return",
      contractId: "c-012",
      title: "Return or destroy Confidential Information on written request",
      owedBy: "us",
      description:
        "On Ostrander's written request, all of its Confidential Information (including copies, extracts, and summaries) must be promptly returned or destroyed, with written certification of destruction on request. The same obligation runs in Vantora's favor.",
      source: {
        sectionId: "c-012-s6",
        excerpt:
          "the receiving party shall promptly return or destroy all Confidential Information of the disclosing party, including all copies, extracts, and summaries",
      },
    },
  ],
  risks: [],
  milestones: [],
  document: {
    filename: "Ostrander_Mutual_NDA_2024.pdf",
    format: "pdf",
    pages: 5,
    sections: [
      {
        id: "c-012-s1",
        number: "1",
        heading: "Parties; Purpose",
        paragraphs: [
          "This Mutual Non-Disclosure Agreement (the “Agreement”) is entered into as of March 15, 2024 (the “Effective Date”), by and between Vantora Labs, Inc., a Delaware corporation with offices at 4120 Delgany Street, Denver, CO 80216 (“Vantora”), and Ostrander Capital Partners, L.P., a Delaware limited partnership with offices at 200 Bellevue Parkway, Suite 410, Wilmington, DE 19809 (“Ostrander”).",
          "The parties wish to evaluate a potential investment relationship (the “Purpose”), and in connection with that evaluation each party may disclose to the other certain non-public business, financial, and technical information.",
        ],
      },
      {
        id: "c-012-s2",
        number: "2",
        heading: "Confidential Information",
        paragraphs: [
          "“Confidential Information” means all non-public information disclosed by a party (the “disclosing party”) to the other party (the “receiving party”), whether oral, written, or electronic, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure, including business plans, financial statements, projections, technology, and the existence and status of the parties' discussions.",
        ],
      },
      {
        id: "c-012-s3",
        number: "3",
        heading: "Obligations of the Parties",
        paragraphs: [
          "Each party shall (a) hold the other party's Confidential Information in strict confidence, (b) use such Confidential Information solely for the Purpose, and (c) not disclose such Confidential Information to any third party other than its directors, officers, employees, and professional advisors who have a need to know for the Purpose and who are bound by confidentiality obligations at least as protective as those set forth herein.",
        ],
      },
      {
        id: "c-012-s4",
        number: "4",
        heading: "Exclusions; Compelled Disclosure",
        paragraphs: [
          "Confidential Information does not include information that (a) is or becomes publicly available through no breach of this Agreement, (b) was rightfully known to the receiving party prior to disclosure, (c) is rightfully received from a third party without restriction, or (d) is independently developed without use of the disclosing party's Confidential Information. A receiving party may disclose Confidential Information to the extent required by law, provided it gives prompt notice (where legally permitted) and reasonably cooperates in any effort to seek protective treatment.",
        ],
      },
      {
        id: "c-012-s5",
        number: "5",
        heading: "Term; Survival",
        paragraphs: [
          "This Agreement shall commence on the Effective Date and continue for a period of three (3) years, expiring on March 15, 2027. Each party's obligations with respect to Confidential Information disclosed during the term shall survive for a period of five (5) years from the date of disclosure.",
          "This Agreement does not renew automatically; any extension must be agreed in a writing signed by both parties.",
        ],
      },
      {
        id: "c-012-s6",
        number: "6",
        heading: "Return or Destruction",
        paragraphs: [
          "Upon the written request of the disclosing party, the receiving party shall promptly return or destroy all Confidential Information of the disclosing party, including all copies, extracts, and summaries, and shall certify such destruction in writing upon request; provided that the receiving party may retain one archival copy solely to the extent required for legal or regulatory compliance, which copy remains subject to this Agreement.",
        ],
      },
      {
        id: "c-012-s7",
        number: "7",
        heading: "No License; No Obligation",
        paragraphs: [
          "No license under any patent, copyright, trademark, or trade secret is granted by this Agreement. Nothing herein obligates either party to proceed with any transaction, and each party reserves the right to terminate discussions at any time. All Confidential Information is provided “AS IS” without warranty of any kind.",
        ],
      },
      {
        id: "c-012-s8",
        number: "8",
        heading: "General; Governing Law",
        paragraphs: [
          "This Agreement is governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflicts of law principles. Each party acknowledges that unauthorized disclosure may cause irreparable harm for which monetary damages are inadequate, and the disclosing party is entitled to seek injunctive relief in addition to any other remedies available at law or in equity.",
        ],
      },
    ],
  },
};
