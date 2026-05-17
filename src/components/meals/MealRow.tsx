"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  CheckIcon,
  PencilIcon,
  TrashIcon,
  XIcon,
} from "@/components/ui/icons";
import { formatTime } from "@/lib/date";
import { fromDatetimeLocal, toDatetimeLocal } from "@/lib/datetime-local";
import type { MealEntry } from "@/types";

type Props = {
  meal: MealEntry;
  readOnly?: boolean;
  onUpdate?: (patch: Partial<MealEntry>) => void;
  onDelete?: () => void;
};

export function MealRow({ meal, readOnly = false, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [labelDraft, setLabelDraft] = useState(meal.label ?? "");
  const [atDraft, setAtDraft] = useState(toDatetimeLocal(meal.at));

  function startEdit() {
    setLabelDraft(meal.label ?? "");
    setAtDraft(toDatetimeLocal(meal.at));
    setEditing(true);
  }

  function save() {
    const at = fromDatetimeLocal(atDraft);
    if (at == null) return;
    const trimmed = labelDraft.trim();
    onUpdate?.({
      at,
      label: trimmed ? trimmed : undefined,
    });
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="rounded-xl border border-accent bg-bg-surface p-3">
        <div className="grid gap-2 sm:grid-cols-[1.2fr_1fr_auto]">
          <Input
            type="text"
            placeholder="Label (optional)"
            value={labelDraft}
            onChange={(e) => setLabelDraft(e.target.value)}
            maxLength={60}
          />
          <Input
            type="datetime-local"
            value={atDraft}
            onChange={(e) => setAtDraft(e.target.value)}
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
          {formatTime(meal.at)}
        </span>
        <span
          className={`truncate text-base ${
            meal.label ? "text-text-primary" : "text-text-muted italic"
          }`}
        >
          {meal.label ?? "Meal"}
        </span>
      </div>

      {!readOnly && (
        <div className="flex items-center gap-1">
          {confirming ? (
            <>
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
                aria-label="Edit meal"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setConfirming(true)}
                aria-label="Delete meal"
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
