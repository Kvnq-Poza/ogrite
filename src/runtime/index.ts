import path from "node:path";
import fs from "node:fs";
import type { Manifest, RoutePath } from "../types/index.js";

/**
 * Resolve the output path for a given route from the manifest.
 *
 * Usage in Next.js / Astro / etc.:
 *   import { getOgImagePath } from 'ogrite/runtime';
 *   const path = getOgImagePath('/blog/post');
 */
export function getOgImagePath(
  route: RoutePath | string,
  manifestDir?: string,
): string | undefined {
  const dir = manifestDir ?? path.join(process.cwd(), "public", "og");
  const manifestPath = path.join(dir, ".ogrite-manifest.json");

  try {
    const raw = fs.readFileSync(manifestPath, "utf-8");
    const manifest: Manifest = JSON.parse(raw);
    const entry = manifest[route];
    return entry?.outputPath;
  } catch {
    return undefined;
  }
}
