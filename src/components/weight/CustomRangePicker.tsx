"use client";

import { Input } from "@/components/ui/Input";

type Props = {
  fromDay: string;
  toDay: string;
  onChange: (next: { fromDay: string; toDay: string }) => void;
};

export function CustomRangePicker({ fromDay, toDay, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <label className="flex items-center gap-2">
        <span className="text-text-muted">From</span>
        <Input
          type="date"
          value={fromDay}
          max={toDay || undefined}
          onChange={(e) => onChange({ fromDay: e.target.value, toDay })}
          className="h-9 w-auto"
        />
      </label>
      <label className="flex items-center gap-2">
        <span className="text-text-muted">To</span>
        <Input
          type="date"
          value={toDay}
          min={fromDay || undefined}
          onChange={(e) => onChange({ fromDay, toDay: e.target.value })}
          className="h-9 w-auto"
        />
      </label>
    </div>
  );
}
