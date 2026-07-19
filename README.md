# Athena

Post-signature contract intelligence. Athena turns a folder of signed PDFs into a
living, queryable knowledge base — every extracted term carries its confidence and
links to the exact clause it came from, and the system surfaces renewals,
obligations, and risks before they bite.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. No database, no API keys — the workspace ships with a
fully populated contract portfolio for **Vantora Labs, Inc.** (a Denver climate-risk
analytics company) and holds all of your actions in browser storage.
**Settings → Workspace data → Reset workspace** restores the pristine state.

> The workspace clock is frozen at **July 19, 2026** so that relative dates
> ("notice due in 13 days") stay meaningful.

## Three flows to try

**1. Upload → verify → alert → assign.**
On Repository, drop any PDF into the upload zone. Watch it upload and extract, then
open the new Nimbara Security contract — three terms were flagged low-confidence
(including a 60-vs-30-day notice conflict with its order form). Confirm or correct
them against the highlighted clauses, then open Tasks & Alerts: the verification
task has resolved itself, the approval is recorded, and the contract's renewal
alert is live — reassign it to anyone, or a whole team.

**2. Ask a question → cited answers → the exact clause.**
On Explore, ask *"Which vendor contracts have a liability cap below $1M?"* You get a
computed answer plus the live contract set behind it — every value chips out to the
exact sentence in the source document. Follow one into the contract to see the
full document with every extracted span highlighted.

**3. Portfolio → timeline → clause.**
On Insights, skim the headline: $8.48M committed, one counterparty holding 30% of
it. Then open the Obligations Timeline tab: renewals, notice cutoffs, expirations,
and payments laid out across the next year. The red diamond is Cirravault — its
non-renewal notice is due August 1, thirteen days out, and missing it locks in a
new 36-month, ~$756K term. Click it, read the terms it rests on, and jump to the
clause.

## How it's built

Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + Zustand. Seed data is
immutable and hand-authored (17 contracts with full clause text); everything you do
is an overlay merged at read time, so corrections ripple into every total, answer,
and alert that depends on them. Extraction and Q&A are simulated behind clean
interfaces (`src/lib/extraction/engine.ts`, `src/lib/explore/engine.ts`) that a real
parser and model drop into.

Data invariants (the demo math) are machine-checked:

```bash
npm run check-seed      # portfolio totals, concentration, deadlines, span integrity
npx tsx scripts/check-explore.ts   # the 15 canonical Explore questions
```

See `NOTES.md` for assumptions and Phase-2 seams.
