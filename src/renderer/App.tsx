import { useEffect, useReducer, useState } from "react";
import {
  failure,
  type Result,
  type TodoError,
  type TodoErrorCode,
  type TodoRepositoryStatus,
} from "../shared/todo";
import {
  initialTodoCreationState,
  todoCreationReducer,
} from "./todo-creation-state";

function messageForError(code: TodoErrorCode): string {
  switch (code) {
    case "invalid-input":
      return "Enter a task title before saving.";
    case "storage-read-only":
      return "The local task store is read-only. Check its permissions and try again.";
    case "storage-corrupt":
      return "The local task store could not be read. Your task was not saved.";
    default:
      return "The task could not be saved. Check available disk space and try again.";
  }
}

export function App() {
  const [status, setStatus] = useState<
    Result<TodoRepositoryStatus, TodoError> | undefined
  >();
  const [creation, dispatchCreation] = useReducer(
    todoCreationReducer,
    initialTodoCreationState,
  );

  useEffect(() => {
    void window.todoApi
      .getFoundationStatus()
      .then(setStatus)
      .catch(() => setStatus(failure("storage-unavailable")));
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (creation.isSaving) {
      return;
    }

    dispatchCreation({ type: "save-started" });
    try {
      const result = await window.todoApi.createTodo(creation.draft);
      if (!result.ok) {
        dispatchCreation({ type: "save-failed", error: result.error.code });
        return;
      }

      dispatchCreation({ type: "save-succeeded", todo: result.value });
    } catch {
      dispatchCreation({ type: "save-failed", error: "persistence-failed" });
    }
  }

  return (
    <main>
      <h1>TODO List Manager</h1>
      {status === undefined ? (
        <p role="status">Checking local storage...</p>
      ) : status.ok ? (
        <p role="status">
          Local database ready (schema {status.value.schemaVersion}).
        </p>
      ) : (
        <p role="alert">
          Local storage could not be initialized. Your data was not loaded.
        </p>
      )}
      <form className="todo-entry" onSubmit={handleSubmit} noValidate>
        <label htmlFor="todo-title">Task title</label>
        <div className="todo-entry__controls">
          <input
            autoComplete="off"
            id="todo-title"
            aria-describedby={creation.error ? "todo-entry-error" : "todo-entry-hint"}
            aria-invalid={creation.error === "invalid-input"}
            onChange={(event) =>
              dispatchCreation({
                type: "draft-changed",
                draft: event.target.value,
              })
            }
            value={creation.draft}
          />
          <button disabled={creation.isSaving} type="submit">
            {creation.isSaving ? "Saving..." : "Add task"}
          </button>
        </div>
        {creation.error ? (
          <p className="todo-entry__error" id="todo-entry-error" role="alert">
            {messageForError(creation.error)}
          </p>
        ) : (
          <p className="todo-entry__hint" id="todo-entry-hint">
            Enter a task and press Enter to save it on this device.
          </p>
        )}
        <p className="todo-entry__success" role="status">
          {creation.savedMessage}
        </p>
      </form>

      <section aria-labelledby="created-todos-heading" className="todo-list">
        <h2 id="created-todos-heading">Created in this window</h2>
        <p className="todo-list__limitation">
          Previously saved tasks are not loaded in this slice.
        </p>
        {creation.todos.length > 0 && (
          <ul>
            {creation.todos.map((todo) => (
              <li key={todo.id}>
                <span>{todo.title}</span>
                <span className="todo-list__status">Active</span>
                <time dateTime={todo.createdAt}>
                  {new Date(todo.createdAt).toLocaleString()}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
