import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import crx from "vite-plugin-crx-mv3";

import * as path from "path";

export default defineConfig(({ mode }) => {
  return {
    base: "./",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    plugins: [
      vue(),
      crx({
        manifest: "./src/manifest.json",
      }),
    ],
    build: {
      minify: false,
      emptyOutDir: true,
    },
  };
});
