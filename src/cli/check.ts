import { loadConfig } from "./loadConfig.js";
import { createRouteSource } from "../routes/index.js";
import { readManifest } from "../fs/manifest.js";
import { normalizeRoute } from "../normalize/normalizeRoute.js";
import { defineConfig } from "../core/defineConfig.js";
import { createLogger } from "../utils/logger.js";
import fs from "node:fs/promises";

/**
 * CLI: `ogrite check`
 * Validates current artifacts against the manifest and route list.
 */
export async function checkCommand(): Promise<void> {
  const config = defineConfig(await loadConfig());
  const logger = createLogger(config.logLevel);

  logger.info("Checking artifacts...");

  // Discover routes
  const routeSource = createRouteSource(config.routeDiscovery, config.baseUrl);
  const routes = await routeSource.getRoutes();

  // Read manifest
  const manifest = await readManifest(config.outputDir);

  const outputFormat = config.compression.enabled
    ? config.compression.target
    : (config.capture.format ?? "png");

  let missing = 0;
  let stale = 0;
  let ok = 0;

  for (const route of routes) {
    const outputPath = normalizeRoute(route, config.normalize, outputFormat);
    const entry = manifest[route];

    if (!entry) {
      logger.warn(`Missing: ${route} → ${outputPath}`);
      missing++;
      continue;
    }

    // Check if file exists on disk
    try {
      await fs.access(entry.outputPath);
      ok++;
    } catch {
      logger.warn(`Stale:   ${route} → ${entry.outputPath} (file missing)`);
      stale++;
    }
  }

  // Check for orphaned manifest entries
  const routeSet = new Set(routes as string[]);
  let orphaned = 0;
  for (const key of Object.keys(manifest)) {
    if (!routeSet.has(key)) {
      logger.warn(`Orphan:  ${key} → ${manifest[key].outputPath}`);
      orphaned++;
    }
  }

  logger.info("");
  logger.info("─── Check Report ───────────────────────────");
  logger.info(`  Routes:   ${routes.length}`);
  logger.info(`  OK:       ${ok}`);
  logger.info(`  Missing:  ${missing}`);
  logger.info(`  Stale:    ${stale}`);
  logger.info(`  Orphaned: ${orphaned}`);
  logger.info("────────────────────────────────────────────");

  process.exitCode = missing + stale > 0 ? 1 : 0;
}
