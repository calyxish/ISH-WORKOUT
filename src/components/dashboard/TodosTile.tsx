"use client";

import { Tile, TileSkeleton } from "@/components/ui/Tile";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useCollection } from "@/lib/hooks/useCollection";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { dayKey } from "@/lib/date";
import type { TodoItem } from "@/types";

export function TodosTile() {
  const { items, hydrated } = useCollection<TodoItem>(STORAGE_KEYS.todos);
  if (!hydrated) return <TileSkeleton href="/todos" label="Today's todos" />;

  const today = dayKey();
  const todays = items.filter((t) => t.day === today);
  const done = todays.filter((t) => t.done).length;
  const total = todays.length;

  if (total === 0) {
    return (
      <Tile
        href="/todos"
        label="Today's todos"
        primary={<span className="text-text-muted">No todos</span>}
        secondary="Tap to plan your day"
      />
    );
  }

  return (
    <Tile
      href="/todos"
      label="Today's todos"
      primary={
        <>
          {done}
          <span className="text-text-muted"> / {total}</span>
        </>
      }
      secondary={
        done === total ? "All done — nice." : `${total - done} left`
      }
      meta={<ProgressBar value={done} max={total} />}
    />
  );
}
