import { loadConfig } from "./loadConfig.js";
import { createOgGenerator } from "../core/createGenerator.js";

/**
 * CLI: `ogrite generate`
 * Runs the full pipeline for all discovered routes.
 */
export async function generateCommand(
  options: {
    concurrency?: number;
    incremental?: boolean;
    force?: boolean;
  } = {},
): Promise<void> {
  const config = await loadConfig();

  // CLI flag overrides
  if (options.concurrency !== undefined) {
    config.concurrency = options.concurrency;
  }
  if (options.force) {
    config.incremental = false;
  } else if (options.incremental) {
    config.incremental = true;
  }

  const generator = createOgGenerator(config);
  const report = await generator.build();

  process.exitCode = report.success ? 0 : 1;
}
