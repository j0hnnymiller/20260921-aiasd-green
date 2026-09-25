import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";
import {
  failure,
  success,
  type Result,
  type TodoErrorCode,
  type TodoRepositoryInitializer,
  type TodoRepositoryStatus,
} from "../../shared/todo";

const currentSchemaVersion = 1;
const expectedColumns = ["id", "title", "status", "created_at"];

function hasExpectedTodoSchema(database: DatabaseSync): boolean {
  const columns = database.prepare("PRAGMA table_info(todos)").all() as Array<{
    name: string;
  }>;
  return (
    JSON.stringify(columns.map((column) => column.name)) ===
    JSON.stringify(expectedColumns)
  );
}

function mapDatabaseFailure(error: unknown): TodoErrorCode {
  if (error instanceof Error) {
    const errorCode =
      "code" in error && typeof error.code === "string" ? error.code : "";
    if (errorCode.includes("READONLY")) {
      return "storage-read-only";
    }
    if (
      errorCode.includes("NOTADB") ||
      errorCode.includes("CORRUPT") ||
      error.message.toLowerCase().includes("not a database")
    ) {
      return "storage-corrupt";
    }
  }
  return "storage-unavailable";
}

export class SqliteTodoRepository implements TodoRepositoryInitializer {
  private database: DatabaseSync | undefined;

  constructor(private readonly databasePath: string) {}

  initialize(): Result<TodoRepositoryStatus> {
    let database: DatabaseSync | undefined;

    try {
      mkdirSync(dirname(this.databasePath), { recursive: true });
      database = new DatabaseSync(this.databasePath);
      database.exec("PRAGMA busy_timeout = 5000; PRAGMA foreign_keys = ON;");

      const integrity = database.prepare("PRAGMA quick_check").get() as
        | { quick_check: string }
        | undefined;
      if (integrity?.quick_check !== "ok") {
        database.close();
        return failure("storage-corrupt");
      }

      const versionRow = database.prepare("PRAGMA user_version").get() as
        | { user_version: number }
        | undefined;
      const version = versionRow?.user_version ?? 0;
      if (version > currentSchemaVersion) {
        database.close();
        return failure("storage-corrupt");
      }

      const existingTable = database
        .prepare(
          "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'todos'",
        )
        .get();
      if (version === 0 && existingTable !== undefined) {
        database.close();
        return failure("storage-corrupt");
      }

      if (version < currentSchemaVersion) {
        database.exec("BEGIN IMMEDIATE");
        try {
          database.exec(`
            CREATE TABLE IF NOT EXISTS todos (
              id TEXT PRIMARY KEY NOT NULL,
              title TEXT NOT NULL CHECK (length(trim(title)) > 0),
              status TEXT NOT NULL CHECK (status IN ('active', 'completed')),
              created_at TEXT NOT NULL
            );
            PRAGMA user_version = ${currentSchemaVersion};
          `);
          database.exec("COMMIT");
        } catch (error: unknown) {
          database.exec("ROLLBACK");
          database.close();
          return failure(mapDatabaseFailure(error));
        }
      }

      if (!hasExpectedTodoSchema(database)) {
        database.close();
        return failure("storage-corrupt");
      }

      this.database?.close();
      this.database = database;
      return success({ schemaVersion: currentSchemaVersion });
    } catch (error: unknown) {
      try {
        database?.close();
      } catch {
        return failure(mapDatabaseFailure(error));
      }
      return failure(mapDatabaseFailure(error));
    }
  }

  close(): void {
    this.database?.close();
    this.database = undefined;
  }
}
