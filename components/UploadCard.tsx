"use client";

import { useRef, useState } from "react";

export interface UploadCardProps {
  onFileSelected: (file: File) => void;
  onPasteText: (text: string) => void;
  onUseSample: () => void;
  onAnalyse: () => void;
  canAnalyse: boolean;
  selectedFileName?: string | null;
  pastedLength?: number;
  error?: string | null;
  busy?: boolean;
}

const ACCEPTED =
  ".pdf,.txt,.md,application/pdf,text/plain,text/markdown";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function UploadCard({
  onFileSelected,
  onPasteText,
  onUseSample,
  onAnalyse,
  canAnalyse,
  selectedFileName,
  pastedLength = 0,
  error,
  busy,
}: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number } | null>(
    null
  );
  const [pasteText, setPasteText] = useState("");
  const [mode, setMode] = useState<"file" | "paste">("file");

  function handleFile(file: File) {
    setFileMeta({ name: file.name, size: file.size });
    onFileSelected(file);
  }

  return (
    <div className="card-soft p-6 sm:p-8">
      <div className="flex items-center gap-1 mb-5 text-sm">
        <button
          type="button"
          onClick={() => setMode("file")}
          className={`px-3 py-1.5 rounded-lg transition ${
            mode === "file"
              ? "bg-[color:var(--color-surface-muted)] text-[color:var(--color-foreground)] font-medium"
              : "text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]"
          }`}
        >
          Upload file
        </button>
        <button
          type="button"
          onClick={() => setMode("paste")}
          className={`px-3 py-1.5 rounded-lg transition ${
            mode === "paste"
              ? "bg-[color:var(--color-surface-muted)] text-[color:var(--color-foreground)] font-medium"
              : "text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]"
          }`}
        >
          Paste text
        </button>
      </div>

      {mode === "file" && (
        <label
          htmlFor="termsheet-file"
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          className={`block cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 sm:py-14 text-center transition ${
            dragging
              ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent-soft)]"
              : "border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-muted)]/60 hover:bg-[color:var(--color-surface-muted)]"
          }`}
        >
          <input
            ref={inputRef}
            id="termsheet-file"
            type="file"
            accept={ACCEPTED}
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent-hover)]">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>

          <div className="text-[15px] font-medium">
            Drop your termsheet here, or{" "}
            <span className="text-[color:var(--color-accent-hover)] underline underline-offset-2">
              browse
            </span>
          </div>
          <div className="mt-1 text-xs text-[color:var(--color-muted)]">
            PDF or TXT · up to 10MB · DOC/DOCX coming soon
          </div>

          {(fileMeta || selectedFileName) && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-white px-3 py-1.5 text-xs text-[color:var(--color-muted)]">
              <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--color-accent)]" />
              <span className="font-medium text-[color:var(--color-foreground)]">
                {fileMeta?.name ?? selectedFileName}
              </span>
              {fileMeta && <span>· {formatBytes(fileMeta.size)}</span>}
            </div>
          )}
        </label>
      )}

      {mode === "paste" && (
        <div>
          <textarea
            value={pasteText}
            onChange={(e) => {
              setPasteText(e.target.value);
              onPasteText(e.target.value);
            }}
            placeholder="Paste the termsheet text here…"
            className="w-full min-h-[220px] rounded-2xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-muted)]/40 p-4 text-sm leading-relaxed font-mono placeholder:text-[color:var(--color-muted)]/70 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent-ring)] focus:border-[color:var(--color-accent)]"
          />
          <div className="mt-2 text-xs text-[color:var(--color-muted)]">
            {pastedLength > 0
              ? `${pastedLength.toLocaleString()} characters`
              : "Paste at least a few clauses. The more context, the sharper the analysis."}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-[color:var(--color-danger)]/20 bg-[color:var(--color-danger-soft)] px-3 py-2.5 text-sm text-[color:var(--color-danger)]">
          {error}
        </div>
      )}

      <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
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
          onClick={onAnalyse}
          disabled={!canAnalyse || busy}
          className="btn-accent inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm"
        >
          {busy ? (
            <>
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </>
          ) : (
            <>
              Analyse termsheet
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
            </>
          )}
        </button>
      </div>
    </div>
  );
}
