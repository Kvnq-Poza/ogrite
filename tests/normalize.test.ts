import { describe, it, expect } from "vitest";
import { normalizeRoute } from "../src/normalize/normalizeRoute.js";
import type { NormalizeOptions } from "../src/types/index.js";

const BASE: NormalizeOptions = {
  baseOutput: "public/og",
  paramStrategy: { type: "slugify" },
  homeFileName: "home",
};

describe("normalizeRoute", () => {
  it("maps / to home.png", () => {
    expect(normalizeRoute("/", BASE)).toBe("public/og/home.png");
  });

  it("maps /about to about.png", () => {
    expect(normalizeRoute("/about", BASE)).toBe("public/og/about.png");
  });

  it("maps /category/shoes to nested path", () => {
    expect(normalizeRoute("/category/shoes", BASE)).toBe(
      "public/og/category/shoes.png",
    );
  });

  it("strips trailing slash", () => {
    expect(normalizeRoute("/about/", BASE)).toBe("public/og/about.png");
  });

  it("respects custom homeFileName", () => {
    const opts = { ...BASE, homeFileName: "index" };
    expect(normalizeRoute("/", opts)).toBe("public/og/index.png");
  });

  it("uses custom format extension", () => {
    expect(normalizeRoute("/about", BASE, "webp")).toBe("public/og/about.webp");
  });

  it("handles dynamic params with slugify strategy", () => {
    const result = normalizeRoute("/blog/[slug]", BASE, "png");
    expect(result).toBe("public/og/blog/slug.png");
  });

  it("handles dynamic params with keep strategy", () => {
    const opts: NormalizeOptions = { ...BASE, paramStrategy: { type: "keep" } };
    const result = normalizeRoute("/blog/[slug]", opts, "png");
    expect(result).toBe("public/og/blog/slug.png");
  });

  it("handles dynamic params with hash strategy", () => {
    const opts: NormalizeOptions = {
      ...BASE,
      paramStrategy: { type: "hash", length: 6 },
    };
    const result = normalizeRoute("/blog/[slug]", opts, "png");
    // Hash should be 6 characters
    const parts = result.split("/");
    const filename = parts[parts.length - 1];
    expect(filename).toMatch(/^[a-f0-9]{6}\.png$/);
  });

  it("handles deeply nested routes", () => {
    expect(normalizeRoute("/a/b/c/d", BASE)).toBe("public/og/a/b/c/d.png");
  });
});
