#!/usr/bin/env node

import { Command } from "commander";
import { generateCommand } from "./generate.js";
import { watchCommand } from "./watch.js";
import { checkCommand } from "./check.js";
import { cleanCommand } from "./clean.js";
import { previewCommand } from "./preview.js";

const program = new Command();

program
  .name("ogrite")
  .description("Deterministic visual artifact compiler for Open Graph images.")
  .version("0.1.0");

program
  .command("generate")
  .description("Run the full pipeline and emit image artifacts.")
  .option(
    "-c, --concurrency <number>",
    "Number of parallel rendering workers",
    parseInt,
  )
  .option(
    "--incremental",
    "Skip routes whose source HTML has not changed since the last build",
  )
  .option("--force", "Force full rebuild, ignoring incremental cache")
  .option(
    "-l, --log-level <level>",
    "Log level (debug, info, warn, error)",
    "info",
  )
  .action(async (options) => {
    await generateCommand({
      concurrency: options.concurrency,
      incremental: options.incremental,
      force: options.force,
      logLevel: options.logLevel,
    });
  });

program
  .command("watch")
  .description("Start incremental watcher and regenerate on change.")
  .action(async () => {
    await watchCommand();
  });

program
  .command("check")
  .description(
    "Validate current artifacts against the manifest and route list.",
  )
  .action(async () => {
    await checkCommand();
  });

program
  .command("clean")
  .description("Remove all generated artifacts and clear the manifest.")
  .action(async () => {
    await cleanCommand();
  });

program
  .command("preview")
  .description("Serve a local HTML gallery of all generated OG images.")
  .option(
    "-p, --port <number>",
    "Port to serve the gallery on",
    (val: string) => parseInt(val, 10),
    4000,
  )
  .action(async (options: { port: number }) => {
    await previewCommand({ port: options.port });
  });

program.parse();
