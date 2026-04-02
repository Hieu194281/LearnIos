import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as api from "@/lib/api";

jest.mock("@/lib/api");
const mockCreateHabit = api.createHabit as jest.MockedFunction<typeof api.createHabit>;

// Mock antd to avoid React 19 + jsdom CSS-in-JS compatibility issues
jest.mock("antd", () => {
  const MockSelect = ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <select {...(props as object)}>{children}</select>;
  MockSelect.Option = ({ value, children }: { value: string; children: React.ReactNode }) => (
    <option value={value}>{children}</option>
  );

  const MockForm = ({
    children,
    onFinish,
    onValuesChange,
  }: {
    children: React.ReactNode;
    onFinish?: (values: Record<string, unknown>) => void;
    initialValues?: Record<string, unknown>;
    onValuesChange?: (changed: Record<string, unknown>) => void;
  }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      const name = (data.get("name") as string) ?? "";
      const frequency = (data.get("frequency") as string) ?? "daily";
      onFinish?.({ name, frequency, days: [] });
    };
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (e.target.name === "frequency") {
        onValuesChange?.({ frequency: e.target.value });
      }
    };
    return (
      <form data-testid="habit-form" onSubmit={handleSubmit} onChange={handleChange as unknown as React.FormEventHandler}>
        {children}
      </form>
    );
  };
  MockForm.Item = ({
    children,
    label,
    name,
  }: {
    children: React.ReactNode;
    label?: string;
    name?: string;
    rules?: unknown[];
  }) => (
    <div>
      {label && <label>{label}</label>}
      {name && React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<{ name?: string }>, { name })
        : children}
    </div>
  );
  MockForm.useForm = () => [{ resetFields: jest.fn() }];

  return {
    Form: MockForm,
    Input: ({ placeholder, name, ...props }: { placeholder?: string; name?: string }) => (
      <input name={name} placeholder={placeholder} {...props} />
    ),
    Select: MockSelect,
    Checkbox: {
      Group: () => <div data-testid="checkbox-group" />,
    },
    Button: ({
      children,
      htmlType,
      loading,
    }: {
      children: React.ReactNode;
      htmlType?: string;
      loading?: boolean;
    }) => (
      <button type={htmlType as "submit" | "button" | "reset"} disabled={loading}>
        {children}
      </button>
    ),
    message: { success: jest.fn(), error: jest.fn() },
    App: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

import CreateHabitForm from "@/components/CreateHabitForm";

const CREATED_HABIT = {
  id: "abc123",
  name: "Exercise",
  frequency: "daily" as const,
  days: [],
  created_at: "2026-04-02T10:00:00",
};

describe("CreateHabitForm", () => {
  const onHabitCreated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders name input and submit button", () => {
    render(<CreateHabitForm onHabitCreated={onHabitCreated} />);
    expect(screen.getByPlaceholderText(/e.g. Exercise/i)).toBeInTheDocument();
    expect(screen.getByText("Create Habit")).toBeInTheDocument();
  });

  it("calls createHabit with correct values on submit", async () => {
    mockCreateHabit.mockResolvedValueOnce(CREATED_HABIT);
    render(<CreateHabitForm onHabitCreated={onHabitCreated} />);

    await userEvent.type(screen.getByPlaceholderText(/e.g. Exercise/i), "Exercise");
    fireEvent.submit(screen.getByTestId("habit-form"));

    await waitFor(() => {
      expect(mockCreateHabit).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Exercise", frequency: "daily" })
      );
    });
  });

  it("calls onHabitCreated after successful creation", async () => {
    mockCreateHabit.mockResolvedValueOnce(CREATED_HABIT);
    render(<CreateHabitForm onHabitCreated={onHabitCreated} />);

    await userEvent.type(screen.getByPlaceholderText(/e.g. Exercise/i), "Exercise");
    fireEvent.submit(screen.getByTestId("habit-form"));

    await waitFor(() => {
      expect(onHabitCreated).toHaveBeenCalledWith(CREATED_HABIT);
    });
  });

  it("does not call onHabitCreated when api throws", async () => {
    mockCreateHabit.mockRejectedValueOnce(new Error("Server error"));
    render(<CreateHabitForm onHabitCreated={onHabitCreated} />);

    await userEvent.type(screen.getByPlaceholderText(/e.g. Exercise/i), "Oops");
    fireEvent.submit(screen.getByTestId("habit-form"));

    await waitFor(() => {
      expect(onHabitCreated).not.toHaveBeenCalled();
    });
  });
});
