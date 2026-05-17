"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PlusIcon } from "@/components/ui/icons";
import { useCollection } from "@/lib/hooks/useCollection";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { newId } from "@/lib/storage";
import type { PushupEntry } from "@/types";

export function PushupForm() {
  const { add } = useCollection<PushupEntry>(STORAGE_KEYS.pushups);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const reps = parseInt(value, 10);
    if (!Number.isFinite(reps) || reps <= 0 || reps > 10000) {
      setError("Enter a positive number of reps");
      return;
    }
    add({ id: newId(), reps, at: Date.now() });
    setValue("");
    setError(null);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <div className="relative flex-1">
        <Input
          type="number"
          step="1"
          min="1"
          inputMode="numeric"
          placeholder="Reps in this set"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          aria-label="Reps in this set"
          aria-invalid={error != null}
          className="pr-14"
        />
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-medium text-text-muted">
          reps
        </span>
      </div>
      <Button type="submit" disabled={!value.trim()}>
        <PlusIcon className="h-4 w-4" /> Log set
      </Button>
      {error && (
        <p role="alert" className="text-sm text-danger sm:basis-full">
          {error}
        </p>
      )}
    </form>
  );
}
