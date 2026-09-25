import type { BrowserWindowConstructorOptions } from "electron";

export function createMainWindowOptions(
  preload: string,
): BrowserWindowConstructorOptions {
  return {
    width: 960,
    height: 680,
    minWidth: 320,
    minHeight: 480,
    webPreferences: {
      preload,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
    },
  };
}
