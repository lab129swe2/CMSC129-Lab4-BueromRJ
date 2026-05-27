import type { ReactNode } from "react";

type SectionCardProps = {
  children: ReactNode;
  className?: string;
};

export function SectionCard({ children, className = "" }: SectionCardProps) {
  return <div className={`card border border-base-300 bg-base-100 shadow-sm ${className}`}>{children}</div>;
}
