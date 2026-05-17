"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCollection } from "@/lib/hooks/useCollection";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { newId } from "@/lib/storage";
import type { WeightEntry } from "@/types";

export function WeightForm() {
  const { add } = useCollection<WeightEntry>(STORAGE_KEYS.weights);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const kg = parseFloat(value);
    if (!Number.isFinite(kg) || kg <= 0 || kg > 1000) {
      setError("Enter a weight between 0 and 1000 kg");
      return;
    }
    add({ id: newId(), kg: Math.round(kg * 10) / 10, at: Date.now() });
    setValue("");
    setError(null);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <div className="relative flex-1">
        <Input
          type="number"
          step="0.1"
          min="0"
          inputMode="decimal"
          placeholder="Weight in kg"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          aria-label="Weight in kilograms"
          aria-invalid={error != null}
          className="pr-12"
        />
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-medium text-text-muted">
          kg
        </span>
      </div>
      <Button type="submit" disabled={!value.trim()}>
        Log weight
      </Button>
      {error && (
        <p role="alert" className="text-sm text-danger sm:basis-full">
          {error}
        </p>
      )}
    </form>
  );
}
