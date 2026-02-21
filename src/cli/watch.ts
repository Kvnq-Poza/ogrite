import chokidar from "chokidar";
import { loadConfig } from "./loadConfig.js";
import { createOgGenerator } from "../core/createGenerator.js";
import { defineConfig } from "../core/defineConfig.js";
import { createLogger } from "../utils/logger.js";
import type { RoutePath } from "../types/index.js";

/**
 * CLI: `ogrite watch`
 * Watches for file changes and triggers incremental rebuilds.
 */
export async function watchCommand(): Promise<void> {
  const rawConfig = await loadConfig();
  const config = defineConfig(rawConfig);
  const logger = createLogger(config.logLevel);
  const generator = createOgGenerator(rawConfig);

  logger.info("Starting watch mode...");
  logger.info(`Watching: ${config.routeDiscovery.source ?? process.cwd()}`);

  // Run initial build
  logger.info("Running initial build...");
  await generator.build();

  // Watch for changes
  const watchPaths = config.routeDiscovery.source
    ? [config.routeDiscovery.source]
    : ["."];

  const watcher = chokidar.watch(watchPaths, {
    ignoreInitial: true,
    ignored: ["**/node_modules/**", `${config.outputDir}/**`, "**/.git/**"],
  });

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const rebuild = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      logger.info("Change detected. Rebuilding...");
      try {
        await generator.build();
      } catch (err) {
        logger.error("Rebuild failed:", err);
      }
    }, 500);
  };

  watcher.on("change", rebuild);
  watcher.on("add", rebuild);
  watcher.on("unlink", rebuild);

  logger.info("Watching for changes. Press Ctrl+C to stop.");

  // Keep process alive
  process.on("SIGINT", async () => {
    logger.info("Stopping watcher...");
    await watcher.close();
    process.exit(0);
  });
}
