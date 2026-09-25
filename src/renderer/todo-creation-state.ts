import type { Todo, TodoErrorCode } from "../shared/todo";

export interface TodoCreationState {
  draft: string;
  todos: Todo[];
  error: TodoErrorCode | undefined;
  savedMessage: string;
  isSaving: boolean;
}

export type TodoCreationAction =
  | { type: "draft-changed"; draft: string }
  | { type: "save-started" }
  | { type: "save-failed"; error: TodoErrorCode }
  | { type: "save-succeeded"; todo: Todo };

export const initialTodoCreationState: TodoCreationState = {
  draft: "",
  todos: [],
  error: undefined,
  savedMessage: "",
  isSaving: false,
};

export function todoCreationReducer(
  state: TodoCreationState,
  action: TodoCreationAction,
): TodoCreationState {
  switch (action.type) {
    case "draft-changed":
      return {
        ...state,
        draft: action.draft,
        error: undefined,
        savedMessage: "",
      };
    case "save-started":
      return {
        ...state,
        error: undefined,
        savedMessage: "",
        isSaving: true,
      };
    case "save-failed":
      return { ...state, error: action.error, isSaving: false };
    case "save-succeeded":
      return {
        ...state,
        draft: "",
        todos: [...state.todos, action.todo],
        error: undefined,
        savedMessage: "Task saved locally.",
        isSaving: false,
      };
  }
}