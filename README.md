# Ogrite

Deterministic visual artifact compiler for Open Graph images.

Ogrite converts application routes into static, optimized OG images at build time — the same way bundlers turn code into assets.

## Installation

```bash
npm install @ogrite/ogrite playwright sharp --save-dev
# or
yarn add -D @ogrite/ogrite playwright sharp
# or
pnpm add -D @ogrite/ogrite playwright sharp
```

Then install the browser binaries:

```bash
npx playwright install chromium
```

Create `ogrite.config.ts`:

```ts
import { defineConfig } from "@ogrite/ogrite";

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
npx @ogrite/ogrite generate
```

## CLI Commands

| Command                                       | Description                                    |
| --------------------------------------------- | ---------------------------------------------- |
| `npx @ogrite/ogrite generate`                 | Run the full pipeline and emit image artifacts |
| `npx @ogrite/ogrite generate --concurrency 8` | Parallel rendering with 8 workers              |
| `npx @ogrite/ogrite watch`                    | Incremental watcher — regenerate on change     |
| `npx @ogrite/ogrite check`                    | Validate artifacts against manifest and routes |
| `npx @ogrite/ogrite clean`                    | Remove all generated artifacts                 |

## Route Discovery Strategies

```ts
// Sitemap
routeDiscovery: { strategy: 'sitemap', source: '/sitemap.xml' }

// Filesystem scan (static routes only — dynamic segments like [slug] are skipped)
routeDiscovery: { strategy: 'filesystem', source: 'app/' }
// source is optional — if omitted, auto-detects common directories (app/, src/app/, pages/, src/pages/)
routeDiscovery: { strategy: 'filesystem' }

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

> **Note:** The `filesystem` strategy only discovers static routes. Dynamic route segments (e.g. `[slug]`, `[...params]`) are skipped because their concrete values cannot be determined from the filesystem alone. To include dynamic routes, use the `sitemap` strategy (which reads your pre-built sitemap) or the `custom` strategy with an async resolver that enumerates the actual paths. The `source` option is optional — if omitted, the resolver auto-detects common framework directories (`app/`, `src/app/`, `pages/`, `src/pages/`).

## Use in your app

Resolve a route to its generated OG image path at build time:

```typescript
import { getOgImagePath } from "@ogrite/ogrite/runtime";

export function generateMetadata({ params }) {
  const ogImage = getOgImagePath(`/blog/${params.slug}`);
  return {
    openGraph: {
      images: ogImage ? [{ url: ogImage }] : [],
    },
  };
}
```

## Programmatic API

```ts
import { createOgGenerator, defineConfig } from "@ogrite/ogrite";

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
