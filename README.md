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

Open http://localhost:3000. No database, no API keys required — the workspace ships
with a fully populated contract portfolio for **Vantora Labs, Inc.** (a Denver
climate-risk analytics company) and holds all of your actions in browser storage.
**Settings → Workspace data → Reset workspace** restores the pristine state.

### Optional: live AI for Explore (Gemini)

Explore works out of the box on a built-in pattern matcher. To let it understand
free-form phrasings, add a Google Gemini key (free at
[aistudio.google.com](https://aistudio.google.com)):

```bash
cp .env.local.example .env.local   # then paste your key into GEMINI_API_KEY
```

The model only translates your question into a small, validated query plan — it
never produces the answer. The plan is executed locally against the contract data,
so every result stays a cited, verifiable fact, and the footer under each answer
tells you which engine read your question. No key, a timeout, or an invalid plan
all degrade silently to the pattern matcher. Your key stays in `.env.local`,
which is never committed.

**The same key makes uploads real.** Drop any PDF or Word contract into the
Repository and Athena extracts its text, has Gemini quote the terms it finds
(quotes only — every one is string-verified against the document before it's
shown, and values are normalized in code, never by the model), and adds the
contract to the shared store: it appears in the Repository, Search, Insights,
Explore, and the review queue like any seed contract, with real clause
highlighting. Without a key (or for scanned/unreadable files), an upload maps to
a pre-authored sample contract instead so the flow still completes end to end.

> The workspace clock is frozen at **July 19, 2026** so that relative dates
> ("notice due in 13 days") stay meaningful.


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
