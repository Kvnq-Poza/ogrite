import fs from "node:fs/promises";
import path from "node:path";
import type { Manifest, ManifestEntry } from "../types/index.js";

const MANIFEST_FILE = ".ogrite-manifest.json";

/**
 * Read the manifest from the output directory.
 * Returns empty object if file doesn't exist.
 */
export async function readManifest(dir: string): Promise<Manifest> {
  const manifestPath = path.join(dir, MANIFEST_FILE);
  try {
    const raw = await fs.readFile(manifestPath, "utf-8");
    return JSON.parse(raw) as Manifest;
  } catch {
    return {};
  }
}

/**
 * Write the full manifest to disk.
 */
export async function writeManifest(
  dir: string,
  manifest: Manifest,
): Promise<void> {
  const manifestPath = path.join(dir, MANIFEST_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
}

/**
 * Upsert a single entry in the manifest.
 */
export function updateManifestEntry(
  manifest: Manifest,
  entry: ManifestEntry,
): Manifest {
  return {
    ...manifest,
    [entry.route]: entry,
  };
}

export { MANIFEST_FILE };
