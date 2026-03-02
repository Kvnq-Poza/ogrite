import type {
  OgGenerator,
  OgriteConfig,
  ResolvedConfig,
  RoutePath,
} from "../types/index.js";
import { defineConfig } from "./defineConfig.js";
import { normalizeRoute } from "../normalize/normalizeRoute.js";
import { createPlaywrightRenderer } from "../renderers/playwrightRenderer.js";
import { createTemplateRenderer } from "../renderers/templateRenderer.js";
import { createSharpOptimizer } from "../optimizers/sharpOptimizer.js";
import { runPipeline, runSingleRoute } from "../pipeline/runPipeline.js";

/**
 * Factory function: create an OgGenerator from user config.
 */
export function createOgGenerator(config: OgriteConfig): OgGenerator {
  const resolved: ResolvedConfig = defineConfig(config);

  const outputFormat = resolved.compression.enabled
    ? resolved.compression.target
    : (resolved.capture.format ?? "png");

  return {
    async build() {
      const renderer = resolved.template
        ? createTemplateRenderer(resolved.template)
        : createPlaywrightRenderer();
      const optimizer = createSharpOptimizer();
      return runPipeline({ config: resolved, renderer, optimizer });
    },

    async buildRoute(route: RoutePath) {
      const renderer = resolved.template
        ? createTemplateRenderer(resolved.template)
        : createPlaywrightRenderer();
      const optimizer = createSharpOptimizer();
      return runSingleRoute({ config: resolved, renderer, optimizer }, route);
    },

    normalize(route: RoutePath) {
      return normalizeRoute(route, resolved.normalize, outputFormat);
    },
  };
}
