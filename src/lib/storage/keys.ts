export const STORAGE_KEYS = {
  weights: "ish:weights",
  pushups: "ish:pushups",
  todos: "ish:todos",
  todosCarryDay: "ish:todos-carry-day",
  meals: "ish:meals",
  water: "ish:water",
  settings: "ish:settings",
  theme: "ish:theme",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
