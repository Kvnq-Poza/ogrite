#!/usr/bin/env node

import { Command } from "commander";
import { generateCommand } from "./generate.js";
import { watchCommand } from "./watch.js";
import { checkCommand } from "./check.js";
import { cleanCommand } from "./clean.js";

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
  .action(async (options) => {
    await generateCommand({ concurrency: options.concurrency });
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

program.parse();
