import type { SVGProps } from "react";

/**
 * Square brand mark: a stylized "I" shaped like a vertical barbell.
 * Renders well at any size — favicon, PWA icon, or header.
 */
export function Mark({
  size = 32,
  bg = "#111110",
  fg = "#C8F400",
  rounded = true,
  ...rest
}: SVGProps<SVGSVGElement> & {
  size?: number;
  bg?: string;
  fg?: string;
  rounded?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-label="ISH Workout"
      {...rest}
    >
      <rect
        width="64"
        height="64"
        rx={rounded ? 14 : 0}
        ry={rounded ? 14 : 0}
        fill={bg}
      />
      {/* Top weight plate */}
      <rect x="14" y="14" width="36" height="8" rx="2" fill={fg} />
      {/* Vertical bar (the "I") */}
      <rect x="28" y="22" width="8" height="20" fill={fg} />
      {/* Bottom weight plate */}
      <rect x="14" y="42" width="36" height="8" rx="2" fill={fg} />
    </svg>
  );
}

/**
 * Full lockup: mark + "ISH WORKOUT" wordmark.
 */
export function Logo({
  height = 28,
  className,
}: {
  height?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 ${className ?? ""}`}
      aria-label="ISH Workout"
    >
      <Mark size={height} />
      <span className="flex flex-col leading-none">
        <span
          className="font-black tracking-tight text-text-primary"
          style={{ fontSize: height * 0.62 }}
        >
          ISH
        </span>
        <span
          className="font-medium uppercase tracking-[0.18em] text-text-muted"
          style={{ fontSize: height * 0.28, marginTop: height * 0.06 }}
        >
          Workout
        </span>
      </span>
    </span>
  );
}
