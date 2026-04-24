"use client";

import type { NotTermsheet, NotTermsheetType } from "@/lib/types";
import { CopyButton } from "./CopyButton";

interface Props {
  notTermsheet: NotTermsheet;
  source: "gemini" | "sample";
  note?: string;
  onStartOver: () => void;
  onUseSample: () => void;
}

type Vibe = {
  emoji: string;
  chipLabel: string;
  chipClass: string;
};

const VIBES: Record<NotTermsheetType, Vibe> = {
  parody: {
    emoji: "🃏",
    chipLabel: "Parody document",
    chipClass: "chip-warning",
  },
  joke: {
    emoji: "😄",
    chipLabel: "Joke / Satire",
    chipClass: "chip-warning",
  },
  unrelated_document: {
    emoji: "📄",
    chipLabel: "Unrelated document",
    chipClass: "chip-muted",
  },
  wrong_contract: {
    emoji: "📜",
    chipLabel: "Wrong kind of contract",
    chipClass: "chip-muted",
  },
  resume: {
    emoji: "🧑‍💼",
    chipLabel: "Looks like a resume",
    chipClass: "chip-muted",
  },
  marketing: {
    emoji: "📣",
    chipLabel: "Marketing copy",
    chipClass: "chip-muted",
  },
  recipe: {
    emoji: "🍳",
    chipLabel: "Looks like a recipe",
    chipClass: "chip-muted",
  },
  lyrics: {
    emoji: "🎵",
    chipLabel: "Lyrics or poem",
    chipClass: "chip-muted",
  },
  gibberish: {
    emoji: "🔀",
    chipLabel: "Random text",
    chipClass: "chip-muted",
  },
  blank: {
    emoji: "📭",
    chipLabel: "Empty document",
    chipClass: "chip-muted",
  },
  prompt_injection: {
    emoji: "🛡️",
    chipLabel: "Prompt injection attempt",
    chipClass: "chip-danger",
  },
  offensive: {
    emoji: "🛑",
    chipLabel: "Unsafe content",
    chipClass: "chip-danger",
  },
  unknown: {
    emoji: "🤔",
    chipLabel: "Not a termsheet",
    chipClass: "chip-muted",
  },
};

export function NotTermsheetView({
  notTermsheet,
  source,
  note,
  onStartOver,
  onUseSample,
}: Props) {
  const vibe = VIBES[notTermsheet.detectedType] ?? VIBES.unknown;

  return (
    <div className="space-y-6">
      {source === "sample" && note && (
        <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-accent-soft)] px-4 py-3 text-sm text-[color:var(--color-accent-hover)]">
          <span className="font-medium">Sample mode:</span>{" "}
          <span className="text-[color:var(--color-foreground)]/80">{note}</span>
        </div>
      )}

      <div
        className="relative overflow-hidden rounded-2xl border p-6 sm:p-10"
        style={{
          background:
            "radial-gradient(circle at 15% 0%, rgba(234, 91, 12, 0.10), transparent 55%), radial-gradient(circle at 85% 20%, rgba(184, 114, 31, 0.08), transparent 50%), linear-gradient(180deg, #fff9f1 0%, #fbf4e9 100%)",
          borderColor: "var(--color-border)",
          boxShadow:
            "0 1px 0 rgba(16, 12, 8, 0.02), 0 20px 48px -28px rgba(82, 54, 20, 0.25)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #1a1715 0 1px, transparent 1px 14px)",
          }}
        />

        <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
          <div
            className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl shrink-0 text-4xl sm:text-5xl"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              boxShadow:
                "0 1px 0 rgba(16, 12, 8, 0.02), 0 10px 24px -16px rgba(82, 54, 20, 0.25)",
            }}
            aria-hidden
          >
            <span>{vibe.emoji}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`chip ${vibe.chipClass}`}>
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: "currentColor" }}
                />
                {notTermsheet.detectedTypeLabel || vibe.chipLabel}
              </span>
              <span className="chip chip-muted">Not analysed</span>
            </div>
            <h1 className="mt-3 text-[26px] sm:text-[32px] leading-[1.1] font-semibold tracking-tight">
              {notTermsheet.headline}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--color-muted)] max-w-[640px]">
              {notTermsheet.whyNotTermsheet}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-soft p-5 sm:p-6">
          <h3 className="text-sm uppercase tracking-wider text-[color:var(--color-muted)] font-medium">
            What we saw
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed">
            {notTermsheet.documentLooksLike}
          </p>

          {notTermsheet.funniestClauseOrLine &&
            notTermsheet.funniestClauseOrLine.trim().length > 0 && (
              <figure className="mt-5 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]/70 p-4">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[color:var(--color-muted)] font-medium">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M3 21c3 0 7-1 7-8V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h3" />
                    <path d="M15 21c3 0 7-1 7-8V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h3" />
                  </svg>
                  Most questionable line
                </div>
                <blockquote className="mt-2 text-[14.5px] italic leading-relaxed text-[color:var(--color-foreground)]/90">
                  {notTermsheet.funniestClauseOrLine}
                </blockquote>
              </figure>
            )}
        </div>

        <div className="card-soft p-5 sm:p-6">
          <h3 className="text-sm uppercase tracking-wider text-[color:var(--color-muted)] font-medium">
            What to do next
          </h3>
          <ul className="mt-3 space-y-3">
            {notTermsheet.whatToDoNext.map((step, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-[14.5px] leading-relaxed"
              >
                <span
                  className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full shrink-0 text-[11px] font-semibold"
                  style={{
                    background: "var(--color-accent-soft)",
                    color: "var(--color-accent-hover)",
                    border: "1px solid #f8d6b5",
                  }}
                  aria-hidden
                >
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {notTermsheet.shareableQuip &&
        notTermsheet.shareableQuip.trim().length > 0 && (
          <div className="card-soft p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="text-sm uppercase tracking-wider text-[color:var(--color-muted)] font-medium">
                Shareable one-liner
              </h3>
              <CopyButton text={notTermsheet.shareableQuip} />
            </div>
            <p className="text-[15px] leading-relaxed text-[color:var(--color-foreground)]/90">
              &ldquo;{notTermsheet.shareableQuip}&rdquo;
            </p>
          </div>
        )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <p className="text-xs leading-relaxed text-[color:var(--color-muted)] max-w-2xl">
          {notTermsheet.disclaimer}
        </p>

        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <button
            type="button"
            onClick={onUseSample}
            className="btn-ghost inline-flex items-center justify-center gap-2 px-3.5 py-2 text-sm"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Try sample termsheet
          </button>

          <button
            type="button"
            onClick={onStartOver}
            className="btn-accent inline-flex items-center justify-center gap-2 px-4 py-2 text-sm"
          >
            Upload a real termsheet
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
