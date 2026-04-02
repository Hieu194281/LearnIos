import "@testing-library/jest-dom";
import { createHabit, getHabits } from "@/lib/api";

const FAKE_HABIT = {
  id: "abc123",
  name: "Exercise",
  frequency: "daily" as const,
  days: [],
  created_at: "2026-04-02T10:00:00",
};

describe("api - createHabit", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("returns habit on success", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => FAKE_HABIT,
    });

    const result = await createHabit({ name: "Exercise", frequency: "daily", days: [] });
    expect(result).toEqual(FAKE_HABIT);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/habits/"),
      expect.objectContaining({ method: "POST" })
    );
  });

  it("throws error on 422", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: [{ msg: "String should have at least 1 character" }] }),
    });

    await expect(
      createHabit({ name: "", frequency: "daily", days: [] })
    ).rejects.toThrow("String should have at least 1 character");
  });

  it("throws generic error when detail is string", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: "Server error" }),
    });

    await expect(
      createHabit({ name: "Test", frequency: "daily", days: [] })
    ).rejects.toThrow("Server error");
  });
});

describe("api - getHabits", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("returns list of habits", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [FAKE_HABIT],
    });

    const result = await getHabits();
    expect(result).toEqual([FAKE_HABIT]);
  });

  it("returns empty array when no habits", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const result = await getHabits();
    expect(result).toEqual([]);
  });

  it("throws error on failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    await expect(getHabits()).rejects.toThrow("Failed to fetch habits");
  });
});
