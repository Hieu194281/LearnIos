"use client";

import { useEffect, useState } from "react";
import { Layout, Typography, Card, Spin } from "antd";
import CreateHabitForm from "@/components/CreateHabitForm";
import HabitList from "@/components/HabitList";
import { Habit } from "@/types/habit";
import { getHabits } from "@/lib/api";

const { Content } = Layout;
const { Title } = Typography;

export default function HomePage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHabits()
      .then(setHabits)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleHabitCreated = (habit: Habit) => {
    setHabits((prev) => [habit, ...prev]);
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Content style={{ maxWidth: 600, margin: "0 auto", padding: "40px 16px" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
          Habit Tracker
        </Title>

        <Card title="Create New Habit" style={{ marginBottom: 24 }}>
          <CreateHabitForm onHabitCreated={handleHabitCreated} />
        </Card>

        <Card title={`My Habits (${habits.length})`}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 32 }}>
              <Spin size="large" />
            </div>
          ) : (
            <HabitList habits={habits} />
          )}
        </Card>
      </Content>
    </Layout>
  );
}
