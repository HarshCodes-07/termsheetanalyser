import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export function Header() {
  return (
    <header className="w-full border-b border-[color:var(--color-border)]/70 backdrop-blur-sm bg-[color:var(--color-background)]/80 sticky top-0 z-30">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 h-14 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          aria-label={`${SITE_NAME} — home`}
        >
          <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ background: "var(--color-accent)" }}
            aria-hidden
          >
            <span className="text-white text-[13px] font-bold tracking-tight">
              T
            </span>
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            {SITE_NAME}
          </span>
          <span className="chip chip-accent hidden sm:inline-flex ml-1">
            beta
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-1 text-sm"
        >
          <Link
            href="#upload"
            className="px-3 py-1.5 rounded-lg text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] hover:bg-[color:var(--color-surface-muted)] transition"
          >
            Upload
          </Link>
          <Link
            href="#how-it-works"
            className="px-3 py-1.5 rounded-lg text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] hover:bg-[color:var(--color-surface-muted)] transition"
          >
            How it works
          </Link>
          <Link
            href="#faq"
            className="px-3 py-1.5 rounded-lg text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] hover:bg-[color:var(--color-surface-muted)] transition"
          >
            FAQ
          </Link>
        </nav>

        <p className="text-sm text-[color:var(--color-muted)] hidden sm:block md:hidden lg:block">
          for founders, not lawyers
        </p>
      </div>
    </header>
  );
}
