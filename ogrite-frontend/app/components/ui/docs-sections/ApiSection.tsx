import { CodeBlock } from "../CodeBlock";
import { DocCard } from "../DocCard";
import { DocSection } from "../DocSection";
import { CodeHelper } from "../CodeHelper";

const snippets = {
  createOgGenerator: `import { createOgGenerator } from '@ogrite/ogrite';

const generator = createOgGenerator({
  baseUrl: 'http://localhost:3000',
  outputDir: 'public/og',
  routeDiscovery: {
    strategy: 'sitemap',
    source: '/sitemap.xml',
  },
});

// Full build
const report = await generator.build();
console.log(report.generated, 'images generated');

// Single route
const outputPath = await generator.buildRoute('/blog/hello-world');

// Just normalise a route to its output path
const filePath = generator.normalize('/about');
// → "public/og/about.webp"`,
  defineConfig: `import { defineConfig } from '@ogrite/ogrite';

const config = defineConfig({
  baseUrl: 'http://localhost:3000',
  outputDir: 'public/og',
  compression: { quality: 90 },
});
// All other fields are filled with defaults`,
  ogGeneratorInterface: `interface OgGenerator {
  /** Run the full pipeline for all discovered routes. */
  build(): Promise<BuildReport>;

  /** Render and optimise a single route. Returns the output path. */
  buildRoute(route: RoutePath): Promise<string>;

  /** Map a route to its deterministic output path (no I/O). */
  normalize(route: RoutePath): string;
}`,
  buildReport: `interface BuildReport {
  success: boolean;     // true if zero failures
  generated: number;    // images successfully written
  failed: number;       // routes that errored
  skipped: number;      // routes skipped (e.g., unchanged)
  durationMs: number;   // total pipeline duration
  errors: OgriteError[];// per-route error details
}

interface OgriteError {
  route: string;
  type: string;
  message: string;
  stack?: string;
}`,
};

export function ApiSection() {
  return (
    <DocSection
      id="api"
      title="Programmatic API"
      lead="Import Ogrite into your Node.js build scripts for full control over the generation pipeline."
      spaced
    >
      <DocCard id="api-createoggenerator" title="createOgGenerator(config)">
        <p className="text-[var(--text-secondary)] mb-3">
          Factory function that accepts an <CodeHelper>OgriteConfig</CodeHelper>
          , resolves defaults via <CodeHelper>defineConfig()</CodeHelper>, and
          returns an <CodeHelper>OgGenerator</CodeHelper> instance.
        </p>
        <CodeBlock
          code={snippets.createOgGenerator}
          language="typescript"
          filename="build-og.ts"
        />
      </DocCard>

      <DocCard id="api-defineconfig" title="defineConfig(config)">
        <p className="text-[var(--text-secondary)] mb-3">
          Merges your partial config with library defaults and validates
          required fields. Throws a{" "}
          <CodeHelper>ConfigValidationError</CodeHelper> if{" "}
          <CodeHelper>baseUrl</CodeHelper> or <CodeHelper>outputDir</CodeHelper>{" "}
          is missing.
        </p>
        <CodeBlock code={snippets.defineConfig} language="typescript" />
      </DocCard>

      <DocCard id="api-oggenerator" title="OgGenerator interface">
        <CodeBlock code={snippets.ogGeneratorInterface} language="typescript" />
      </DocCard>

      <DocCard id="api-buildreport" title="BuildReport">
        <p className="text-[var(--text-secondary)] mb-3">
          Returned by <CodeHelper>generator.build()</CodeHelper>. Aggregates
          results across all routes.
        </p>
        <CodeBlock code={snippets.buildReport} language="typescript" />
      </DocCard>
    </DocSection>
  );
}
