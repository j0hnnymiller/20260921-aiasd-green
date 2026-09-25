import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const preloadSource = readFileSync(
  new URL("./index.ts", import.meta.url),
  "utf8",
);

describe("preload API boundary", () => {
  it("exposes one fixed status operation and no raw IPC object", () => {
    expect(preloadSource).toContain(
      'contextBridge.exposeInMainWorld("todoApi", todoApi)',
    );
    expect(preloadSource).toContain(
      "ipcRenderer.invoke('app:get-foundation-status')",
    );
    expect(preloadSource.match(/ipcRenderer\.invoke\(/g)).toHaveLength(1);
    expect(preloadSource).not.toMatch(/exposeInMainWorld\(['"]ipcRenderer/);
  });
});
