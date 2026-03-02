import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { injectMetaTags } from "../src/meta/injectMetaTags.js";

const TEST_DIR = "tests/.auto-meta";

describe("injectMetaTags", () => {
  it("injects og:image into an HTML file with no existing tag", async () => {
    await rm(TEST_DIR, { recursive: true, force: true });
    await mkdir(join(TEST_DIR, "about"), { recursive: true });

    const htmlContent =
      "<html><head><title>About</title></head><body>hello</body></html>";
    await writeFile(
      join(TEST_DIR, "about", "index.html"),
      htmlContent,
      "utf-8",
    );

    await injectMetaTags(
      { baseMetaUrl: "https://example.com/og", htmlOutputDir: TEST_DIR },
      {
        "/about": {
          route: "/about",
          outputPath: "public/og/about.png",
          hash: "123",
          generatedAt: new Date().toISOString(),
        },
      },
    );

    const resultHtml = await readFile(
      join(TEST_DIR, "about", "index.html"),
      "utf-8",
    );
    expect(resultHtml).toContain(
      '<meta property="og:image" content="https://example.com/og/public/og/about.png">',
    );
    expect(resultHtml.indexOf("</head>")).toBeGreaterThan(
      resultHtml.indexOf('<meta property="og:image"'),
    );
  });

  it("replaces existing og:image tags correctly", async () => {
    await rm(TEST_DIR, { recursive: true, force: true });
    await mkdir(join(TEST_DIR, "contact"), { recursive: true });

    const existingHtml =
      '<html><head><meta property="og:image" content="old.jpg"/></head><body>contact</body></html>';
    const filePath = join(TEST_DIR, "contact", "index.html");
    await writeFile(filePath, existingHtml, "utf-8");

    await injectMetaTags(
      { baseMetaUrl: "https://example.com", htmlOutputDir: TEST_DIR },
      {
        "/contact": {
          route: "/contact",
          outputPath: "og/contact.png",
          hash: "123",
          generatedAt: new Date().toISOString(),
        },
      },
    );

    const resultHtml = await readFile(filePath, "utf-8");
    expect(resultHtml).not.toContain("old.jpg");
    expect(resultHtml).toContain(
      '<meta property="og:image" content="https://example.com/og/contact.png">',
    );
  });

  it("does not crash if file does not exist", async () => {
    await rm(TEST_DIR, { recursive: true, force: true });

    await expect(
      injectMetaTags(
        { baseMetaUrl: "https://example.com", htmlOutputDir: TEST_DIR },
        {
          "/missing": {
            route: "/missing",
            outputPath: "og/missing.png",
            hash: "123",
            generatedAt: "",
          },
        },
      ),
    ).resolves.not.toThrow();
  });
});
