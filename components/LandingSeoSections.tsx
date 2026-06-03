import { FAQ_ITEMS, HOW_IT_WORKS_STEPS } from "@/lib/site";

export function LandingSeoSections() {
  return (
    <div className="border-t border-[color:var(--color-border)]/70 bg-[color:var(--color-surface-muted)]/30">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 py-14 sm:py-16 space-y-14">
        <section
          id="how-it-works"
          aria-labelledby="how-it-works-heading"
          className="scroll-mt-24"
        >
          <h2
            id="how-it-works-heading"
            className="text-[24px] sm:text-[28px] font-semibold tracking-tight"
          >
            How termsheet analysis works
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--color-muted)] max-w-[640px]">
            Three steps from upload to a founder-friendly report you can share
            with co-founders or advisors.
          </p>
          <ol className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 list-none p-0 m-0">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <li key={step.title} className="card-soft p-5 sm:p-6">
                <span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white mb-4"
                  style={{ background: "var(--color-accent)" }}
                  aria-hidden
                >
                  {index + 1}
                </span>
                <h3 className="text-[16px] font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-muted)]">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="faq"
          aria-labelledby="faq-heading"
          className="scroll-mt-24"
        >
          <h2
            id="faq-heading"
            className="text-[24px] sm:text-[28px] font-semibold tracking-tight"
          >
            Frequently asked questions
          </h2>
          <div className="mt-8 space-y-3">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="card-soft group open:shadow-sm"
              >
                <summary className="cursor-pointer list-none px-5 py-4 sm:px-6 font-medium text-[15px] tracking-tight [&::-webkit-details-marker]:hidden flex items-center justify-between gap-3">
                  {item.question}
                  <span
                    className="text-[color:var(--color-muted)] text-lg shrink-0 group-open:rotate-45 transition-transform"
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <div className="pt-4 px-5 pb-5 sm:px-6 sm:pb-6 text-sm leading-relaxed text-[color:var(--color-muted)] border-t border-[color:var(--color-border)]/60">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
