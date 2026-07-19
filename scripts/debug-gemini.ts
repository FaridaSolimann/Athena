// Dev utility: inspect the raw QueryPlan Gemini returns for a question.
// Usage: GEMINI_API_KEY=... npx tsx scripts/debug-gemini.ts "your question"
import { GoogleGenAI } from "@google/genai";
import { buildSystemInstruction, PLAN_RESPONSE_SCHEMA } from "../src/lib/explore/gemini-prompt";
import { validatePlan } from "../src/lib/explore/plan";

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("set GEMINI_API_KEY");
  const ai = new GoogleGenAI({ apiKey });
  const question = process.argv[2] ?? "Which vendor contracts have a liability cap below one million dollars?";
  try {
    const r = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: question,
      config: {
        systemInstruction: buildSystemInstruction(),
        temperature: 0,
        responseMimeType: "application/json",
        responseSchema: PLAN_RESPONSE_SCHEMA,
      },
    });
    console.log("RAW:", r.text);
    console.log("VALIDATION:", JSON.stringify(validatePlan(JSON.parse(r.text ?? "{}")), null, 2));
  } catch (e) {
    console.log("ERROR:", (e as Error).message.slice(0, 800));
  }
}

main();
