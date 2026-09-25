import { contextBridge, ipcRenderer } from "electron";
import type { TodoPreloadApi } from "../shared/todo";

const todoApi: TodoPreloadApi = {
  getFoundationStatus: () => ipcRenderer.invoke("app:get-foundation-status"),
};

contextBridge.exposeInMainWorld("todoApi", todoApi);
