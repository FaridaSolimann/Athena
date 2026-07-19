import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import {
  ANSWER_SYSTEM_INSTRUCTION,
  GEMINI_MODEL,
} from "@/lib/explore/gemini-prompt";

// Step 2 of the two-step Explore flow: phrase the ALREADY-RETRIEVED results.
// The client executes the query plan locally (that's where the verification
// overlay lives) and posts the resulting facts here; the model turns them
// into 1–2 sentences and nothing else. It never sees the contract corpus,
// only what retrieval produced — so it cannot answer from its own knowledge.
// The client additionally rejects any prose whose numbers aren't in the
// context it sent (see proseNumbersAreGrounded).

const TIMEOUT_MS = 8_000;

export async function POST(request: Request) {
  let question: string;
  let context: unknown;
  try {
    const body = await request.json();
    question = String(body?.question ?? "").slice(0, 500);
    context = body?.context;
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (!question.trim() || !context || typeof context !== "object") {
    return NextResponse.json({ error: "question and context required" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ answer: null, reason: "no_key" });

  // Cap context size defensively — it should already be ≤10 rows.
  const contextJson = JSON.stringify(context).slice(0, 12_000);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `Question: ${question}\n\nRetrieved context (the only source of truth):\n${contextJson}`,
      config: {
        systemInstruction: ANSWER_SYSTEM_INSTRUCTION,
        temperature: 0,
        // Phrasing needs no reasoning budget — and thinking tokens would
        // otherwise eat maxOutputTokens and truncate the sentence.
        thinkingConfig: { thinkingBudget: 0 },
        maxOutputTokens: 300,
        abortSignal: controller.signal,
      },
    });
    const answer = response.text?.trim();
    if (!answer) return NextResponse.json({ answer: null, reason: "api_error" });
    // The prompt enforces 1–2 sentences; this is just a runaway backstop.
    return NextResponse.json({ answer: answer.slice(0, 600) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/abort/i.test(msg)) return NextResponse.json({ answer: null, reason: "timeout" });
    if (/429|quota|rate/i.test(msg))
      return NextResponse.json({ answer: null, reason: "rate_limited" });
    return NextResponse.json({ answer: null, reason: "api_error" });
  } finally {
    clearTimeout(timer);
  }
}
