import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "electron-vite";

const projectRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  main: {},
  preload: {
    build: {
      rollupOptions: {
        output: {
          format: "cjs",
          entryFileNames: "[name].cjs",
        },
      },
    },
  },
  renderer: {
    root: resolve(projectRoot, "src/renderer"),
    plugins: [react()],
    resolve: {
      alias: {
        "@shared": resolve(projectRoot, "src/shared"),
      },
    },
  },
});
