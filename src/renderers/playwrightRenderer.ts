import type { Renderer, RenderOptions } from "../types/index.js";

/**
 * Playwright-based renderer adapter.
 * Manages a single browser instance, reused across routes.
 */
export function createPlaywrightRenderer(): Renderer {
  let browser: import("playwright").Browser | null = null;

  return {
    async init() {
      const pw = await import("playwright");
      browser = await pw.chromium.launch({ headless: true });
    },

    async render(url: string, options: RenderOptions): Promise<Buffer> {
      if (!browser) {
        throw new Error(
          "[ogrite] NavigationError: Renderer not initialized. Call init() first.",
        );
      }

      const page = await browser.newPage({
        viewport: {
          width: options.viewport.width,
          height: options.viewport.height,
        },
        deviceScaleFactor: options.viewport.deviceScaleFactor,
      });

      try {
        // Map wait type to Playwright's waitUntil
        const waitUntil =
          options.wait.type === "networkidle"
            ? ("networkidle" as const)
            : options.wait.type === "domcontentloaded"
              ? ("domcontentloaded" as const)
              : ("load" as const);

        await page.goto(url, {
          waitUntil,
          timeout: options.wait.timeoutMs,
        });

        // Optional extra delay for late-hydrating components
        if (options.wait.extraDelayMs > 0) {
          await page.waitForTimeout(options.wait.extraDelayMs);
        }

        // Capture screenshot
        let screenshotBuffer: Buffer;

        if (options.capture.type === "element" && options.capture.selector) {
          const element = await page.$(options.capture.selector);
          if (!element) {
            throw new Error(
              `[ogrite] RenderTimeoutError: Element "${options.capture.selector}" not found on ${url}`,
            );
          }
          screenshotBuffer = (await element.screenshot({
            type: options.capture.format === "jpeg" ? "jpeg" : "png",
            quality:
              options.capture.format === "png"
                ? undefined
                : options.capture.quality,
          })) as Buffer;
        } else {
          screenshotBuffer = (await page.screenshot({
            fullPage: options.capture.type === "fullpage",
            type: options.capture.format === "jpeg" ? "jpeg" : "png",
            quality:
              options.capture.format === "png"
                ? undefined
                : options.capture.quality,
          })) as Buffer;
        }

        return Buffer.from(screenshotBuffer);
      } finally {
        await page.close();
      }
    },

    async close() {
      if (browser) {
        await browser.close();
        browser = null;
      }
    },
  };
}
