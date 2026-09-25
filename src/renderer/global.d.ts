import type { TodoPreloadApi } from "../shared/todo";

declare global {
  interface Window {
    todoApi: TodoPreloadApi;
  }
}

export {};
