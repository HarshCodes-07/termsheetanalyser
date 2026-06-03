import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DAILY_ANALYSIS_LIMIT, USAGE_COOKIE_NAME } from "./constants";
import type { UsageInfo } from "./types";

function getSigningSecret(): string {
  const secret =
    process.env.RATE_LIMIT_SECRET ||
    process.env.GEMINI_API_KEY ||
    "dev-insecure-rate-limit-secret";
  return secret;
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function nextMidnightUtcIso(): string {
  const now = new Date();
  const tomorrow = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  );
  return tomorrow.toISOString();
}

function sign(payload: string): string {
  return createHmac("sha256", getSigningSecret())
    .update(payload)
    .digest("base64url");
}

function verifySignature(payload: string, signature: string): boolean {
  const expected = sign(payload);
  try {
    const a = Buffer.from(signature, "base64url");
    const b = Buffer.from(expected, "base64url");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function parseUsageCookie(
  value: string | undefined
): { count: number } {
  if (!value) return { count: 0 };

  const dot = value.indexOf(".");
  if (dot === -1) return { count: 0 };

  const payloadB64 = value.slice(0, dot);
  const sig = value.slice(dot + 1);

  let payload: string;
  try {
    payload = Buffer.from(payloadB64, "base64url").toString("utf8");
  } catch {
    return { count: 0 };
  }

  if (!verifySignature(payload, sig)) return { count: 0 };

  try {
    const data = JSON.parse(payload) as { d?: string; c?: number };
    if (data.d !== todayUtc()) return { count: 0 };
    const count =
      typeof data.c === "number" && data.c >= 0
        ? Math.min(Math.floor(data.c), DAILY_ANALYSIS_LIMIT + 10)
        : 0;
    return { count };
  } catch {
    return { count: 0 };
  }
}

export function serializeUsageCookie(count: number): string {
  const payload = JSON.stringify({ d: todayUtc(), c: count });
  return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

export function buildUsageInfo(count: number): UsageInfo {
  const used = Math.min(Math.max(0, count), DAILY_ANALYSIS_LIMIT);
  return {
    used,
    limit: DAILY_ANALYSIS_LIMIT,
    remaining: Math.max(0, DAILY_ANALYSIS_LIMIT - used),
    resetsAt: nextMidnightUtcIso(),
  };
}

export async function readCurrentUsage(): Promise<{
  count: number;
  usage: UsageInfo;
}> {
  const store = await cookies();
  const raw = store.get(USAGE_COOKIE_NAME)?.value;
  const { count } = parseUsageCookie(raw);
  return { count, usage: buildUsageInfo(count) };
}

export function attachUsageCookie(
  response: NextResponse,
  count: number
): NextResponse {
  response.cookies.set(USAGE_COOKIE_NAME, serializeUsageCookie(count), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return response;
}
