import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import HabitList from "@/components/HabitList";
import { Habit } from "@/types/habit";

const DAILY_HABIT: Habit = {
  id: "1",
  name: "Exercise",
  frequency: "daily",
  days: [],
  created_at: "2026-04-02T10:00:00",
};

const CUSTOM_HABIT: Habit = {
  id: "2",
  name: "Read",
  frequency: "custom",
  days: ["mon", "wed", "fri"],
  created_at: "2026-04-02T11:00:00",
};

describe("HabitList", () => {
  it("shows empty state when no habits", () => {
    render(<HabitList habits={[]} />);
    expect(screen.getByText(/no habits yet/i)).toBeInTheDocument();
  });

  it("renders a daily habit", () => {
    render(<HabitList habits={[DAILY_HABIT]} />);
    expect(screen.getByText("Exercise")).toBeInTheDocument();
    expect(screen.getByText("Daily")).toBeInTheDocument();
  });

  it("renders a custom habit with day tags", () => {
    render(<HabitList habits={[CUSTOM_HABIT]} />);
    expect(screen.getByText("Read")).toBeInTheDocument();
    expect(screen.getByText("Custom")).toBeInTheDocument();
    expect(screen.getByText("Mon")).toBeInTheDocument();
    expect(screen.getByText("Wed")).toBeInTheDocument();
    expect(screen.getByText("Fri")).toBeInTheDocument();
  });

  it("renders multiple habits", () => {
    render(<HabitList habits={[DAILY_HABIT, CUSTOM_HABIT]} />);
    expect(screen.getByText("Exercise")).toBeInTheDocument();
    expect(screen.getByText("Read")).toBeInTheDocument();
  });
});
