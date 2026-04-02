export interface Habit {
  id: string;
  name: string;
  frequency: "daily" | "custom";
  days: string[];
  created_at: string;
}

export interface CreateHabitPayload {
  name: string;
  frequency: "daily" | "custom";
  days: string[];
}
