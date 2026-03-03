import { exec } from "node:child_process";

/**
 * Astro integration to automatically run Ogrite after a full site build.
 */
export function ogriteAstroPlugin() {
  return {
    name: "ogrite:astro",
    hooks: {
      "astro:build:done": async () => {
        console.log("\n[ogrite] Generating Open Graph images...");
        await new Promise<void>((resolve, reject) => {
          exec("npx ogrite generate", (error, stdout, stderr) => {
            if (error) {
              console.error(`[ogrite] Generation failed: ${error.message}`);
              reject(error);
              return;
            }
            if (stderr) console.error(stderr);
            console.log(stdout);
            resolve();
          });
        });
      },
    },
  };
}
