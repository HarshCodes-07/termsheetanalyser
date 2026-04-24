import type { GreenFlag, RedFlag, Severity } from "@/lib/types";

function severityChipClass(sev: Severity) {
  switch (sev) {
    case "High":
      return "chip chip-danger";
    case "Medium":
      return "chip chip-warning";
    case "Low":
      return "chip chip-muted";
  }
}

export function RedFlagCard({ flag }: { flag: RedFlag }) {
  return (
    <div className="card-soft p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[16px] font-semibold tracking-tight">
          {flag.title}
        </h3>
        <span className={severityChipClass(flag.severity)}>
          {flag.severity}
        </span>
      </div>

      <div className="mt-4 space-y-3 text-sm leading-relaxed">
        <Row label="Why it matters" value={flag.whyItMatters} />
        <Row label="Founder impact" value={flag.founderImpact} accent />
        <Row label="Suggested ask" value={flag.suggestedAsk} />
      </div>
    </div>
  );
}

export function GreenFlagCard({ flag }: { flag: GreenFlag }) {
  return (
    <div
      className="rounded-2xl border p-5 sm:p-6"
      style={{
        background: "var(--color-success-soft)",
        borderColor: "#cfe6d6",
      }}
    >
      <div className="flex items-start gap-2">
        <span
          className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-white"
          style={{ background: "var(--color-success)" }}
          aria-hidden
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <h3 className="text-[15px] font-semibold tracking-tight text-[color:var(--color-foreground)]">
          {flag.title}
        </h3>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-foreground)]/85">
        {flag.whyItIsGood}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div
        className={`text-[11px] uppercase tracking-wider font-medium ${
          accent
            ? "text-[color:var(--color-accent-hover)]"
            : "text-[color:var(--color-muted)]"
        }`}
      >
        {label}
      </div>
      <div className="mt-0.5 text-[color:var(--color-foreground)]/90">
        {value}
      </div>
    </div>
  );
}
