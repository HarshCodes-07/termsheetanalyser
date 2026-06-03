import Link from "next/link";
import {
  AUTHOR_NAME,
  AUTHOR_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[color:var(--color-border)]/70 bg-[color:var(--color-surface)]">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <p className="text-[15px] font-semibold tracking-tight">
              {SITE_NAME}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-muted)] max-w-xs">
              {SITE_DESCRIPTION}
            </p>
          </div>

          <nav aria-label="Footer" className="sm:col-start-2 lg:col-start-2">
            <p className="text-[11px] uppercase tracking-wider font-medium text-[color:var(--color-muted)] mb-3">
              Explore
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#upload"
                  className="text-[color:var(--color-foreground)] hover:text-[color:var(--color-accent-hover)] transition"
                >
                  Upload termsheet
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="text-[color:var(--color-foreground)] hover:text-[color:var(--color-accent-hover)] transition"
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="text-[color:var(--color-foreground)] hover:text-[color:var(--color-accent-hover)] transition"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-[color:var(--color-foreground)] hover:text-[color:var(--color-accent-hover)] transition"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-[color:var(--color-foreground)] hover:text-[color:var(--color-accent-hover)] transition"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </nav>

          <div className="sm:col-span-2 lg:col-span-1 lg:text-right">
            <p className="text-[11px] uppercase tracking-wider font-medium text-[color:var(--color-muted)] mb-3">
              Disclaimer
            </p>
            <p className="text-sm leading-relaxed text-[color:var(--color-muted)]">
              AI-generated business analysis only — not legal advice. Consult a
              qualified lawyer before signing.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[color:var(--color-border)]/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-[color:var(--color-muted)]">
          <p>© {year} {SITE_NAME}. All rights reserved.</p>
          <p>
            Built with care by{" "}
            <a
              href={AUTHOR_URL}
              target="_blank"
              rel="author me noopener noreferrer"
              className="text-[color:var(--color-foreground)] hover:text-[color:var(--color-accent-hover)] transition underline-offset-2 hover:underline"
            >
              {AUTHOR_NAME}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
