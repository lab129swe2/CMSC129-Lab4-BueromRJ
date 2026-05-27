import type { ReactNode } from "react";
import { SectionCard } from "./SectionCard";

type StatCardProps = {
  label: string;
  value: ReactNode;
  helper?: string;
  accent?: "primary" | "warning" | "success" | "neutral";
};

const accents = {
  primary: "text-primary",
  warning: "text-warning",
  success: "text-success",
  neutral: "text-base-content",
};

export function StatCard({ label, value, helper, accent = "neutral" }: StatCardProps) {
  return (
    <SectionCard>
      <div className="card-body gap-1 p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">{label}</p>
        <p className={`text-3xl font-semibold ${accents[accent]}`}>{value}</p>
        {helper ? <p className="text-xs text-base-content/60">{helper}</p> : null}
      </div>
    </SectionCard>
  );
}
