import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";
import { DatabaseSync } from "node:sqlite";

if (process.platform !== "win32" || process.arch !== "x64") {
  throw new Error(
    "The Slice 0 packaged-like smoke launch currently targets Windows x64 only.",
  );
}

const require = createRequire(import.meta.url);
const electronBinary = require("electron");
const projectRoot = resolve(import.meta.dirname, "..");
const profilePath = mkdtempSync(join(tmpdir(), "todo-list-manager-smoke-"));
const databasePath = join(profilePath, "todos.sqlite");
const interactiveDemo = process.argv.includes("--interactive");
const child = spawn(
  electronBinary,
  [".", `--user-data-dir=${profilePath}`, "--disable-gpu"],
  {
    cwd: projectRoot,
    stdio: "ignore",
  },
);

let launchError;
child.once("error", (error) => {
  launchError = error;
});

try {
  const deadline = Date.now() + 30000;
  let schemaVerified = false;

  while (Date.now() < deadline) {
    if (launchError) {
      throw launchError;
    }
    if (child.exitCode !== null) {
      throw new Error(
        `Electron exited before initializing the disposable database (${child.exitCode}).`,
      );
    }
    try {
      const database = new DatabaseSync(databasePath, { readOnly: true });
      try {
        const version = database.prepare("PRAGMA user_version").get();
        const columns = database
          .prepare("PRAGMA table_info(todos)")
          .all()
          .map((column) => column.name);
        schemaVerified =
          version?.user_version === 1 &&
          JSON.stringify(columns) ===
            JSON.stringify(["id", "title", "status", "created_at"]);
      } finally {
        database.close();
      }
      if (schemaVerified) {
        break;
      }
    } catch {
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 250));
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 250));
  }

  if (!schemaVerified) {
    throw new Error(
      "Timed out waiting for the version 1 schema in the disposable profile.",
    );
  }
  console.log("PASS: Electron initialized schema v1 in a disposable profile.");
  if (interactiveDemo) {
    console.log(
      "Disposable demo is open. Close the application window to remove its profile.",
    );
    await new Promise((resolveClose) => child.once("close", resolveClose));
  }
} finally {
  child.kill();
  await new Promise((resolveClose) => {
    if (child.exitCode !== null) {
      resolveClose();
    } else {
      child.once("close", resolveClose);
    }
  });
  rmSync(profilePath, { recursive: true, force: true });
}
