import type { Todo } from "./todo";

export function createTodoFixture(overrides: Partial<Todo> = {}): Todo {
  return {
    id: "todo-fixture-001",
    title: "Fixture task",
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}
