import { loadConfig } from "./loadConfig.js";
import { createOgGenerator } from "../core/createGenerator.js";

/**
 * CLI: `ogrite generate`
 * Runs the full pipeline for all discovered routes.
 */
export async function generateCommand(
  options: { concurrency?: number } = {},
): Promise<void> {
  const config = await loadConfig();

  // CLI flag overrides
  if (options.concurrency !== undefined) {
    config.concurrency = options.concurrency;
  }

  const generator = createOgGenerator(config);
  const report = await generator.build();

  process.exitCode = report.success ? 0 : 1;
}
