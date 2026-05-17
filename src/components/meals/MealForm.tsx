"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PlusIcon } from "@/components/ui/icons";
import { useCollection } from "@/lib/hooks/useCollection";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { newId } from "@/lib/storage";
import { toDatetimeLocal, fromDatetimeLocal } from "@/lib/datetime-local";
import type { MealEntry } from "@/types";

export function MealForm() {
  const { add } = useCollection<MealEntry>(STORAGE_KEYS.meals);
  const [label, setLabel] = useState("");
  const [when, setWhen] = useState(() => toDatetimeLocal(Date.now()));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const at = fromDatetimeLocal(when) ?? Date.now();
    const trimmed = label.trim();
    add({
      id: newId(),
      at,
      ...(trimmed ? { label: trimmed } : {}),
    });
    setLabel("");
    setWhen(toDatetimeLocal(Date.now()));
  }

  function setNow() {
    setWhen(toDatetimeLocal(Date.now()));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-[1.4fr_1fr_auto]">
        <Input
          type="text"
          placeholder="Label (optional) — e.g. Breakfast"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          aria-label="Meal label"
          maxLength={60}
        />
        <div className="flex gap-2">
          <Input
            type="datetime-local"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            aria-label="When"
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={setNow}
            aria-label="Set to now"
          >
            Now
          </Button>
        </div>
        <Button type="submit" aria-label="Log meal">
          <PlusIcon className="h-4 w-4" /> Log
        </Button>
      </div>
    </form>
  );
}
