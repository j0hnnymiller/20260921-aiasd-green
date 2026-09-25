import { readFileSync, writeFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { afterEach, describe, expect, it } from "vitest";
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

  it("rejects a schema that claims version 1 but has an unexpected shape", () => {
    temporaryDatabase = createTemporaryTodoDatabase();
    const database = new DatabaseSync(temporaryDatabase.databasePath);
    database.exec(
      "CREATE TABLE todos (id TEXT PRIMARY KEY); PRAGMA user_version = 1",
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
