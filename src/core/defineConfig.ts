import type { OgriteConfig, ResolvedConfig } from "../types/index.js";

const DEFAULTS: Omit<ResolvedConfig, "baseUrl" | "outputDir"> = {
  mode: "manual",
  concurrency: 4,
  incremental: false,
  logLevel: "info",
  viewport: { width: 1200, height: 630, deviceScaleFactor: 2 },
  wait: { type: "networkidle", timeoutMs: 30_000, extraDelayMs: 500 },
  capture: { type: "viewport", selector: null, format: "png", quality: 90 },
  compression: { enabled: true, target: "webp", quality: 80, maxWidth: 1200 },
  inject: { css: "", js: "" },
  routeDiscovery: { strategy: "filesystem" },
  normalize: {
    baseOutput: "",
    paramStrategy: { type: "slugify" },
    homeFileName: "home",
  },
};

/**
 * Merge user-provided config with sensible defaults.
 * Throws on missing required fields.
 */
export function defineConfig(config: OgriteConfig): ResolvedConfig {
  if (!config.baseUrl) {
    throw new Error('[ogrite] ConfigValidationError: "baseUrl" is required.');
  }
  if (!config.outputDir) {
    throw new Error('[ogrite] ConfigValidationError: "outputDir" is required.');
  }

  const resolved: ResolvedConfig = {
    baseUrl: config.baseUrl.replace(/\/+$/, ""), // strip trailing slash
    outputDir: config.outputDir,
    mode: config.mode ?? DEFAULTS.mode,
    concurrency: config.concurrency ?? DEFAULTS.concurrency,
    incremental: config.incremental ?? DEFAULTS.incremental,
    logLevel: config.logLevel ?? DEFAULTS.logLevel,
    viewport: { ...DEFAULTS.viewport, ...config.viewport },
    wait: { ...DEFAULTS.wait, ...config.wait },
    capture: { ...DEFAULTS.capture, ...config.capture },
    compression: { ...DEFAULTS.compression, ...config.compression },
    inject: { ...DEFAULTS.inject, ...config.inject },
    routeDiscovery: { ...DEFAULTS.routeDiscovery, ...config.routeDiscovery },
    template: config.template,
    normalize: {
      ...DEFAULTS.normalize,
      baseOutput: config.normalize?.baseOutput ?? config.outputDir,
      ...config.normalize,
    },
    meta: config.meta,
    autoMeta: config.autoMeta,
  };

  // Ensure normalize.baseOutput falls back to outputDir
  if (!resolved.normalize.baseOutput) {
    resolved.normalize.baseOutput = resolved.outputDir;
  }

  return resolved;
}
