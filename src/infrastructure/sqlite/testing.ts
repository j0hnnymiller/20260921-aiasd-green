import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { SqliteTodoRepository } from "./sqlite-todo-repository";

export function createTemporaryTodoDatabase() {
  const directoryPath = mkdtempSync(join(tmpdir(), "todo-list-manager-"));
  const databasePath = join(directoryPath, "todos.sqlite");
  const repository = new SqliteTodoRepository(databasePath);

  return {
    databasePath,
    repository,
    close: () => repository.close(),
    dispose: () => rmSync(directoryPath, { recursive: true, force: true }),
  };
}
