type Props = {
  cups: number;
  goal: number;
  size?: number;
};

/**
 * Circular progress ring. Visual fill caps at 100% so overflow doesn't render
 * past the circle; the numeric label still shows the true count.
 */
export function WaterProgressRing({ cups, goal, size = 200 }: Props) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = goal <= 0 ? 0 : Math.min(1, Math.max(0, cups / goal));
  const dash = c * pct;
  const over = cups > goal;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`${cups} of ${goal} cups`}
    >
      {/* track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--bg-input)"
        strokeWidth={stroke}
      />
      {/* progress */}
      {pct > 0 && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dasharray 250ms ease-out" }}
        />
      )}
      {/* center labels */}
      <text
        x="50%"
        y="46%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--text-primary)"
        fontSize={size * 0.28}
        fontWeight={800}
      >
        {cups}
      </text>
      <text
        x="50%"
        y="64%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--text-muted)"
        fontSize={size * 0.08}
        fontWeight={600}
      >
        {over ? `+${cups - goal} over goal` : `of ${goal} cups`}
      </text>
    </svg>
  );
}
