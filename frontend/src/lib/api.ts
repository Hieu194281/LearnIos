import { Habit, CreateHabitPayload } from "@/types/habit";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function createHabit(payload: CreateHabitPayload): Promise<Habit> {
  const res = await fetch(`${API_BASE}/api/habits/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json();
    const msg = Array.isArray(error.detail)
      ? error.detail[0]?.msg
      : error.detail;
    throw new Error(msg || "Failed to create habit");
  }
  return res.json();
}

export async function getHabits(): Promise<Habit[]> {
  const res = await fetch(`${API_BASE}/api/habits/`);
  if (!res.ok) throw new Error("Failed to fetch habits");
  return res.json();
}
