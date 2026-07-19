import type { Contract } from "@/data/types";

// c-015 — Nimbara managed SOC monitoring. The fresh-upload demo contract
// (ingested today, status needs_review): exactly three fields land below the
// 0.75 review threshold, each backed by a real conflict between the master
// terms and Order Form CV-114 — payment schedule (quarterly vs annual prepay),
// notice window (60 vs 30 days), and a formula-based liability cap.

export const nimbara: Contract = {
  id: "c-015",
  title: "Managed SOC Monitoring Subscription",
  counterparty: "Nimbara Security, Inc.",
  counterpartyCategory: "Security services",
  type: "SaaS",
  status: "needs_review",
  valueUsd: 144_000,
  effectiveDate: "2026-02-01",
  expirationDate: "2027-01-31",
  autoRenew: true,
  noticeDays: 60,
  renewalTermMonths: 12,
  ingestedAt: "2026-07-19",
  fields: [
    {
      id: "c-015:contract_type",
      contractId: "c-015",
      key: "contract_type",
      label: "Contract type",
      group: "Overview",
      value: { kind: "text", value: "SaaS subscription (managed security)" },
      confidence: 0.95,
      source: {
        sectionId: "c-015-s1",
        excerpt:
          "These Managed SOC Master Subscription Terms (the “Agreement”)",
      },
    },
    {
      id: "c-015:counterparty",
      contractId: "c-015",
      key: "counterparty",
      label: "Counterparty",
      group: "Overview",
      value: { kind: "text", value: "Nimbara Security, Inc." },
      confidence: 0.96,
      source: {
        sectionId: "c-015-s1",
        excerpt:
          "Nimbara Security, Inc., a Delaware corporation with offices at 901 Mariner Boulevard, San Jose, CA 95134 (“Nimbara”)",
      },
    },
    {
      id: "c-015:effective_date",
      contractId: "c-015",
      key: "effective_date",
      label: "Effective date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2026-02-01" },
      confidence: 0.94,
      source: {
        sectionId: "c-015-s2",
        excerpt: "commences on February 1, 2026 (the “Effective Date”)",
      },
    },
    {
      id: "c-015:expiration_date",
      contractId: "c-015",
      key: "expiration_date",
      label: "Expiration date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2027-01-31" },
      confidence: 0.94,
      source: {
        sectionId: "c-015-s2",
        excerpt:
          "continues for an initial term of twelve (12) months through January 31, 2027 (the “Initial Term”)",
      },
    },
    {
      id: "c-015:auto_renew",
      contractId: "c-015",
      key: "auto_renew",
      label: "Auto-renewal",
      group: "Term & renewal",
      value: { kind: "boolean", value: true },
      confidence: 0.93,
      source: {
        sectionId: "c-015-s2",
        excerpt:
          "shall automatically renew for successive renewal terms of twelve (12) months each",
      },
    },
    {
      id: "c-015:renewal_date",
      contractId: "c-015",
      key: "renewal_date",
      label: "Renewal date",
      group: "Term & renewal",
      value: { kind: "date", iso: "2027-01-31" },
      confidence: 0.92,
      source: {
        sectionId: "c-015-s2",
        excerpt: "Upon expiration of the Initial Term and each renewal term",
      },
    },
    {
      id: "c-015:notice_days",
      contractId: "c-015",
      key: "notice_days",
      label: "Non-renewal notice window",
      group: "Term & renewal",
      value: { kind: "duration", days: 60, raw: "sixty (60) days" },
      confidence: 0.62,
      source: {
        sectionId: "c-015-s2",
        excerpt:
          "written notice of non-renewal at least sixty (60) days prior to the end of the then-current term",
      },
      note: "Master terms §2 requires sixty (60) days; Order Form CV-114 states thirty (30) days. Sixty assumed pending review.",
    },
    {
      id: "c-015:notice_deadline",
      contractId: "c-015",
      key: "notice_deadline",
      label: "Notice deadline",
      group: "Term & renewal",
      value: { kind: "date", iso: "2026-12-02" },
      confidence: 0.78,
      source: {
        sectionId: "c-015-s2",
        excerpt:
          "written notice of non-renewal at least sixty (60) days prior to the end of the then-current term",
      },
      note: "Computed: January 31, 2027 term end − 60 days (pending notice-window verification).",
    },
    {
      id: "c-015:total_value",
      contractId: "c-015",
      key: "total_value",
      label: "Total contract value",
      group: "Financial",
      value: { kind: "money", usd: 144_000 },
      confidence: 0.94,
      source: {
        sectionId: "c-015-s11",
        excerpt: "Subscription fee: $144,000 per annum",
      },
    },
    {
      id: "c-015:payment_schedule",
      contractId: "c-015",
      key: "payment_schedule",
      label: "Payment schedule",
      group: "Financial",
      value: { kind: "text", value: "Quarterly invoices, net 30" },
      confidence: 0.68,
      source: {
        sectionId: "c-015-s4",
        excerpt:
          "subscription fees for each contract year are payable annually in advance",
      },
      note: "Order Form §2 reads quarterly; §4.2 of the master terms references annual prepay — readings conflict.",
    },
    {
      id: "c-015:liability_cap",
      contractId: "c-015",
      key: "liability_cap",
      label: "Liability cap",
      group: "Legal terms",
      value: { kind: "money", usd: 288_000 },
      confidence: 0.71,
      source: {
        sectionId: "c-015-s9",
        excerpt:
          "SHALL NOT EXCEED AN AMOUNT EQUAL TO TWO TIMES (2×) THE FEES PAID OR PAYABLE BY CUSTOMER IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM",
      },
      note: "“2× the fees paid in the trailing twelve months” ≈ $288,000 at current run rate.",
    },
    {
      id: "c-015:sla",
      contractId: "c-015",
      key: "sla",
      label: "Service level",
      group: "Legal terms",
      value: {
        kind: "text",
        value: "24×7×365 monitoring; 24-hour breach notification",
      },
      confidence: 0.93,
      source: {
        sectionId: "c-015-s3",
        excerpt:
          "monitoring of Customer's covered environment on a 24×7×365 basis",
      },
    },
    {
      id: "c-015:governing_law",
      contractId: "c-015",
      key: "governing_law",
      label: "Governing law",
      group: "Legal terms",
      value: { kind: "text", value: "California" },
      confidence: 0.96,
      source: {
        sectionId: "c-015-s10",
        excerpt:
          "governed by and construed in accordance with the laws of the State of California",
      },
    },
  ],
  obligations: [
    {
      id: "c-015:ob-soc-monitoring",
      contractId: "c-015",
      title: "Nimbara: 24/7 SOC monitoring and 24-hour breach notification",
      owedBy: "them",
      recurrence: "continuous",
      description:
        "Nimbara staffs continuous SOC monitoring of the covered environment and must notify Vantora of any confirmed breach of Customer Data within 24 hours of confirmation.",
      source: {
        sectionId: "c-015-s3",
        excerpt:
          "notify Customer of any confirmed breach of Customer Data within twenty-four (24) hours of confirmation",
      },
    },
    {
      id: "c-015:ob-subscription-payment",
      contractId: "c-015",
      title: "Subscription payment per invoicing schedule",
      owedBy: "us",
      recurrence: "quarterly",
      description:
        "Pay subscription fees ($144,000/yr) per the invoicing schedule — quarterly $36,000 invoices net 30 under Order Form CV-114, pending resolution of the annual-prepay reading in §4.2.",
      source: {
        sectionId: "c-015-s11",
        excerpt:
          "Nimbara shall issue quarterly invoices of $36,000 in advance, payable net thirty (30) days from invoice date",
      },
    },
  ],
  risks: [
    {
      id: "c-015:risk-autorenew",
      contractId: "c-015",
      kind: "auto_renewal_trap",
      severity: "medium",
      summary:
        "Auto-renews Jan 31, 2027; notice window in dispute (60 vs 30 days)",
      fieldId: "c-015:notice_days",
    },
  ],
  milestones: [],
  document: {
    filename: "Nimbara_SOC_Monitoring_Order_2026.pdf",
    format: "pdf",
    pages: 9,
    sections: [
      {
        id: "c-015-s1",
        number: "1",
        heading: "Parties; Definitions",
        paragraphs: [
          "These Managed SOC Master Subscription Terms (the “Agreement”) are entered into by and between Vantora Labs, Inc., a Delaware corporation with offices at 4120 Delgany Street, Denver, CO 80216 (“Customer”), and Nimbara Security, Inc., a Delaware corporation with offices at 901 Mariner Boulevard, San Jose, CA 95134 (“Nimbara”), and govern each Order Form executed by the parties that references these terms.",
          "“Services” means Nimbara's managed security operations center monitoring services described in the applicable Order Form. “Customer Data” means data submitted to or collected by the Services on Customer's behalf, including log and telemetry data from Customer's covered environment.",
        ],
      },
      {
        id: "c-015-s2",
        number: "2",
        heading: "Term; Automatic Renewal; Non-Renewal Notice",
        paragraphs: [
          "The subscription term commences on February 1, 2026 (the “Effective Date”) and continues for an initial term of twelve (12) months through January 31, 2027 (the “Initial Term”).",
          "Upon expiration of the Initial Term and each renewal term, this Agreement and each outstanding Order Form shall automatically renew for successive renewal terms of twelve (12) months each, at the pricing then in effect, unless either party delivers written notice of non-renewal at least sixty (60) days prior to the end of the then-current term. Notice is effective only upon receipt.",
        ],
      },
      {
        id: "c-015-s3",
        number: "3",
        heading: "SOC Monitoring; Incident Response",
        paragraphs: [
          "Nimbara shall provide security operations center monitoring of Customer's covered environment on a 24×7×365 basis, including alert triage, threat hunting, containment recommendations, and escalation in accordance with the incident response runbook agreed under the applicable Order Form. Critical alerts shall be escalated to Customer's designated contacts within fifteen (15) minutes of validation.",
          "Nimbara shall notify Customer of any confirmed breach of Customer Data within twenty-four (24) hours of confirmation, and shall thereafter provide reasonable cooperation and information to support Customer's legal and regulatory notification obligations.",
        ],
      },
      {
        id: "c-015-s4",
        number: "4",
        heading: "Fees; Payment",
        paragraphs: [
          "4.1 Customer shall pay the subscription fees set forth in the applicable Order Form. Fees are stated and payable in U.S. dollars and are exclusive of applicable taxes, which Customer shall pay or provide a valid exemption certificate.",
          "4.2 Unless otherwise stated herein, subscription fees for each contract year are payable annually in advance within thirty (30) days of the start of such contract year. Amounts not received when due accrue interest at the lesser of one percent (1%) per month or the maximum rate permitted by law.",
        ],
      },
      {
        id: "c-015-s5",
        number: "5",
        heading: "Data Security; Confidentiality",
        paragraphs: [
          "Nimbara shall maintain an information security program aligned to SOC 2 Type II and shall process Customer Data solely to provide the Services. Each party shall protect the other party's Confidential Information with at least reasonable care and use it solely to perform under, or exercise rights granted by, this Agreement.",
        ],
      },
      {
        id: "c-015-s6",
        number: "6",
        heading: "Customer Responsibilities",
        paragraphs: [
          "Customer shall deploy and maintain the log forwarders and sensors reasonably specified by Nimbara, keep escalation contacts current, and respond to containment recommendations for critical incidents within the timeframes set out in the incident response runbook. Nimbara is not responsible for detection gaps attributable to telemetry Customer elects not to forward.",
        ],
      },
      {
        id: "c-015-s7",
        number: "7",
        heading: "Warranties",
        paragraphs: [
          "Each party warrants that it has the authority to enter into this Agreement. Nimbara warrants that the Services will be performed in a professional and workmanlike manner by qualified personnel. EXCEPT AS EXPRESSLY STATED, THE SERVICES ARE PROVIDED “AS IS” AND NIMBARA DISCLAIMS ALL OTHER WARRANTIES, EXPRESS OR IMPLIED, INCLUDING ANY WARRANTY THAT THE SERVICES WILL DETECT ALL SECURITY INCIDENTS.",
        ],
      },
      {
        id: "c-015-s8",
        number: "8",
        heading: "Indemnification",
        paragraphs: [
          "Nimbara shall defend Customer against any third-party claim alleging that the Services, as provided by Nimbara, infringe a U.S. patent, copyright, or trademark, and shall indemnify Customer against amounts finally awarded or agreed in settlement, provided Customer gives prompt notice and reasonable cooperation.",
        ],
      },
      {
        id: "c-015-s9",
        number: "9",
        heading: "Limitation of Liability",
        paragraphs: [
          "EXCEPT FOR BREACHES OF SECTION 5 OR AMOUNTS PAYABLE UNDER SECTION 8, EACH PARTY'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL NOT EXCEED AN AMOUNT EQUAL TO TWO TIMES (2×) THE FEES PAID OR PAYABLE BY CUSTOMER IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM. IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES.",
        ],
      },
      {
        id: "c-015-s10",
        number: "10",
        heading: "General; Governing Law",
        paragraphs: [
          "This Agreement is governed by and construed in accordance with the laws of the State of California, without regard to its conflicts of law principles. The parties consent to the exclusive jurisdiction of the state and federal courts located in Santa Clara County, California. In the event of a conflict between these master terms and an Order Form, the Order Form controls with respect to the Services it describes.",
        ],
      },
      {
        id: "c-015-s11",
        number: "Order Form",
        heading: "Order Form CV-114",
        paragraphs: [
          "Order Form CV-114 is entered into under and incorporates the Nimbara Managed SOC Master Subscription Terms. Services: Managed SOC Monitoring — Tier 2, covering up to 400 monitored endpoints and two cloud environments. Subscription fee: $144,000 per annum.",
          "Invoicing: Nimbara shall issue quarterly invoices of $36,000 in advance, payable net thirty (30) days from invoice date.",
          "Renewal: this Order Form renews in accordance with Section 2 of the master terms, provided that either party may elect non-renewal upon thirty (30) days' prior written notice to the other party.",
        ],
      },
    ],
  },
};
