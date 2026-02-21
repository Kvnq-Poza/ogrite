import { describe, it, expect } from "vitest";
import { slugify } from "../src/utils/slugify.js";

describe("slugify", () => {
  it("lowercases input", () => {
    expect(slugify("Hello")).toBe("hello");
  });

  it("replaces spaces with hyphens", () => {
    expect(slugify("hello world")).toBe("hello-world");
  });

  it("strips diacritics", () => {
    expect(slugify("café")).toBe("cafe");
  });

  it("removes special characters", () => {
    expect(slugify("hello@world!")).toBe("hello-world");
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("a---b")).toBe("a-b");
  });

  it("trims leading/trailing hyphens", () => {
    expect(slugify("--hello--")).toBe("hello");
  });

  it("handles bracket-wrapped segments", () => {
    expect(slugify("[slug]")).toBe("slug");
  });
});
