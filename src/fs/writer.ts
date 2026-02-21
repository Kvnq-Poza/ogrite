import fs from "node:fs/promises";
import path from "node:path";

/**
 * Write an image buffer to disk, creating directories as needed.
 */
export async function writeArtifact(
  outputPath: string,
  buffer: Buffer,
): Promise<void> {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, buffer);
}
