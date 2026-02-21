# Ogrite

Deterministic visual artifact compiler for Open Graph images.

Ogrite converts application routes into static, optimized OG images at build time — the same way bundlers turn code into assets.

## Quick Start

```bash
npm install ogrite playwright sharp
npx playwright install chromium
```

Create `ogrite.config.ts`:

```ts
import { defineConfig } from "ogrite";

export default defineConfig({
  baseUrl: "http://localhost:3000",
  outputDir: "public/og",
  routeDiscovery: {
    strategy: "manual",
    routes: ["/", "/about", "/blog"],
  },
});
```

Generate images:

```bash
npx ogrite generate
```

## CLI Commands

| Command                           | Description                                    |
| --------------------------------- | ---------------------------------------------- |
| `ogrite generate`                 | Run the full pipeline and emit image artifacts |
| `ogrite generate --concurrency 8` | Parallel rendering with 8 workers              |
| `ogrite watch`                    | Incremental watcher — regenerate on change     |
| `ogrite check`                    | Validate artifacts against manifest and routes |
| `ogrite clean`                    | Remove all generated artifacts                 |

## Route Discovery Strategies

```ts
// Sitemap
routeDiscovery: { strategy: 'sitemap', source: '/sitemap.xml' }

// Filesystem scan
routeDiscovery: { strategy: 'filesystem', source: 'app/' }

// Manual list
routeDiscovery: { strategy: 'manual', routes: ['/', '/about'] }

// Custom async resolver
routeDiscovery: {
  strategy: 'custom',
  resolver: async () => {
    const slugs = await fetchBlogSlugs();
    return slugs.map(s => `/blog/${s}`);
  },
}
```

## Runtime Helper

Resolve a route to its generated OG image path at build time:

```ts
import { getOgImagePath } from "ogrite/runtime";

const path = getOgImagePath("/blog/post");
// → 'public/og/blog/post.webp'
```

## Programmatic API

```ts
import { createOgGenerator, defineConfig } from "ogrite";

const generator = createOgGenerator({
  baseUrl: "http://localhost:3000",
  outputDir: "public/og",
});

// Full build
const report = await generator.build();

// Single route
const outputPath = await generator.buildRoute("/about");

// Normalize without rendering
const path = generator.normalize("/blog/post");
```

## Configuration

| Option           | Type                             | Default                    | Description                    |
| ---------------- | -------------------------------- | -------------------------- | ------------------------------ |
| `baseUrl`        | `string`                         | _required_                 | Root URL for rendering         |
| `outputDir`      | `string`                         | _required_                 | Output directory for artifacts |
| `mode`           | `'manual' \| 'build' \| 'watch'` | `'manual'`                 | Execution mode                 |
| `concurrency`    | `number`                         | `4`                        | Parallel rendering workers     |
| `viewport`       | `Viewport`                       | `1200×630 @2x`             | Browser viewport               |
| `wait`           | `WaitOptions`                    | `networkidle, 30s, +500ms` | Navigation wait conditions     |
| `capture`        | `CaptureOptions`                 | `viewport, png, q90`       | Screenshot capture settings    |
| `compression`    | `CompressionOptions`             | `webp, q80, max 1200px`    | Post-render optimization       |
| `routeDiscovery` | `RouteDiscovery`                 | `manual`                   | Route detection strategy       |
| `normalize`      | `NormalizeOptions`               | `slugify, "home"`          | Output path mapping            |
| `logLevel`       | `'silent' \| 'info' \| 'debug'`  | `'info'`                   | Verbosity                      |

## License

MIT
