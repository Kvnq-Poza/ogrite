import type { BuildReport, OgriteError } from "../types/index.js";
import type { Logger } from "../utils/logger.js";

export interface ReportCollector {
  addSuccess(route: string): void;
  addSkip(route: string): void;
  addError(route: string, type: string, error: unknown): void;
  finalize(): BuildReport;
}

/**
 * Creates a report collector that aggregates per-route results.
 */
export function createReportCollector(logger: Logger): ReportCollector {
  const startTime = Date.now();
  let generated = 0;
  let skipped = 0;
  const errors: OgriteError[] = [];

  return {
    addSuccess(route: string) {
      generated++;
      logger.debug(`✓ ${route}`);
    },

    addSkip(route: string) {
      skipped++;
      logger.debug(`⊘ ${route} (skipped)`);
    },

    addError(route: string, type: string, error: unknown) {
      const err: OgriteError = {
        route,
        type,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      };
      errors.push(err);
      logger.error(`✗ ${route}: ${err.message}`);
    },

    finalize(): BuildReport {
      const durationMs = Date.now() - startTime;
      const report: BuildReport = {
        success: errors.length === 0,
        generated,
        failed: errors.length,
        skipped,
        durationMs,
        errors,
      };

      logger.info("");
      logger.info("─── Build Report ───────────────────────────");
      logger.info(`  Generated: ${generated}`);
      logger.info(`  Failed:    ${errors.length}`);
      logger.info(`  Skipped:   ${skipped}`);
      logger.info(`  Duration:  ${(durationMs / 1000).toFixed(2)}s`);
      logger.info("────────────────────────────────────────────");

      if (errors.length > 0) {
        logger.info("");
        logger.info("Errors:");
        for (const err of errors) {
          logger.info(`  [${err.type}] ${err.route}: ${err.message}`);
        }
      }

      return report;
    },
  };
}
