import { NextResponse } from "next/server";
import { buildUserPrompt } from "@/lib/prompt";
import { SAMPLE_ANALYSIS } from "@/lib/sample";
import type {
  Analysis,
  AnalyseResponse,
  NotTermsheet,
  NotTermsheetType,
} from "@/lib/types";

export const runtime = "nodejs";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const MIN_CHARS = 40;
const MAX_CHARS = 120_000;

function isPlaceholderKey(key: string) {
  return !key || key.trim().length < 10 || key.trim().toLowerCase() === "xyz";
}

const NOT_TERMSHEET_TYPES: NotTermsheetType[] = [
  "parody",
  "joke",
  "unrelated_document",
  "wrong_contract",
  "resume",
  "marketing",
  "recipe",
  "lyrics",
  "gibberish",
  "blank",
  "prompt_injection",
  "offensive",
  "unknown",
];

function toStringSafe(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function toStringArraySafe(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

function coerceNotTermsheet(raw: Record<string, unknown>): NotTermsheet {
  const rawType = toStringSafe(raw.detectedType, "unknown");
  const detectedType: NotTermsheetType = (
    NOT_TERMSHEET_TYPES as string[]
  ).includes(rawType)
    ? (rawType as NotTermsheetType)
    : "unknown";

  const whatToDoNext = toStringArraySafe(raw.whatToDoNext);

  return {
    detectedType,
    detectedTypeLabel: toStringSafe(
      raw.detectedTypeLabel,
      "This doesn't look like a termsheet"
    ),
    headline: toStringSafe(
      raw.headline,
      "This doesn't look like a real termsheet."
    ),
    whyNotTermsheet: toStringSafe(
      raw.whyNotTermsheet,
      "We couldn't find the usual investment, valuation or board terms that a real termsheet would have."
    ),
    documentLooksLike: toStringSafe(
      raw.documentLooksLike,
      "We couldn't classify the document with confidence."
    ),
    funniestClauseOrLine: toStringSafe(raw.funniestClauseOrLine, ""),
    whatToDoNext:
      whatToDoNext.length > 0
        ? whatToDoNext
        : [
            "Upload the actual investment termsheet your investor sent you.",
            "Try the sample termsheet to see what a real analysis looks like.",
          ],
    shareableQuip: toStringSafe(raw.shareableQuip, ""),
    disclaimer: toStringSafe(
      raw.disclaimer,
      "This is an AI-generated read of your document, not legal advice."
    ),
  };
}

function coerceAnalysis(raw: unknown): Analysis | null {
  if (!raw || typeof raw !== "object") return null;
  const a = raw as Record<string, unknown>;
  const required = [
    "overallVerdict",
    "safetyScore",
    "scoreLabel",
    "oneLineSummary",
    "plainEnglishSummary",
    "redFlags",
    "greenFlags",
    "negotiationPoints",
    "investorFriendlyTerms",
    "founderFriendlyTerms",
    "missingOrUnclearTerms",
    "shareableSummary",
    "disclaimer",
  ];
  for (const key of required) {
    if (!(key in a)) return null;
  }
  return a as unknown as Analysis;
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

type GeminiResult =
  | { kind: "analysis"; analysis: Analysis }
  | { kind: "notTermsheet"; notTermsheet: NotTermsheet };

async function callGemini(termsheetText: string): Promise<GeminiResult> {
  const prompt = buildUserPrompt(termsheetText);

  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        responseMimeType: "application/json",
      },
    }),
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

  const jsonText = extractJson(text);
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("Gemini response was not valid JSON.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Gemini response was not an object.");
  }

  const obj = parsed as Record<string, unknown>;

  if (obj.isTermsheet === false) {
    return { kind: "notTermsheet", notTermsheet: coerceNotTermsheet(obj) };
  }

  const analysis = coerceAnalysis(obj);
  if (!analysis) {
    throw new Error("Gemini response did not match the expected schema.");
  }
  return { kind: "analysis", analysis };
}

export async function POST(request: Request) {
  let body: { termsheetText?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const text = (body.termsheetText ?? "").toString().trim();
  if (!text) {
    return NextResponse.json(
      { error: "termsheetText is required." },
      { status: 400 }
    );
  }
  if (text.length < MIN_CHARS) {
    return NextResponse.json(
      {
        error:
          "Termsheet is too short. Please paste more text or upload a fuller document.",
      },
      { status: 400 }
    );
  }

  const safeText = text.slice(0, MAX_CHARS);

  if (isPlaceholderKey(GEMINI_API_KEY)) {
    const response: AnalyseResponse = {
      kind: "analysis",
      analysis: SAMPLE_ANALYSIS,
      source: "sample",
      note: "Gemini API key is a placeholder. Returning sample analysis so the UI is fully testable. Replace GEMINI_API_KEY in app/api/analyse/route.ts to enable real analysis.",
    };
    return NextResponse.json(response, { status: 200 });
  }

  try {
    const result = await callGemini(safeText);
    if (result.kind === "notTermsheet") {
      const response: AnalyseResponse = {
        kind: "notTermsheet",
        notTermsheet: result.notTermsheet,
        source: "gemini",
      };
      return NextResponse.json(response, { status: 200 });
    }
    const response: AnalyseResponse = {
      kind: "analysis",
      analysis: result.analysis,
      source: "gemini",
    };
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const response: AnalyseResponse = {
      kind: "analysis",
      analysis: SAMPLE_ANALYSIS,
      source: "sample",
      note: `Gemini call failed (${message}). Showing sample analysis so the UI stays testable.`,
    };
    return NextResponse.json(response, { status: 200 });
  }
}
