"use client";

import { useEffect, useState } from "react";

const STAGES = [
  "Reading clauses…",
  "Checking liquidation preferences…",
  "Looking for founder traps…",
  "Weighing board and voting rights…",
  "Scoring founder-friendliness…",
];

interface Props {
  onCancel?: () => void;
}

export function LoadingAnalysis({ onCancel }: Props) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % STAGES.length);
    }, 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      aria-labelledby="loading-status"
      className="card-soft p-6 sm:p-8"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
          <p
            id="loading-status"
            className="ml-2 text-sm font-medium text-[color:var(--color-foreground)] truncate"
            aria-live="polite"
          >
            {STAGES[idx]}
          </p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-ghost shrink-0 px-3 py-1.5 text-xs"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="skeleton h-24" />
        <div className="skeleton h-24" />
        <div className="skeleton h-24" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
        <div className="skeleton h-4 w-4/6" />
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="skeleton h-28" />
        <div className="skeleton h-28" />
      </div>

      <div className="mt-6 text-xs text-[color:var(--color-muted)]">
        This usually takes 10–20 seconds.
      </div>
    </section>
  );
}
