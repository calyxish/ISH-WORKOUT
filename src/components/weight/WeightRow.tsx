"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PencilIcon, TrashIcon, CheckIcon, XIcon } from "@/components/ui/icons";
import { formatDateTime } from "@/lib/date";
import type { WeightEntry } from "@/types";

type Props = {
  entry: WeightEntry;
  onUpdate: (patch: Partial<WeightEntry>) => void;
  onDelete: () => void;
};

function toDatetimeLocal(ms: number) {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocal(s: string): number | null {
  const ms = new Date(s).getTime();
  return Number.isFinite(ms) ? ms : null;
}

export function WeightRow({ entry, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [kgDraft, setKgDraft] = useState(String(entry.kg));
  const [atDraft, setAtDraft] = useState(toDatetimeLocal(entry.at));

  function startEdit() {
    setKgDraft(String(entry.kg));
    setAtDraft(toDatetimeLocal(entry.at));
    setEditing(true);
  }

  function save() {
    const kg = parseFloat(kgDraft);
    const at = fromDatetimeLocal(atDraft);
    if (!Number.isFinite(kg) || kg <= 0 || kg > 1000) return;
    if (at == null) return;
    onUpdate({ kg: Math.round(kg * 10) / 10, at });
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="rounded-xl border border-accent bg-bg-surface p-3">
        <div className="grid gap-2 sm:grid-cols-[1fr_1.5fr_auto]">
          <div className="relative">
            <Input
              type="number"
              step="0.1"
              inputMode="decimal"
              value={kgDraft}
              onChange={(e) => setKgDraft(e.target.value)}
              aria-label="Weight in kilograms"
              className="pr-10"
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-text-muted">
              kg
            </span>
          </div>
          <Input
            type="datetime-local"
            value={atDraft}
            onChange={(e) => setAtDraft(e.target.value)}
            aria-label="When"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={save} aria-label="Save edit">
              <CheckIcon className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditing(false)}
              aria-label="Cancel edit"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between rounded-xl border border-border-default bg-bg-surface p-3">
      <div>
        <p className="text-lg font-semibold text-text-primary">
          {entry.kg.toFixed(1)}
          <span className="ml-1 text-sm font-medium text-text-muted">kg</span>
        </p>
        <p className="text-xs text-text-muted">{formatDateTime(entry.at)}</p>
      </div>
      <div className="flex items-center gap-1">
        {confirming ? (
          <>
            <span className="mr-1 text-xs text-text-muted">Delete?</span>
            <Button
              size="sm"
              variant="danger"
              onClick={onDelete}
              aria-label="Confirm delete"
            >
              <CheckIcon className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setConfirming(false)}
              aria-label="Cancel delete"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={startEdit}
              aria-label="Edit entry"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setConfirming(true)}
              aria-label="Delete entry"
            >
              <TrashIcon className="h-4 w-4 text-danger" />
            </Button>
          </>
        )}
      </div>
    </li>
  );
}
