import { describe, expect, it } from "vitest";
import { createMainWindowOptions } from "./window-options";

describe("main window security options", () => {
  it("isolates the renderer from Node and enables the sandbox", () => {
    const options = createMainWindowOptions("preload.js");

    expect(options.webPreferences).toMatchObject({
      preload: "preload.js",
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
    });
  });
});
