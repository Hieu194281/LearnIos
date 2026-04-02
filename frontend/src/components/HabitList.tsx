"use client";

import { List, Tag, Empty, Typography } from "antd";
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
    <List
      dataSource={habits}
      renderItem={(habit) => (
        <List.Item>
          <List.Item.Meta
            title={<Typography.Text strong>{habit.name}</Typography.Text>}
            description={
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                <Tag color={habit.frequency === "daily" ? "blue" : "purple"}>
                  {habit.frequency === "daily" ? "Daily" : "Custom"}
                </Tag>
                {habit.frequency === "custom" &&
                  habit.days.map((day) => (
                    <Tag key={day}>{DAY_LABELS[day] ?? day}</Tag>
                  ))}
              </div>
            }
          />
        </List.Item>
      )}
    />
  );
}
