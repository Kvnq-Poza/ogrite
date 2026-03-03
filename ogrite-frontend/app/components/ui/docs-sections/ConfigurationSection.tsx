import { CodeBlock } from "../CodeBlock";
import { DocCard } from "../DocCard";
import { DocSection } from "../DocSection";
import { CodeHelper } from "../CodeHelper";

const snippets = {
  configFile: `import { defineConfig } from '@ogrite/ogrite';

export default defineConfig({
  baseUrl: 'http://localhost:3000',
  outputDir: 'public/og',
});`,
  baseUrl: `baseUrl: 'http://localhost:3000'`,
  outputDir: `outputDir: 'public/og'`,
  viewport: `viewport: {
  width: 1200,           // default: 1200
  height: 630,           // default: 630
  deviceScaleFactor: 2,  // default: 2
}`,
  wait: `wait: {
  type: 'networkidle',  // 'load' | 'domcontentloaded' | 'networkidle' (default)
  timeoutMs: 30000,     // default: 30000
  extraDelayMs: 500,    // additional wait after condition (default: 500)
}`,
  capture: `capture: {
  type: 'viewport',     // 'fullpage' | 'viewport' | 'element' (default: 'viewport')
  selector: null,       // CSS selector when type is 'element'
  format: 'png',        // 'png' | 'jpeg' | 'webp' (default: 'png')
  quality: 90,          // 0-100 (default: 90)
}`,
  compression: `compression: {
  enabled: true,       // default: true
  target: 'webp',     // 'png' | 'webp' | 'avif' (default: 'webp')
  quality: 80,         // default: 80
  maxWidth: 1200,      // resize if wider (default: 1200)
}`,
  routeDiscovery: `// Strategy: 'sitemap' | 'filesystem' | 'manual' | 'custom'

// Sitemap — parses your sitemap.xml
routeDiscovery: {
  strategy: 'sitemap',
  source: '/sitemap.xml',
}

// Filesystem — scans your pages directory (static routes only)
routeDiscovery: {
  strategy: 'filesystem',
  source: 'src/app',  // optional — auto-detects app/, src/app/, pages/, src/pages/ if omitted
}

// Manual — explicit route list
routeDiscovery: {
  strategy: 'manual',
  routes: ['/', '/about', '/blog/hello-world'],
}

// Custom — your own async resolver
routeDiscovery: {
  strategy: 'custom',
  resolver: async () => ['/', '/pricing'],
}`,
  normalize: `normalize: {
  baseOutput: 'public/og',           // defaults to outputDir
  paramStrategy: { type: 'slugify' },// 'keep' | 'hash' | 'slugify'
  homeFileName: 'home',              // name for the / route
  sanitize: (segment) => segment,    // optional custom sanitizer
}`,
  meta: `meta: async (route) => ({
  canonicalPath: route,
  slug: route.replace(/^\\//, ''),
})`,
  autoMeta: `autoMeta: {
  baseMetaUrl: "https://example.com/og",
  htmlOutputDir: "./dist",
}`,
  template: `template: async ({ route, meta }) => {
  return \`
    <div style="width: 1200px; height: 630px; display: flex; align-items: center; justify-content: center;">
      <h1>\${meta?.title ?? 'Default Title'}</h1>
      <p>Route: \${route}</p>
    </div>
  \`;
}`,
  inject: `inject: {
  css: 'body { background: white !important; }',
  js: "document.querySelector('.cookie-banner')?.remove();",
}`,
  incremental: `incremental: true`,
  configDefaults: `{
  mode: 'manual',
  concurrency: 4,
  logLevel: 'info',
  incremental: false,
  template: undefined,
  viewport: { width: 1200, height: 630, deviceScaleFactor: 2 },
  wait: { type: 'networkidle', timeoutMs: 30000, extraDelayMs: 500 },
  capture: { type: 'viewport', selector: null, format: 'png', quality: 90 },
  compression: { enabled: true, target: 'webp', quality: 80, maxWidth: 1200 },
  inject: { css: '', js: '' },
  routeDiscovery: { strategy: 'manual', routes: [] },
  normalize: {
    baseOutput: '<outputDir>',
    paramStrategy: { type: 'slugify' },
    homeFileName: 'home',
  },
}`,
};

export function ConfigurationSection() {
  return (
    <DocSection
      id="configuration"
      title="Configuration"
      lead={
        <>
          Ogrite is configured through a single file in your project root. It
          supports <CodeHelper>.ts</CodeHelper>, <CodeHelper>.js</CodeHelper>,
          and <CodeHelper>.mjs</CodeHelper> extensions. All options (except{" "}
          <CodeHelper>baseUrl</CodeHelper> and{" "}
          <CodeHelper>outputDir</CodeHelper>) are optional — sensible defaults
          are applied automatically.
        </>
      }
    >
      <DocCard id="config-file" title="Config file">
        <CodeBlock
          code={snippets.configFile}
          language="typescript"
          filename="ogrite.config.ts"
        />
      </DocCard>

      <DocCard id="config-baseurl" title="baseUrl">
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          <strong className="text-[var(--text-primary)]">Required.</strong> The
          origin of your running application. Ogrite navigates Playwright to{" "}
          <CodeHelper>{`\${baseUrl}\${route}`}</CodeHelper> for each discovered
          route. Trailing slashes are stripped automatically.
        </p>
        <CodeBlock code={snippets.baseUrl} language="typescript" />
      </DocCard>

      <DocCard id="config-outputdir" title="outputDir">
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          <strong className="text-[var(--text-primary)]">Required.</strong>{" "}
          Where generated images are written. Typically inside your public
          directory so the images are served as static assets.
        </p>
        <CodeBlock code={snippets.outputDir} language="typescript" />
      </DocCard>

      <DocCard id="config-concurrency" title="concurrency">
        <p className="text-sm text-[var(--text-secondary)]">
          Maximum number of routes rendered in parallel.{" "}
          <strong className="text-[var(--text-primary)]">
            Default: <CodeHelper>4</CodeHelper>
          </strong>
        </p>
      </DocCard>

      <DocCard id="config-loglevel" title="logLevel">
        <p className="text-sm text-[var(--text-secondary)]">
          Controls CLI output verbosity. Accepted values:{" "}
          <CodeHelper>&quot;silenC&quot;</CodeHelper> |{" "}
          <CodeHelper>&quot;info&quot;</CodeHelper> |{" "}
          <CodeHelper>&quot;debug&quot;</CodeHelper>.{" "}
          <strong className="text-[var(--text-primary)]">
            Default: <CodeHelper>&quot;info&quot;</CodeHelper>
          </strong>
        </p>
      </DocCard>

      <DocCard id="config-viewport" title="viewport">
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          Defines the browser viewport used for rendering.
        </p>
        <CodeBlock code={snippets.viewport} language="typescript" />
      </DocCard>

      <DocCard id="config-wait" title="wait">
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          Conditions for when the screenshot is taken after navigation.
        </p>
        <CodeBlock code={snippets.wait} language="typescript" />
      </DocCard>

      <DocCard id="config-capture" title="capture">
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          Controls what part of the page is captured.
        </p>
        <CodeBlock code={snippets.capture} language="typescript" />
      </DocCard>

      <DocCard id="config-compression" title="compression">
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          Post-capture optimisation via Sharp.
        </p>
        <CodeBlock code={snippets.compression} language="typescript" />
      </DocCard>

      <DocCard id="config-routediscovery" title="routeDiscovery">
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          How Ogrite finds routes to generate images for.
        </p>
        <CodeBlock code={snippets.routeDiscovery} language="typescript" />
        <p className="text-xs text-[var(--text-muted)] mt-3">
          <strong>Note:</strong> The filesystem strategy only detects static
          routes. Dynamic route segments (e.g. <CodeHelper>[slug]</CodeHelper>,{" "}
          <CodeHelper>[...params]</CodeHelper>) are skipped because their
          concrete values cannot be determined from the filesystem. For dynamic
          routes, use the <strong>sitemap</strong> or <strong>custom</strong>{" "}
          strategy.
        </p>
      </DocCard>

      <DocCard id="config-normalize" title="normalize">
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          Controls how route paths are mapped to file names. See{" "}
          <a
            href="#normalization"
            className="text-[var(--accent-primary)] underline"
          >
            Route Normalization
          </a>{" "}
          for details.
        </p>
        <CodeBlock code={snippets.normalize} language="typescript" />
      </DocCard>

      <DocCard id="config-meta" title="meta">
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          Optional async function that resolves per-route metadata. Receives a{" "}
          <CodeHelper>RoCtePath</CodeHelper> and returns a{" "}
          <CodeHelper>RouteMeta</CodeHelper> object.
        </p>
        <CodeBlock code={snippets.meta} language="typescript" />
      </DocCard>

      <DocCard id="config-autometa" title="autoMeta">
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          Automatically inject{" "}
          <CodeHelper>&lt;meta property="og:image"&gt;</CodeHelper> tags into
          your generated static HTML files after the build is complete.
        </p>
        <CodeBlock code={snippets.autoMeta} language="typescript" />
        <p className="text-sm text-[var(--text-secondary)] mt-3">
          If enabled, Ogrite will scan <CodeHelper>htmlOutputDir</CodeHelper>{" "}
          for HTML files matching your routes and safely inject the meta tag
          right before <CodeHelper>&lt;/head&gt;</CodeHelper>. If an{" "}
          <CodeHelper>og:image</CodeHelper> tag already exists, it is
          overwritten, making it an excellent final-step utility for statically
          generated sites.
        </p>
      </DocCard>

      <DocCard id="config-template" title="template">
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          Instead of having Playwright navigate to live URLs, you can provide a
          template function. Ogrite will take the HTML string returned by this
          function, inject it into the browser, and screenshot it.
        </p>
        <CodeBlock code={snippets.template} language="typescript" />
        <p className="text-sm text-[var(--text-secondary)] mt-3">
          This is excellent for generating deterministic static cards without
          needing a web server running your app routes. It is recommended to
          inline all CSS and base64-encode any images for best reliability.
        </p>
      </DocCard>

      <DocCard id="config-inject" title="inject">
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          Inject custom CSS and/or JavaScript into the page before capturing.
          Useful for removing cookie banners, overlays, or toggling dark mode.
        </p>
        <CodeBlock code={snippets.inject} language="typescript" />
        <p className="text-xs text-[var(--text-muted)] mt-3">
          Both fields default to empty strings. CSS is applied via{" "}
          <CodeHelper>page.addStyleTag()</CodeHelper> and JS via{" "}
          <CodeHelper>page.evaluate()</CodeHelper>.
        </p>
      </DocCard>

      <DocCard id="config-incremental" title="incremental">
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          Enable incremental builds to significantly speed up CI and local
          regeneration.
        </p>
        <CodeBlock code={snippets.incremental} language="typescript" />
        <p className="text-sm text-[var(--text-secondary)] mt-3 mb-3">
          When enabled, Ogrite fetches the target route's HTML before taking a
          screenshot, computes a hash, and compares it to the previous run
          (stored in <CodeHelper>.ogrite-manifest.json</CodeHelper>). If the
          HTML hasn't changed, rendering and optimisation are skipped.
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-3">
          Defaults to <CodeHelper>false</CodeHelper>. Can be overridden via CLI
          flags: <CodeHelper>--incremental</CodeHelper> or{" "}
          <CodeHelper>--force</CodeHelper>.
        </p>
      </DocCard>

      <DocCard id="config-defaults" title="Full defaults">
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          These are the exact defaults applied when you call{" "}
          <CodeHelper>defineConfig()</CodeHelper>. Only{" "}
          <CodeHelper>baseUrl</CodeHelper> and{" "}
          <CodeHelper>outputDir</CodeHelper> are required.
        </p>
        <CodeBlock
          code={snippets.configDefaults}
          language="json"
          showLineNumbers
        />
      </DocCard>
    </DocSection>
  );
}
