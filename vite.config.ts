import path from "path";
import { type UserConfig, defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  return {
    root: "./",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {},
    build: {
      outDir: "dist",
      assetsDir: ".", // NOTE: default build `src` to `dist/assets`
      sourcemap: true,
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          sourcemapExcludeSources: mode === "production", // NOTE: set sourceContent null in `.js.map` file
          manualChunks(ids) {
            if (ids.includes("node_modules")) return "vendor";
            if (ids.includes("src")) {
              return path
                .relative(process.cwd(), ids)
                .replace(path.extname(ids), "")
                .replace("src\\", "");
            }
          },
        },
      },
    },
  } satisfies UserConfig;
});
