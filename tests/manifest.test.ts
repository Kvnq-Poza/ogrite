import { describe, it, expect } from "vitest";
import {
  readManifest,
  writeManifest,
  updateManifestEntry,
} from "../src/fs/manifest.js";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

describe("manifest", () => {
  let tmpDir: string;

  async function setup() {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ogrite-test-"));
  }

  async function teardown() {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }

  it("returns empty object when manifest does not exist", async () => {
    await setup();
    try {
      const manifest = await readManifest(tmpDir);
      expect(manifest).toEqual({});
    } finally {
      await teardown();
    }
  });

  it("writes and reads manifest correctly", async () => {
    await setup();
    try {
      const data = {
        "/about": {
          route: "/about",
          outputPath: "public/og/about.webp",
          hash: "abc12345",
          generatedAt: "2025-01-01T00:00:00.000Z",
        },
      };

      await writeManifest(tmpDir, data);
      const result = await readManifest(tmpDir);
      expect(result).toEqual(data);
    } finally {
      await teardown();
    }
  });

  it("updates manifest entry immutably", () => {
    const manifest = {
      "/": {
        route: "/",
        outputPath: "public/og/home.png",
        hash: "aaa",
        generatedAt: "2025-01-01T00:00:00.000Z",
      },
    };

    const updated = updateManifestEntry(manifest, {
      route: "/about",
      outputPath: "public/og/about.png",
      hash: "bbb",
      generatedAt: "2025-01-02T00:00:00.000Z",
    });

    expect(Object.keys(updated)).toHaveLength(2);
    expect(updated["/"]).toBeDefined();
    expect(updated["/about"]).toBeDefined();
    // Original is unchanged
    expect(Object.keys(manifest)).toHaveLength(1);
  });
});
