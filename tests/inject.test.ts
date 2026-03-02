import { describe, it, expect } from "vitest";
import { defineConfig } from "../src/core/defineConfig.js";

describe("inject options", () => {
  it("fills default inject as empty strings", () => {
    const config = defineConfig({
      baseUrl: "http://localhost:3000",
      outputDir: "public/og",
    });

    expect(config.inject.css).toBe("");
    expect(config.inject.js).toBe("");
  });

  it("merges user-provided inject CSS", () => {
    const config = defineConfig({
      baseUrl: "http://localhost:3000",
      outputDir: "public/og",
      inject: { css: "body { background: white !important; }" },
    });

    expect(config.inject.css).toBe("body { background: white !important; }");
    expect(config.inject.js).toBe("");
  });

  it("merges user-provided inject JS", () => {
    const config = defineConfig({
      baseUrl: "http://localhost:3000",
      outputDir: "public/og",
      inject: { js: "document.querySelector('.banner')?.remove();" },
    });

    expect(config.inject.css).toBe("");
    expect(config.inject.js).toBe(
      "document.querySelector('.banner')?.remove();",
    );
  });

  it("merges both CSS and JS together", () => {
    const config = defineConfig({
      baseUrl: "http://localhost:3000",
      outputDir: "public/og",
      inject: {
        css: ".cookie-banner { display: none; }",
        js: "window.scrollTo(0, 0);",
      },
    });

    expect(config.inject.css).toBe(".cookie-banner { display: none; }");
    expect(config.inject.js).toBe("window.scrollTo(0, 0);");
  });
});
