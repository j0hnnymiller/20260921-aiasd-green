import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const preloadSource = readFileSync(
  new URL("./index.ts", import.meta.url),
  "utf8",
);

describe("preload API boundary", () => {
  it("exposes only fixed status and create operations, not raw IPC", () => {
    expect(preloadSource).toContain(
      'contextBridge.exposeInMainWorld("todoApi", todoApi)',
    );
    expect(preloadSource).toMatch(
      /ipcRenderer\.invoke\(["']app:get-foundation-status["']\)/,
    );
    expect(preloadSource).toMatch(
      /ipcRenderer\.invoke\(["']todos:create["'], \{ title \}\)/,
    );
    expect(preloadSource.match(/ipcRenderer\.invoke\(/g)).toHaveLength(2);
    expect(preloadSource).not.toMatch(/exposeInMainWorld\(['"]ipcRenderer/);
  });
});
