import { readFileSync, writeFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { afterEach, describe, expect, it } from "vitest";
import type { Todo } from "../../shared/todo";
import { createTemporaryTodoDatabase } from "./testing";

describe("temporary SQLite repository database", () => {
  let temporaryDatabase:
    | ReturnType<typeof createTemporaryTodoDatabase>
    | undefined;

  afterEach(() => {
    temporaryDatabase?.close();
    temporaryDatabase?.dispose();
    temporaryDatabase = undefined;
  });

  it("creates the version 1 TODO schema and can be initialized repeatedly", () => {
    temporaryDatabase = createTemporaryTodoDatabase();

    expect(temporaryDatabase.repository.initialize()).toEqual({
      ok: true,
      value: { schemaVersion: 1 },
    });
    expect(temporaryDatabase.repository.initialize()).toEqual({
      ok: true,
      value: { schemaVersion: 1 },
    });

    const database = new DatabaseSync(temporaryDatabase.databasePath, {
      readOnly: true,
    });
    try {
      expect(database.prepare("PRAGMA user_version").get()).toEqual({
        user_version: 1,
      });
      expect(
        database
          .prepare("PRAGMA table_info(todos)")
          .all()
          .map((column) => column.name),
      ).toEqual(["id", "title", "status", "created_at"]);
    } finally {
      database.close();
    }
  });

  it("commits a created item before returning and preserves it after reopening", async () => {
    temporaryDatabase = createTemporaryTodoDatabase();
    expect(temporaryDatabase.repository.initialize().ok).toBe(true);
    const todo: Todo = {
      id: "todo-reopen",
      title: "Review the sample",
      status: "active",
      createdAt: "2026-09-25T12:00:00.000Z",
    };

    await expect(temporaryDatabase.repository.create(todo)).resolves.toEqual({
      ok: true,
      value: todo,
    });
    temporaryDatabase.close();

    const reopenedDatabase = new DatabaseSync(temporaryDatabase.databasePath, {
      readOnly: true,
    });
    try {
      expect(
        reopenedDatabase
          .prepare(
            "SELECT id, title, status, created_at AS createdAt FROM todos",
          )
          .get(),
      ).toEqual(todo);
    } finally {
      reopenedDatabase.close();
    }
  });

  it("does not report success or leave a row when the insert transaction fails", async () => {
    temporaryDatabase = createTemporaryTodoDatabase();
    expect(temporaryDatabase.repository.initialize().ok).toBe(true);
    const database = new DatabaseSync(temporaryDatabase.databasePath);
    database.exec(`
      CREATE TRIGGER reject_todo_insert BEFORE INSERT ON todos
      BEGIN SELECT RAISE(ABORT, 'test failure'); END;
    `);
    database.close();

    await expect(
      temporaryDatabase.repository.create({
        id: "todo-failed",
        title: "Do not save",
        status: "active",
        createdAt: "2026-09-25T12:00:00.000Z",
      }),
    ).resolves.toEqual({ ok: false, error: { code: "storage-unavailable" } });

    const check = new DatabaseSync(temporaryDatabase.databasePath, {
      readOnly: true,
    });
    try {
      expect(
        check.prepare("SELECT COUNT(*) AS count FROM todos").get(),
      ).toEqual({
        count: 0,
      });
    } finally {
      check.close();
    }
  });

  it("rejects a database from a newer schema version without replacing it", () => {
    temporaryDatabase = createTemporaryTodoDatabase();
    const database = new DatabaseSync(temporaryDatabase.databasePath);
    database.exec("PRAGMA user_version = 2");
    database.close();

    expect(temporaryDatabase.repository.initialize()).toEqual({
      ok: false,
      error: { code: "storage-corrupt" },
    });

    const check = new DatabaseSync(temporaryDatabase.databasePath, {
      readOnly: true,
    });
    try {
      expect(check.prepare("PRAGMA user_version").get()).toEqual({
        user_version: 2,
      });
    } finally {
      check.close();
    }
  });

  it("rejects a schema that claims version 1 but weakens the expected table definition", () => {
    temporaryDatabase = createTemporaryTodoDatabase();
    const database = new DatabaseSync(temporaryDatabase.databasePath);
    database.exec(
      "CREATE TABLE todos (id TEXT PRIMARY KEY, title TEXT, status TEXT, created_at INTEGER); PRAGMA user_version = 1",
    );
    database.close();

    expect(temporaryDatabase.repository.initialize()).toEqual({
      ok: false,
      error: { code: "storage-corrupt" },
    });
  });

  it("maps malformed storage to a safe error and preserves the original file", () => {
    temporaryDatabase = createTemporaryTodoDatabase();
    writeFileSync(temporaryDatabase.databasePath, "not a SQLite database");

    expect(temporaryDatabase.repository.initialize()).toEqual({
      ok: false,
      error: { code: "storage-corrupt" },
    });
    expect(readFileSync(temporaryDatabase.databasePath, "utf8")).toBe(
      "not a SQLite database",
    );
  });
});
