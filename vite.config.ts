import { defineConfig, type Plugin } from "vitest/config";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import tailwindcss from "@tailwindcss/vite";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const injectLibraryCss = (): Plugin => ({
  name: "inject-library-css-import",
  closeBundle() {
    const distDir = resolve(__dirname, "dist");
    const entryFile = resolve(distDir, "index.es.js");

    if (!existsSync(entryFile)) return;

    const cssFileName = readdirSync(distDir).find((fileName) => fileName.endsWith(".css"));
    if (!cssFileName) return;

    const cssImport = `import "./${cssFileName}";`;
    const code = readFileSync(entryFile, "utf8");
    if (code.startsWith(cssImport)) return;

    writeFileSync(entryFile, `${cssImport}\n${code}`);
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), injectLibraryCss(), dts()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "JyOverlay",
      fileName: (format) => `index.${format}.js`,
      cssFileName: "overlay",
    },
    rollupOptions: {
      external: [/^react(?:\/.*)?$/, /^react-dom(?:\/.*)?$/],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
  },
});
