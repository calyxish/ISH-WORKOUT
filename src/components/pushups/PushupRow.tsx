"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CheckIcon, PencilIcon, TrashIcon, XIcon } from "@/components/ui/icons";
import { formatTime } from "@/lib/date";
import { toDatetimeLocal, fromDatetimeLocal } from "@/lib/datetime-local";
import type { PushupEntry } from "@/types";

type Props = {
  entry: PushupEntry;
  readOnly?: boolean;
  onUpdate?: (patch: Partial<PushupEntry>) => void;
  onDelete?: () => void;
};

export function PushupRow({ entry, readOnly = false, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [repsDraft, setRepsDraft] = useState(String(entry.reps));
  const [atDraft, setAtDraft] = useState(toDatetimeLocal(entry.at));

  function startEdit() {
    setRepsDraft(String(entry.reps));
    setAtDraft(toDatetimeLocal(entry.at));
    setEditing(true);
  }

  function save() {
    const reps = parseInt(repsDraft, 10);
    const at = fromDatetimeLocal(atDraft);
    if (!Number.isFinite(reps) || reps <= 0 || reps > 10000) return;
    if (at == null) return;
    onUpdate?.({ reps, at });
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="rounded-xl border border-accent bg-bg-surface p-3">
        <div className="grid gap-2 sm:grid-cols-[1fr_1.5fr_auto]">
          <div className="relative">
            <Input
              type="number"
              step="1"
              min="1"
              inputMode="numeric"
              value={repsDraft}
              onChange={(e) => setRepsDraft(e.target.value)}
              aria-label="Reps"
              className="pr-12"
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-text-muted">
              reps
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
    <li className="flex items-center justify-between gap-3 rounded-xl border border-border-default bg-bg-surface p-3">
      <div className="flex min-w-0 items-baseline gap-3">
        <span className="shrink-0 font-mono text-sm font-semibold text-accent">
          {formatTime(entry.at)}
        </span>
        <span className="text-base text-text-primary">
          <span className="font-semibold">{entry.reps}</span>
          <span className="ml-1 text-sm text-text-muted">reps</span>
        </span>
      </div>

      {!readOnly && (
        <div className="flex items-center gap-1">
          {confirming ? (
            <>
              <Button size="sm" variant="danger" onClick={onDelete} aria-label="Confirm delete">
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
              <Button size="sm" variant="ghost" onClick={startEdit} aria-label="Edit set">
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setConfirming(true)}
                aria-label="Delete set"
              >
                <TrashIcon className="h-4 w-4 text-danger" />
              </Button>
            </>
          )}
        </div>
      )}
    </li>
  );
}
