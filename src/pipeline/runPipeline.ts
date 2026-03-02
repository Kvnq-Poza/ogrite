import type {
  BuildReport,
  Manifest,
  ManifestEntry,
  Renderer,
  Optimizer,
  ResolvedConfig,
  RoutePath,
} from "../types/index.js";
import { createRouteSource } from "../routes/index.js";
import { normalizeRoute } from "../normalize/normalizeRoute.js";
import { writeArtifact } from "../fs/writer.js";
import {
  readManifest,
  writeManifest,
  updateManifestEntry,
} from "../fs/manifest.js";
import { createReportCollector } from "../reporting/buildReport.js";
import { contentHash } from "../utils/hash.js";
import { createLogger } from "../utils/logger.js";

export interface PipelineContext {
  config: ResolvedConfig;
  renderer: Renderer;
  optimizer: Optimizer;
}

/**
 * Run the full 7-stage pipeline:
 * 1. Route discovery
 * 2. Route normalization
 * 3. Rendering (parallel, bounded by concurrency)
 * 4. Optimization
 * 5. Persistence
 * 6. Manifest update
 * 7. Reporting
 */
export async function runPipeline(ctx: PipelineContext): Promise<BuildReport> {
  const { config, renderer, optimizer } = ctx;
  const logger = createLogger(config.logLevel);
  const report = createReportCollector(logger);

  // ── Stage 1: Route Discovery ────────────────────────────────────
  logger.info("Discovering routes...");
  const routeSource = createRouteSource(config.routeDiscovery, config.baseUrl);
  let routes: RoutePath[];

  try {
    routes = await routeSource.getRoutes();
  } catch (err) {
    logger.error("Route discovery failed.");
    report.addError("*", "RouteDiscoveryError", err);
    return report.finalize();
  }

  logger.info(
    `Found ${routes.length} route(s) via "${routeSource.name}" strategy.`,
  );

  if (routeSource.name === "filesystem") {
    logger.info(
      "Note: The filesystem strategy only detects static routes. " +
        'Dynamic route segments (e.g. [slug]) are skipped. Use the "sitemap" or "custom" strategy to include dynamic routes.',
    );
  }

  if (routes.length === 0) {
    logger.warn("No routes to process.");
    return report.finalize();
  }

  // ── Stage 2: Route Normalization ────────────────────────────────
  const outputFormat = config.compression.enabled
    ? config.compression.target
    : (config.capture.format ?? "png");

  const routeMap = new Map<RoutePath, string>();
  for (const route of routes) {
    try {
      const outputPath = normalizeRoute(route, config.normalize, outputFormat);
      routeMap.set(route, outputPath);
    } catch (err) {
      report.addError(route, "NormalizationError", err);
    }
  }

  // ── Stage 3–6: Render → Optimize → Persist → Manifest ──────────
  logger.info("Initializing renderer...");
  await renderer.init();

  let manifest: Manifest;
  try {
    manifest = await readManifest(config.outputDir);
  } catch {
    manifest = {};
  }

  // Process routes with bounded concurrency
  const entries = Array.from(routeMap.entries());
  const concurrency = config.concurrency;

  for (let i = 0; i < entries.length; i += concurrency) {
    const batch = entries.slice(i, i + concurrency);

    await Promise.all(
      batch.map(async ([route, outputPath]) => {
        try {
          // ── Stage 3: Render ──
          const url = `${config.baseUrl}${route}`;
          logger.debug(`Rendering ${url} ...`);

          const rawBuffer = await renderer.render(url, {
            viewport: config.viewport,
            wait: config.wait,
            capture: config.capture,
            inject: config.inject,
          });

          // ── Stage 4: Optimize ──
          const optimizedBuffer = await optimizer.optimize(rawBuffer, {
            enabled: config.compression.enabled,
            target: config.compression.target,
            quality: config.compression.quality,
            maxWidth: config.compression.maxWidth,
          });

          // ── Stage 5: Persist ──
          await writeArtifact(outputPath, optimizedBuffer);

          // ── Stage 6: Manifest ──
          const hash = contentHash(optimizedBuffer);
          const entry: ManifestEntry = {
            route,
            outputPath,
            hash,
            generatedAt: new Date().toISOString(),
          };
          manifest = updateManifestEntry(manifest, entry);

          report.addSuccess(route);
        } catch (err) {
          const errorType =
            err instanceof Error && err.message.includes("Navigation")
              ? "NavigationError"
              : err instanceof Error && err.message.includes("Timeout")
                ? "RenderTimeoutError"
                : err instanceof Error && err.message.includes("Element")
                  ? "RenderTimeoutError"
                  : "RenderError";
          report.addError(route, errorType, err);
        }
      }),
    );
  }

  // Write final manifest
  await writeManifest(config.outputDir, manifest);

  // Cleanup
  await renderer.close();

  // ── Stage 7: Reporting ──────────────────────────────────────────
  return report.finalize();
}

/**
 * Run the pipeline for a single route.
 */
export async function runSingleRoute(
  ctx: PipelineContext,
  route: RoutePath,
): Promise<string> {
  const { config, renderer, optimizer } = ctx;

  const outputFormat = config.compression.enabled
    ? config.compression.target
    : (config.capture.format ?? "png");

  const outputPath = normalizeRoute(route, config.normalize, outputFormat);

  await renderer.init();

  try {
    const url = `${config.baseUrl}${route}`;
    const rawBuffer = await renderer.render(url, {
      viewport: config.viewport,
      wait: config.wait,
      capture: config.capture,
      inject: config.inject,
    });

    const optimizedBuffer = await optimizer.optimize(rawBuffer, {
      enabled: config.compression.enabled,
      target: config.compression.target,
      quality: config.compression.quality,
      maxWidth: config.compression.maxWidth,
    });

    await writeArtifact(outputPath, optimizedBuffer);

    // Update manifest
    let manifest = await readManifest(config.outputDir);
    const hash = contentHash(optimizedBuffer);
    manifest = updateManifestEntry(manifest, {
      route,
      outputPath,
      hash,
      generatedAt: new Date().toISOString(),
    });
    await writeManifest(config.outputDir, manifest);

    return outputPath;
  } finally {
    await renderer.close();
  }
}
