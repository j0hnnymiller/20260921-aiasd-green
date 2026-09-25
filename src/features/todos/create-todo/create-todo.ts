import { randomUUID } from "node:crypto";
import {
  failure,
  type Result,
  type Todo,
  type TodoRepository,
} from "../../../shared/todo";

export interface CreateTodoDependencies {
  createId: () => string;
  now: () => Date;
}

const defaultDependencies: CreateTodoDependencies = {
  createId: randomUUID,
  now: () => new Date(),
};

export async function createTodo(
  titleInput: unknown,
  repository: Pick<TodoRepository, "create">,
  dependencies: Partial<CreateTodoDependencies> = {},
): Promise<Result<Todo>> {
  if (typeof titleInput !== "string") {
    return failure("invalid-input");
  }

  const title = titleInput.trim();
  if (title.length === 0) {
    return failure("invalid-input");
  }

  try {
    return await repository.create({
      id: (dependencies.createId ?? defaultDependencies.createId)(),
      title,
      status: "active",
      createdAt: (dependencies.now ?? defaultDependencies.now)().toISOString(),
    });
  } catch {
    return failure("persistence-failed");
  }
}
