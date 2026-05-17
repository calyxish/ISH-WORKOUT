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
import type { TodoItem } from "@/types";

type Props = {
  todo: TodoItem;
  readOnly?: boolean;
  onToggle?: () => void;
  onUpdate?: (patch: Partial<TodoItem>) => void;
  onDelete?: () => void;
};

export function TodoRow({
  todo,
  readOnly = false,
  onToggle,
  onUpdate,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [draft, setDraft] = useState(todo.text);

  function startEdit() {
    setDraft(todo.text);
    setEditing(true);
  }

  function saveEdit() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onUpdate?.({ text: trimmed });
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="flex items-center gap-2 rounded-xl border border-accent bg-bg-surface p-3">
        <Input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveEdit();
            if (e.key === "Escape") setEditing(false);
          }}
          maxLength={200}
        />
        <Button size="sm" onClick={saveEdit} aria-label="Save edit">
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
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 rounded-xl border border-border-default bg-bg-surface p-3">
      <button
        type="button"
        role="checkbox"
        aria-checked={todo.done}
        aria-label={todo.done ? "Mark as not done" : "Mark as done"}
        disabled={readOnly}
        onClick={onToggle}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition ${
          todo.done
            ? "border-accent bg-accent text-[#111110]"
            : "border-border-default bg-bg-input hover:border-accent"
        } disabled:cursor-default disabled:hover:border-border-default`}
      >
        {todo.done && <CheckIcon className="h-4 w-4" />}
      </button>

      <span
        className={`flex-1 text-base ${
          todo.done ? "text-text-muted line-through" : "text-text-primary"
        }`}
      >
        {todo.text}
      </span>

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
                aria-label="Edit todo"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setConfirming(true)}
                aria-label="Delete todo"
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
