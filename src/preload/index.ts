import { contextBridge, ipcRenderer } from "electron";
import type { TodoPreloadApi } from "../shared/todo";

const todoApi: TodoPreloadApi = {
  getFoundationStatus: () => ipcRenderer.invoke("app:get-foundation-status"),
  createTodo: (title) => ipcRenderer.invoke("todos:create", { title }),
};

contextBridge.exposeInMainWorld("todoApi", todoApi);
