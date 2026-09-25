import { describe, expect, it } from "vitest";
import type { Todo } from "../shared/todo";
import {
  initialTodoCreationState,
  todoCreationReducer,
} from "./todo-creation-state";

const savedTodo: Todo = {
  id: "todo-1",
  title: "Review the draft",
  status: "active",
  createdAt: "2026-09-25T12:00:00.000Z",
};

describe("todo creation view state", () => {
  it("keeps the draft and list unchanged after a failed save", () => {
    const draftState = todoCreationReducer(initialTodoCreationState, {
      type: "draft-changed",
      draft: "Keep this draft",
    });
    const savingState = todoCreationReducer(draftState, {
      type: "save-started",
    });
    const failedState = todoCreationReducer(savingState, {
      type: "save-failed",
      error: "storage-unavailable",
    });

    expect(failedState).toMatchObject({
      draft: "Keep this draft",
      todos: [],
      error: "storage-unavailable",
      isSaving: false,
    });
  });

  it("appends the saved item and clears the draft only on success", () => {
    const draftState = todoCreationReducer(initialTodoCreationState, {
      type: "draft-changed",
      draft: "Review the draft",
    });
    const savingState = todoCreationReducer(draftState, {
      type: "save-started",
    });
    const savedState = todoCreationReducer(savingState, {
      type: "save-succeeded",
      todo: savedTodo,
    });

    expect(savedState).toMatchObject({
      draft: "",
      todos: [savedTodo],
      error: undefined,
      savedMessage: "Task saved locally.",
      isSaving: false,
    });
  });
});
