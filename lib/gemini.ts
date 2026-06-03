import { buildUserPrompt } from "./prompt";
import {
  isNotTermsheetPayload,
  parseGeminiAnalysis,
  parseGeminiNotTermsheet,
} from "./validation";
import type { Analysis, NotTermsheet } from "./types";

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export function isPlaceholderKey(key: string): boolean {
  return !key || key.trim().length < 10 || key.trim().toLowerCase() === "xyz";
}

export function isDevSampleMode(apiKey: string): boolean {
  return isPlaceholderKey(apiKey) && process.env.NODE_ENV !== "production";
}

function extractJson(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced && fenced[1]) return fenced[1].trim();
  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    return trimmed.slice(first, last + 1);
  }
  return trimmed;
}

export type GeminiResult =
  | { kind: "analysis"; analysis: Analysis }
  | { kind: "notTermsheet"; notTermsheet: NotTermsheet };

export async function callGemini(
  termsheetText: string,
  apiKey: string,
  signal?: AbortSignal
): Promise<GeminiResult> {
  const prompt = buildUserPrompt(termsheetText);

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        responseMimeType: "application/json",
      },
    }),
    signal,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(
      `Gemini API error (${res.status}): ${errText.slice(0, 300)}`
    );
  }

  const data = (await res.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJson(text));
  } catch {
    throw new Error("Gemini response was not valid JSON.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Gemini response was not an object.");
  }

  const obj = parsed as Record<string, unknown>;

  if (isNotTermsheetPayload(obj)) {
    return {
      kind: "notTermsheet",
      notTermsheet: parseGeminiNotTermsheet(obj),
    };
  }

  return { kind: "analysis", analysis: parseGeminiAnalysis(obj) };
}

export function toUserFacingGeminiError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);

  if (err instanceof Error && err.name === "AbortError") {
    return "Analysis was cancelled.";
  }
  if (/API error \(401\)|API error \(403\)|invalid.*api.*key/i.test(raw)) {
    return "The analysis service is not configured correctly. Please try again later.";
  }
  if (/API error \(429\)|quota|rate limit/i.test(raw)) {
    return "The analysis service is busy. Please wait a moment and try again.";
  }
  if (/API error \(5\d\d\)/.test(raw)) {
    return "The analysis service is temporarily unavailable. Please try again in a few minutes.";
  }
  if (
    /empty response|not valid JSON|did not match|ZodError|Invalid input/i.test(
      raw
    )
  ) {
    return "We received an unexpected response from the analysis service. Please try again.";
  }

  return "We couldn't analyse your termsheet right now. Please try again.";
}
