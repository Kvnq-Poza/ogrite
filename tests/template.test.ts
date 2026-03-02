import { describe, it, expect } from "vitest";
import { createTemplateRenderer } from "../src/renderers/templateRenderer.js";

describe("templateRenderer", () => {
  it("initializes and closes without errors", async () => {
    const renderer = createTemplateRenderer(() => "<h1>Test</h1>");
    await renderer.init();
    await renderer.close();
  }, 30000);

  it("fails if templateCtx is not provided in RenderOptions", async () => {
    const renderer = createTemplateRenderer(() => "<h1>Test</h1>");
    await renderer.init();

    await expect(
      renderer.render("/test", {
        viewport: { width: 800, height: 600, deviceScaleFactor: 1 },
        wait: { type: "load", timeoutMs: 5000, extraDelayMs: 0 },
        capture: {
          type: "viewport",
          selector: null,
          format: "png",
          quality: 90,
        },
        inject: { css: "", js: "" },
      }),
    ).rejects.toThrow("Missing templateCtx");

    await renderer.close();
  });

  it("executes the template with the provided context", async () => {
    let capturedCtx: any = null;
    const renderer = createTemplateRenderer((ctx) => {
      capturedCtx = ctx;
      return "<h1>" + ctx.route + "</h1>";
    });

    await renderer.init();
    const buffer = await renderer.render("/example", {
      viewport: { width: 800, height: 600, deviceScaleFactor: 1 },
      wait: { type: "load", timeoutMs: 5000, extraDelayMs: 0 },
      capture: { type: "viewport", selector: null, format: "png", quality: 90 },
      inject: { css: "", js: "" },
      templateCtx: { route: "/example", meta: { title: "Hello" } },
    });

    expect(capturedCtx).toEqual({
      route: "/example",
      meta: { title: "Hello" },
    });
    expect(buffer).toBeInstanceOf(Buffer);

    await renderer.close();
  });
});
