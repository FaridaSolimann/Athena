import type { Contract } from "@/data/types";

// c-016 — Aldervik Data Annotation Services Agreement.
// EUR-denominated vendor deal (EUR 220,000 → $237,600 at 1.08) with a
// REVERSED uncapped indemnity in §8: Vantora (the customer!) indemnifies the
// vendor for IP claims arising from customer-supplied data, carved out of the
// liability cap. No auto-renewal — the agreement lapses December 31, 2026, so
// a renewal decision is needed before year end.

export const aldervik: Contract = {
  id: "c-016",
  title: "Data Annotation Services Agreement",
  counterparty: "Aldervik Data GmbH",
  counterpartyCategory: "Data services",
  type: "Vendor",
  status: "active",
  valueUsd: 237_600,
  valueOriginal: { amount: 220_000, currency: "EUR", fxRate: 1.08 },
  effectiveDate: "2026-01-01",
  expirationDate: "2026-12-31",
  autoRenew: false,
  ingestedAt: "2026-06-12",
  fields: [
    {
      id: "c-016:contract_type",
      contractId: "c-016",
      key: "contract_type",
      label: "Contract type",
      group: "Overview",
      value: { kind: "text", value: "Vendor services agreement" },
      confidence: 0.97,
      source: {
        sectionId: "c-016-s1",
        excerpt:
          "This Data Annotation Services Agreement (the “Agreement”)",
      },
    },
    {
      id: "c-016:counterparty",
      contractId: "c-016",
      key: "counterparty",
      label: "Counterparty",
      group: "Overview",
      value: { kind: "text", value: "Aldervik Data GmbH" },
      confidence: 0.97,
      source: {
        sectionId: "c-016-s1",
        excerpt:
          "Aldervik Data GmbH, a limited liability company organized under the laws of Germany with offices at Ritterstraße 24, 10969 Berlin, Germany (“Aldervik”)",
      },
    },
    {
      id: "c-016:effective_date",
      contractId: "c-016",
      key: "effective_date",
      label: "Effective date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2026-01-01" },
      confidence: 0.97,
      source: {
        sectionId: "c-016-s2",
        excerpt: "commence on January 1, 2026 (the “Effective Date”)",
      },
    },
    {
      id: "c-016:expiration_date",
      contractId: "c-016",
      key: "expiration_date",
      label: "Expiration date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2026-12-31" },
      confidence: 0.96,
      source: {
        sectionId: "c-016-s2",
        excerpt:
          "continue through December 31, 2026 (the “Term”), whereupon it shall expire",
      },
      note: "Hard stop at year end — no auto-renewal, so an extension or replacement must be decided before December 31, 2026.",
    },
    {
      id: "c-016:auto_renew",
      contractId: "c-016",
      key: "auto_renew",
      label: "Auto-renewal",
      group: "Term & renewal",
      value: { kind: "boolean", value: false },
      confidence: 0.96,
      source: {
        sectionId: "c-016-s2",
        excerpt:
          "This Agreement does not renew automatically; any extension requires a written amendment executed by both parties prior to expiration",
      },
    },
    {
      id: "c-016:total_value",
      contractId: "c-016",
      key: "total_value",
      label: "Total contract value",
      group: "Financial",
      value: {
        kind: "money",
        usd: 237_600,
        original: { amount: 220_000, currency: "EUR", fxRate: 1.08 },
      },
      confidence: 0.89,
      source: {
        sectionId: "c-016-s4",
        excerpt:
          "total fees of EUR 220,000 for the Term, invoiced in four equal quarterly installments of EUR 55,000",
      },
      note: "EUR 220,000 → $237,600 at 1.08 USD/EUR.",
    },
    {
      id: "c-016:payment_schedule",
      contractId: "c-016",
      key: "payment_schedule",
      label: "Payment schedule",
      group: "Financial",
      value: {
        kind: "text",
        value: "Quarterly, EUR 55,000 due Mar/Jun/Sep/Dec 15, net 30",
      },
      confidence: 0.95,
      source: {
        sectionId: "c-016-s4",
        excerpt:
          "quarterly installments of EUR 55,000 due on March 15, June 15, September 15, and December 15, 2026",
      },
      note: "Next installment due September 15, 2026.",
    },
    {
      id: "c-016:liability_cap",
      contractId: "c-016",
      key: "liability_cap",
      label: "Liability cap",
      group: "Legal terms",
      value: {
        kind: "money",
        usd: 237_600,
        original: { amount: 220_000, currency: "EUR", fxRate: 1.08 },
      },
      confidence: 0.85,
      source: {
        sectionId: "c-016-s9",
        excerpt:
          "shall not exceed the total fees paid by Customer under this Agreement",
      },
      note: "Cap equals fees paid: EUR 220,000 → $237,600 at 1.08 USD/EUR. Customer's Section 8 indemnity is expressly carved out of this cap.",
    },
    {
      id: "c-016:governing_law",
      contractId: "c-016",
      key: "governing_law",
      label: "Governing law",
      group: "Legal terms",
      value: { kind: "text", value: "Germany" },
      confidence: 0.96,
      source: {
        sectionId: "c-016-s12",
        excerpt:
          "governed by the laws of the Federal Republic of Germany",
      },
      note: "Exclusive jurisdiction of the courts of Berlin, Germany.",
    },
    {
      id: "c-016:indemnification",
      contractId: "c-016",
      key: "indemnification",
      label: "Indemnification",
      group: "Legal terms",
      value: {
        kind: "text",
        value:
          "Reversed: Vantora indemnifies Aldervik for customer-supplied data IP claims — uncapped",
      },
      confidence: 0.78,
      source: {
        sectionId: "c-016-s8",
        excerpt:
          "Customer shall defend, indemnify, and hold harmless Aldervik, its affiliates, and their respective officers, directors, and employees",
      },
      note: "Unusual direction: the indemnity runs from the customer to the vendor, covers customer-supplied data and instructions, and is expressly excluded from the Section 9 liability cap. There is no reciprocal indemnity from Aldervik.",
    },
    {
      id: "c-016:confidentiality",
      contractId: "c-016",
      key: "confidentiality",
      label: "Confidentiality",
      group: "Legal terms",
      value: {
        kind: "text",
        value: "Mutual; survives 5 years after termination",
      },
      confidence: 0.94,
      source: {
        sectionId: "c-016-s6",
        excerpt:
          "obligations under this Section 6 shall survive for five (5) years following expiration or termination of this Agreement",
      },
    },
    {
      id: "c-016:ip_ownership",
      contractId: "c-016",
      key: "ip_ownership",
      label: "IP ownership",
      group: "Legal terms",
      value: {
        kind: "text",
        value: "Annotations and deliverables assigned to Vantora on payment",
      },
      confidence: 0.93,
      source: {
        sectionId: "c-016-s7",
        excerpt:
          "Aldervik hereby assigns to Customer all right, title, and interest in and to the Annotations and other deliverables, effective upon payment of the fees attributable thereto",
      },
    },
    {
      id: "c-016:termination",
      contractId: "c-016",
      key: "termination",
      label: "Termination",
      group: "Legal terms",
      value: {
        kind: "text",
        value: "Material breach, 30-day cure; Vantora convenience on 60 days' notice",
      },
      confidence: 0.93,
      source: {
        sectionId: "c-016-s11",
        excerpt:
          "Customer may terminate this Agreement for convenience upon sixty (60) days' written notice",
      },
    },
  ],
  obligations: [
    {
      id: "c-016:ob-quality",
      contractId: "c-016",
      title: "Aldervik: annotation accuracy ≥98% with monthly QA report",
      owedBy: "them",
      recurrence: "monthly",
      description:
        "Aldervik must maintain at least 98% annotation accuracy against Vantora's gold-standard sample set, evidenced by a monthly QA report delivered within 10 days of each month end.",
      source: {
        sectionId: "c-016-s3",
        excerpt:
          "maintain an annotation accuracy rate of at least ninety-eight percent (98%), measured against Customer's gold-standard sample set",
      },
    },
    {
      id: "c-016:ob-quarterly-payment",
      contractId: "c-016",
      title: "Quarterly service payment (EUR 55,000)",
      owedBy: "us",
      recurrence: "quarterly",
      dueDate: "2026-09-15",
      description:
        "Quarterly installments of EUR 55,000 (~$59,400) due March 15, June 15, September 15, and December 15, 2026, net 30. Next installment due September 15, 2026.",
      source: {
        sectionId: "c-016-s4",
        excerpt:
          "quarterly installments of EUR 55,000 due on March 15, June 15, September 15, and December 15, 2026",
      },
    },
  ],
  risks: [
    {
      id: "c-016:risk-indemnity",
      contractId: "c-016",
      kind: "unusual_indemnity",
      severity: "high",
      summary:
        "Indemnity runs FROM Vantora TO the vendor, uncapped, for customer-supplied data — carved out of the liability cap with no reciprocal indemnity from Aldervik.",
      fieldId: "c-016:indemnification",
    },
  ],
  milestones: [],
  document: {
    filename: "Aldervik_Data_Annotation_Services_2026.pdf",
    format: "pdf",
    pages: 13,
    sections: [
      {
        id: "c-016-s1",
        number: "1",
        heading: "Parties; Definitions",
        paragraphs: [
          "This Data Annotation Services Agreement (the “Agreement”) is entered into by and between Vantora Labs, Inc., a Delaware corporation with offices at 4120 Delgany Street, Denver, CO 80216 (“Customer”), and Aldervik Data GmbH, a limited liability company organized under the laws of Germany with offices at Ritterstraße 24, 10969 Berlin, Germany (“Aldervik”).",
          "“Services” means the data labeling and annotation services described in Statement of Work AD-2026-01, including image segmentation, entity tagging, and quality assurance review. “Annotations” means the labeled datasets and associated metadata produced by Aldervik in performing the Services.",
        ],
      },
      {
        id: "c-016-s2",
        number: "2",
        heading: "Term",
        paragraphs: [
          "The term of this Agreement shall commence on January 1, 2026 (the “Effective Date”) and shall continue through December 31, 2026 (the “Term”), whereupon it shall expire. This Agreement does not renew automatically; any extension requires a written amendment executed by both parties prior to expiration.",
        ],
      },
      {
        id: "c-016-s3",
        number: "3",
        heading: "Services; Quality Standards",
        paragraphs: [
          "Aldervik shall perform the Services in a professional and workmanlike manner using appropriately trained annotation personnel, in accordance with the specifications and labeling guidelines set forth in Statement of Work AD-2026-01.",
          "Aldervik shall maintain an annotation accuracy rate of at least ninety-eight percent (98%), measured against Customer's gold-standard sample set and reported in a monthly quality assurance report delivered to Customer within ten (10) days after the end of each calendar month. If accuracy falls below ninety-eight percent (98%) in any month, Aldervik shall re-perform the affected annotation batches at its own expense and shall deliver a remediation plan within five (5) business days.",
        ],
      },
      {
        id: "c-016-s4",
        number: "4",
        heading: "Fees; Payment",
        paragraphs: [
          "Customer shall pay Aldervik total fees of EUR 220,000 for the Term, invoiced in four equal quarterly installments of EUR 55,000 due on March 15, June 15, September 15, and December 15, 2026. Invoices are payable net thirty (30) days from the date of invoice, and all amounts are stated and payable in euros, exclusive of value added tax.",
          "Amounts not received when due shall accrue interest at the statutory rate for commercial transactions under Section 288 of the German Civil Code (BGB).",
        ],
      },
      {
        id: "c-016-s5",
        number: "5",
        heading: "Customer Data; Materials",
        paragraphs: [
          "Customer shall supply the source datasets, labeling guidelines, and gold-standard samples reasonably required for Aldervik to perform the Services. Customer represents that it has all rights necessary to provide such data and materials to Aldervik for processing under this Agreement.",
        ],
      },
      {
        id: "c-016-s6",
        number: "6",
        heading: "Confidentiality",
        paragraphs: [
          "Each party shall protect the other party's Confidential Information with at least the degree of care it uses for its own confidential information of like kind, and in no event less than reasonable care. Confidential Information may be used solely to perform under, or exercise rights granted by, this Agreement, and the obligations under this Section 6 shall survive for five (5) years following expiration or termination of this Agreement.",
        ],
      },
      {
        id: "c-016-s7",
        number: "7",
        heading: "Intellectual Property",
        paragraphs: [
          "As between the parties, Customer retains all right, title, and interest in and to Customer-supplied data and materials. Aldervik hereby assigns to Customer all right, title, and interest in and to the Annotations and other deliverables, effective upon payment of the fees attributable thereto. Aldervik retains ownership of its pre-existing tools, know-how, and annotation platform.",
        ],
      },
      {
        id: "c-016-s8",
        number: "8",
        heading: "Indemnification",
        paragraphs: [
          "Customer shall defend, indemnify, and hold harmless Aldervik, its affiliates, and their respective officers, directors, and employees from and against any and all third-party claims, demands, damages, losses, liabilities, and expenses (including reasonable attorneys' fees) arising out of or relating to any allegation that Customer-supplied data, materials, or labeling instructions infringe or misappropriate the intellectual property rights of any third party or violate applicable law. Aldervik shall give Customer prompt written notice of any such claim and reasonable cooperation in its defense, at Customer's expense.",
          "Customer's obligations under this Section 8 are not subject to, and shall not be limited by, the limitations of liability set forth in Section 9, and shall survive expiration or termination of this Agreement.",
        ],
      },
      {
        id: "c-016-s9",
        number: "9",
        heading: "Limitation of Liability",
        paragraphs: [
          "EXCEPT FOR CUSTOMER'S OBLIGATIONS UNDER SECTION 8 AND BREACHES OF SECTION 6, EACH PARTY'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT shall not exceed the total fees paid by Customer under this Agreement. IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES.",
        ],
      },
      {
        id: "c-016-s10",
        number: "10",
        heading: "Data Protection",
        paragraphs: [
          "Each party shall comply with applicable data protection laws, including the EU General Data Protection Regulation, in connection with this Agreement. The parties shall execute the data processing addendum attached as Exhibit C to the extent Aldervik processes personal data on Customer's behalf.",
        ],
      },
      {
        id: "c-016-s11",
        number: "11",
        heading: "Termination",
        paragraphs: [
          "Either party may terminate this Agreement for material breach upon thirty (30) days' written notice if such breach remains uncured at the end of the notice period. Customer may terminate this Agreement for convenience upon sixty (60) days' written notice, in which case Customer shall pay for Services performed through the effective date of termination.",
        ],
      },
      {
        id: "c-016-s12",
        number: "12",
        heading: "General; Governing Law",
        paragraphs: [
          "This Agreement is governed by the laws of the Federal Republic of Germany, excluding its conflict of laws rules and the United Nations Convention on Contracts for the International Sale of Goods. The parties submit to the exclusive jurisdiction of the courts of Berlin, Germany.",
          "12.2 Notices. Notices must be in writing and delivered to the addresses in Section 1, with a copy to legal@vantoralabs.com and vertrag@aldervik.de respectively, and are effective upon receipt.",
        ],
      },
    ],
  },
};
