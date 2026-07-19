"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Sparkles, CornerDownLeft, LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { buildFallbackPlan, type ExploreContext } from "@/lib/explore/engine";
import { answerFor, describePlan, executePlan } from "@/lib/explore/execute";
import {
  buildAnswerContext,
  proseNumbersAreGrounded,
} from "@/lib/explore/answer-context";
import { validatePlan, type QueryPlan } from "@/lib/explore/plan";
import { SUGGESTED_QUESTIONS } from "@/lib/explore/suggestions";
import { ResultCard } from "@/components/explore/ResultCard";
import { useEffectiveContracts } from "@/lib/selectors";
import { useOverlay } from "@/lib/store";
import { reportAiReason, useUi } from "@/lib/ui";

type Asked =
  | { plan: QueryPlan; engine: "gemini" | "fallback"; reason?: string }
  | { plan: null; engine: "fallback"; reason?: string };

function ExploreInner() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [asked, setAsked] = useState<string>("");
  const [outcome, setOutcome] = useState<Asked | null>(null);
  const [loading, setLoading] = useState(false);
  const requestRef = useRef(0);
  const verifications = useOverlay((s) => s.fieldVerifications);
  const recentQueries = useOverlay((s) => s.recentQueries);
  const pushRecentQuery = useOverlay((s) => s.pushRecentQuery);
  const effective = useEffectiveContracts();

  const ctx: ExploreContext = useMemo(
    () => ({ contracts: effective.map((e) => e.contract), verifications }),
    [effective, verifications]
  );
  const ctxRef = useRef(ctx);
  ctxRef.current = ctx;

  const ask = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setAsked(trimmed);
    pushRecentQuery(trimmed);
    setLoading(true);
    const requestId = ++requestRef.current;

    // Ask the server to translate the question into a plan (Gemini). Any
    // failure — no key, timeout, invalid plan — falls back to the local
    // pattern matcher. Execution is always local either way.
    let plan: QueryPlan | null = null;
    let engine: "gemini" | "fallback" = "fallback";
    let reason: string | undefined;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10_000);
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      const data = await res.json();
      if (data?.engine === "gemini" && data.plan) {
        const v = validatePlan(data.plan); // never trust the wire
        if (v.ok) {
          plan = v.plan;
          engine = "gemini";
          useUi.getState().reportAiHealth("ok");
        }
      } else if (typeof data?.reason === "string") {
        reason = data.reason;
        reportAiReason(reason);
      }
    } catch {
      // network/timeout — fall through to the matcher
    }

    if (requestId !== requestRef.current) return; // a newer question superseded us

    if (!plan) {
      plan = buildFallbackPlan(trimmed, ctxRef.current);
      engine = "fallback";
    }
    setOutcome(plan ? { plan, engine, reason } : { plan: null, engine: "fallback", reason });
    setLoading(false);
  };

  // Support deep links like /explore?q=…
  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const q = params.get("q");
    if (q) void ask(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-execute the current plan whenever effective state changes — verifying
  // or correcting a term updates the answer without re-asking.
  const result = useMemo(() => {
    if (!outcome?.plan) return null;
    const exec = executePlan(outcome.plan, ctx);
    return {
      exec,
      interpretation: describePlan(outcome.plan),
      answer: answerFor(outcome.plan, exec, ctx),
      rows: exec.rows,
    };
  }, [outcome, ctx]);

  // Step 2: have Gemini phrase the retrieved results. The template answer
  // shows immediately; the prose swaps in when it arrives. If a correction
  // later changes the numbers, the stale prose is dropped automatically
  // (it's keyed to the template it was generated alongside).
  const [prose, setProse] = useState<{ text: string; forAnswer: string } | null>(null);
  useEffect(() => {
    setProse(null);
    if (!outcome?.plan || !asked) return;
    const plan = outcome.plan;
    const requestId = ++requestRef.current;
    const exec = executePlan(plan, ctxRef.current);
    if (exec.rows.length === 0 && !exec.agg) return; // nothing to phrase
    const templateAnswer = answerFor(plan, exec, ctxRef.current);
    const context = buildAnswerContext(plan, exec, ctxRef.current, describePlan(plan));
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    fetch("/api/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: asked, context }),
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        if (requestId !== requestRef.current) return;
        const text = typeof data?.answer === "string" ? data.answer.trim() : null;
        if (!text && data?.reason) reportAiReason(data.reason);
        // The numbers guardrail: prose with any figure not present in the
        // retrieved context is discarded in favor of the template.
        if (text && proseNumbersAreGrounded(text, context)) {
          useUi.getState().reportAiHealth("ok");
          setProse({ text, forAnswer: templateAnswer });
        }
      })
      .catch(() => {})
      .finally(() => clearTimeout(timer));
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome, asked]);

  const proseShown = prose && result && prose.forAnswer === result.answer;

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8">
      <div className="mb-1 flex items-center gap-2">
        <Sparkles className="size-4 text-primary" />
        <h2 className="text-lg font-semibold tracking-tight">Ask your contracts</h2>
      </div>
      <p className="mb-4 text-[13px] text-muted-foreground">
        Plain-language questions over terms, dates, renewals, and financials — every
        answer cites the clauses it rests on.
      </p>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && ask(query)}
          placeholder="e.g. Which vendor contracts have a liability cap below $1M?"
          className="h-11 pl-10 pr-24 text-[14px]"
        />
        <Button
          onClick={() => ask(query)}
          disabled={loading}
          className="absolute right-1.5 top-1/2 h-8 -translate-y-1/2 px-3 text-xs"
        >
          {loading ? (
            <>
              Reading
              <LoaderCircle className="size-3 animate-spin" />
            </>
          ) : (
            <>
              Ask
              <CornerDownLeft className="size-3" />
            </>
          )}
        </Button>
      </div>

      {!asked && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Try asking
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => ask(q)}
                className="rounded-full border bg-card px-3 py-1.5 text-xs text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary"
              >
                {q}
              </button>
            ))}
          </div>
          {recentQueries.length > 0 && (
            <>
              <p className="mb-2 mt-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Recent
              </p>
              <div className="flex flex-wrap gap-1.5">
                {recentQueries.map((q) => (
                  <button
                    key={q}
                    onClick={() => ask(q)}
                    className="rounded-full border border-dashed bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {asked && !loading && result && outcome && (
        <div className="mt-5">
          <p className="text-[11.5px] text-muted-foreground">
            Read as:{" "}
            <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">
              {result.interpretation}
            </span>
          </p>
          <div className="mt-2 rounded-lg border border-primary/25 bg-accent/60 p-4">
            <p className="text-[14.5px] font-semibold leading-relaxed">
              {proseShown ? prose.text : result.answer}
            </p>
          </div>
          <p className="mt-1.5 text-right text-[11px] text-muted-foreground">
            {proseShown
              ? "written by Gemini from the retrieved results — every number computed locally"
              : outcome.engine === "gemini"
                ? "answered by Gemini — plan executed locally against your contracts"
                : `answered by pattern matching${outcome.reason === "no_key" ? " (no API key)" : outcome.reason === "rate_limited" ? " (Gemini rate-limited)" : ""}`}
          </p>
          <div className="mt-2 grid gap-2">
            {result.rows.map((row, i) => (
              <ResultCard key={`${row.contractId}-${i}`} row={row} />
            ))}
            {result.rows.length === 0 && (
              <div className="rounded-lg border border-dashed p-6 text-center text-[13px] text-muted-foreground">
                No contracts match — which is itself worth knowing.
              </div>
            )}
          </div>
        </div>
      )}

      {asked && !loading && outcome && !outcome.plan && (
        <div className="mt-5 rounded-lg border p-5">
          <p className="text-[13.5px] font-medium">
            Athena couldn't map that question to the contract data.
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
            It answers questions about terms, dates, renewals, financials, risks, and
            review status across {ctx.contracts.length} contracts. Try one of these:
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {SUGGESTED_QUESTIONS.slice(0, 6).map((q) => (
              <button
                key={q}
                onClick={() => ask(q)}
                className="rounded-full border bg-card px-3 py-1.5 text-xs text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense>
      <ExploreInner />
    </Suspense>
  );
}
