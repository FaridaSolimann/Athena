import type { Contract } from "@/data/types";

// c-011 — Executive employment agreement for the Chief Data Officer.
// At-will (no expiration); demo beats: 30% target bonus, invention assignment,
// 12-month post-termination non-solicitation, and an annual compensation
// review due each February 1.

export const marshEmployment: Contract = {
  id: "c-011",
  title: "Executive Employment Agreement — Chief Data Officer",
  counterparty: "Dr. Elena Marsh",
  counterpartyCategory: "Executive employment",
  type: "Employment",
  status: "active",
  valueUsd: 310_000,
  effectiveDate: "2025-01-15",
  expirationDate: null,
  autoRenew: false,
  ingestedAt: "2026-06-10",
  fields: [
    {
      id: "c-011:contract_type",
      contractId: "c-011",
      key: "contract_type",
      label: "Contract type",
      group: "Overview",
      value: { kind: "text", value: "Executive employment agreement" },
      confidence: 0.98,
      source: {
        sectionId: "c-011-s1",
        excerpt: "This Executive Employment Agreement (the “Agreement”)",
      },
    },
    {
      id: "c-011:counterparty",
      contractId: "c-011",
      key: "counterparty",
      label: "Counterparty",
      group: "Overview",
      value: { kind: "text", value: "Dr. Elena Marsh" },
      confidence: 0.98,
      source: {
        sectionId: "c-011-s1",
        excerpt:
          "Dr. Elena Marsh, an individual residing in Denver, Colorado (the “Executive”)",
      },
    },
    {
      id: "c-011:effective_date",
      contractId: "c-011",
      key: "effective_date",
      label: "Start date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2025-01-15" },
      confidence: 0.97,
      source: {
        sectionId: "c-011-s2",
        excerpt: "commence on January 15, 2025 (the “Start Date”)",
      },
    },
    {
      id: "c-011:expiration_date",
      contractId: "c-011",
      key: "expiration_date",
      label: "Expiration date",
      group: "Term & renewal",
      value: { kind: "text", value: "At-will" },
      confidence: 0.93,
      source: {
        sectionId: "c-011-s2",
        excerpt:
          "The Executive's employment is at-will and does not have a fixed term",
      },
      note: "No fixed expiration; employment continues until terminated by either party under Section 10.",
    },
    {
      id: "c-011:total_value",
      contractId: "c-011",
      key: "total_value",
      label: "Total contract value",
      group: "Financial",
      value: { kind: "money", usd: 310_000 },
      confidence: 0.86,
      source: {
        sectionId: "c-011-s3",
        excerpt: "an annualized base salary of $310,000",
      },
      note: "Annualized base salary; excludes bonus and equity",
    },
    {
      id: "c-011:payment_schedule",
      contractId: "c-011",
      key: "payment_schedule",
      label: "Payment schedule",
      group: "Financial",
      value: { kind: "text", value: "Semi-monthly payroll" },
      confidence: 0.95,
      source: {
        sectionId: "c-011-s3",
        excerpt:
          "payable in accordance with the Company's standard semi-monthly payroll practices",
      },
    },
    {
      id: "c-011:confidentiality",
      contractId: "c-011",
      key: "confidentiality",
      label: "Confidentiality",
      group: "Legal terms",
      value: {
        kind: "text",
        value: "Survives termination while information remains confidential",
      },
      confidence: 0.93,
      source: {
        sectionId: "c-011-s7",
        excerpt:
          "This obligation survives termination of employment for so long as such information remains confidential",
      },
    },
    {
      id: "c-011:ip_ownership",
      contractId: "c-011",
      key: "ip_ownership",
      label: "IP ownership",
      group: "Legal terms",
      value: {
        kind: "text",
        value: "All work-related inventions assigned to Vantora",
      },
      confidence: 0.95,
      source: {
        sectionId: "c-011-s8",
        excerpt:
          "The Executive hereby assigns to the Company all right, title, and interest in and to any inventions, works of authorship, developments, and trade secrets",
      },
    },
    {
      id: "c-011:termination",
      contractId: "c-011",
      key: "termination",
      label: "Post-termination restrictions",
      group: "Legal terms",
      value: {
        kind: "text",
        value: "12-month non-solicitation of employees and customers",
      },
      confidence: 0.94,
      source: {
        sectionId: "c-011-s9",
        excerpt:
          "For a period of twelve (12) months following the termination of the Executive's employment for any reason",
      },
    },
    {
      id: "c-011:liability_cap",
      contractId: "c-011",
      key: "liability_cap",
      label: "Liability cap",
      group: "Legal terms",
      value: { kind: "text", value: "N/A — employment" },
      confidence: 0.9,
      source: null,
      note: "Employment agreements do not typically carry a liability cap; remedies are governed by statute and the termination provisions.",
    },
    {
      id: "c-011:governing_law",
      contractId: "c-011",
      key: "governing_law",
      label: "Governing law",
      group: "Legal terms",
      value: { kind: "text", value: "Colorado" },
      confidence: 0.97,
      source: {
        sectionId: "c-011-s11",
        excerpt:
          "governed by and construed in accordance with the laws of the State of Colorado",
      },
    },
  ],
  obligations: [
    {
      id: "c-011:ob-comp-review",
      contractId: "c-011",
      title: "Complete annual compensation review",
      owedBy: "us",
      recurrence: "annual",
      dueDate: "2027-02-01",
      description:
        "The Compensation Committee must review Dr. Marsh's base salary and target bonus no later than February 1 each year; base salary may not be reduced without her written consent.",
      source: {
        sectionId: "c-011-s6",
        excerpt:
          "review the Executive's base salary and target bonus no later than February 1 of each calendar year",
      },
    },
  ],
  risks: [],
  milestones: [],
  document: {
    filename: "Marsh_Employment_Agreement_CDO_2025.pdf",
    format: "pdf",
    pages: 12,
    sections: [
      {
        id: "c-011-s1",
        number: "1",
        heading: "Parties; Position and Duties",
        paragraphs: [
          "This Executive Employment Agreement (the “Agreement”) is entered into by and between Vantora Labs, Inc., a Delaware corporation with offices at 4120 Delgany Street, Denver, CO 80216 (the “Company”), and Dr. Elena Marsh, an individual residing in Denver, Colorado (the “Executive”).",
          "The Company shall employ the Executive as Chief Data Officer, reporting to the Chief Executive Officer. The Executive shall devote her full business time, attention, and best efforts to the business and affairs of the Company, provided that the Executive may serve on one outside advisory board with the prior written consent of the Board, such consent not to be unreasonably withheld.",
        ],
      },
      {
        id: "c-011-s2",
        number: "2",
        heading: "Term; At-Will Employment",
        paragraphs: [
          "The Executive's employment under this Agreement shall commence on January 15, 2025 (the “Start Date”). The Executive's employment is at-will and does not have a fixed term; either the Executive or the Company may terminate the employment relationship at any time, with or without Cause or notice, subject to the provisions of Section 10.",
        ],
      },
      {
        id: "c-011-s3",
        number: "3",
        heading: "Base Salary",
        paragraphs: [
          "The Company shall pay the Executive an annualized base salary of $310,000, less applicable withholdings and deductions, payable in accordance with the Company's standard semi-monthly payroll practices as in effect from time to time.",
        ],
      },
      {
        id: "c-011-s4",
        number: "4",
        heading: "Annual Bonus",
        paragraphs: [
          "For each calendar year of employment, the Executive shall be eligible to earn a target annual bonus of thirty percent (30%) of base salary, based upon the achievement of Company and individual performance objectives established by the Board in consultation with the Executive. Any bonus for calendar year 2025 shall be prorated from the Start Date.",
          "Except as expressly provided in Section 10, the Executive must remain employed by the Company on the bonus payment date in order to earn any annual bonus, and any bonus earned shall be paid no later than March 15 of the year following the year to which it relates.",
        ],
      },
      {
        id: "c-011-s5",
        number: "5",
        heading: "Equity Award",
        paragraphs: [
          "Subject to approval by the Board, the Executive shall be granted an option to purchase 220,000 shares of the Company's common stock under the Company's 2023 Equity Incentive Plan, vesting over four (4) years with a one (1) year cliff, in each case as set forth in the applicable award agreement and the Plan.",
        ],
      },
      {
        id: "c-011-s6",
        number: "6",
        heading: "Benefits; Annual Compensation Review",
        paragraphs: [
          "The Executive shall be eligible to participate in the employee benefit plans and programs generally made available to the Company's senior executives, subject to the terms of the applicable plan documents, and shall be entitled to paid time off in accordance with the Company's flexible vacation policy.",
          "The Compensation Committee of the Board shall review the Executive's base salary and target bonus no later than February 1 of each calendar year, beginning February 1, 2026. Any adjustment shall be effective as of the date determined by the Committee, provided that the Executive's base salary shall not be reduced without her prior written consent.",
        ],
      },
      {
        id: "c-011-s7",
        number: "7",
        heading: "Confidential Information",
        paragraphs: [
          "During and after employment, the Executive shall hold in strict confidence and shall not use or disclose, other than in the good-faith performance of her duties, any Confidential Information of the Company, including data assets, model architectures, product roadmaps, customer lists, and business plans. This obligation survives termination of employment for so long as such information remains confidential.",
        ],
      },
      {
        id: "c-011-s8",
        number: "8",
        heading: "Inventions Assignment; Intellectual Property",
        paragraphs: [
          "The Executive hereby assigns to the Company all right, title, and interest in and to any inventions, works of authorship, developments, and trade secrets conceived, made, or reduced to practice by the Executive, alone or jointly with others, during the period of employment that relate to the Company's business or actual or demonstrably anticipated research, or that are developed using Company equipment, facilities, or Confidential Information (collectively, “Inventions”).",
          "The Executive shall promptly disclose all Inventions to the Company and shall execute such documents and take such actions as the Company reasonably requests to evidence and perfect the Company's ownership. This Section 8 does not apply to any invention developed entirely on the Executive's own time without use of Company equipment, supplies, facilities, or trade secret information, except for inventions that relate to the Company's business or actual or demonstrably anticipated research or development.",
        ],
      },
      {
        id: "c-011-s9",
        number: "9",
        heading: "Non-Solicitation",
        paragraphs: [
          "For a period of twelve (12) months following the termination of the Executive's employment for any reason, the Executive shall not, directly or indirectly, solicit or induce any employee or independent contractor of the Company to terminate his or her relationship with the Company, and shall not solicit any customer of the Company with whom the Executive had material contact during the final twelve (12) months of employment for the purpose of providing products or services competitive with the Company's business.",
        ],
      },
      {
        id: "c-011-s10",
        number: "10",
        heading: "Termination of Employment",
        paragraphs: [
          "Upon termination of employment for any reason, the Company shall pay the Executive all accrued but unpaid base salary through the date of termination and any other amounts required by applicable law. If the Company terminates the Executive's employment without Cause, the Executive shall be eligible, subject to her execution and non-revocation of a general release of claims, to receive continued payment of base salary for six (6) months following the date of termination.",
        ],
      },
      {
        id: "c-011-s11",
        number: "11",
        heading: "General; Governing Law",
        paragraphs: [
          "This Agreement is governed by and construed in accordance with the laws of the State of Colorado, without regard to its conflicts of law principles. This Agreement, together with the award agreement referenced in Section 5, constitutes the entire agreement of the parties with respect to its subject matter and may be amended only in a writing signed by both parties.",
        ],
      },
    ],
  },
};
