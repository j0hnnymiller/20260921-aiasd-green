import { useEffect, useState } from "react";
import {
  failure,
  type Result,
  type TodoError,
  type TodoRepositoryStatus,
} from "../shared/todo";

export function App() {
  const [status, setStatus] = useState<
    Result<TodoRepositoryStatus, TodoError> | undefined
  >();

  useEffect(() => {
    void window.todoApi
      .getFoundationStatus()
      .then(setStatus)
      .catch(() => setStatus(failure("storage-unavailable")));
  }, []);

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
    </main>
  );
}
