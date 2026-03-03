import { CodeBlock } from "../CodeBlock";
import { DocSection } from "../DocSection";
import { CodeHelper } from "../CodeHelper";

const snippet = `import type {
  RoutePath,           // \`/\${string}\` — absolute route
  OutputPath,          // string — resolved filesystem path
  CaptureFormat,       // 'png' | 'jpeg' | 'webp'
  Viewport,            // { width, height, deviceScaleFactor? }
  WaitOptions,         // { type?, timeoutMs?, extraDelayMs? }
  CaptureOptions,      // { type?, selector?, format?, quality? }
  CompressionOptions,  // { enabled?, target?, quality?, maxWidth? }
  RouteDiscovery,      // { strategy?, source?, routes?, resolver? }
  NormalizeOptions,    // { baseOutput, paramStrategy?, homeFileName?, sanitize? }
  ParamStrategy,       // { type: 'keep' } | { type: 'hash', length? } | { type: 'slugify' }
  RouteMeta,           // { canonicalPath?, slug?, [key]: unknown }
  MetaResolver,        // (route: RoutePath) => Promise<RouteMeta | undefined>
  OgriteConfig,        // Full user-facing config (all optional except baseUrl, outputDir)
  ResolvedConfig,      // Fully resolved config with defaults
  OgGenerator,         // { build(), buildRoute(), normalize() }
  BuildReport,         // { success, generated, failed, skipped, durationMs, errors }
  OgriteError,         // { route, type, message, stack? }
  ManifestEntry,       // { route, outputPath, hash, sourceHash?, generatedAt }
  Manifest,            // Record<string, ManifestEntry>
  Renderer,            // Adapter interface: { init(), render(), close() }
  Optimizer,           // Adapter interface: { optimize() }
  InjectOptions,       // { css?, js? }
  TemplateContext,     // { route: RoutePath, meta?: RouteMeta }
  TemplateFunction,    // (ctx: TemplateContext) => string | Promise<string>
  AutoMetaOptions,     // { enabled?, htmlDir?, baseUrl? }
} from '@ogrite/ogrite';`;

export function TypesSection() {
  return (
    <DocSection
      id="types"
      title="Type Reference"
      lead={
        <>
          All public types are exported from the{" "}
          <CodeHelper>@ogrite/ogrite</CodeHelper> package and can be imported
          directly.
        </>
      }
    >
      <CodeBlock code={snippet} language="typescript" showLineNumbers />
    </DocSection>
  );
}
