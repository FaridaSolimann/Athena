import type { Contract } from "@/data/types";

// c-018 — Brightloom catering & events. Deliberately unremarkable spare
// contract (used only if a second file is uploaded in a session; NOT part of
// portfolio math). Clean digital doc, high confidences, no risks.

export const brightloom: Contract = {
  id: "c-018",
  title: "Catering & Events Services Agreement",
  counterparty: "Brightloom Catering Co.",
  counterpartyCategory: "Office services",
  type: "Vendor",
  status: "active",
  valueUsd: 36_000,
  effectiveDate: "2026-03-01",
  expirationDate: "2027-02-28",
  autoRenew: false,
  ingestedAt: "2026-07-19",
  fields: [
    {
      id: "c-018:contract_type",
      contractId: "c-018",
      key: "contract_type",
      label: "Contract type",
      group: "Overview",
      value: { kind: "text", value: "Vendor services agreement" },
      confidence: 0.96,
      source: {
        sectionId: "c-018-s1",
        excerpt:
          "This Catering & Events Services Agreement (the “Agreement”)",
      },
    },
    {
      id: "c-018:counterparty",
      contractId: "c-018",
      key: "counterparty",
      label: "Counterparty",
      group: "Overview",
      value: { kind: "text", value: "Brightloom Catering Co." },
      confidence: 0.97,
      source: {
        sectionId: "c-018-s1",
        excerpt:
          "Brightloom Catering Co., a Colorado corporation with offices at 3315 East 40th Avenue, Denver, CO 80205 (“Brightloom”)",
      },
    },
    {
      id: "c-018:effective_date",
      contractId: "c-018",
      key: "effective_date",
      label: "Effective date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2026-03-01" },
      confidence: 0.96,
      source: {
        sectionId: "c-018-s2",
        excerpt: "commence on March 1, 2026 (the “Effective Date”)",
      },
    },
    {
      id: "c-018:expiration_date",
      contractId: "c-018",
      key: "expiration_date",
      label: "Expiration date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2027-02-28" },
      confidence: 0.96,
      source: {
        sectionId: "c-018-s2",
        excerpt:
          "continue for a term of twelve (12) months through February 28, 2027",
      },
    },
    {
      id: "c-018:auto_renew",
      contractId: "c-018",
      key: "auto_renew",
      label: "Auto-renewal",
      group: "Term & renewal",
      value: { kind: "boolean", value: false },
      confidence: 0.95,
      source: {
        sectionId: "c-018-s2",
        excerpt: "This Agreement shall not renew automatically",
      },
    },
    {
      id: "c-018:total_value",
      contractId: "c-018",
      key: "total_value",
      label: "Total contract value",
      group: "Financial",
      value: { kind: "money", usd: 36_000 },
      confidence: 0.95,
      source: {
        sectionId: "c-018-s4",
        excerpt:
          "a total of $36,000 for the twelve-month term",
      },
    },
    {
      id: "c-018:payment_schedule",
      contractId: "c-018",
      key: "payment_schedule",
      label: "Payment schedule",
      group: "Financial",
      value: { kind: "text", value: "Monthly fee $3,000, net 30" },
      confidence: 0.95,
      source: {
        sectionId: "c-018-s4",
        excerpt:
          "a monthly service fee of $3,000, invoiced on the first business day of each month and payable net thirty (30) days",
      },
    },
    {
      id: "c-018:liability_cap",
      contractId: "c-018",
      key: "liability_cap",
      label: "Liability cap",
      group: "Legal terms",
      value: { kind: "money", usd: 36_000 },
      confidence: 0.93,
      source: {
        sectionId: "c-018-s7",
        excerpt:
          "shall not exceed the total fees actually paid by Client to Brightloom under this Agreement",
      },
      note: "Fees paid over the full term = $36,000.",
    },
    {
      id: "c-018:insurance",
      contractId: "c-018",
      key: "insurance",
      label: "Insurance",
      group: "Legal terms",
      value: { kind: "text", value: "$1M general liability per occurrence" },
      confidence: 0.94,
      source: {
        sectionId: "c-018-s6",
        excerpt:
          "commercial general liability insurance of not less than $1,000,000 per occurrence",
      },
    },
    {
      id: "c-018:governing_law",
      contractId: "c-018",
      key: "governing_law",
      label: "Governing law",
      group: "Legal terms",
      value: { kind: "text", value: "Colorado" },
      confidence: 0.97,
      source: {
        sectionId: "c-018-s8",
        excerpt:
          "governed by and construed in accordance with the laws of the State of Colorado",
      },
    },
  ],
  obligations: [
    {
      id: "c-018:ob-monthly-payment",
      contractId: "c-018",
      title: "Monthly service fee ($3,000)",
      owedBy: "us",
      recurrence: "monthly",
      dueDate: "2026-08-01",
      description:
        "Monthly service fee of $3,000, invoiced the first business day of each month, payable net 30.",
      source: {
        sectionId: "c-018-s4",
        excerpt:
          "invoiced on the first business day of each month and payable net thirty (30) days",
      },
    },
  ],
  risks: [],
  milestones: [],
  document: {
    filename: "Brightloom_Catering_Services_2026.pdf",
    format: "pdf",
    pages: 6,
    sections: [
      {
        id: "c-018-s1",
        number: "1",
        heading: "Parties; Engagement",
        paragraphs: [
          "This Catering & Events Services Agreement (the “Agreement”) is entered into by and between Vantora Labs, Inc., a Delaware corporation with offices at 4120 Delgany Street, Denver, CO 80216 (“Client”), and Brightloom Catering Co., a Colorado corporation with offices at 3315 East 40th Avenue, Denver, CO 80205 (“Brightloom”).",
          "Client engages Brightloom to provide the recurring workplace catering and event services described in Section 3 at Client's Denver office.",
        ],
      },
      {
        id: "c-018-s2",
        number: "2",
        heading: "Term",
        paragraphs: [
          "The term of this Agreement shall commence on March 1, 2026 (the “Effective Date”) and shall continue for a term of twelve (12) months through February 28, 2027, unless earlier terminated under Section 5.",
          "This Agreement shall not renew automatically. Any renewal requires a written agreement signed by both parties.",
        ],
      },
      {
        id: "c-018-s3",
        number: "3",
        heading: "Services",
        paragraphs: [
          "Brightloom shall provide weekly team lunch service for up to sixty (60) attendees each Wednesday, monthly all-hands breakfast service, and catering for up to four (4) office events per contract year, per the standing menu agreed with Client's office manager. Menu changes and headcount adjustments require five (5) business days' notice. Additional events beyond the included allocation are billed separately at Brightloom's standard rates under a written event order.",
        ],
      },
      {
        id: "c-018-s4",
        number: "4",
        heading: "Fees; Payment",
        paragraphs: [
          "Client shall pay Brightloom a monthly service fee of $3,000, invoiced on the first business day of each month and payable net thirty (30) days from receipt of invoice — a total of $36,000 for the twelve-month term. The monthly fee covers the services described in Section 3; separately ordered events are invoiced upon completion at the rates stated in the applicable event order.",
        ],
      },
      {
        id: "c-018-s5",
        number: "5",
        heading: "Termination",
        paragraphs: [
          "Either party may terminate this Agreement for material breach upon fifteen (15) days' written notice if such breach remains uncured at the end of the notice period. Either party may terminate for convenience upon thirty (30) days' written notice, in which case Client remains responsible for the monthly fee through the effective date of termination.",
        ],
      },
      {
        id: "c-018-s6",
        number: "6",
        heading: "Food Safety; Insurance",
        paragraphs: [
          "Brightloom shall hold all licenses and permits required to provide the services, comply with applicable food safety regulations, and accommodate the dietary restrictions communicated by Client. Brightloom shall maintain commercial general liability insurance of not less than $1,000,000 per occurrence for the duration of the term and shall furnish a certificate of insurance upon request.",
        ],
      },
      {
        id: "c-018-s7",
        number: "7",
        heading: "Limitation of Liability",
        paragraphs: [
          "EXCEPT FOR CLAIMS ARISING FROM BODILY INJURY OR BRIGHTLOOM'S GROSS NEGLIGENCE, EACH PARTY'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT shall not exceed the total fees actually paid by Client to Brightloom under this Agreement. NEITHER PARTY SHALL BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES.",
        ],
      },
      {
        id: "c-018-s8",
        number: "8",
        heading: "General; Governing Law",
        paragraphs: [
          "This Agreement is governed by and construed in accordance with the laws of the State of Colorado, without regard to its conflicts of law principles. The parties consent to the exclusive jurisdiction of the state and federal courts located in Denver, Colorado. This Agreement constitutes the entire agreement of the parties with respect to its subject matter.",
        ],
      },
    ],
  },
};
