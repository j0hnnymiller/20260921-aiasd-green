import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const rendererDirectory = fileURLToPath(new URL(".", import.meta.url));

function readRendererSources(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return readRendererSources(path);
    }
    return /\.(ts|tsx|js|jsx)$/.test(entry.name) &&
      !entry.name.endsWith(".test.ts")
      ? [readFileSync(path, "utf8")]
      : [];
  });
}

describe("renderer process boundary", () => {
  it("does not import privileged runtime, filesystem, or SQLite modules", () => {
    const rendererSource = readRendererSources(rendererDirectory).join("\n");

    expect(rendererSource).not.toMatch(
      /from\s+['"](?:electron|node:|better-sqlite3)/,
    );
    expect(rendererSource).not.toMatch(
      /require\(['"](?:electron|node:|better-sqlite3)/,
    );
  });
});
