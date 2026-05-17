import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  label: string;
  primary: ReactNode;
  secondary?: ReactNode;
  meta?: ReactNode;
};

/**
 * Dashboard snapshot tile. Big stat up top, secondary line below, optional
 * meta row at the bottom (e.g. progress bar). Tap-through to the feature.
 */
export function Tile({ href, label, primary, secondary, meta }: Props) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-2xl border border-border-default bg-bg-surface p-5 transition hover:border-accent"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {label}
        </span>
        <span className="text-accent transition-transform group-hover:translate-x-0.5">
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 6 6 6-6 6" />
          </svg>
        </span>
      </div>
      <div className="text-2xl font-bold text-text-primary">{primary}</div>
      {secondary && (
        <div className="text-sm text-text-muted">{secondary}</div>
      )}
      {meta && <div className="mt-1">{meta}</div>}
    </Link>
  );
}

export function TileSkeleton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-3 rounded-2xl border border-border-default bg-bg-surface p-5"
      aria-hidden
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {label}
        </span>
      </div>
      <div className="h-7 w-24 rounded bg-bg-input animate-pulse" />
      <div className="h-4 w-32 rounded bg-bg-input animate-pulse" />
    </Link>
  );
}
