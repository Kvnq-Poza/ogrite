import { exec } from "node:child_process";

/**
 * Vite plugin to automatically run Ogrite after a production build.
 */
export function ogriteVitePlugin() {
  return {
    name: "ogrite:vite",
    apply: "build" as const,
    closeBundle() {
      console.log("\n[ogrite] Generating Open Graph images...");
      exec("npx ogrite generate", (error, stdout, stderr) => {
        if (error) {
          console.error(`[ogrite] Generation failed: ${error.message}`);
          return;
        }
        if (stderr) console.error(stderr);
        console.log(stdout);
      });
    },
  };
}
