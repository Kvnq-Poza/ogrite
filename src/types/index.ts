// ── Primitives ──────────────────────────────────────────────────────

/** Absolute route path without origin, query string, or hash. Always begins with `/`. */
export type RoutePath = `/${string}`;

/** Filesystem path resolved at runtime relative to project root. */
export type OutputPath = string;

/** Image output format for the rendered artifact. */
export type CaptureFormat = "png" | "jpeg" | "webp";

// ── Viewport & Wait ─────────────────────────────────────────────────

/** Defines browser rendering dimensions and pixel density. */
export interface Viewport {
  width: number;
  height: number;
  deviceScaleFactor?: number;
}

/** Conditions controlling when screenshots are captured after navigation. */
export interface WaitOptions {
  type?: "load" | "domcontentloaded" | "networkidle";
  timeoutMs?: number;
  extraDelayMs?: number;
}

// ── Capture & Compression ───────────────────────────────────────────

export interface CaptureOptions {
  type?: "fullpage" | "viewport" | "element";
  selector?: string | null;
  format?: CaptureFormat;
  quality?: number;
}

export interface CompressionOptions {
  enabled?: boolean;
  target?: "png" | "webp" | "avif";
  quality?: number;
  maxWidth?: number;
}

// ── Injection ───────────────────────────────────────────────────────

/** Custom CSS/JS to inject into the page before capturing a screenshot. */
export interface InjectOptions {
  /** CSS string to inject via <style> tag. */
  css?: string;
  /** JS string to evaluate in the page context. */
  js?: string;
}

// ── Route Discovery ─────────────────────────────────────────────────

export interface RouteDiscovery {
  strategy?: "sitemap" | "filesystem" | "manual" | "custom";
  source?: string;
  routes?: string[];
  resolver?: () => Promise<RoutePath[]>;
}

export interface RouteSource {
  name: string;
  getRoutes(): Promise<RoutePath[]>;
}

// ── Normalization ───────────────────────────────────────────────────

export type ParamStrategy =
  | { type: "keep" }
  | { type: "hash"; length?: number }
  | { type: "slugify" };

export interface NormalizeOptions {
  baseOutput: OutputPath;
  paramStrategy?: ParamStrategy;
  homeFileName?: string;
  sanitize?: (segment: string) => string;
}

// ── Route Metadata ──────────────────────────────────────────────────

export interface RouteMeta {
  canonicalPath?: RoutePath;
  slug?: string;
  [key: string]: unknown;
}

export type MetaResolver = (route: RoutePath) => Promise<RouteMeta | undefined>;

// ── Templating ──────────────────────────────────────────────────────

export interface TemplateContext {
  route: RoutePath;
  meta?: RouteMeta;
}

export type TemplateFunction = (
  ctx: TemplateContext,
) => string | Promise<string>;

export interface AutoMetaOptions {
  baseMetaUrl: string;
  htmlOutputDir: string;
}

// ── Config ──────────────────────────────────────────────────────────

export interface OgriteConfig {
  baseUrl: string;
  outputDir: string;
  mode?: "manual" | "build" | "watch";
  concurrency?: number;
  incremental?: boolean;
  viewport?: Viewport;
  wait?: WaitOptions;
  capture?: CaptureOptions;
  compression?: CompressionOptions;
  inject?: InjectOptions;
  template?: TemplateFunction;
  routeDiscovery?: RouteDiscovery;
  normalize?: NormalizeOptions;
  meta?: MetaResolver;
  autoMeta?: AutoMetaOptions;
  logLevel?: "silent" | "error" | "warn" | "info" | "debug";
}

// ── Generator ───────────────────────────────────────────────────────

export interface OgGenerator {
  build(): Promise<BuildReport>;
  buildRoute(route: RoutePath): Promise<string>;
  normalize(route: RoutePath): string;
}

// ── Reporting ───────────────────────────────────────────────────────

export interface OgriteError {
  route: string;
  type: string;
  message: string;
  stack?: string;
}

export interface BuildReport {
  success: boolean;
  generated: number;
  failed: number;
  skipped: number;
  durationMs: number;
  errors: OgriteError[];
}

// ── Manifest ────────────────────────────────────────────────────────

export interface ManifestEntry {
  route: string;
  outputPath: string;
  hash: string;
  sourceHash?: string;
  generatedAt: string;
}

export type Manifest = Record<string, ManifestEntry>;

// ── Renderer Adapter ────────────────────────────────────────────────

export interface RenderOptions {
  viewport: Required<Viewport>;
  wait: Required<WaitOptions>;
  capture: Required<CaptureOptions>;
  inject: Required<InjectOptions>;
  templateCtx?: TemplateContext;
}

export interface Renderer {
  init(): Promise<void>;
  render(url: string, options: RenderOptions): Promise<Buffer>;
  close(): Promise<void>;
}

// ── Optimizer Adapter ───────────────────────────────────────────────

export interface OptimizeOptions {
  enabled: boolean;
  target: "png" | "webp" | "avif";
  quality: number;
  maxWidth: number;
}

export interface Optimizer {
  optimize(buffer: Buffer, options: OptimizeOptions): Promise<Buffer>;
}

// ── Resolved Config (all defaults filled) ───────────────────────────

export interface ResolvedConfig {
  baseUrl: string;
  outputDir: string;
  mode: "manual" | "build" | "watch";
  concurrency: number;
  incremental: boolean;
  viewport: Required<Viewport>;
  wait: Required<WaitOptions>;
  capture: Required<CaptureOptions>;
  compression: Required<CompressionOptions>;
  inject: Required<InjectOptions>;
  template?: TemplateFunction;
  routeDiscovery: RouteDiscovery;
  normalize: NormalizeOptions;
  meta?: MetaResolver;
  autoMeta?: AutoMetaOptions;
  logLevel: "silent" | "error" | "warn" | "info" | "debug";
}
