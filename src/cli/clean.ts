import fs from "node:fs/promises";
import path from "node:path";
import { loadConfig } from "./loadConfig.js";
import { defineConfig } from "../core/defineConfig.js";
import { createLogger } from "../utils/logger.js";
import { MANIFEST_FILE } from "../fs/manifest.js";

/**
 * CLI: `ogrite clean`
 * Removes all generated artifacts and clears the manifest.
 */
export async function cleanCommand(): Promise<void> {
  const config = defineConfig(await loadConfig());
  const logger = createLogger(config.logLevel);

  logger.info(`Cleaning output directory: ${config.outputDir}`);

  try {
    // Remove all files from output dir
    const entries = await fs.readdir(config.outputDir, { withFileTypes: true });

    let removed = 0;
    for (const entry of entries) {
      const fullPath = path.join(config.outputDir, entry.name);
      await fs.rm(fullPath, { recursive: true, force: true });
      removed++;
    }

    logger.info(`Removed ${removed} item(s).`);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      logger.info("Output directory does not exist. Nothing to clean.");
    } else {
      throw err;
    }
  }
}
