export type TodoStatus = "active" | "completed";

export interface Todo {
  id: string;
  title: string;
  status: TodoStatus;
  createdAt: string;
}

export type TodoErrorCode =
  | "invalid-input"
  | "not-found"
  | "storage-unavailable"
  | "storage-read-only"
  | "storage-corrupt"
  | "persistence-failed";

export interface TodoError {
  code: TodoErrorCode;
}

export type Result<T, E = TodoError> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export interface TodoRepositoryStatus {
  schemaVersion: number;
}

export interface TodoRepository {
  initialize(): Result<TodoRepositoryStatus>;
  loadAll(): Promise<Result<Todo[]>>;
  create(todo: Todo): Promise<Result<Todo>>;
  update(todo: Todo): Promise<Result<Todo>>;
  setCompletion(id: string, status: TodoStatus): Promise<Result<Todo>>;
  delete(id: string): Promise<Result<void>>;
}

export interface TodoRepositoryInitializer {
  initialize(): Result<TodoRepositoryStatus>;
}

export interface AppFoundationStatus {
  schemaVersion: number;
}

export interface TodoPreloadApi {
  getFoundationStatus(): Promise<Result<AppFoundationStatus>>;
  createTodo(title: string): Promise<Result<Todo>>;
}

export function success<T>(value: T): Result<T> {
  return { ok: true, value };
}

export function failure(code: TodoErrorCode): Result<never> {
  return { ok: false, error: { code } };
}
