import path from "node:path";
import type { OgriteConfig } from "../types/index.js";

/**
 * Dynamically load the user's ogrite config from CWD.
 * Supports: ogrite.config.ts, ogrite.config.js, ogrite.config.mjs
 */
export async function loadConfig(
  cwd: string = process.cwd(),
): Promise<OgriteConfig> {
  const candidates = [
    "ogrite.config.ts",
    "ogrite.config.js",
    "ogrite.config.mjs",
  ];

  for (const filename of candidates) {
    const filePath = path.resolve(cwd, filename);
    try {
      // For TypeScript, use jiti for on-the-fly transpilation
      if (filename.endsWith(".ts")) {
        const { createJiti } = await import("jiti");
        const jiti = createJiti(filePath, { interopDefault: true });
        const mod = (await jiti.import(filePath)) as
          | { default?: OgriteConfig }
          | OgriteConfig;
        return extractDefault(mod);
      }

      // For JS/MJS, use dynamic import
      const mod = await import(filePath);
      return extractDefault(mod);
    } catch (err) {
      // File not found — try next candidate
      if (isModuleNotFound(err)) continue;
      throw err;
    }
  }

  throw new Error(
    `[ogrite] ConfigValidationError: No config file found. Create ogrite.config.ts in your project root.`,
  );
}

function extractDefault(mod: unknown): OgriteConfig {
  if (mod && typeof mod === "object" && "default" in mod) {
    return (mod as { default: OgriteConfig }).default;
  }
  return mod as OgriteConfig;
}

function isModuleNotFound(err: unknown): boolean {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code: string }).code;
    return (
      code === "ERR_MODULE_NOT_FOUND" ||
      code === "MODULE_NOT_FOUND" ||
      code === "ENOENT"
    );
  }
  return false;
}
