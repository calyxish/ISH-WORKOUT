"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardTitle } from "@/components/ui/Card";
import { TargetIcon, PencilIcon, CheckIcon, XIcon } from "@/components/ui/icons";
import { useValue } from "@/lib/hooks/useValue";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import type { Settings } from "@/types";

type Props = {
  /** Latest weight, in kg, used to compute delta-to-target */
  latestKg?: number;
};

const EMPTY: Settings = {};

export function TargetCard({ latestKg }: Props) {
  const [settings, setSettings] = useValue<Settings>(
    STORAGE_KEYS.settings,
    EMPTY
  );
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  function openEdit() {
    setDraft(settings.targetKg != null ? String(settings.targetKg) : "");
    setEditing(true);
  }

  function save() {
    const kg = parseFloat(draft);
    if (!Number.isFinite(kg) || kg <= 0 || kg > 1000) return;
    setSettings({ ...settings, targetKg: Math.round(kg * 10) / 10 });
    setEditing(false);
  }

  function clear() {
    const { targetKg: _drop, ...rest } = settings;
    void _drop;
    setSettings(rest);
    setEditing(false);
  }

  const target = settings.targetKg;
  const delta = target != null && latestKg != null ? latestKg - target : null;

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <TargetIcon className="h-4 w-4 text-accent" />
          <CardTitle>Target</CardTitle>
        </div>
        {!editing && target != null && (
          <button
            type="button"
            onClick={openEdit}
            aria-label="Edit target"
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
              step="0.1"
              inputMode="decimal"
              placeholder="Target weight"
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="pr-12"
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-medium text-text-muted">
              kg
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
            Set a target weight to track progress.
          </p>
          <Button size="md" onClick={openEdit}>
            Set target
          </Button>
        </div>
      ) : (
        <div className="mt-2 flex items-baseline gap-3">
          <span className="text-2xl font-bold text-text-primary">
            {target.toFixed(1)}
            <span className="ml-1 text-base font-medium text-text-muted">
              kg
            </span>
          </span>
          {delta != null && (
            <span
              className={
                Math.abs(delta) < 0.05
                  ? "text-sm text-success font-medium"
                  : "text-sm text-text-muted"
              }
            >
              {Math.abs(delta) < 0.05
                ? "On target"
                : `${Math.abs(delta).toFixed(1)} kg ${
                    delta > 0 ? "to lose" : "to gain"
                  }`}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
