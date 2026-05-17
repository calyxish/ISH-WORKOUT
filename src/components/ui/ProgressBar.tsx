type Props = {
  value: number;
  max: number;
  className?: string;
};

export function ProgressBar({ value, max, className = "" }: Props) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full bg-bg-input ${className}`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className="h-full rounded-full bg-accent transition-[width]"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
