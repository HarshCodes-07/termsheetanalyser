import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms of use for ${SITE_NAME} — AI termsheet analysis for founders.`,
};

export default function TermsPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main id="main-content" className="flex-1">
          <article className="mx-auto max-w-[720px] px-5 sm:px-8 py-12 sm:py-16">
            <h1 className="text-[32px] font-semibold tracking-tight mb-2">
              Terms of Use
            </h1>
            <p className="text-sm text-[color:var(--color-muted)] mb-8">
              Last updated: June 2026
            </p>

            <div className="space-y-6 text-[15px] leading-relaxed text-[color:var(--color-foreground)]/90">
              <section>
                <h2 className="text-lg font-semibold mb-2">Acceptance</h2>
                <p className="text-[color:var(--color-muted)]">
                  By using {SITE_NAME}, you agree to these terms. If you do not
                  agree, please do not use the service.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-2">The service</h2>
                <p className="text-[color:var(--color-muted)]">
                  {SITE_NAME} provides AI-generated summaries of startup
                  investment termsheets. Output may be incomplete, incorrect, or
                  outdated. It is not a substitute for professional legal,
                  financial, or tax advice.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-2">Your responsibilities</h2>
                <ul className="list-disc pl-5 space-y-2 text-[color:var(--color-muted)]">
                  <li>
                    Only upload documents you have the right to process.
                  </li>
                  <li>
                    Do not upload malicious files, prompt-injection attacks, or
                    unlawful content.
                  </li>
                  <li>
                    Verify all analysis with qualified advisors before making
                    investment decisions.
                  </li>
                  <li>
                    Respect the daily usage limit (3 analyses per day per
                    browser).
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-2">
                  Limitation of liability
                </h2>
                <p className="text-[color:var(--color-muted)]">
                  The service is provided &ldquo;as is&rdquo; without warranties.
                  We are not liable for decisions you make based on AI output,
                  including financial loss, missed negotiation points, or
                  incorrect scores.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-2">Availability</h2>
                <p className="text-[color:var(--color-muted)]">
                  We may modify, suspend, or discontinue the service at any time.
                  API limits, model changes, or outages may affect availability
                  without notice.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-2">Privacy</h2>
                <p className="text-[color:var(--color-muted)]">
                  See our{" "}
                  <Link
                    href="/privacy"
                    className="text-[color:var(--color-accent-hover)] underline underline-offset-2"
                  >
                    Privacy Policy
                  </Link>{" "}
                  for how we handle your data.
                </p>
              </section>
            </div>

            <p className="mt-10">
              <Link
                href="/"
                className="text-sm text-[color:var(--color-accent-hover)] hover:underline"
              >
                ← Back to home
              </Link>
            </p>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
}
