import { createHash } from "node:crypto";

/**
 * Produce a hex content hash of a buffer.
 * Default algorithm: sha256, truncated to `length` characters.
 */
export function contentHash(data: Buffer | string, length: number = 8): string {
  return createHash("sha256").update(data).digest("hex").slice(0, length);
}
