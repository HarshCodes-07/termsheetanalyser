import { NextResponse } from "next/server";
import {
  DAILY_ANALYSIS_LIMIT,
  MAX_REQUEST_BODY_BYTES,
  MAX_TERMSHEET_CHARS,
  MIN_TERMSHEET_CHARS,
} from "@/lib/constants";
import {
  callGemini,
  isPlaceholderKey,
  toUserFacingGeminiError,
} from "@/lib/gemini";
import {
  attachUsageCookie,
  buildUsageInfo,
  readCurrentUsage,
} from "@/lib/rate-limit";
import { SAMPLE_ANALYSIS } from "@/lib/sample";
import type { AnalyseResponse } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

function jsonWithUsage<T extends object>(
  body: T,
  count: number,
  status = 200
): NextResponse {
  const response = NextResponse.json(body, { status });
  return attachUsageCookie(response, count);
}

export async function POST(request: Request) {
  const contentLength = request.headers.get("content-length");
  if (
    contentLength &&
    Number.parseInt(contentLength, 10) > MAX_REQUEST_BODY_BYTES
  ) {
    return NextResponse.json(
      { error: "Request body is too large." },
      { status: 413 }
    );
  }

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
  if (text.length < MIN_TERMSHEET_CHARS) {
    return NextResponse.json(
      {
        error:
          "Termsheet is too short. Please paste more text or upload a fuller document.",
      },
      { status: 400 }
    );
  }

  const safeText = text.slice(0, MAX_TERMSHEET_CHARS);

  if (isPlaceholderKey(GEMINI_API_KEY)) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          error:
            "Analysis service is temporarily unavailable. Please try again later.",
        },
        { status: 503 }
      );
    }

    const response: AnalyseResponse = {
      kind: "analysis",
      analysis: SAMPLE_ANALYSIS,
      source: "sample",
      note: "Development sample mode — set GEMINI_API_KEY for real analysis.",
    };
    return NextResponse.json(response, { status: 200 });
  }

  const { count: currentCount } = await readCurrentUsage();
  if (currentCount >= DAILY_ANALYSIS_LIMIT) {
    const usage = buildUsageInfo(currentCount);
    const response = NextResponse.json(
      {
        error: `Daily limit reached. You have used all ${DAILY_ANALYSIS_LIMIT} free analyses today.`,
        usage,
        code: "DAILY_LIMIT",
      },
      { status: 429 }
    );
    return attachUsageCookie(response, currentCount);
  }

  const newCount = currentCount + 1;

  try {
    const result = await callGemini(safeText, GEMINI_API_KEY);

    if (result.kind === "notTermsheet") {
      const response: AnalyseResponse = {
        kind: "notTermsheet",
        notTermsheet: result.notTermsheet,
        source: "gemini",
        usage: buildUsageInfo(newCount),
      };
      return jsonWithUsage(response, newCount);
    }

    const response: AnalyseResponse = {
      kind: "analysis",
      analysis: result.analysis,
      source: "gemini",
      usage: buildUsageInfo(newCount),
    };
    return jsonWithUsage(response, newCount);
  } catch (err) {
    console.error("[analyse] Gemini error:", err);
    const refundedCount = Math.max(0, currentCount);
    const response = NextResponse.json(
      {
        error: toUserFacingGeminiError(err),
        usage: buildUsageInfo(refundedCount),
      },
      { status: 502 }
    );
    return attachUsageCookie(response, refundedCount);
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
