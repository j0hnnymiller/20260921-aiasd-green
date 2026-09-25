import { describe, expect, it, vi } from "vitest";
import {
  failure,
  success,
  type Todo,
  type TodoRepository,
} from "../../../shared/todo";
import { createTodo } from "./create-todo";

const fixedDate = new Date("2026-09-25T12:00:00.000Z");

function createRepository() {
  return {
    create: vi.fn(async (todo: Todo) => success(todo)),
  } satisfies Pick<TodoRepository, "create">;
}

describe("createTodo", () => {
  it("trims only title boundaries and returns the durably saved active item", async () => {
    const repository = createRepository();
    const result = await createTodo(
      " \tReview the draft  TODAY\n ",
      repository,
      {
        createId: () => "todo-1",
        now: () => fixedDate,
      },
    );

    expect(result).toEqual({
      ok: true,
      value: {
        id: "todo-1",
        title: "Review the draft  TODAY",
        status: "active",
        createdAt: fixedDate.toISOString(),
      },
    });
    expect(repository.create).toHaveBeenCalledOnce();
    expect(repository.create).toHaveBeenCalledWith(
      result.ok ? result.value : null,
    );
  });

  it("rejects empty and whitespace-only titles without persisting", async () => {
    const repository = createRepository();

    for (const title of ["", "   ", "\t\n  "]) {
      await expect(createTodo(title, repository)).resolves.toEqual({
        ok: false,
        error: { code: "invalid-input" },
      });
    }

    expect(repository.create).not.toHaveBeenCalled();
  });

  it("returns repository failures without converting them to success", async () => {
    const repository = createRepository();
    repository.create.mockResolvedValue(failure("storage-unavailable"));

    await expect(createTodo("Keep this draft", repository)).resolves.toEqual({
      ok: false,
      error: { code: "storage-unavailable" },
    });
  });

  it("maps thrown persistence errors to a safe domain failure", async () => {
    const repository = createRepository();
    repository.create.mockRejectedValue(new Error("private database detail"));

    await expect(createTodo("Keep this draft", repository)).resolves.toEqual({
      ok: false,
      error: { code: "persistence-failed" },
    });
  });
});
