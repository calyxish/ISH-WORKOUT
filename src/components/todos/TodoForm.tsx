"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PlusIcon } from "@/components/ui/icons";
import { useCollection } from "@/lib/hooks/useCollection";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { newId } from "@/lib/storage";
import { dayKey } from "@/lib/date";
import type { TodoItem } from "@/types";

export function TodoForm() {
  const { add } = useCollection<TodoItem>(STORAGE_KEYS.todos);
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    add({
      id: newId(),
      text: trimmed,
      done: false,
      day: dayKey(),
      createdAt: Date.now(),
    });
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="What needs to happen today?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="New todo"
        maxLength={200}
      />
      <Button type="submit" disabled={!text.trim()} aria-label="Add todo">
        <PlusIcon className="h-4 w-4" /> Add
      </Button>
    </form>
  );
}
