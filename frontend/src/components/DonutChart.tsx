import type { CSSProperties } from "react";
import { SectionCard } from "./SectionCard";

type Segment = {
  label: string;
  count: number;
  color: string;
  dotClassName: string;
};

type DonutChartProps = {
  title: string;
  description: string;
  total: number;
  segments: Segment[];
  centerLabel?: string;
};

export function DonutChart({
  title,
  description,
  total,
  segments,
  centerLabel = "Tasks",
}: DonutChartProps) {
  let runningPercentage = 0;
  const slices = segments
    .filter((segment) => segment.count > 0)
    .map((segment) => {
      const start = runningPercentage;
      runningPercentage += (segment.count / total) * 100;
      return `${segment.color} ${start}% ${runningPercentage}%`;
    });
  const background = slices.length
    ? `conic-gradient(${slices.join(", ")})`
    : "var(--color-base-300)";

  return (
    <SectionCard>
      <div className="card-body gap-6 p-5 sm:p-6">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-base-content/70">{description}</p>
        </div>
        <div className="flex flex-col items-center gap-7 sm:flex-row">
          <div
            role="img"
            aria-label={`${title}: ${segments.map((segment) => `${segment.label} ${segment.count}`).join(", ")}`}
            className="relative grid size-44 shrink-0 place-items-center rounded-full"
            style={{ background } as CSSProperties}
          >
            <div className="grid size-28 place-items-center rounded-full bg-base-100 text-center shadow-sm">
              <div>
                <p className="text-3xl font-bold">{total}</p>
                <p className="text-xs uppercase tracking-wide text-base-content/60">{centerLabel}</p>
              </div>
            </div>
          </div>
          <ul className="w-full space-y-3" aria-label={`${title} legend`}>
            {segments.map((segment) => {
              const percentage = total ? Math.round((segment.count / total) * 100) : 0;
              return (
                <li key={segment.label} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" className={`size-3 rounded-full ${segment.dotClassName}`} />
                    <span className="font-medium">{segment.label}</span>
                  </span>
                  <span className="text-base-content/70">{segment.count} ({percentage}%)</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </SectionCard>
  );
}
