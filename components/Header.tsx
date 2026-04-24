import Link from "next/link";

export function Header() {
  return (
    <header className="w-full border-b border-[color:var(--color-border)]/70 backdrop-blur-sm bg-[color:var(--color-background)]/80 sticky top-0 z-30">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ background: "var(--color-accent)" }}
          >
              <img src="/logo.jpeg" alt="logo" className="w-7 h-7" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            Termsheet Analyser
          </span>
          <span className="chip chip-accent hidden sm:inline-flex ml-1">
            beta
          </span>
        </Link>

        <div className="flex items-center gap-2 text-sm text-[color:var(--color-muted)]">
          <span className="hidden sm:inline">for founders, not lawyers</span>
        </div>
      </div>
    </header>
  );
}
