import { describe, it, expect } from "vitest";
import { defineConfig } from "../src/core/defineConfig.js";

describe("defineConfig", () => {
  it("fills defaults for minimal config", () => {
    const config = defineConfig({
      baseUrl: "http://localhost:3000",
      outputDir: "public/og",
    });

    expect(config.mode).toBe("manual");
    expect(config.concurrency).toBe(4);
    expect(config.logLevel).toBe("info");
    expect(config.viewport.width).toBe(1200);
    expect(config.viewport.height).toBe(630);
    expect(config.viewport.deviceScaleFactor).toBe(2);
    expect(config.wait.type).toBe("networkidle");
    expect(config.compression.enabled).toBe(true);
    expect(config.compression.target).toBe("webp");
    expect(config.normalize.baseOutput).toBe("public/og");
  });

  it("merges user overrides", () => {
    const config = defineConfig({
      baseUrl: "http://localhost:3000",
      outputDir: "out/og",
      concurrency: 8,
      viewport: { width: 800, height: 400 },
    });

    expect(config.concurrency).toBe(8);
    expect(config.viewport.width).toBe(800);
    expect(config.viewport.height).toBe(400);
    expect(config.viewport.deviceScaleFactor).toBe(2); // default retained
  });

  it("strips trailing slash from baseUrl", () => {
    const config = defineConfig({
      baseUrl: "http://localhost:3000/",
      outputDir: "public/og",
    });
    expect(config.baseUrl).toBe("http://localhost:3000");
  });

  it("throws on missing baseUrl", () => {
    expect(() => defineConfig({ baseUrl: "", outputDir: "out" })).toThrow(
      "baseUrl",
    );
  });

  it("throws on missing outputDir", () => {
    expect(() =>
      defineConfig({ baseUrl: "http://localhost:3000", outputDir: "" }),
    ).toThrow("outputDir");
  });
});
