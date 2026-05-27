import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  badge?: string;
  children?: ReactNode;
};

export function SectionHeader({ title, badge, children }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="card-title text-xl">{title}</h2>
      <div className="flex items-center gap-2">
        {children}
        {badge ? <span className="badge badge-outline">{badge}</span> : null}
      </div>
    </div>
  );
}
