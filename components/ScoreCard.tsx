import type { Analysis } from "@/lib/types";

interface Props {
  analysis: Analysis;
}

function labelChipClass(label: Analysis["scoreLabel"]) {
  switch (label) {
    case "Founder Friendly":
      return "chip chip-success";
    case "Balanced":
      return "chip chip-accent";
    case "Investor Friendly":
      return "chip chip-warning";
    case "Risky":
      return "chip chip-danger";
    default:
      return "chip chip-muted";
  }
}

function scoreTone(score: number) {
  if (score >= 80) return "var(--color-success)";
  if (score >= 60) return "var(--color-accent)";
  if (score >= 40) return "var(--color-warning)";
  return "var(--color-danger)";
}

export function ScoreCard({ analysis }: Props) {
  const score = Math.max(0, Math.min(100, Math.round(analysis.safetyScore)));
  const tone = scoreTone(score);

  return (
    <div className="card-soft p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div
          className="relative shrink-0 h-32 w-32 rounded-full p-[6px] score-ring"
          style={
            {
              ["--score" as string]: score,
              background: `conic-gradient(${tone} ${score}%, #f2e6d4 0)`,
            } as React.CSSProperties
          }
        >
          <div className="h-full w-full rounded-full bg-white flex flex-col items-center justify-center">
            <div
              className="text-[34px] font-semibold leading-none tracking-tight"
              style={{ color: tone }}
            >
              {score}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-wider text-[color:var(--color-muted)]">
              / 100
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={labelChipClass(analysis.scoreLabel)}>
              {analysis.scoreLabel}
            </span>
            <span className="chip chip-muted">Safety score</span>
          </div>
          <h2 className="text-[22px] sm:text-[24px] font-semibold leading-snug tracking-tight">
            {analysis.oneLineSummary}
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-[color:var(--color-muted)]">
            {analysis.overallVerdict}
          </p>
        </div>
      </div>
    </div>
  );
}
