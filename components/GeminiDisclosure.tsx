export function GeminiDisclosure() {
  return (
    <p className="text-xs leading-relaxed text-[color:var(--color-muted)]">
      By analysing, you agree that your document text is sent to an{" "}
      <strong className="font-medium text-[color:var(--color-foreground)]/80">
        AI model
      </strong>{" "}
      for processing. We do not store your file on our servers.{" "}
      <a
        href="/privacy"
        className="text-[color:var(--color-accent-hover)] underline underline-offset-2 hover:text-[color:var(--color-accent)]"
      >
        Privacy policy
      </a>
    </p>
  );
}
