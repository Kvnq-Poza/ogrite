import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    runtime: "src/runtime/index.ts",
    cli: "src/cli/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  clean: true,
  sourcemap: true,
  target: "node18",
  external: ["playwright", "sharp"],
  banner: ({ format }) => {
    if (format === "esm") {
      return {
        js: "#!/usr/bin/env node\n",
      };
    }
    return {};
  },
});
