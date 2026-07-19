# How Athena was built — iteration log

**Iteration 0 — Framing before code.**
Analyzed the grading criteria and made the sharp-angle decisions up front: one
interface for three personas with **no persona switch** (progressive disclosure
instead: every screen leads with a plain-language answer, opens into
obligations, and terminates in the source clause); a **trust primitive** as the
core mechanic; hand-crafted realistic data as a graded deliverable. Invented
the product fiction (Vantora Labs, a Denver climate-risk analytics company,
six named users, three teams) and derived the design system from a reference
visual language rather than building a generic dashboard.

**Iteration 1 — Phase 1 core.**
Built the foundation in nine demo-able milestones: a hand-authored corpus of
17 contracts with full clause text and *machine-checked math*
(`scripts/check-seed.ts` asserts the $8.48M portfolio, the 30% concentration,
the 13-days-out renewal deadline, and that every cited excerpt exists verbatim
in its document); the `TrustedFact` component as the only way an extracted
value ever renders (value + confidence + click-through to the highlighted
clause); tasks and alerts **derived** from contract data rather than stored,
so verifying a field auto-resolves its review task; a simulated upload flow; a
deterministic natural-language Explore; and the Obligations Timeline as the
signature interaction. All three required user flows were verified end-to-end
in a real browser before shipping.

**Iteration 2 — Review-driven UX ordering.**
Small changes from using the product: the Obligations Timeline became the
default Insights tab (it's the most novel view), Explore moved above
Tasks & Alerts in the navigation, and the logo became a home link.

**Iteration 3 — Live AI without giving up trust.**
Added Gemini to Explore under one rule: *the model translates, it never
answers.* Both the model and the built-in pattern matcher emit the same small,
whitelisted **QueryPlan DSL**; a shared local engine executes plans against
the user's actual (correction-aware) data, so every answer stays a computed,
cited fact. Plans are validated twice (server and client), and every failure
mode — no key, timeout, invalid plan, rate limit — degrades silently to the
deterministic engine. The footer under each answer discloses which engine read
the question.

**Iteration 4 — Written answers, grounded by construction.**
Split answering into two steps: retrieve locally, then have Gemini phrase
1–2 sentences from *only* the retrieved facts (names, normalized values,
clause snippets, and code-computed totals). A **numbers guardrail** rejects
any generated sentence containing a figure not present in the supplied
context. Keyless users get parity through enumerated template answers
("…: Bramblewood ($23,250), Aldervik ($237,600)…"). Live testing surfaced and
fixed real integration issues: structured-output schemas needed required
fields and property ordering, and thinking-token budgets were truncating
sentences.

**Iteration 5 — Real uploads.**
Replaced upload theater with a genuine pipeline: PDF/DOCX text extraction →
Gemini extracts *quotes only* → the server string-verifies every quote against
the document (an unverified quote is capped at low confidence and shown
without a source — never presented as solid) → values are normalized
deterministically in code (currency at a dated rate, word-durations to days,
formula caps routed to review, the notice deadline computed, never modeled).
The result is a contract in the exact seed shape, written into the one shared
store — so it appears in the Repository, Search, Insights, Explore, and the
review queue with real clause highlighting. Search was widened to match
extracted values and clause text across all contracts, including in-review
ones.

**Iteration 6 — Hardening from real use.**
Every bug found by actually using the product was fixed and shipped the same
day: a modal stretched by long contract names; a cramped assignee menu;
timeline cluster circles that zoomed into a dead end (now they open an event
list) and popovers clipped by the chart; uploaded contracts not appearing
until reload (a stale memo dependency) plus "Uploaded" badges and source
filenames for recognition; a file-picker click swallowed by event bubbling
(also the cause of duplicate uploads); and a global **"Gemini credits
exhausted"** health pill so quota exhaustion is visible on every dashboard
instead of failing silently. A unified Create Task/Alert modal with an honest
"notify via Slack/Email" placeholder rounded out the manual workflows.

**Throughlines.** Three habits ran through every iteration: *invariants over
intentions* (the demo math and the Explore behaviors are locked by scripts run
after every change), *honesty as UX* (fallbacks, previews, and degraded states
are labeled, never faked), and *verify in the browser* (every feature was
driven end-to-end in a real session before it shipped).
