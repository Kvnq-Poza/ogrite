import { describe, it, expect } from "vitest";
import { defineConfig } from "../src/core/defineConfig.js";
import { updateManifestEntry } from "../src/fs/manifest.js";

describe("incremental builds", () => {
  it("defaults incremental to false", () => {
    const config = defineConfig({
      baseUrl: "http://localhost:3000",
      outputDir: "public/og",
    });

    expect(config.incremental).toBe(false);
  });

  it("accepts incremental: true from config", () => {
    const config = defineConfig({
      baseUrl: "http://localhost:3000",
      outputDir: "public/og",
      incremental: true,
    });

    expect(config.incremental).toBe(true);
  });

  it("manifest entry supports optional sourceHash", () => {
    const manifest: any = {};
    const withHash = updateManifestEntry(manifest, {
      route: "/about",
      outputPath: "public/og/about.webp",
      hash: "abc123",
      sourceHash: "src456",
      generatedAt: "2026-01-01T00:00:00.000Z",
    });

    expect(withHash["/about"].sourceHash).toBe("src456");
  });

  it("manifest entry works without sourceHash", () => {
    const manifest: any = {};
    const withoutHash = updateManifestEntry(manifest, {
      route: "/",
      outputPath: "public/og/home.webp",
      hash: "abc123",
      generatedAt: "2026-01-01T00:00:00.000Z",
    });

    expect(withoutHash["/"].sourceHash).toBeUndefined();
  });

  it("sourceHash is preserved across manifest updates", () => {
    let manifest: any = {};
    manifest = updateManifestEntry(manifest, {
      route: "/about",
      outputPath: "public/og/about.webp",
      hash: "abc123",
      sourceHash: "src456",
      generatedAt: "2026-01-01T00:00:00.000Z",
    });

    manifest = updateManifestEntry(manifest, {
      route: "/contact",
      outputPath: "public/og/contact.webp",
      hash: "def789",
      sourceHash: "src012",
      generatedAt: "2026-01-02T00:00:00.000Z",
    });

    expect(manifest["/about"].sourceHash).toBe("src456");
    expect(manifest["/contact"].sourceHash).toBe("src012");
  });
});
