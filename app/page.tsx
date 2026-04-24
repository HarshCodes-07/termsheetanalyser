"use client";

import { useCallback, useState } from "react";
import { Header } from "@/components/Header";
import { UploadCard } from "@/components/UploadCard";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { ResultView } from "@/components/ResultView";
import { NotTermsheetView } from "@/components/NotTermsheetView";
import { SAMPLE_TERMSHEET } from "@/lib/sample";
import type {
  Analysis,
  AnalyseResponse,
  NotTermsheet,
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

const EMPTY_SOURCE: TermsheetSource = { kind: null, file: null, text: "" };

const MAX_FILE_MB = 10;

export default function Page() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [notTermsheet, setNotTermsheet] = useState<NotTermsheet | null>(null);
  const [source, setSource] = useState<"gemini" | "sample">("sample");
  const [note, setNote] = useState<string | undefined>(undefined);
  const [termsheetSource, setTermsheetSource] =
    useState<TermsheetSource>(EMPTY_SOURCE);

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
    if (file.type === "text/plain" || lower.endsWith(".txt") || lower.endsWith(".md")) {
      return file.text();
    }
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/extract", { method: "POST", body: fd });
    const json = (await res.json().catch(() => ({}))) as {
      text?: string;
      error?: string;
    };
    if (!res.ok) {
      throw new Error(json.error || "Could not extract text from file.");
    }
    return json.text ?? "";
  }

  const handleAnalyse = useCallback(async () => {
    setError(null);
    const src = termsheetSource;
    if (!src.kind) {
      setError("Please upload a file, paste text, or use the sample termsheet.");
      return;
    }

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

      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ termsheetText: text }),
      });
      const json = (await res.json().catch(() => ({}))) as
        | AnalyseResponse
        | { error?: string };
      if (!res.ok) {
        throw new Error(
          ("error" in json && json.error) ||
            "Something went wrong analysing the termsheet."
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

      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      setStatus("error");
    }
  }, [termsheetSource]);

  const handleStartOver = useCallback(() => {
    setTermsheetSource(EMPTY_SOURCE);
    setFileName(null);
    setPastedText("");
    setAnalysis(null);
    setNotTermsheet(null);
    setSource("sample");
    setNote(undefined);
    setError(null);
    setStatus("idle");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

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
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const canAnalyse =
    (status === "selected" || status === "error") && !!termsheetSource.kind;

  const showIntro = status !== "success" && status !== "notTermsheet";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-8 py-10 sm:py-16">
          {showIntro && (
            <section className="mb-10 sm:mb-14 max-w-[780px]">
              <span className="chip chip-accent">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--color-accent)" }}
                />
                AI-powered · founder-first
              </span>
              <h1 className="mt-4 text-[34px] sm:text-[44px] leading-[1.08] font-semibold tracking-tight">
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
            />
          )}

          {status === "analysing" && <LoadingAnalysis />}

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
            <section className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            </section>
          )}
        </div>
      </main>

      <footer className="border-t border-[color:var(--color-border)]/70 py-6">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-[color:var(--color-muted)]">
          <span>
            Termsheet Analyser · a founder tool. Not legal advice.
          </span>
          <span>
            Built with ❤️ by <a href="https://www.x.com/harsh_dwivedi7" target="_blank" rel="noopener noreferrer">Harsh Dwivedi</a>
          </span>
        </div>
      </footer>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="card-soft p-5">
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--color-accent)" }}
        />
        <h3 className="text-[14px] font-semibold tracking-tight">{title}</h3>
      </div>
      <p className="text-sm leading-relaxed text-[color:var(--color-muted)]">
        {body}
      </p>
    </div>
  );
}
