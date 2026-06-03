"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UploadCard } from "@/components/UploadCard";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { ResultView } from "@/components/ResultView";
import { NotTermsheetView } from "@/components/NotTermsheetView";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";
import { SAMPLE_TERMSHEET } from "@/lib/sample";
import { MAX_TERMSHEET_CHARS } from "@/lib/constants";
import { formatResetsAt } from "@/lib/format-usage";
import type {
  Analysis,
  AnalyseResponse,
  NotTermsheet,
  UsageInfo,
} from "@/lib/types";

type Status =
  | "idle"
  | "selected"
  | "analysing"
  | "success"
  | "notTermsheet"
  | "error";

type SourceKind = "file" | "text" | "sample" | null;

interface TermsheetSource {
  kind: SourceKind;
  file: File | null;
  text: string;
}

type ApiErrorBody = {
  error?: string;
  usage?: UsageInfo;
  code?: string;
};

const EMPTY_SOURCE: TermsheetSource = { kind: null, file: null, text: "" };
const MAX_FILE_MB = 10;

export function HomePage() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [notTermsheet, setNotTermsheet] = useState<NotTermsheet | null>(null);
  const [source, setSource] = useState<"gemini" | "sample">("sample");
  const [note, setNote] = useState<string | undefined>(undefined);
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [usageLoading, setUsageLoading] = useState(true);
  const [termsheetSource, setTermsheetSource] =
    useState<TermsheetSource>(EMPTY_SOURCE);

  const abortRef = useRef<AbortController | null>(null);
  const analyseLockRef = useRef(false);

  const fetchUsage = useCallback(async () => {
    try {
      const res = await fetch("/api/usage", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { usage: UsageInfo };
        setUsage(data.usage);
      }
    } catch {
      /* ignore */
    } finally {
      setUsageLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadUsage() {
      try {
        const res = await fetch("/api/usage", { cache: "no-store" });
        if (res.ok && !cancelled) {
          const data = (await res.json()) as { usage: UsageInfo };
          setUsage(data.usage);
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setUsageLoading(false);
      }
    }

    void loadUsage();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleFileSelected = useCallback((file: File) => {
    setError(null);
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`File is too large. Please keep it under ${MAX_FILE_MB}MB.`);
      return;
    }
    const name = file.name.toLowerCase();
    const isSupported =
      file.type === "application/pdf" ||
      file.type === "text/plain" ||
      name.endsWith(".pdf") ||
      name.endsWith(".txt") ||
      name.endsWith(".md");
    if (!isSupported) {
      setError(
        "Unsupported file type. Please upload a .pdf or .txt file. DOC/DOCX support is coming soon."
      );
      return;
    }
    setTermsheetSource({ kind: "file", file, text: "" });
    setFileName(file.name);
    setStatus("selected");
  }, []);

  const handlePasteText = useCallback((text: string) => {
    setError(null);
    setTermsheetSource({ kind: "text", file: null, text });
    setPastedText(text);
    setFileName(null);
    setStatus(text.trim().length > 0 ? "selected" : "idle");
  }, []);

  const handleUseSample = useCallback(() => {
    setError(null);
    setTermsheetSource({
      kind: "sample",
      file: null,
      text: SAMPLE_TERMSHEET,
    });
    setFileName("sample-termsheet.txt");
    setPastedText("");
    setStatus("selected");
  }, []);

  async function extractTextFromFile(file: File): Promise<string> {
    const lower = file.name.toLowerCase();
    if (
      file.type === "text/plain" ||
      lower.endsWith(".txt") ||
      lower.endsWith(".md")
    ) {
      return file.text();
    }
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/extract", { method: "POST", body: fd });
    const json = (await res.json().catch(() => ({}))) as ApiErrorBody & {
      text?: string;
    };
    if (!res.ok) {
      throw new Error(json.error || "Could not extract text from file.");
    }
    return json.text ?? "";
  }

  const handleCancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    analyseLockRef.current = false;
    setStatus("selected");
    setError("Analysis cancelled.");
  }, []);

  const handleAnalyse = useCallback(async () => {
    if (analyseLockRef.current) return;
    if (usage && usage.remaining <= 0) {
      setError(
        `Daily limit reached. Your free analyses reset ${formatResetsAt(usage.resetsAt)}.`
      );
      return;
    }

    setError(null);
    const src = termsheetSource;
    if (!src.kind) {
      setError("Please upload a file, paste text, or use the sample termsheet.");
      return;
    }

    analyseLockRef.current = true;
    abortRef.current = new AbortController();
    setStatus("analysing");

    try {
      let text = "";
      if (src.kind === "file" && src.file) {
        text = await extractTextFromFile(src.file);
      } else {
        text = src.text;
      }

      text = text.trim();
      if (text.length < 40) {
        throw new Error(
          "Termsheet text is too short to analyse. Please upload a fuller document or paste more text."
        );
      }
      if (text.length > MAX_TERMSHEET_CHARS) {
        text = text.slice(0, MAX_TERMSHEET_CHARS);
      }

      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ termsheetText: text }),
        signal: abortRef.current.signal,
      });

      const json = (await res.json().catch(() => ({}))) as
        | AnalyseResponse
        | ApiErrorBody;

      if ("usage" in json && json.usage) setUsage(json.usage);

      if (!res.ok) {
        const errBody = json as ApiErrorBody;
        if (res.status === 429 && errBody.code === "DAILY_LIMIT") {
          throw new Error(
            errBody.error ||
              `Daily limit reached. Resets ${errBody.usage ? formatResetsAt(errBody.usage.resetsAt) : "tomorrow"}.`
          );
        }
        throw new Error(
          errBody.error || "Something went wrong analysing the termsheet."
        );
      }

      if (
        !("kind" in json) ||
        (json.kind !== "analysis" && json.kind !== "notTermsheet")
      ) {
        throw new Error(
          "Received an invalid response from the server. Please try again."
        );
      }

      const apiResponse = json as AnalyseResponse;

      if (apiResponse.kind === "notTermsheet") {
        setNotTermsheet(apiResponse.notTermsheet);
        setAnalysis(null);
        setSource(apiResponse.source);
        setNote(apiResponse.note);
        setStatus("notTermsheet");
      } else {
        setAnalysis(apiResponse.analysis);
        setNotTermsheet(null);
        setSource(apiResponse.source);
        setNote(apiResponse.note);
        setStatus("success");
      }

      if (apiResponse.usage) setUsage(apiResponse.usage);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setError("Analysis cancelled.");
        setStatus("selected");
      } else {
        const msg =
          err instanceof Error ? err.message : "Something went wrong.";
        setAnalysis(null);
        setNotTermsheet(null);
        setNote(undefined);
        setError(msg);
        setStatus("error");
      }
      await fetchUsage();
    } finally {
      analyseLockRef.current = false;
      abortRef.current = null;
    }
  }, [termsheetSource, usage, fetchUsage]);

  const handleStartOver = useCallback(() => {
    abortRef.current?.abort();
    analyseLockRef.current = false;
    setTermsheetSource(EMPTY_SOURCE);
    setFileName(null);
    setPastedText("");
    setAnalysis(null);
    setNotTermsheet(null);
    setSource("sample");
    setNote(undefined);
    setError(null);
    setStatus("idle");
    fetchUsage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [fetchUsage]);

  const handleUseSampleFromError = useCallback(() => {
    setTermsheetSource({
      kind: "sample",
      file: null,
      text: SAMPLE_TERMSHEET,
    });
    setFileName("sample-termsheet.txt");
    setPastedText("");
    setAnalysis(null);
    setNotTermsheet(null);
    setNote(undefined);
    setError(null);
    setStatus("selected");
  }, []);

  const limitReached = usage !== null && usage.remaining <= 0;
  const canAnalyse =
    (status === "selected" || status === "error") &&
    !!termsheetSource.kind &&
    !limitReached;

  const showIntro = status !== "success" && status !== "notTermsheet";

  return (
    <main id="main-content" className="flex-1">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 py-10 sm:py-16">
        {showIntro && (
          <section
            className="mb-10 sm:mb-14 max-w-[780px]"
            aria-labelledby="hero-heading"
          >
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="chip chip-accent">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--color-accent)" }}
                />
                AI-powered · founder-first
              </span>
              <UsageLimitBanner usage={usage} loading={usageLoading} compact />
            </div>
            <h1
              id="hero-heading"
              className="text-[34px] sm:text-[44px] leading-[1.08] font-semibold tracking-tight"
            >
              Understand your termsheet{" "}
              <span className="text-[color:var(--color-accent-hover)]">
                before you sign it.
              </span>
            </h1>
            <p className="mt-4 text-[17px] leading-relaxed text-[color:var(--color-muted)] max-w-[640px]">
              Upload a termsheet and get founder-friendly red flags, green
              flags, a safety score, and negotiation notes in plain english.
              No jargon. No legalese. Just clarity.
            </p>
          </section>
        )}

        {status === "analysing" && (
          <h1 className="sr-only">Analysing your termsheet</h1>
        )}

        {status === "success" && analysis && (
          <h1 className="text-[28px] sm:text-[34px] font-semibold tracking-tight mb-6">
            Your termsheet analysis
          </h1>
        )}

        {showIntro && (
          <div className="mb-6">
            <UsageLimitBanner usage={usage} loading={usageLoading} />
          </div>
        )}

        {(status === "idle" ||
          status === "selected" ||
          status === "error") && (
          <UploadCard
            onFileSelected={handleFileSelected}
            onPasteText={handlePasteText}
            onUseSample={handleUseSample}
            onAnalyse={handleAnalyse}
            canAnalyse={canAnalyse}
            selectedFileName={fileName}
            pastedLength={pastedText.length}
            error={error}
            busy={false}
            limitReached={limitReached}
          />
        )}

        {status === "analysing" && (
          <LoadingAnalysis onCancel={handleCancel} />
        )}

        {status === "success" && analysis && (
          <ResultView
            analysis={analysis}
            source={source}
            note={note}
            onStartOver={handleStartOver}
          />
        )}

        {status === "notTermsheet" && notTermsheet && (
          <NotTermsheetView
            notTermsheet={notTermsheet}
            source={source}
            note={note}
            onStartOver={handleStartOver}
            onUseSample={handleUseSampleFromError}
          />
        )}

        {showIntro && (
          <section className="mt-10" aria-labelledby="features-heading">
            <h2
              id="features-heading"
              className="text-[20px] sm:text-[22px] font-semibold tracking-tight mb-5"
            >
              Why founders use Termsheet Analyser
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Feature
                title="Founder-first analysis"
                body="Written for founders, not lawyers. Plain english, real tradeoffs."
              />
              <Feature
                title="Strict safety score"
                body="0–100 score based on how the deal actually impacts founders, not vibes."
              />
              <Feature
                title="Ready-to-send ask language"
                body="Negotiation points come with suggested clause language you can send back."
              />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <article className="card-soft p-5">
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--color-accent)" }}
          aria-hidden
        />
        <h3 className="text-[14px] font-semibold tracking-tight">{title}</h3>
      </div>
      <p className="text-sm leading-relaxed text-[color:var(--color-muted)]">
        {body}
      </p>
    </article>
  );
}
