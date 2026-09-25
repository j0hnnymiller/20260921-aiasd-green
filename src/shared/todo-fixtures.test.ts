import { describe, expect, it } from "vitest";
import { createTodoFixture } from "./todo-fixtures";

describe("TODO fixtures", () => {
  it("returns deterministic default values and permits explicit overrides", () => {
    expect(createTodoFixture()).toEqual(createTodoFixture());
    expect(createTodoFixture({ status: "completed" })).toMatchObject({
      id: "todo-fixture-001",
      status: "completed",
      createdAt: "2026-01-01T00:00:00.000Z",
    });
  });
});
