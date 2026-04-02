"use client";

import { Tag, Empty, Typography } from "antd";
import { Habit } from "@/types/habit";

const DAY_LABELS: Record<string, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

interface HabitListProps {
  habits: Habit[];
}

export default function HabitList({ habits }: HabitListProps) {
  if (habits.length === 0) {
    return <Empty description="No habits yet. Create your first one!" />;
  }

  return (
    <div>
      {habits.map((habit) => (
        <div
          key={habit.id}
          style={{
            padding: "12px 0",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Typography.Text strong style={{ display: "block", marginBottom: 6 }}>
            {habit.name}
          </Typography.Text>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Tag color={habit.frequency === "daily" ? "blue" : "purple"}>
              {habit.frequency === "daily" ? "Daily" : "Custom"}
            </Tag>
            {habit.frequency === "custom" &&
              habit.days.map((day) => (
                <Tag key={day}>{DAY_LABELS[day] ?? day}</Tag>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
