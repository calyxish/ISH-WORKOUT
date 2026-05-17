"use client";

import { useMemo } from "react";
import { TodoForm } from "./TodoForm";
import { TodoRow } from "./TodoRow";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCollection } from "@/lib/hooks/useCollection";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { dayKey } from "@/lib/date";
import type { TodoItem } from "@/types";

export function TodayTodos() {
  const { items, hydrated, update, remove } = useCollection<TodoItem>(
    STORAGE_KEYS.todos
  );

  const today = dayKey();
  const todays = useMemo(
    () =>
      items
        .filter((t) => t.day === today)
        .sort((a, b) => a.createdAt - b.createdAt),
    [items, today]
  );

  const done = todays.filter((t) => t.done).length;
  const total = todays.length;

  return (
    <section aria-label="Today's todos">
      <div className="mb-3 flex items-end justify-between gap-3">
        <CardTitle>Today</CardTitle>
        {hydrated && total > 0 && (
          <span className="text-sm font-medium text-text-muted">
            <span className="text-text-primary">{done}</span> / {total} done
          </span>
        )}
      </div>

      {hydrated && total > 0 && (
        <ProgressBar value={done} max={total} className="mb-4" />
      )}

      <div className="mb-4">
        <TodoForm />
      </div>

      {!hydrated ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-xl bg-bg-surface"
              aria-hidden
            />
          ))}
        </div>
      ) : total === 0 ? (
        <EmptyState
          title="Nothing on the list yet"
          description="Add something above to get started."
        />
      ) : (
        <ul className="space-y-2">
          {todays.map((todo) => (
            <TodoRow
              key={todo.id}
              todo={todo}
              onToggle={() => update(todo.id, { done: !todo.done })}
              onUpdate={(patch) => update(todo.id, patch)}
              onDelete={() => remove(todo.id)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
