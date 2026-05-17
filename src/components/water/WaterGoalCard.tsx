"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardTitle } from "@/components/ui/Card";
import { CheckIcon, PencilIcon, TargetIcon, XIcon } from "@/components/ui/icons";
import { useValue } from "@/lib/hooks/useValue";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { DEFAULT_GOAL } from "@/lib/water";
import type { Settings } from "@/types";

const EMPTY: Settings = {};

export function WaterGoalCard() {
  const [settings, setSettings] = useValue<Settings>(
    STORAGE_KEYS.settings,
    EMPTY
  );
  const goal = settings.waterGoal ?? DEFAULT_GOAL;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(goal));

  function openEdit() {
    setDraft(String(goal));
    setEditing(true);
  }

  function save() {
    const n = parseInt(draft, 10);
    if (!Number.isFinite(n) || n < 1 || n > 30) return;
    setSettings({ ...settings, waterGoal: n });
    setEditing(false);
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <TargetIcon className="h-4 w-4 text-accent" />
          <CardTitle>Daily goal</CardTitle>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={openEdit}
            aria-label="Edit daily goal"
            className="rounded-md p-1.5 text-text-muted hover:text-text-primary"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {editing ? (
        <div className="mt-3 flex gap-2 sm:items-center">
          <div className="relative flex-1">
            <Input
              type="number"
              min="1"
              max="30"
              step="1"
              inputMode="numeric"
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="pr-14"
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-medium text-text-muted">
              cups
            </span>
          </div>
          <Button size="md" onClick={save}>
            <CheckIcon className="h-4 w-4" /> Save
          </Button>
          <Button size="md" variant="ghost" onClick={() => setEditing(false)}>
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <p className="mt-2 text-2xl font-bold text-text-primary">
          {goal}
          <span className="ml-1 text-base font-medium text-text-muted">
            cups
          </span>
        </p>
      )}
    </Card>
  );
}
