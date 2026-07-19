import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { validatePlan } from "@/lib/explore/plan";
import {
  buildSystemInstruction,
  PLAN_RESPONSE_SCHEMA,
} from "@/lib/explore/gemini-prompt";

// Translation-only endpoint: question in, validated QueryPlan out.
// It NEVER executes plans or computes answers — the client does that against
// effective state (which includes the local verification overlay this server
// can't see). Any failure degrades to {engine:"fallback"} and the client's
// deterministic matcher takes over; the app runs fully without a key.

/** The one place the model id lives. gemini-flash-latest also works; we pin
 * the current GA Flash explicitly so behavior doesn't shift under us. */
const GEMINI_MODEL = "gemini-3.5-flash";

// Warm calls run 2–4s; the budget leaves headroom for cold starts without
// letting a hung call stall the page (the client aborts at 10s regardless).
const TIMEOUT_MS = 8_000;

type FallbackReason =
  | "no_key"
  | "timeout"
  | "invalid_plan"
  | "out_of_scope"
  | "rate_limited"
  | "api_error";

const fallback = (reason: FallbackReason) =>
  NextResponse.json({ engine: "fallback", reason });

export async function POST(request: Request) {
  let question: string;
  try {
    const body = await request.json();
    question = String(body?.question ?? "").slice(0, 500);
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (!question.trim()) {
    return NextResponse.json({ error: "empty question" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return fallback("no_key");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: question,
      config: {
        systemInstruction: buildSystemInstruction(),
        temperature: 0,
        responseMimeType: "application/json",
        responseSchema: PLAN_RESPONSE_SCHEMA,
        abortSignal: controller.signal,
      },
    });

    const text = response.text;
    if (!text) return fallback("api_error");

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return fallback("invalid_plan");
    }

    const validation = validatePlan(parsed);
    if (!validation.ok) {
      return fallback(validation.error === "out_of_scope" ? "out_of_scope" : "invalid_plan");
    }
    return NextResponse.json({ engine: "gemini", plan: validation.plan });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/abort/i.test(msg)) return fallback("timeout");
    if (/429|quota|rate/i.test(msg)) return fallback("rate_limited");
    return fallback("api_error");
  } finally {
    clearTimeout(timer);
  }
}
