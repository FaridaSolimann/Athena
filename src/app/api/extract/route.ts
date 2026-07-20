import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import mammoth from "mammoth";
import {
  EXTRACTION_SYSTEM_INSTRUCTION,
  EXTRACTION_RESPONSE_SCHEMA,
  GEMINI_MODEL,
} from "@/lib/explore/gemini-prompt";
import { assembleContract, type RawExtraction } from "@/lib/extraction/assemble";

// Real extraction: file → text → Gemini (quote-only) → server-side quote
// verification + deterministic normalization → a Contract in the seed shape.
// The client writes the result into the shared store; without a key (or on
// any failure) it falls back to the pre-authored queue so a demo never dies.

export const runtime = "nodejs";
// Real extractions run 15-25s; don't let serverless defaults kill them.
export const maxDuration = 60;

const TIMEOUT_MS = 30_000;
const MAX_TEXT_CHARS = 60_000;

type FallbackReason = "no_key" | "unreadable" | "timeout" | "invalid" | "rate_limited" | "api_error";
const fallback = (reason: FallbackReason) => {
  console.log("[extract] fallback:", reason);
  return NextResponse.json({ engine: "fallback", reason });
};

async function extractText(file: File): Promise<{ text: string; format: "pdf" | "docx"; pages: number } | null> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();
  try {
    if (name.endsWith(".pdf")) {
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: buffer });
      try {
        const result = await parser.getText();
        return { text: result.text ?? "", format: "pdf", pages: result.total ?? 1 };
      } finally {
        await parser.destroy();
      }
    }
    if (name.endsWith(".docx") || name.endsWith(".doc")) {
      const result = await mammoth.extractRawText({ buffer });
      return { text: result.value ?? "", format: "docx", pages: 1 };
    }
  } catch (err) {
    console.error("[extract] text extraction failed:", err);
    return null;
  }
  return null;
}

export async function POST(request: Request) {
  let file: File | null = null;
  try {
    const form = await request.formData();
    const candidate = form.get("file");
    if (candidate instanceof File) file = candidate;
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (!file) return NextResponse.json({ error: "file required" }, { status: 400 });
  if (file.size > 15_000_000) return NextResponse.json({ error: "file too large" }, { status: 413 });

  const extracted = await extractText(file);
  if (!extracted || extracted.text.replace(/\s+/g, "").length < 200) {
    // scanned/image-only or unreadable — the keyless path takes over
    return fallback("unreadable");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return fallback("no_key");

  const text = extracted.text.slice(0, MAX_TEXT_CHARS);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `Document text:\n\n${text}`,
      config: {
        systemInstruction: EXTRACTION_SYSTEM_INSTRUCTION,
        temperature: 0,
        responseMimeType: "application/json",
        responseSchema: EXTRACTION_RESPONSE_SCHEMA,
        abortSignal: controller.signal,
      },
    });
    const body = response.text;
    if (!body) return fallback("api_error");

    let raw: RawExtraction;
    try {
      raw = JSON.parse(body);
    } catch {
      return fallback("invalid");
    }
    if (!raw || !Array.isArray(raw.fields) || raw.fields.length === 0) {
      return fallback("invalid");
    }

    const contract = assembleContract({
      raw,
      text,
      filename: file.name,
      format: extracted.format,
      pages: extracted.pages,
    });
    return NextResponse.json({ engine: "gemini", contract });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/abort/i.test(msg)) return fallback("timeout");
    if (/429|quota|rate/i.test(msg)) return fallback("rate_limited");
    return fallback("api_error");
  } finally {
    clearTimeout(timer);
  }
}
