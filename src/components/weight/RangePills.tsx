"use client";

import type { Range } from "@/lib/weight/bucket";

const ITEMS: { value: Range; label: string }[] = [
  { value: "1H", label: "1H" },
  { value: "24H", label: "24H" },
  { value: "7D", label: "7D" },
  { value: "30D", label: "30D" },
  { value: "1Y", label: "1Y" },
  { value: "ALL", label: "All" },
  { value: "CUSTOM", label: "Custom" },
];

type Props = {
  value: Range;
  onChange: (range: Range) => void;
};

export function RangePills({ value, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Time range"
      className="flex flex-wrap gap-1 rounded-xl border border-border-default bg-bg-surface p-1"
    >
      {ITEMS.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={`h-8 rounded-lg px-3 text-xs font-semibold transition ${
              active
                ? "bg-accent text-[#111110]"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
