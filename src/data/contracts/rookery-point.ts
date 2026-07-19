import type { Contract } from "@/data/types";

// c-010 — Office lease at 4120 Delgany Street (Vantora HQ).
// Demo beats: (a) a one-time 60-month extension option at 95% of fair market
// rent that must be exercised by February 28, 2027; (b) a holdover clause at
// 150% of base rent ($58,125/mo) flagged as a medium penalty risk.

export const rookeryPoint: Contract = {
  id: "c-010",
  title: "Office Lease — 4120 Delgany Street, Denver",
  counterparty: "Rookery Point Properties LLC",
  counterpartyCategory: "Real estate",
  type: "Lease",
  status: "active",
  valueUsd: 2_325_000,
  effectiveDate: "2022-09-01",
  expirationDate: "2027-08-31",
  autoRenew: false,
  ingestedAt: "2026-06-10",
  fields: [
    {
      id: "c-010:contract_type",
      contractId: "c-010",
      key: "contract_type",
      label: "Contract type",
      group: "Overview",
      value: { kind: "text", value: "Office lease" },
      confidence: 0.98,
      source: {
        sectionId: "c-010-s1",
        excerpt: "This Office Lease (the “Lease”)",
      },
    },
    {
      id: "c-010:counterparty",
      contractId: "c-010",
      key: "counterparty",
      label: "Counterparty",
      group: "Overview",
      value: { kind: "text", value: "Rookery Point Properties LLC" },
      confidence: 0.98,
      source: {
        sectionId: "c-010-s1",
        excerpt:
          "Rookery Point Properties LLC, a Colorado limited liability company with offices at 1899 Wynkoop Street, Suite 700, Denver, CO 80202 (“Landlord”)",
      },
    },
    {
      id: "c-010:effective_date",
      contractId: "c-010",
      key: "effective_date",
      label: "Commencement date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2022-09-01" },
      confidence: 0.97,
      source: {
        sectionId: "c-010-s2",
        excerpt: "commence on September 1, 2022 (the “Commencement Date”)",
      },
    },
    {
      id: "c-010:expiration_date",
      contractId: "c-010",
      key: "expiration_date",
      label: "Expiration date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2027-08-31" },
      confidence: 0.96,
      source: {
        sectionId: "c-010-s2",
        excerpt: "expiring on August 31, 2027 (the “Expiration Date”)",
      },
    },
    {
      id: "c-010:auto_renew",
      contractId: "c-010",
      key: "auto_renew",
      label: "Auto-renewal",
      group: "Term & renewal",
      value: { kind: "boolean", value: false },
      confidence: 0.95,
      source: {
        sectionId: "c-010-s2",
        excerpt: "This Lease does not renew automatically",
      },
    },
    {
      id: "c-010:notice_deadline",
      contractId: "c-010",
      key: "notice_deadline",
      label: "Extension option deadline",
      group: "Term & renewal",
      value: { kind: "date", iso: "2027-02-28" },
      confidence: 0.86,
      source: {
        sectionId: "c-010-s6",
        excerpt:
          "delivering written notice to Landlord no later than February 28, 2027",
      },
      note: "Deadline to exercise the one-time 60-month extension option — six (6) months before the August 31, 2027 expiration.",
    },
    {
      id: "c-010:term_length",
      contractId: "c-010",
      key: "term_length",
      label: "Term length",
      group: "Term & renewal",
      value: { kind: "duration", days: 1825, raw: "sixty (60) months" },
      confidence: 0.95,
      source: {
        sectionId: "c-010-s2",
        excerpt: "continue for sixty (60) months",
      },
    },
    {
      id: "c-010:total_value",
      contractId: "c-010",
      key: "total_value",
      label: "Total contract value",
      group: "Financial",
      value: { kind: "money", usd: 2_325_000 },
      confidence: 0.85,
      source: {
        sectionId: "c-010-s3",
        excerpt: "base rent of $38,750 per month",
      },
      note: "Computed: $38,750 monthly base rent × 60-month term",
    },
    {
      id: "c-010:payment_schedule",
      contractId: "c-010",
      key: "payment_schedule",
      label: "Payment schedule",
      group: "Financial",
      value: { kind: "text", value: "Monthly base rent, due the 1st" },
      confidence: 0.96,
      source: {
        sectionId: "c-010-s3",
        excerpt:
          "due and payable in advance on the first day of each calendar month",
      },
    },
    {
      id: "c-010:liability_cap",
      contractId: "c-010",
      key: "liability_cap",
      label: "Liability cap",
      group: "Legal terms",
      value: { kind: "text", value: "N/A — lease" },
      confidence: 0.9,
      source: null,
      note: "Commercial leases do not typically carry a mutual liability cap; exposure is governed by the default, holdover, and indemnity provisions.",
    },
    {
      id: "c-010:governing_law",
      contractId: "c-010",
      key: "governing_law",
      label: "Governing law",
      group: "Legal terms",
      value: { kind: "text", value: "Colorado" },
      confidence: 0.97,
      source: {
        sectionId: "c-010-s12",
        excerpt:
          "governed by and construed in accordance with the laws of the State of Colorado",
      },
    },
    {
      id: "c-010:insurance",
      contractId: "c-010",
      key: "insurance",
      label: "Insurance",
      group: "Legal terms",
      value: {
        kind: "text",
        value: "$2M/$4M CGL, Landlord as additional insured",
      },
      confidence: 0.94,
      source: {
        sectionId: "c-010-s8",
        excerpt:
          "commercial general liability insurance with limits of not less than $2,000,000 per occurrence and $4,000,000 in the aggregate",
      },
    },
    {
      id: "c-010:termination",
      contractId: "c-010",
      key: "termination",
      label: "Holdover",
      group: "Legal terms",
      value: { kind: "text", value: "Holdover at 150% of base rent" },
      confidence: 0.88,
      source: {
        sectionId: "c-010-s10",
        excerpt:
          "a tenancy at sufferance at a monthly rent equal to one hundred fifty percent (150%) of the base rent",
      },
      note: "150% × $38,750 base rent = $58,125 per month during any holdover.",
    },
  ],
  obligations: [
    {
      id: "c-010:ob-extension",
      contractId: "c-010",
      title: "Exercise or decline 5-year extension option",
      owedBy: "us",
      dueDate: "2027-02-28",
      description:
        "Written notice exercising the 60-month extension option (at 95% of fair market rent) must reach Rookery Point by February 28, 2027. The option lapses if the deadline passes.",
      source: {
        sectionId: "c-010-s6",
        excerpt:
          "Tenant may exercise the extension option only by delivering written notice to Landlord no later than February 28, 2027",
      },
    },
    {
      id: "c-010:ob-rent",
      contractId: "c-010",
      title: "Monthly base rent ($38,750)",
      owedBy: "us",
      recurrence: "monthly",
      description:
        "Base rent of $38,750 is due in advance on the first day of each calendar month; a 5% late charge applies after five days.",
      source: {
        sectionId: "c-010-s3",
        excerpt:
          "base rent of $38,750 per month, due and payable in advance on the first day of each calendar month",
      },
    },
    {
      id: "c-010:ob-coi",
      contractId: "c-010",
      title: "Deliver annual certificate of insurance",
      owedBy: "us",
      recurrence: "annual",
      dueDate: "2026-09-01",
      description:
        "A current certificate of insurance evidencing the required coverage must be delivered to Rookery Point by September 1 each year of the term.",
      source: {
        sectionId: "c-010-s8",
        excerpt:
          "deliver a certificate of insurance evidencing the coverage required by this Section 8 on or before September 1 of each year of the term",
      },
    },
  ],
  risks: [
    {
      id: "c-010:risk-holdover",
      contractId: "c-010",
      kind: "penalty",
      severity: "medium",
      summary: "Holdover at 150% of base rent ($58,125/mo)",
      fieldId: "c-010:termination",
    },
  ],
  milestones: [],
  document: {
    filename: "RookeryPoint_Office_Lease_2022.pdf",
    format: "pdf",
    pages: 22,
    sections: [
      {
        id: "c-010-s1",
        number: "1",
        heading: "Parties; Premises",
        paragraphs: [
          "This Office Lease (the “Lease”) is entered into as of September 1, 2022, by and between Rookery Point Properties LLC, a Colorado limited liability company with offices at 1899 Wynkoop Street, Suite 700, Denver, CO 80202 (“Landlord”), and Vantora Labs, Inc., a Delaware corporation (“Tenant”).",
          "Landlord leases to Tenant approximately 12,400 rentable square feet on the third floor of the building located at 4120 Delgany Street, Denver, CO 80216 (the “Premises”), together with the non-exclusive right to use the common areas of the building, all as more particularly shown on the floor plan attached as Exhibit A.",
        ],
      },
      {
        id: "c-010-s2",
        number: "2",
        heading: "Term",
        paragraphs: [
          "The term of this Lease shall commence on September 1, 2022 (the “Commencement Date”) and shall continue for sixty (60) months, expiring on August 31, 2027 (the “Expiration Date”), unless sooner terminated or extended as expressly provided herein.",
          "This Lease does not renew automatically. Tenant shall have no right to remain in possession of the Premises after the Expiration Date except pursuant to the extension option set forth in Section 6 or with Landlord's prior written consent.",
        ],
      },
      {
        id: "c-010-s3",
        number: "3",
        heading: "Base Rent; Payment",
        paragraphs: [
          "Tenant shall pay Landlord base rent of $38,750 per month, due and payable in advance on the first day of each calendar month during the term, without notice, demand, offset, or deduction, at the address specified in Section 12 or by electronic transfer to an account designated in writing by Landlord.",
          "Any installment of base rent not received within five (5) days after its due date shall bear a late charge equal to five percent (5%) of the amount past due, which the parties agree is a reasonable estimate of Landlord's administrative costs.",
        ],
      },
      {
        id: "c-010-s4",
        number: "4",
        heading: "Additional Rent; Operating Expenses",
        paragraphs: [
          "In addition to base rent, Tenant shall pay Tenant's proportionate share (14.2%) of building operating expenses and real property taxes, estimated monthly and reconciled annually within one hundred twenty (120) days after the close of each calendar year. Landlord shall furnish a reasonably detailed statement of actual operating expenses with each reconciliation.",
        ],
      },
      {
        id: "c-010-s5",
        number: "5",
        heading: "Security Deposit",
        paragraphs: [
          "Tenant has deposited with Landlord the sum of $77,500 as security for the faithful performance of Tenant's obligations under this Lease. The security deposit is not an advance payment of rent and shall be returned to Tenant, less lawful deductions, within sixty (60) days after the Expiration Date.",
        ],
      },
      {
        id: "c-010-s6",
        number: "6",
        heading: "Option to Extend",
        paragraphs: [
          "Tenant shall have one (1) option to extend the term of this Lease for an additional period of sixty (60) months (the “Extension Term”), commencing on September 1, 2027. Base rent during the Extension Term shall be ninety-five percent (95%) of the fair market rent for comparable office space in the Delgany corridor, determined in accordance with the appraisal procedure set forth in Exhibit C.",
          "Tenant may exercise the extension option only by delivering written notice to Landlord no later than February 28, 2027, being not less than six (6) months prior to the Expiration Date. Time is of the essence with respect to such notice, and any purported exercise delivered after such date shall be void. The option shall lapse if Tenant is in uncured monetary default at the time of exercise.",
        ],
      },
      {
        id: "c-010-s7",
        number: "7",
        heading: "Use; Maintenance",
        paragraphs: [
          "The Premises shall be used for general office purposes and for no other use without Landlord's prior written consent. Tenant shall keep the Premises in good order and repair, ordinary wear and tear excepted; Landlord shall maintain the roof, foundation, structural elements, and base building systems in good working condition.",
        ],
      },
      {
        id: "c-010-s8",
        number: "8",
        heading: "Insurance",
        paragraphs: [
          "Tenant shall maintain, at its sole expense, commercial general liability insurance with limits of not less than $2,000,000 per occurrence and $4,000,000 in the aggregate, naming Landlord as an additional insured, together with property insurance covering Tenant's personal property and improvements at full replacement cost.",
          "Tenant shall deliver a certificate of insurance evidencing the coverage required by this Section 8 on or before September 1 of each year of the term. Failure to deliver a current certificate within ten (10) days after written demand shall constitute a default under this Lease.",
        ],
      },
      {
        id: "c-010-s9",
        number: "9",
        heading: "Assignment and Subletting",
        paragraphs: [
          "Tenant shall not assign this Lease or sublet all or any portion of the Premises without Landlord's prior written consent, which consent shall not be unreasonably withheld, conditioned, or delayed. Any permitted assignment shall not release Tenant from its obligations hereunder.",
        ],
      },
      {
        id: "c-010-s10",
        number: "10",
        heading: "Holdover",
        paragraphs: [
          "If Tenant remains in possession of the Premises after the Expiration Date without Landlord's prior written consent, such possession shall constitute a tenancy at sufferance at a monthly rent equal to one hundred fifty percent (150%) of the base rent in effect immediately before the Expiration Date, and Tenant shall additionally be liable for any consequential damages incurred by Landlord as a result of such holdover, including damages arising from a lost successor tenancy.",
        ],
      },
      {
        id: "c-010-s11",
        number: "11",
        heading: "Default; Remedies",
        paragraphs: [
          "Each of the following constitutes an event of default: failure to pay rent within five (5) days after written notice; failure to perform any other covenant within thirty (30) days after written notice (or such longer period as is reasonably required, provided cure is commenced promptly); or the making of a general assignment for the benefit of creditors. Upon an uncured default, Landlord may pursue any remedy available at law or in equity, including termination of this Lease and recovery of the Premises.",
        ],
      },
      {
        id: "c-010-s12",
        number: "12",
        heading: "General; Governing Law",
        paragraphs: [
          "This Lease is governed by and construed in accordance with the laws of the State of Colorado, without regard to its conflicts of law principles. The parties consent to the exclusive jurisdiction of the state courts located in the City and County of Denver, Colorado.",
          "Notices must be in writing and delivered by hand, nationally recognized overnight courier, or certified mail to the parties at the addresses set forth in Section 1, and are effective upon receipt.",
        ],
      },
    ],
  },
};
