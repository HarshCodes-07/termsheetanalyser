"use client";

import { formatResetsAt } from "@/lib/format-usage";
import type { UsageInfo } from "@/lib/types";

interface Props {
  usage: UsageInfo | null;
  loading?: boolean;
  compact?: boolean;
}

export function UsageLimitBanner({ usage, loading, compact }: Props) {
  if (loading && !usage) {
    return (
      <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]/50 px-4 py-3 animate-pulse">
        <div className="h-4 w-48 skeleton rounded" />
      </div>
    );
  }

  if (!usage) return null;

  const exhausted = usage.remaining === 0;
  const dots = Array.from({ length: usage.limit }, (_, i) => i < usage.used);

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
          exhausted
            ? "border-[color:var(--color-danger)]/30 bg-[color:var(--color-danger-soft)] text-[color:var(--color-danger)]"
            : "border-[color:var(--color-border)] bg-white text-[color:var(--color-muted)]"
        }`}
        title={
          exhausted
            ? `Resets ${formatResetsAt(usage.resetsAt)}`
            : `${usage.remaining} analyses left today`
        }
      >
        <span className="flex gap-1" aria-hidden>
          {dots.map((filled, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${
                filled
                  ? exhausted
                    ? "bg-[color:var(--color-danger)]"
                    : "bg-[color:var(--color-accent)]"
                  : "bg-[color:var(--color-border-strong)]"
              }`}
            />
          ))}
        </span>
        {exhausted
          ? "Daily limit reached"
          : `${usage.remaining} of ${usage.limit} left today`}
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border px-4 py-3.5 sm:px-5 sm:py-4 ${
        exhausted
          ? "border-[color:var(--color-danger)]/25 bg-[color:var(--color-danger-soft)]/60"
          : "border-[color:var(--color-border)] bg-gradient-to-r from-[color:var(--color-surface-muted)]/80 to-white"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p
            className={`text-sm font-semibold tracking-tight ${
              exhausted
                ? "text-[color:var(--color-danger)]"
                : "text-[color:var(--color-foreground)]"
            }`}
          >
            {exhausted
              ? "You've used all 3 free analyses for today"
              : `${usage.remaining} free ${usage.remaining === 1 ? "analysis" : "analyses"} left today`}
          </p>
          <p className="mt-0.5 text-xs text-[color:var(--color-muted)]">
            {exhausted
              ? `Resets ${formatResetsAt(usage.resetsAt)}`
              : "Fair-use limit to keep the tool free for everyone"}
          </p>
        </div>

        <div
          className="flex items-center gap-2 shrink-0"
          role="img"
          aria-label={`${usage.used} of ${usage.limit} analyses used today`}
        >
          {dots.map((filled, i) => (
            <span
              key={i}
              className={`h-3 w-3 rounded-full transition-all ${
                filled
                  ? exhausted
                    ? "bg-[color:var(--color-danger)] shadow-sm"
                    : "bg-[color:var(--color-accent)] shadow-sm"
                  : "border-2 border-[color:var(--color-border-strong)] bg-white"
              }`}
            />
          ))}
          <span className="ml-1 text-xs font-medium tabular-nums text-[color:var(--color-muted)]">
            {usage.used}/{usage.limit}
          </span>
        </div>
      </div>
    </div>
  );
}
