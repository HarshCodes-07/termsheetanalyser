import { NextResponse } from "next/server";
import { readCurrentUsage } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function GET() {
  const { usage } = await readCurrentUsage();
  return NextResponse.json({ usage });
}

export async function POST() {
  return NextResponse.json(
    { error: "Method not allowed." },
    { status: 405 }
  );
}
