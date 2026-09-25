import { app, BrowserWindow, ipcMain } from "electron";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  failure,
  type Result,
  type TodoError,
  type TodoRepositoryStatus,
} from "../shared/todo";
import { SqliteTodoRepository } from "../infrastructure/sqlite/sqlite-todo-repository";
import { createTodoRequestHandler } from "./create-todo-handler";
import { createMainWindowOptions } from "./window-options";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const statusChannel = "app:get-foundation-status";
const createTodoChannel = "todos:create";
const rendererUrl =
  process.env.ELECTRON_RENDERER_URL ??
  new URL(`../renderer/index.html`, import.meta.url).toString();
let foundationStatus: Result<TodoRepositoryStatus, TodoError> = failure(
  "storage-unavailable",
);
let repository: SqliteTodoRepository | undefined;

function createWindow(): void {
  const window = new BrowserWindow(
    createMainWindowOptions(join(currentDirectory, "../preload/index.cjs")),
  );

  if (process.env.ELECTRON_RENDERER_URL) {
    void window.loadURL(rendererUrl);
  } else {
    void window.loadFile(join(currentDirectory, "../renderer/index.html"));
  }
}

ipcMain.handle(statusChannel, () => foundationStatus);
ipcMain.handle(createTodoChannel, (_event, request: unknown) => {
  if (!repository) {
    return failure("storage-unavailable");
  }
  return createTodoRequestHandler(repository)(request);
});

app.whenReady().then(() => {
  repository = new SqliteTodoRepository(
    join(app.getPath("userData"), "todos.sqlite"),
  );
  foundationStatus = repository.initialize();
  if (!foundationStatus.ok) {
    console.error(
      "TODO database initialization failed:",
      foundationStatus.error.code,
    );
  }

  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("web-contents-created", (_event, contents) => {
  contents.setWindowOpenHandler(() => ({ action: "deny" }));
  contents.on("will-navigate", (event, targetUrl) => {
    if (targetUrl !== rendererUrl) {
      event.preventDefault();
    }
  });
});
