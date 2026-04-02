"use client";

import { useState } from "react";
import { Form, Input, Select, Checkbox, Button, message } from "antd";
import { Habit } from "@/types/habit";
import { createHabit } from "@/lib/api";

const DAY_OPTIONS = [
  { label: "Monday", value: "mon" },
  { label: "Tuesday", value: "tue" },
  { label: "Wednesday", value: "wed" },
  { label: "Thursday", value: "thu" },
  { label: "Friday", value: "fri" },
  { label: "Saturday", value: "sat" },
  { label: "Sunday", value: "sun" },
];

interface CreateHabitFormProps {
  onHabitCreated: (habit: Habit) => void;
}

export default function CreateHabitForm({ onHabitCreated }: CreateHabitFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [frequency, setFrequency] = useState<"daily" | "custom">("daily");

  const onFinish = async (values: { name: string; frequency: "daily" | "custom"; days?: string[] }) => {
    setLoading(true);
    try {
      const habit = await createHabit({
        name: values.name,
        frequency: values.frequency,
        days: values.days ?? [],
      });
      onHabitCreated(habit);
      form.resetFields();
      setFrequency("daily");
      message.success("Habit created!");
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Failed to create habit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ frequency: "daily", days: [] }}
      onValuesChange={(changed) => {
        if (changed.frequency) setFrequency(changed.frequency);
      }}
    >
      <Form.Item
        label="Habit Name"
        name="name"
        rules={[{ required: true, message: "Please enter a habit name" }]}
      >
        <Input placeholder="e.g. Exercise, Read, Meditate" />
      </Form.Item>

      <Form.Item label="Frequency" name="frequency">
        <Select>
          <Select.Option value="daily">Daily</Select.Option>
          <Select.Option value="custom">Custom days</Select.Option>
        </Select>
      </Form.Item>

      {frequency === "custom" && (
        <Form.Item
          label="Days"
          name="days"
          rules={[{ required: true, message: "Please select at least one day", type: "array", min: 1 }]}
        >
          <Checkbox.Group options={DAY_OPTIONS} />
        </Form.Item>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Create Habit
        </Button>
      </Form.Item>
    </Form>
  );
}
