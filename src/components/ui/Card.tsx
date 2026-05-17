import type { HTMLAttributes } from "react";

export function Card({
  className = "",
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-border-default bg-bg-surface p-5 ${className}`}
      {...rest}
    />
  );
}

export function CardTitle({
  className = "",
  ...rest
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={`text-sm font-semibold uppercase tracking-wider text-text-muted ${className}`}
      {...rest}
    />
  );
}
