export type WeightEntry = {
  id: string;
  /** kilograms */
  kg: number;
  /** Unix ms timestamp */
  at: number;
};

export type TodoItem = {
  id: string;
  text: string;
  done: boolean;
  /** Day key in local time, format: YYYY-MM-DD */
  day: string;
  /** Unix ms when created */
  createdAt: number;
};

export type MealEntry = {
  id: string;
  /** Optional label, e.g. "Breakfast", "Snack" */
  label?: string;
  /** Unix ms timestamp of the meal */
  at: number;
};

export type WaterDay = {
  /** Day key, format: YYYY-MM-DD */
  day: string;
  /** Number of cups consumed */
  cups: number;
};

export type Settings = {
  /** Target weight in kilograms */
  targetKg?: number;
  /** Daily water goal in cups */
  waterGoal?: number;
};

export type Unit = "kg" | "lb";
