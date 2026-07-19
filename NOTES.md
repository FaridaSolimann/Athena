# NOTES

Assumptions, judgment calls, and the seams left for later phases.

## Design tokens

The Figma file couldn't be accessed without authenticating the integration, so
tokens were derived from the Clay web reference screens in `Design reference/`:
white surfaces, cool near-black text (`oklch(0.22 0.01 260)`), hairline borders,
a single blue primary (~`#2185FF`), 8px control radii, dense numbered tables,
right-side slide-in panels. Judgment calls:

- Trust-state colors are first-class tokens (`--trust-high/medium/low/verified/missing`)
  rather than hardcoded utility classes, since the whole product hangs off them.
  Verified = blue (human sign-off reads as product-primary), high = quiet green,
  medium = amber, low = red, missing = dashed gray.
- Timeline lane colors (`--event-*`) reuse the same hues so the two systems agree.
- Typeface is Geist (close to Clay's grotesque; ships with Next).

## Simulated AI

- Extraction is pre-computed seed data behind a real seam: `lib/extraction/engine.ts`
  defines `ExtractionEngine`; the Phase-1 `MockExtractionEngine` never reads file
  bytes and materializes pre-authored contracts from `src/data/upload-queue`. A real
  parser drops in behind the same interface without touching UI code.
- Explore has two question readers and ONE answerer. Both Google Gemini
  (`/api/ask`, model pinned in `route.ts`) and the deterministic pattern matcher
  (`lib/explore/engine.ts`) translate a question into the same validated
  **QueryPlan** DSL (`lib/explore/plan.ts`); a shared local engine
  (`lib/explore/execute.ts`) executes plans against *effective* state, so answers
  are computed facts with provenance — the model never emits values or prose.
  Plans are validated twice (server before returning, client before executing).
  The server can't see the localStorage verification overlay, which is exactly why
  translation is the only thing it does. No key / timeout (5s) / invalid plan /
  out-of-scope → deterministic fallback; unmatched questions get a scope card with
  guaranteed-answerable suggestions — never a fake answer. `npm run check-explore`
  locks 15 canonical questions plus DSL conformance and hostile-plan rejection.
  Money aggregates report low-confidence value explicitly ("$X of that rests on N
  low-confidence terms") — nothing is silently folded into a total.
- Confidence scores are hand-tuned: clean digital docs 0.92–0.98, derived fields
  0.75–0.90 (always with a computation note), the scanned 2019 Kearns agreement
  0.33–0.72. `< 0.75` is the needs-review line everywhere.

## Data invariants

The demo math is hand-reconciled and machine-checked — run `npm run check-seed`
after ANY seed edit. Headlines: $8,480,000 portfolio (EUR at 1.08), Torvane
exactly 30.0%, 3 notice deadlines within 90 days (earliest Cirravault Aug 1 =
today + 13), $267,000 on needs-review paper. The workspace clock is frozen at
2026-07-19 (`src/lib/demo-clock.ts`) so urgency never rots.

## Architecture notes

- Seed is immutable; everything the user does is a localStorage overlay
  (`lib/store.ts`) merged at read time (`lib/selectors.ts`). Tasks & alerts are
  derived pure functions with deterministic IDs, so verifying a field auto-resolves
  its verification task, and a fresh upload grows alerts with zero extra code.
- Approving a task and verifying its fields are the same store write — the approval
  queue is a view over field verifications, not a second system.
- Reset (Settings → Workspace data) clears the overlay and reloads.

## Deliberate cuts (Phase 1)

No chart library (hand-rolled SVG/divs), no framer-motion (CSS animations), no dark
mode, no mobile layout (min ~1100px), no auth, no real PDF parsing or rendering
(documents are structured seed text), no notifications/permissions/audit/bulk
actions (Phase 3 per the brief). Timeline cut order if it ever needs slimming:
minimap → hover arcs → domain animation — never the click-through or zoom.

## Suggestions for Phase 2

- Real extractor behind `ExtractionEngine`, streaming stage events.
- Explore: LLM translates question → the same QueryPlan the matcher emits today
  (grounded execution stays local; answers stay cited by construction).
- Cross-document conflict detection (the Nimbara 60-vs-30-day order-form conflict
  is seeded as the first test case).
- Calendar/Slack integrations doing what their stub cards promise.
