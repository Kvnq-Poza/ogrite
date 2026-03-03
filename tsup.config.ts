import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    runtime: "src/runtime/index.ts",
    cli: "src/cli/index.ts",
    "plugins/vite": "src/plugins/vite.ts",
    "plugins/astro": "src/plugins/astro.ts",
    "plugins/next": "src/plugins/next.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  clean: true,
  sourcemap: true,
  target: "node18",
  external: ["playwright", "sharp"],
});
