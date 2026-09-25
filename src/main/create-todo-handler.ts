import {
  failure,
  type Result,
  type Todo,
  type TodoRepository,
} from "../shared/todo";
import {
  createTodo,
  type CreateTodoDependencies,
} from "../features/todos/create-todo/create-todo";

function isCreateTodoRequest(request: unknown): request is { title: string } {
  if (
    typeof request !== "object" ||
    request === null ||
    Array.isArray(request)
  ) {
    return false;
  }

  const fields = Object.keys(request);
  return (
    fields.length === 1 &&
    fields[0] === "title" &&
    typeof (request as { title?: unknown }).title === "string"
  );
}

export function createTodoRequestHandler(
  repository: Pick<TodoRepository, "create">,
  dependencies?: Partial<CreateTodoDependencies>,
): (request: unknown) => Promise<Result<Todo>> {
  return (request) => {
    if (!isCreateTodoRequest(request)) {
      return Promise.resolve(failure("invalid-input"));
    }
    return createTodo(request.title, repository, dependencies);
  };
}
