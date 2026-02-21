import { describe, it, expect } from "vitest";
import { contentHash } from "../src/utils/hash.js";

describe("contentHash", () => {
  it("returns a hex string of the specified length", () => {
    const hash = contentHash(Buffer.from("hello"), 8);
    expect(hash).toHaveLength(8);
    expect(hash).toMatch(/^[a-f0-9]+$/);
  });

  it("is deterministic", () => {
    const a = contentHash(Buffer.from("test-data"), 12);
    const b = contentHash(Buffer.from("test-data"), 12);
    expect(a).toBe(b);
  });

  it("differs for different inputs", () => {
    const a = contentHash(Buffer.from("input-a"));
    const b = contentHash(Buffer.from("input-b"));
    expect(a).not.toBe(b);
  });

  it("accepts string input", () => {
    const hash = contentHash("hello-string", 6);
    expect(hash).toHaveLength(6);
  });
});
