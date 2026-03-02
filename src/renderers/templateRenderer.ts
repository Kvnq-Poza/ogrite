import type {
  Renderer,
  RenderOptions,
  TemplateFunction,
} from "../types/index.js";

/**
 * Renders OG images by executing a user-provided template function
 * and injecting the resulting HTML string directly into Playwright.
 */
export function createTemplateRenderer(
  templateFunc: TemplateFunction,
): Renderer {
  let browser: import("playwright").Browser | null = null;

  return {
    async init() {
      if (!browser) {
        const pw = await import("playwright");
        browser = await pw.chromium.launch({ headless: true });
      }
    },

    async render(_url: string, options: RenderOptions): Promise<Buffer> {
      if (!browser) {
        throw new Error(
          "[ogrite] TemplateRenderer is not initialized. Call init() first.",
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
        // 1. Execute the user's template function
        if (!options.templateCtx) {
          throw new Error("[ogrite] Missing templateCtx in RenderOptions.");
        }

        const htmlContent = await templateFunc(options.templateCtx);

        // 2. Set the content directly (no navigation)
        const waitUntil =
          options.wait.type === "networkidle" && htmlContent.includes("<img")
            ? "networkidle"
            : "load";

        await page.setContent(htmlContent, {
          waitUntil,
          timeout: options.wait.timeoutMs,
        });

        // Optional extra delay
        if (options.wait.extraDelayMs > 0) {
          await page.waitForTimeout(options.wait.extraDelayMs);
        }

        // Inject custom CSS before capture
        if (options.inject.css) {
          await page.addStyleTag({ content: options.inject.css });
        }

        // Inject custom JS before capture
        if (options.inject.js) {
          await page.evaluate(options.inject.js);
        }

        // Capture screenshot
        let screenshotBuffer: Buffer;
        if (options.capture.type === "element" && options.capture.selector) {
          const element = await page.locator(options.capture.selector).first();
          screenshotBuffer = await element.screenshot({
            type: options.capture.format === "jpeg" ? "jpeg" : "png",
            quality:
              options.capture.format !== "png"
                ? options.capture.quality
                : undefined,
          });
        } else if (options.capture.type === "fullpage") {
          screenshotBuffer = await page.screenshot({
            type: options.capture.format === "jpeg" ? "jpeg" : "png",
            fullPage: true,
            quality:
              options.capture.format !== "png"
                ? options.capture.quality
                : undefined,
          });
        } else {
          screenshotBuffer = await page.screenshot({
            type: options.capture.format === "jpeg" ? "jpeg" : "png",
            quality:
              options.capture.format !== "png"
                ? options.capture.quality
                : undefined,
          });
        }

        return Buffer.from(screenshotBuffer);
      } finally {
        await page.close();
      }
    },

    async close() {
      if (browser) await browser.close();
      browser = null;
    },
  };
}
