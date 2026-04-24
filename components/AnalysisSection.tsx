import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  count?: number;
  children: ReactNode;
  action?: ReactNode;
}

export function AnalysisSection({
  title,
  subtitle,
  count,
  children,
  action,
}: Props) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[18px] sm:text-[19px] font-semibold tracking-tight">
              {title}
            </h2>
            {typeof count === "number" && (
              <span className="chip chip-muted">{count}</span>
            )}
          </div>
          {subtitle && (
            <p className="mt-0.5 text-sm text-[color:var(--color-muted)]">
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
      <div>{children}</div>
    </section>
  );
}
