import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles your data, Gemini processing, and daily usage limits.`,
};

export default function PrivacyPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main id="main-content" className="flex-1">
          <article className="mx-auto max-w-[720px] px-5 sm:px-8 py-12 sm:py-16 prose prose-neutral">
            <h1 className="text-[32px] font-semibold tracking-tight mb-2">
              Privacy Policy
            </h1>
            <p className="text-sm text-[color:var(--color-muted)] mb-8">
              Last updated: June 2026
            </p>

            <div className="space-y-6 text-[15px] leading-relaxed text-[color:var(--color-foreground)]/90">
              <section>
                <h2 className="text-lg font-semibold mb-2">Overview</h2>
                <p className="text-[color:var(--color-muted)]">
                  {SITE_NAME} helps founders understand investment termsheets
                  using AI. This policy explains what data we process and how.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-2">What we collect</h2>
                <ul className="list-disc pl-5 space-y-2 text-[color:var(--color-muted)]">
                  <li>
                    <strong className="text-[color:var(--color-foreground)]">
                      Termsheet content
                    </strong>{" "}
                    — text you upload, paste, or extract from PDF/TXT files,
                    sent to our server for analysis.
                  </li>
                  <li>
                    <strong className="text-[color:var(--color-foreground)]">
                      Usage cookie
                    </strong>{" "}
                    — a signed, HttpOnly cookie tracking how many analyses you
                    have used today (max 3 per day). No personal identity is
                    stored.
                  </li>
                  <li>
                    <strong className="text-[color:var(--color-foreground)]">
                      Standard logs
                    </strong>{" "}
                    — our hosting provider (e.g. Vercel) may log IP addresses,
                    request metadata, and errors for security and reliability.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-2">
                  Third-party processing (Google Gemini)
                </h2>
                <p className="text-[color:var(--color-muted)]">
                  When you click &ldquo;Analyse termsheet&rdquo;, your document
                  text is transmitted to{" "}
                  <strong className="text-[color:var(--color-foreground)]">
                    Google Gemini
                  </strong>{" "}
                  via the Google Generative Language API for AI analysis. Google
                  processes this data under their own terms and privacy policy.
                  Do not upload documents containing secrets you cannot share
                  with a third-party AI provider.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-2">What we do not do</h2>
                <ul className="list-disc pl-5 space-y-2 text-[color:var(--color-muted)]">
                  <li>We do not operate a user database or accounts.</li>
                  <li>
                    We do not persistently store your termsheet on our servers
                    after the request completes.
                  </li>
                  <li>We do not sell your data.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-2">Daily usage limit</h2>
                <p className="text-[color:var(--color-muted)]">
                  To prevent abuse and control API costs, each browser may run
                  up to 3 analyses per calendar day (UTC). This is enforced via
                  a signed cookie on your device.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-2">Not legal advice</h2>
                <p className="text-[color:var(--color-muted)]">
                  AI output is for informational purposes only. Always consult a
                  qualified lawyer before signing investment documents.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-2">Contact</h2>
                <p className="text-[color:var(--color-muted)]">
                  Questions? Reach out via{" "}
                  <a
                    href="https://www.x.com/harsh_dwivedi7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[color:var(--color-accent-hover)] underline underline-offset-2"
                  >
                    @harsh_dwivedi7
                  </a>
                  .
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
