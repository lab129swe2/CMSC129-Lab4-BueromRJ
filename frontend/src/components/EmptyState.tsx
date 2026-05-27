import type { ReactNode } from "react";
import { SectionCard } from "./SectionCard";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  eyebrow?: string;
  variant?: "tasks" | "analytics";
};

export function EmptyState({
  title,
  description,
  action,
  eyebrow = "Ready when you are",
  variant = "tasks",
}: EmptyStateProps) {
  return (
    <SectionCard className="overflow-hidden">
      <div className="relative card-body items-center px-6 py-12 text-center sm:py-14">
        <div aria-hidden="true" className="absolute inset-x-10 top-0 h-28 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative rounded-2xl border border-primary/10 bg-primary/5 p-4 text-primary">
          {variant === "analytics" ? (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-10" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M4 20V10m6 10V4m6 16v-7m4 7H2" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-10" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M9 5h6m-6 4h6m-6 4h3m-6 7h12a2 2 0 002-2V6l-4-4H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="m8.5 17 1.5 1.5 3-3" />
            </svg>
          )}
        </div>
        <p className="relative mt-5 text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
        <h3 className="relative mt-2 text-xl font-semibold">{title}</h3>
        <p className="relative mt-2 max-w-sm text-sm leading-relaxed text-base-content/70">{description}</p>
        {action ? <div className="relative mt-6">{action}</div> : null}
      </div>
    </SectionCard>
  );
}
