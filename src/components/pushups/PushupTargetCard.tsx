"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardTitle } from "@/components/ui/Card";
import { CheckIcon, PencilIcon, TargetIcon, XIcon } from "@/components/ui/icons";
import { useValue } from "@/lib/hooks/useValue";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import type { Settings } from "@/types";

const EMPTY: Settings = {};

export function PushupTargetCard() {
  const [settings, setSettings] = useValue<Settings>(
    STORAGE_KEYS.settings,
    EMPTY
  );
  const target = settings.dailyPushupGoal;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(target != null ? String(target) : "");

  function openEdit() {
    setDraft(target != null ? String(target) : "");
    setEditing(true);
  }

  function save() {
    const n = parseInt(draft, 10);
    if (!Number.isFinite(n) || n < 1 || n > 10000) return;
    setSettings({ ...settings, dailyPushupGoal: n });
    setEditing(false);
  }

  function clear() {
    const { dailyPushupGoal: _drop, ...rest } = settings;
    void _drop;
    setSettings(rest);
    setEditing(false);
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <TargetIcon className="h-4 w-4 text-accent" />
          <CardTitle>Daily push-up goal</CardTitle>
        </div>
        {!editing && target != null && (
          <button
            type="button"
            onClick={openEdit}
            aria-label="Edit daily push-up goal"
            className="rounded-md p-1.5 text-text-muted hover:text-text-primary"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {editing ? (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Input
              type="number"
              step="1"
              min="1"
              inputMode="numeric"
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="pr-14"
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-medium text-text-muted">
              reps
            </span>
          </div>
          <div className="flex gap-2">
            <Button size="md" onClick={save}>
              <CheckIcon className="h-4 w-4" /> Save
            </Button>
            <Button size="md" variant="ghost" onClick={() => setEditing(false)}>
              <XIcon className="h-4 w-4" /> Cancel
            </Button>
            {target != null && (
              <Button size="md" variant="danger" onClick={clear}>
                Clear
              </Button>
            )}
          </div>
        </div>
      ) : target == null ? (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text-muted">
            Set how many reps to hit each day.
          </p>
          <Button size="md" onClick={openEdit}>
            Set goal
          </Button>
        </div>
      ) : (
        <p className="mt-2 text-2xl font-bold text-text-primary">
          {target}
          <span className="ml-1 text-base font-medium text-text-muted">reps</span>
        </p>
      )}
    </Card>
  );
}
