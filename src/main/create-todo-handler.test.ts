import { describe, expect, it, vi } from "vitest";
import { success, type Todo, type TodoRepository } from "../shared/todo";
import { createTodoRequestHandler } from "./create-todo-handler";

function createRepository() {
  return {
    create: vi.fn(async (todo: Todo) => success(todo)),
  } satisfies Pick<TodoRepository, "create">;
}

describe("create TODO IPC request handler", () => {
  it("rejects malformed and unexpected request fields without persistence", async () => {
    const repository = createRepository();
    const handleRequest = createTodoRequestHandler(repository);

    for (const request of [
      null,
      "title",
      {},
      { title: 42 },
      { title: "x", extra: true },
    ]) {
      await expect(handleRequest(request)).resolves.toEqual({
        ok: false,
        error: { code: "invalid-input" },
      });
    }

    expect(repository.create).not.toHaveBeenCalled();
  });

  it("returns a serializable saved item through the validated request", async () => {
    const repository = createRepository();
    const handleRequest = createTodoRequestHandler(repository, {
      createId: () => "todo-ipc",
      now: () => new Date("2026-09-25T12:00:00.000Z"),
    });

    const result = await handleRequest({ title: "  Call the supplier  " });

    expect(JSON.parse(JSON.stringify(result))).toEqual({
      ok: true,
      value: {
        id: "todo-ipc",
        title: "Call the supplier",
        status: "active",
        createdAt: "2026-09-25T12:00:00.000Z",
      },
    });
    expect(repository.create).toHaveBeenCalledOnce();
  });
});
