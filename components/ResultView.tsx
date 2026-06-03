"use client";

import { useState } from "react";
import type { Analysis } from "@/lib/types";
import { ScoreCard } from "./ScoreCard";
import { AnalysisSection } from "./AnalysisSection";
import { GreenFlagCard, RedFlagCard } from "./FlagCard";
import { CopyButton } from "./CopyButton";

type TabId =
  | "summary"
  | "red"
  | "green"
  | "negotiation"
  | "missing"
  | "share";

const TABS: { id: TabId; label: string }[] = [
  { id: "summary", label: "Summary" },
  { id: "red", label: "Red Flags" },
  { id: "green", label: "Green Flags" },
  { id: "negotiation", label: "Negotiation" },
  { id: "missing", label: "Missing Terms" },
  { id: "share", label: "Share" },
];

export function ResultView({
  analysis,
  source,
  note,
  onStartOver,
}: {
  analysis: Analysis;
  source: "gemini" | "sample";
  note?: string;
  onStartOver: () => void;
}) {
  const [tab, setTab] = useState<TabId>("summary");

  return (
    <div className="space-y-6">
      {source === "sample" && (
        <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-accent-soft)] px-4 py-3 text-sm text-[color:var(--color-accent-hover)]">
          <span className="font-medium">Sample mode:</span>{" "}
          <span className="text-[color:var(--color-foreground)]/80">
            {note ??
              "Showing a realistic sample analysis so the full UI is testable. Add a real Gemini key in app/api/analyse/route.ts to analyse your own termsheet."}
          </span>
        </div>
      )}

      <ScoreCard analysis={analysis} />

      <TabBar
        tab={tab}
        setTab={setTab}
        counts={{
          red: analysis.redFlags.length,
          green: analysis.greenFlags.length,
          negotiation: analysis.negotiationPoints.length,
          missing: analysis.missingOrUnclearTerms.length,
        }}
      />

      <div className="min-h-[200px]">
        {tab === "summary" && <SummaryTab analysis={analysis} />}
        {tab === "red" && <RedFlagsTab analysis={analysis} />}
        {tab === "green" && <GreenFlagsTab analysis={analysis} />}
        {tab === "negotiation" && <NegotiationTab analysis={analysis} />}
        {tab === "missing" && <MissingTab analysis={analysis} />}
        {tab === "share" && <ShareTab analysis={analysis} />}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <p className="text-xs leading-relaxed text-[color:var(--color-muted)] max-w-2xl">
          {analysis.disclaimer}
        </p>
        <button
          type="button"
          onClick={onStartOver}
          className="btn-ghost inline-flex items-center justify-center gap-2 px-3.5 py-2 text-sm shrink-0"
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
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          Analyse another termsheet
        </button>
      </div>
    </div>
  );
}

function TabBar({
  tab,
  setTab,
  counts,
}: {
  tab: TabId;
  setTab: (t: TabId) => void;
  counts: { red: number; green: number; negotiation: number; missing: number };
}) {
  return (
    <nav
      aria-label="Analysis sections"
      className="card-soft p-1.5 overflow-x-auto"
    >
      <div className="flex gap-1 min-w-max">
        {TABS.map((t) => {
          const n =
            t.id === "red"
              ? counts.red
              : t.id === "green"
                ? counts.green
                : t.id === "negotiation"
                  ? counts.negotiation
                  : t.id === "missing"
                    ? counts.missing
                    : undefined;

          const active = t.id === tab;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-3.5 py-2 rounded-lg text-sm transition whitespace-nowrap ${
                active
                  ? "bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent-hover)] font-medium"
                  : "text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]"
              }`}
            >
              {t.label}
              {typeof n === "number" && n > 0 && (
                <span
                  className={`ml-2 inline-flex items-center justify-center rounded-full text-[11px] px-1.5 min-w-[18px] h-[18px] ${
                    active
                      ? "bg-[color:var(--color-accent)] text-white"
                      : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-muted)]"
                  }`}
                >
                  {n}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function SummaryTab({ analysis }: { analysis: Analysis }) {
  const paragraphs = analysis.plainEnglishSummary
    .split(/\n{2,}/g)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="card-soft p-6 sm:p-8">
        <h2 className="text-sm uppercase tracking-wider text-[color:var(--color-muted)] font-medium">
          Plain english summary
        </h2>
        <div className="mt-3 space-y-3 text-[15px] leading-relaxed">
          {paragraphs.length > 0 ? (
            paragraphs.map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <p>{analysis.plainEnglishSummary}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TermList
          title="Founder-friendly terms"
          terms={analysis.founderFriendlyTerms}
          tone="success"
        />
        <TermList
          title="Investor-friendly terms"
          terms={analysis.investorFriendlyTerms}
          tone="warning"
        />
      </div>
    </div>
  );
}

function TermList({
  title,
  terms,
  tone,
}: {
  title: string;
  terms: string[];
  tone: "success" | "warning";
}) {
  const color =
    tone === "success" ? "var(--color-success)" : "var(--color-warning)";
  return (
    <div className="card-soft p-5 sm:p-6">
      <h3 className="text-sm uppercase tracking-wider text-[color:var(--color-muted)] font-medium">
        {title}
      </h3>
      {terms.length === 0 ? (
        <p className="mt-3 text-sm text-[color:var(--color-muted)]">
          None called out.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {terms.map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-[14.5px]">
              <span
                className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full shrink-0"
                style={{ background: color }}
                aria-hidden
              />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function RedFlagsTab({ analysis }: { analysis: Analysis }) {
  if (analysis.redFlags.length === 0) {
    return (
      <EmptyState text="No red flags detected. That's rare — double-check with a lawyer just in case." />
    );
  }
  return (
    <AnalysisSection
      title="Red flags"
      subtitle="Things that could hurt founders. Sorted as the AI saw them."
      count={analysis.redFlags.length}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analysis.redFlags.map((f, i) => (
          <RedFlagCard key={i} flag={f} />
        ))}
      </div>
    </AnalysisSection>
  );
}

function GreenFlagsTab({ analysis }: { analysis: Analysis }) {
  if (analysis.greenFlags.length === 0) {
    return <EmptyState text="No clear green flags detected." />;
  }
  return (
    <AnalysisSection
      title="Green flags"
      subtitle="Terms that are standard-good for founders."
      count={analysis.greenFlags.length}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analysis.greenFlags.map((f, i) => (
          <GreenFlagCard key={i} flag={f} />
        ))}
      </div>
    </AnalysisSection>
  );
}

function NegotiationTab({ analysis }: { analysis: Analysis }) {
  if (analysis.negotiationPoints.length === 0) {
    return <EmptyState text="No specific negotiation points surfaced." />;
  }
  return (
    <AnalysisSection
      title="Negotiation points"
      subtitle="Clauses worth pushing back on, with suggested language."
      count={analysis.negotiationPoints.length}
    >
      <div className="space-y-4">
        {analysis.negotiationPoints.map((n, i) => (
          <div key={i} className="card-soft p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[16px] font-semibold tracking-tight">
                {n.clause}
              </h3>
              <span className="chip chip-accent">Ask</span>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[color:var(--color-muted)] font-medium">
                  Current risk
                </div>
                <p className="mt-1 leading-relaxed">{n.currentRisk}</p>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[color:var(--color-accent-hover)] font-medium">
                  Better position
                </div>
                <p className="mt-1 leading-relaxed">{n.betterPosition}</p>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-[color:var(--color-surface-muted)] border border-[color:var(--color-border)] p-3.5">
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <div className="text-[11px] uppercase tracking-wider text-[color:var(--color-muted)] font-medium">
                  Suggested language
                </div>
                <CopyButton text={n.suggestedLanguage} label="Copy" />
              </div>
              <p className="text-[13.5px] font-mono leading-relaxed text-[color:var(--color-foreground)]/90">
                {n.suggestedLanguage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </AnalysisSection>
  );
}

function MissingTab({ analysis }: { analysis: Analysis }) {
  if (analysis.missingOrUnclearTerms.length === 0) {
    return (
      <EmptyState text="No obvious gaps detected. Still, compare against a founder-friendly template." />
    );
  }
  return (
    <AnalysisSection
      title="Missing or unclear terms"
      subtitle="These were either not addressed or ambiguous in the termsheet. Ask for clarity before signing."
      count={analysis.missingOrUnclearTerms.length}
    >
      <div className="card-soft p-5 sm:p-6">
        <ul className="space-y-3">
          {analysis.missingOrUnclearTerms.map((t, i) => (
            <li key={i} className="flex items-start gap-3 text-[14.5px]">
              <span
                className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full shrink-0"
                style={{
                  background: "var(--color-surface-muted)",
                  color: "var(--color-muted)",
                  border: "1px solid var(--color-border)",
                }}
                aria-hidden
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="8" x2="12" y2="13" />
                  <line x1="12" y1="16" x2="12" y2="16" />
                </svg>
              </span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </AnalysisSection>
  );
}

function ShareTab({ analysis }: { analysis: Analysis }) {
  return (
    <AnalysisSection
      title="Shareable copy"
      subtitle="Ready-to-post summaries for the usual places."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ShareCard
          platform="Tweet"
          icon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M18.244 2H21.5l-7.53 8.607L22.5 22h-6.83l-5.348-6.98L3.999 22H.74l8.077-9.23L1.5 2h6.96l4.836 6.39L18.244 2Zm-1.195 18h1.87L7.066 4H5.09l11.96 16Z" />
            </svg>
          }
          text={analysis.shareableSummary.tweet}
        />
        <ShareCard
          platform="LinkedIn"
          icon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M19 0h-14C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM8 19H5V9h3v10zM6.5 7.73A1.73 1.73 0 1 1 6.5 4.27a1.73 1.73 0 0 1 0 3.46zM20 19h-3v-5.3c0-1.26-.02-2.88-1.76-2.88-1.76 0-2.03 1.37-2.03 2.79V19h-3V9h2.88v1.37h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59V19z" />
            </svg>
          }
          text={analysis.shareableSummary.linkedin}
        />
        <ShareCard
          platform="WhatsApp"
          icon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M20.52 3.48A11.78 11.78 0 0 0 12.02 0C5.5 0 .2 5.3.2 11.83c0 2.08.54 4.11 1.58 5.9L0 24l6.44-1.69a11.8 11.8 0 0 0 5.58 1.42h.01c6.52 0 11.82-5.3 11.82-11.83 0-3.16-1.23-6.13-3.33-8.42zM12.03 21.5h-.01a9.67 9.67 0 0 1-4.93-1.35l-.35-.21-3.82 1 1.02-3.72-.23-.38a9.7 9.7 0 0 1-1.48-5.1c0-5.36 4.37-9.72 9.8-9.72 2.62 0 5.08 1.02 6.93 2.87a9.68 9.68 0 0 1 2.87 6.86c0 5.36-4.37 9.75-9.8 9.75zm5.39-7.29c-.29-.15-1.75-.87-2.03-.97-.27-.1-.47-.15-.66.15-.2.29-.76.96-.93 1.16-.17.2-.35.22-.64.07-.29-.15-1.23-.46-2.35-1.46-.87-.78-1.46-1.74-1.63-2.04-.17-.29-.02-.45.13-.6.14-.13.29-.35.44-.52.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.9-2.19-.24-.58-.48-.5-.66-.51h-.56c-.2 0-.52.07-.79.37-.27.29-1.03 1.01-1.03 2.46 0 1.45 1.06 2.86 1.2 3.06.15.2 2.09 3.2 5.07 4.49.71.31 1.26.49 1.69.63.71.22 1.35.19 1.86.11.57-.08 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.12-.27-.2-.56-.35z" />
            </svg>
          }
          text={analysis.shareableSummary.whatsapp}
        />
      </div>
    </AnalysisSection>
  );
}

function ShareCard({
  platform,
  icon,
  text,
}: {
  platform: string;
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="card-soft p-5 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-[color:var(--color-muted)]">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--color-surface-muted)]">
            {icon}
          </span>
          <span className="text-sm font-medium text-[color:var(--color-foreground)]">
            {platform}
          </span>
        </div>
        <CopyButton text={text} />
      </div>
      <p className="text-[14px] leading-relaxed text-[color:var(--color-foreground)]/90 whitespace-pre-wrap">
        {text}
      </p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="card-soft p-8 text-center text-sm text-[color:var(--color-muted)]">
      {text}
    </div>
  );
}
