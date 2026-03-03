import { execSync } from "node:child_process";

/**
 * Next.js unfortunately does not have native post-build plugin hooks.
 * We export this wrapper as a documentation pointer or to be used in custom build scripts.
 * The recommended approach for Next.js is adding a standard `postbuild` script in `package.json`.
 */
export function withOgrite(nextConfig: any = {}) {
  const originalWebpack = nextConfig.webpack;
  nextConfig.webpack = (config: any, context: any) => {
    // Next.js runs webpack multiple times. We only want to log this once.
    if (context.isServer && context.nextRuntime === "nodejs") {
      console.warn(
        "\n[ogrite] Next.js detected. Remember to run `ogrite generate` after your `next build` is fully complete.",
      );
    }

    if (typeof originalWebpack === "function") {
      return originalWebpack(config, context);
    }

    return config;
  };
  return nextConfig;
}

/**
 * Synchronous helper for custom Node.js build scripts.
 */
export function runOgrite() {
  console.log("\n[ogrite] Generating Open Graph images for Next.js...");
  execSync("npx ogrite generate", { stdio: "inherit" });
}
