"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Sparkles, CornerDownLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { runExplore, type ExploreContext } from "@/lib/explore/engine";
import { SUGGESTED_QUESTIONS } from "@/lib/explore/suggestions";
import { ResultCard } from "@/components/explore/ResultCard";
import { useEffectiveContracts } from "@/lib/selectors";
import { useOverlay } from "@/lib/store";

function ExploreInner() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [asked, setAsked] = useState(params.get("q") ?? "");
  const verifications = useOverlay((s) => s.fieldVerifications);
  const recentQueries = useOverlay((s) => s.recentQueries);
  const pushRecentQuery = useOverlay((s) => s.pushRecentQuery);
  const effective = useEffectiveContracts();

  const ctx: ExploreContext = useMemo(
    () => ({ contracts: effective.map((e) => e.contract), verifications }),
    [effective, verifications]
  );

  const result = useMemo(() => (asked ? runExplore(asked, ctx) : null), [asked, ctx]);

  const ask = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setAsked(trimmed);
    pushRecentQuery(trimmed);
  };

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
          onKeyDown={(e) => e.key === "Enter" && ask(query)}
          placeholder="e.g. Which vendor contracts have a liability cap below $1M?"
          className="h-11 pl-10 pr-24 text-[14px]"
        />
        <Button
          onClick={() => ask(query)}
          className="absolute right-1.5 top-1/2 h-8 -translate-y-1/2 px-3 text-xs"
        >
          Ask
          <CornerDownLeft className="size-3" />
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

      {asked && result && (
        <div className="mt-5">
          <p className="text-[11.5px] text-muted-foreground">
            Read as: {result.interpretation}
          </p>
          <div className="mt-2 rounded-lg border border-primary/25 bg-accent/60 p-4">
            <p className="text-[14.5px] font-semibold leading-relaxed">{result.answer}</p>
          </div>
          <div className="mt-3 grid gap-2">
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

      {asked && !result && (
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
