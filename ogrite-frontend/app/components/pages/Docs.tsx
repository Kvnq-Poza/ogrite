"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Menu, X } from "lucide-react";
import { FadeIn } from "../animations/FadeIn";
import { CodeBlock } from "../CodeBlock";
import { DocCard } from "../DocCard";

/* scroll helper — accounts for fixed header height (64px) + 16px buffer */
const HEADER_OFFSET = 80;
function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}

/* ------------------------------------------------------------------ */
/*  Sidebar section model                                             */
/* ------------------------------------------------------------------ */

interface DocSection {
  id: string;
  title: string;
  subsections?: { id: string; title: string }[];
}

const docSections: DocSection[] = [
  {
    id: "introduction",
    title: "Introduction",
  },
  {
    id: "installation",
    title: "Installation",
    subsections: [
      { id: "install-packages", title: "Install packages" },
      { id: "install-browser", title: "Install browser binary" },
    ],
  },
  {
    id: "configuration",
    title: "Configuration",
    subsections: [
      { id: "config-file", title: "Config file" },
      { id: "config-baseurl", title: "baseUrl" },
      { id: "config-outputdir", title: "outputDir" },
      { id: "config-concurrency", title: "concurrency" },
      { id: "config-loglevel", title: "logLevel" },
      { id: "config-viewport", title: "viewport" },
      { id: "config-wait", title: "wait" },
      { id: "config-capture", title: "capture" },
      { id: "config-compression", title: "compression" },
      { id: "config-routediscovery", title: "routeDiscovery" },
      { id: "config-normalize", title: "normalize" },
      { id: "config-meta", title: "meta" },
      { id: "config-autometa", title: "autoMeta" },
      { id: "config-template", title: "template" },
      { id: "config-inject", title: "inject" },
      { id: "config-incremental", title: "incremental" },
      { id: "config-defaults", title: "Full defaults" },
    ],
  },
  {
    id: "frameworks",
    title: "Framework Integrations",
    subsections: [
      { id: "framework-vite", title: "Vite" },
      { id: "framework-next", title: "Next.js" },
      { id: "framework-astro", title: "Astro" },
    ],
  },
  {
    id: "cli",
    title: "CLI Reference",
    subsections: [
      { id: "cli-generate", title: "ogrite generate" },
      { id: "cli-watch", title: "ogrite watch" },
      { id: "cli-check", title: "ogrite check" },
      { id: "cli-clean", title: "ogrite clean" },
    ],
  },
  {
    id: "api",
    title: "Programmatic API",
    subsections: [
      { id: "api-createoggenerator", title: "createOgGenerator()" },
      { id: "api-defineconfig", title: "defineConfig()" },
      { id: "api-oggenerator", title: "OgGenerator interface" },
      { id: "api-buildreport", title: "BuildReport" },
    ],
  },
  {
    id: "runtime",
    title: "Runtime Helper",
    subsections: [{ id: "runtime-getogimagepath", title: "getOgImagePath()" }],
  },
  {
    id: "normalization",
    title: "Route Normalization",
    subsections: [
      { id: "norm-overview", title: "How it works" },
      { id: "norm-strategies", title: "Param strategies" },
    ],
  },
  {
    id: "types",
    title: "Type Reference",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function Docs() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(docSections.map((s) => s.id)),
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSection = (id: string) => {
    const next = new Set(expandedSections);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedSections(next);
  };

  const handleSectionClick = useCallback(
    (id: string, hasSubsections: boolean) => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // "in view" = already near the top of the viewport under the header
      const isInView = rect.top >= 0 && rect.top <= HEADER_OFFSET + 30;

      scrollToId(id);

      if (hasSubsections) {
        if (isInView) {
          toggleSection(id);
        } else {
          setExpandedSections((prev) => new Set([...prev, id]));
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [expandedSections],
  );

  const handleSubClick = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    scrollToId(id);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[240px_1fr] gap-10 min-w-0">
          {/* ── Sidebar ─────────────────────────────────────────── */}
          <div className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
              <FadeIn>
                <nav className="space-y-0.5">
                  {docSections.map((section) => (
                    <div key={section.id}>
                      <button
                        onClick={() =>
                          handleSectionClick(section.id, !!section.subsections)
                        }
                        className="w-full flex items-center justify-between px-3 py-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-surface)] transition-colors text-sm font-medium"
                      >
                        {section.title}
                        {section.subsections && (
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform ${
                              expandedSections.has(section.id)
                                ? "rotate-90"
                                : ""
                            }`}
                          />
                        )}
                      </button>
                      {section.subsections &&
                        expandedSections.has(section.id) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-0.5 pl-3 mt-0.5">
                              {section.subsections.map((sub) => (
                                <a
                                  key={sub.id}
                                  href={`#${sub.id}`}
                                  onClick={(e) => handleSubClick(e, sub.id)}
                                  className="block px-3 py-1.5 rounded-md text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--background-surface)] transition-colors"
                                >
                                  {sub.title}
                                </a>
                              ))}
                            </div>
                          </motion.div>
                        )}
                    </div>
                  ))}
                </nav>
              </FadeIn>
            </div>
          </div>

          {/* ── Main content ────────────────────────────────────── */}
          <div className="min-w-0 w-full overflow-hidden">
            <FadeIn className="mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
                Documentation
              </h1>
              <p className="text-base sm:text-xl text-[var(--text-secondary)]">
                Complete reference for the Ogrite build-time OG image compiler.
              </p>
            </FadeIn>

            {/* Mobile nav */}
            <div className="lg:hidden mb-8 relative">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--background-surface)] text-[var(--text-primary)] font-medium hover:bg-[var(--background-elevated)] transition-colors w-full"
              >
                <Menu className="w-4 h-4" />
                <span className="flex-1 text-left">Jump to section</span>
                <X
                  className={`w-4 h-4 transition-transform ${
                    mobileMenuOpen
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                />
              </button>
              <AnimatePresence>
                {mobileMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setMobileMenuOpen(false)}
                    />
                    <motion.nav
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="absolute top-full left-0 right-0 z-20 mt-1 bg-[var(--background-elevated)] rounded-xl border border-[var(--border-subtle)] shadow-xl overflow-hidden"
                    >
                      <div className="p-2 max-h-72 overflow-y-auto">
                        {docSections.map((s) => (
                          <a
                            key={s.id}
                            href={`#${s.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              setMobileMenuOpen(false);
                              setTimeout(() => {
                                scrollToId(s.id);
                              }, 150);
                            }}
                            className="block px-4 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-surface)] transition-colors"
                          >
                            {s.title}
                          </a>
                        ))}
                      </div>
                    </motion.nav>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* ── Sections ─────────────────────────────────────── */}
            <div className="space-y-20">
              {/* ────────────────── Introduction ────────────────── */}
              <section id="introduction" className="scroll-mt-24">
                <h2 className="text-3xl font-bold mb-4">Introduction</h2>
                <div className="prose-custom space-y-4 text-[var(--text-secondary)]">
                  <p>
                    <strong className="text-[var(--text-primary)]">
                      Ogrite
                    </strong>{" "}
                    is a deterministic, build-time Open Graph image compiler. It
                    discovers your application routes, renders each one in a
                    headless browser, optimizes the output, and writes static
                    image artifacts to disk — all during your build step.
                  </p>
                  <p>
                    Instead of generating images at runtime (serverless
                    functions, edge workers), Ogrite handles everything at build
                    time so your images ship as static files alongside the rest
                    of your site. This eliminates cold-start latency, runtime
                    failures, and non-deterministic output.
                  </p>
                  <p>
                    The pipeline is composed of discrete stages — route
                    discovery, normalization, rendering, optimization,
                    persistence, manifest tracking, and reporting — each of
                    which can be configured independently.
                  </p>
                </div>
              </section>

              {/* ────────────────── Installation ────────────────── */}
              <section id="installation" className="scroll-mt-24">
                <h2 className="text-3xl font-bold mb-4">Installation</h2>
                <p className="text-[var(--text-secondary)] mb-6">
                  Ogrite uses{" "}
                  <strong className="text-[var(--text-primary)]">
                    Playwright
                  </strong>{" "}
                  (headless rendering) and{" "}
                  <strong className="text-[var(--text-primary)]">Sharp</strong>{" "}
                  (image optimisation) as <em>peer dependencies</em> so you
                  control their versions.
                </p>

                <div className="space-y-8">
                  <div id="install-packages" className="scroll-mt-24">
                    <h3 className="text-lg font-semibold mb-3">
                      Install packages
                    </h3>
                    <CodeBlock
                      code="npm install @ogrite/ogrite playwright sharp --save-dev"
                      language="bash"
                      variant="terminal"
                    />
                    <p className="text-xs text-[var(--text-muted)] mt-2">
                      Or with{" "}
                      <code className="text-[var(--accent-primary)]">
                        yarn add -D
                      </code>{" "}
                      /{" "}
                      <code className="text-[var(--accent-primary)]">
                        pnpm add -D
                      </code>
                      .
                    </p>
                  </div>

                  <div id="install-browser" className="scroll-mt-24">
                    <h3 className="text-lg font-semibold mb-3">
                      Install browser binary
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-3">
                      Playwright requires a browser binary for rendering.
                      Install Chromium:
                    </p>
                    <CodeBlock
                      code="npx playwright install chromium"
                      language="bash"
                      variant="terminal"
                    />
                  </div>
                </div>
              </section>

              {/* ────────────────── Configuration ───────────────── */}
              <section id="configuration" className="scroll-mt-24">
                <h2 className="text-3xl font-bold mb-4">Configuration</h2>
                <p className="text-[var(--text-secondary)] mb-8">
                  Ogrite is configured through a single file in your project
                  root. It supports{" "}
                  <code className="text-[var(--accent-primary)]">.ts</code>,{" "}
                  <code className="text-[var(--accent-primary)]">.js</code>, and{" "}
                  <code className="text-[var(--accent-primary)]">.mjs</code>{" "}
                  extensions. All options (except{" "}
                  <code className="text-[var(--accent-primary)]">baseUrl</code>{" "}
                  and{" "}
                  <code className="text-[var(--accent-primary)]">
                    outputDir
                  </code>
                  ) are optional — sensible defaults are applied automatically.
                </p>

                {/* config-file */}
                <div id="config-file" className="mb-10 scroll-mt-24">
                  <h3 className="text-xl font-semibold mb-3">Config file</h3>
                  <CodeBlock
                    code={`import { defineConfig } from '@ogrite/ogrite';

export default defineConfig({
  baseUrl: 'http://localhost:3000',
  outputDir: 'public/og',
});`}
                    language="typescript"
                    filename="ogrite.config.ts"
                  />
                </div>

                {/* baseUrl */}
                <DocCard id="config-baseurl" title="baseUrl">
                  <p className="text-sm text-[var(--text-secondary)]">
                    <strong className="text-[var(--text-primary)]">
                      Required.
                    </strong>{" "}
                    The origin of your running application. Ogrite navigates
                    Playwright to{" "}
                    <code className="text-[var(--accent-primary)]">{`\${baseUrl}\${route}`}</code>{" "}
                    for each discovered route. Trailing slashes are stripped
                    automatically.
                  </p>
                  <CodeBlock
                    code={`baseUrl: 'http://localhost:3000'`}
                    language="typescript"
                  />
                </DocCard>

                {/* outputDir */}
                <DocCard id="config-outputdir" title="outputDir">
                  <p className="text-sm text-[var(--text-secondary)]">
                    <strong className="text-[var(--text-primary)]">
                      Required.
                    </strong>{" "}
                    Where generated images are written. Typically inside your
                    public directory so the images are served as static assets.
                  </p>
                  <CodeBlock
                    code={`outputDir: 'public/og'`}
                    language="typescript"
                  />
                </DocCard>

                {/* concurrency */}
                <DocCard id="config-concurrency" title="concurrency">
                  <p className="text-sm text-[var(--text-secondary)]">
                    Maximum number of routes rendered in parallel.{" "}
                    <strong className="text-[var(--text-primary)]">
                      Default:{" "}
                      <code className="text-[var(--accent-primary)]">4</code>
                    </strong>
                  </p>
                </DocCard>

                {/* logLevel */}
                <DocCard id="config-loglevel" title="logLevel">
                  <p className="text-sm text-[var(--text-secondary)]">
                    Controls CLI output verbosity. Accepted values:{" "}
                    <code className="text-[var(--accent-primary)]">
                      &quot;silent&quot;
                    </code>{" "}
                    |{" "}
                    <code className="text-[var(--accent-primary)]">
                      &quot;info&quot;
                    </code>{" "}
                    |{" "}
                    <code className="text-[var(--accent-primary)]">
                      &quot;debug&quot;
                    </code>
                    .{" "}
                    <strong className="text-[var(--text-primary)]">
                      Default:{" "}
                      <code className="text-[var(--accent-primary)]">
                        &quot;info&quot;
                      </code>
                    </strong>
                  </p>
                </DocCard>

                {/* viewport */}
                <DocCard id="config-viewport" title="viewport">
                  <p className="text-sm text-[var(--text-secondary)] mb-3">
                    Defines the browser viewport used for rendering.
                  </p>
                  <CodeBlock
                    code={`viewport: {
  width: 1200,           // default: 1200
  height: 630,           // default: 630
  deviceScaleFactor: 2,  // default: 2
}`}
                    language="typescript"
                  />
                </DocCard>

                {/* wait */}
                <DocCard id="config-wait" title="wait">
                  <p className="text-sm text-[var(--text-secondary)] mb-3">
                    Conditions for when the screenshot is taken after
                    navigation.
                  </p>
                  <CodeBlock
                    code={`wait: {
  type: 'networkidle',  // 'load' | 'domcontentloaded' | 'networkidle' (default)
  timeoutMs: 30000,     // default: 30000
  extraDelayMs: 500,    // additional wait after condition (default: 500)
}`}
                    language="typescript"
                  />
                </DocCard>

                {/* capture */}
                <DocCard id="config-capture" title="capture">
                  <p className="text-sm text-[var(--text-secondary)] mb-3">
                    Controls what part of the page is captured.
                  </p>
                  <CodeBlock
                    code={`capture: {
  type: 'viewport',     // 'fullpage' | 'viewport' | 'element' (default: 'viewport')
  selector: null,       // CSS selector when type is 'element'
  format: 'png',        // 'png' | 'jpeg' | 'webp' (default: 'png')
  quality: 90,          // 0-100 (default: 90)
}`}
                    language="typescript"
                  />
                </DocCard>

                {/* compression */}
                <DocCard id="config-compression" title="compression">
                  <p className="text-sm text-[var(--text-secondary)] mb-3">
                    Post-capture optimisation via Sharp.
                  </p>
                  <CodeBlock
                    code={`compression: {
  enabled: true,       // default: true
  target: 'webp',     // 'png' | 'webp' | 'avif' (default: 'webp')
  quality: 80,         // default: 80
  maxWidth: 1200,      // resize if wider (default: 1200)
}`}
                    language="typescript"
                  />
                </DocCard>

                {/* routeDiscovery */}
                <DocCard id="config-routediscovery" title="routeDiscovery">
                  <p className="text-sm text-[var(--text-secondary)] mb-3">
                    How Ogrite finds directions to generate images for.
                  </p>
                  <CodeBlock
                    code={`// Strategy: 'sitemap' | 'filesystem' | 'manual' | 'custom'

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
}`}
                    language="typescript"
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-3">
                    <strong>Note:</strong> The filesystem strategy only detects
                    static routes. Dynamic route segments (e.g.{" "}
                    <code className="text-[var(--accent-primary)]">[slug]</code>
                    ,{" "}
                    <code className="text-[var(--accent-primary)]">
                      [...params]
                    </code>
                    ) are skipped because their concrete values cannot be
                    determined from the filesystem. For dynamic routes, use the{" "}
                    <strong>sitemap</strong> or <strong>custom</strong>{" "}
                    strategy.
                  </p>
                </DocCard>

                {/* normalize */}
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
                  <CodeBlock
                    code={`normalize: {
  baseOutput: 'public/og',           // defaults to outputDir
  paramStrategy: { type: 'slugify' },// 'keep' | 'hash' | 'slugify'
  homeFileName: 'home',              // name for the / route
  sanitize: (segment) => segment,    // optional custom sanitizer
}`}
                    language="typescript"
                  />
                </DocCard>

                {/* meta */}
                <DocCard id="config-meta" title="meta">
                  <p className="text-sm text-[var(--text-secondary)] mb-3">
                    Optional async function that resolves per-route metadata.
                    Receives a{" "}
                    <code className="text-[var(--accent-primary)]">
                      RoutePath
                    </code>{" "}
                    and returns a{" "}
                    <code className="text-[var(--accent-primary)]">
                      RouteMeta
                    </code>{" "}
                    object.
                  </p>
                  <CodeBlock
                    code={`meta: async (route) => ({
  canonicalPath: route,
  slug: route.replace(/^\\//, ''),
})`}
                    language="typescript"
                  />
                </DocCard>

                {/* autoMeta */}
                <DocCard id="config-autometa" title="autoMeta">
                  <p className="text-sm text-[var(--text-secondary)] mb-3">
                    Automatically inject{" "}
                    <code className="text-[var(--accent-primary)]">
                      &lt;meta property="og:image"&gt;
                    </code>{" "}
                    tags into your generated static HTML files after the build
                    is complete.
                  </p>
                  <CodeBlock
                    code={`autoMeta: {
  baseMetaUrl: "https://example.com/og",
  htmlOutputDir: "./dist",
}`}
                    language="typescript"
                  />
                  <p className="text-sm text-[var(--text-secondary)] mt-3">
                    If enabled, Ogrite will scan{" "}
                    <code className="text-[var(--accent-primary)]">
                      htmlOutputDir
                    </code>{" "}
                    for HTML files matching your routes and safely inject the
                    meta tag right before{" "}
                    <code className="text-[var(--accent-primary)]">
                      &lt;/head&gt;
                    </code>
                    . If an{" "}
                    <code className="text-[var(--accent-primary)]">
                      og:image
                    </code>{" "}
                    tag already exists, it is overwritten, making it an
                    excellent final-step utility for statically generated sites.
                  </p>
                </DocCard>

                {/* template */}
                <DocCard id="config-template" title="template">
                  <p className="text-sm text-[var(--text-secondary)] mb-3">
                    Instead of having Playwright navigate to live URLs, you can
                    provide a template function. Ogrite will take the HTML
                    string returned by this function, inject it into the
                    browser, and screenshot it.
                  </p>
                  <CodeBlock
                    code={`template: async ({ route, meta }) => {
  return \`
    <div style="width: 1200px; height: 630px; display: flex; align-items: center; justify-content: center;">
      <h1>\${meta?.title ?? 'Default Title'}</h1>
      <p>Route: \${route}</p>
    </div>
  \`;
}`}
                    language="typescript"
                  />
                  <p className="text-sm text-[var(--text-secondary)] mt-3">
                    This is excellent for generating deterministic static cards
                    without needing a web server running your app routes. It is
                    recommended to inline all CSS and base64-encode any images
                    for the best performance and reliability.
                  </p>
                </DocCard>

                {/* inject */}
                <DocCard id="config-inject" title="inject">
                  <p className="text-sm text-[var(--text-secondary)] mb-3">
                    Inject custom CSS and/or JavaScript into the page before
                    capturing a screenshot. Useful for removing cookie banners,
                    overlays, or toggling dark mode.
                  </p>
                  <CodeBlock
                    code={`inject: {
  css: 'body { background: white !important; }',  // injected via <style> tag
  js: "document.querySelector('.cookie-banner')?.remove();",  // evaluated in page context
}`}
                    language="typescript"
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-3">
                    Both fields default to empty strings (no injection). CSS is
                    applied via{" "}
                    <code className="text-[var(--accent-primary)]">
                      page.addStyleTag()
                    </code>{" "}
                    and JS via{" "}
                    <code className="text-[var(--accent-primary)]">
                      page.evaluate()
                    </code>
                    .
                  </p>
                </DocCard>

                {/* incremental */}
                <DocCard id="config-incremental" title="incremental">
                  <p className="text-sm text-[var(--text-secondary)] mb-3">
                    Enable incremental builds to significantly speed up CI and
                    local regeneration.
                  </p>
                  <CodeBlock code={`incremental: true`} language="typescript" />
                  <p className="text-sm text-[var(--text-secondary)] mt-3 mb-3">
                    When enabled, Ogrite fetches the target route's HTML before
                    taking a screenshot. It computes a hash of the HTML source
                    and compares it to the previous run (stored in{" "}
                    <code className="text-[var(--accent-primary)]">
                      .ogrite-manifest.json
                    </code>
                    ). If the HTML hasn't changed, Ogrite skips the Playwright
                    rendering and Sharp optimization steps.
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-3">
                    Defaults to{" "}
                    <code className="text-[var(--accent-primary)]">false</code>.
                    Can be overridden via CLI flags:{" "}
                    <code className="text-[var(--accent-primary)]">
                      --incremental
                    </code>{" "}
                    or{" "}
                    <code className="text-[var(--accent-primary)]">
                      --force
                    </code>
                    .
                  </p>
                </DocCard>

                {/* Full defaults */}
                <div id="config-defaults" className="scroll-mt-24">
                  <h3 className="text-xl font-semibold mb-3">Full defaults</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-3">
                    These are the exact defaults applied when you call{" "}
                    <code className="text-[var(--accent-primary)]">
                      defineConfig()
                    </code>
                    . Only{" "}
                    <code className="text-[var(--accent-primary)]">
                      baseUrl
                    </code>{" "}
                    and{" "}
                    <code className="text-[var(--accent-primary)]">
                      outputDir
                    </code>{" "}
                    are required.
                  </p>
                  <CodeBlock
                    code={`{
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
}`}
                    language="json"
                    showLineNumbers
                  />
                </div>
              </section>

              {/* ────────────────── Framework Integrations ────────── */}
              <section id="frameworks" className="scroll-mt-24">
                <h2 className="text-3xl font-bold mb-4">
                  Framework Integrations
                </h2>
                <p className="text-[var(--text-secondary)] mb-8">
                  Ogrite provides first-class plugins for modern frontend
                  meta-frameworks to run automatically post-build.
                </p>

                <div className="space-y-10">
                  {/* Vite */}
                  <DocCard id="framework-vite" title="Vite">
                    <p className="text-sm text-[var(--text-secondary)] mb-3">
                      Add the Ogrite Vite plugin to automatically run image
                      generation when your Vite build completes.
                    </p>
                    <CodeBlock
                      code={`// vite.config.ts
import { defineConfig } from 'vite';
import { ogriteVitePlugin } from '@ogrite/ogrite/plugins/vite';

export default defineConfig({
  plugins: [
    ogriteVitePlugin(),
  ],
});`}
                      language="typescript"
                    />
                  </DocCard>

                  {/* Next.js */}
                  <DocCard id="framework-next" title="Next.js">
                    <p className="text-sm text-[var(--text-secondary)] mb-3">
                      Use the Next.js wrapper or programmatic utility in your
                      build scripts.
                    </p>
                    <CodeBlock
                      code={`// next.config.js
import { withOgrite } from '@ogrite/ogrite/plugins/next';

export default withOgrite({
  reactStrictMode: true,
  // your other next configs
});`}
                      language="typescript"
                    />
                    <p className="text-sm text-[var(--text-secondary)] mt-3">
                      Since Next.js doesn't natively expose post-build hooks,
                      the wrapper logs a reminder locally. It is recommended to
                      run{" "}
                      <code className="text-[var(--accent-primary)]">
                        ogrite generate
                      </code>{" "}
                      as a postbuild script in{" "}
                      <code className="text-[var(--accent-primary)]">
                        package.json
                      </code>
                      : <br />
                      <code className="text-[var(--accent-primary)]">
                        "build": "next build && ogrite generate"
                      </code>
                    </p>
                  </DocCard>

                  {/* Astro */}
                  <DocCard id="framework-astro" title="Astro">
                    <p className="text-sm text-[var(--text-secondary)] mb-3">
                      Hook into Astro's{" "}
                      <code className="text-[var(--accent-primary)]">
                        astro:build:done
                      </code>{" "}
                      target to generate images perfectly timed after your
                      static pages are emitted.
                    </p>
                    <CodeBlock
                      code={`// astro.config.mjs
import { defineConfig } from 'astro/config';
import { ogriteAstroPlugin } from '@ogrite/ogrite/plugins/astro';

export default defineConfig({
  integrations: [
    ogriteAstroPlugin(),
  ],
});`}
                      language="typescript"
                    />
                  </DocCard>
                </div>
              </section>

              {/* ────────────────── CLI Reference ───────────────── */}
              <section id="cli" className="scroll-mt-24">
                <h2 className="text-3xl font-bold mb-4">CLI Reference</h2>
                <p className="text-[var(--text-secondary)] mb-8">
                  The{" "}
                  <code className="text-[var(--accent-primary)]">ogrite</code>{" "}
                  binary ships with the package. Run commands via{" "}
                  <code className="text-[var(--accent-primary)]">
                    npx @ogrite/ogrite
                  </code>{" "}
                  or add scripts to your{" "}
                  <code className="text-[var(--accent-primary)]">
                    package.json
                  </code>
                  .
                </p>

                <div className="space-y-10">
                  <DocCard id="cli-generate" title="ogrite generate">
                    <p className="text-[var(--text-secondary)] mb-3">
                      Run the full pipeline: discover routes → render → optimize
                      → write artifacts → update manifest.
                    </p>
                    <CodeBlock
                      code="npx @ogrite/ogrite generate"
                      language="bash"
                      variant="terminal"
                    />
                    <div className="mt-3 bg-[var(--background-surface)] rounded-xl p-4 border border-[var(--border-subtle)]">
                      <h4 className="text-sm font-semibold mb-2">Options</h4>
                      <ul className="text-sm text-[var(--text-secondary)] space-y-1">
                        <li>
                          <code className="text-[var(--accent-primary)]">
                            -c, --concurrency &lt;number&gt;
                          </code>{" "}
                          — Override parallel rendering workers
                        </li>
                      </ul>
                    </div>
                  </DocCard>

                  <DocCard id="cli-watch" title="ogrite watch">
                    <p className="text-[var(--text-secondary)] mb-3">
                      Start an incremental watcher. Monitors your source files
                      and regenerates affected images on change. Uses{" "}
                      <code className="text-[var(--accent-primary)]">
                        chokidar
                      </code>{" "}
                      under the hood.
                    </p>
                    <CodeBlock
                      code="npx @ogrite/ogrite watch"
                      language="bash"
                      variant="terminal"
                    />
                  </DocCard>

                  <DocCard id="cli-check" title="ogrite check">
                    <p className="text-[var(--text-secondary)] mb-3">
                      Validate that current artifacts on disk match the manifest
                      and route list. Exits with a non-zero code if stale or
                      missing images are found — ideal for CI.
                    </p>
                    <CodeBlock
                      code="npx @ogrite/ogrite check"
                      language="bash"
                      variant="terminal"
                    />
                  </DocCard>

                  <DocCard id="cli-clean" title="ogrite clean">
                    <p className="text-[var(--text-secondary)] mb-3">
                      Remove all generated artifacts and clear the{" "}
                      <code className="text-[var(--accent-primary)]">
                        .ogrite-manifest.json
                      </code>{" "}
                      file.
                    </p>
                    <CodeBlock
                      code="npx @ogrite/ogrite clean"
                      language="bash"
                      variant="terminal"
                    />
                  </DocCard>
                </div>
              </section>

              {/* ────────────────── Programmatic API ────────────── */}
              <section id="api" className="scroll-mt-24">
                <h2 className="text-3xl font-bold mb-4">Programmatic API</h2>
                <p className="text-[var(--text-secondary)] mb-8">
                  Import Ogrite into your Node.js build scripts for full control
                  over the generation pipeline.
                </p>

                <div className="space-y-10">
                  <DocCard
                    id="api-createoggenerator"
                    title="createOgGenerator(config)"
                  >
                    <p className="text-[var(--text-secondary)] mb-3">
                      Factory function that accepts an{" "}
                      <code className="text-[var(--accent-primary)]">
                        OgriteConfig
                      </code>
                      , resolves defaults via{" "}
                      <code className="text-[var(--accent-primary)]">
                        defineConfig()
                      </code>
                      , and returns an{" "}
                      <code className="text-[var(--accent-primary)]">
                        OgGenerator
                      </code>{" "}
                      instance.
                    </p>
                    <CodeBlock
                      code={`import { createOgGenerator } from '@ogrite/ogrite';

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
// → "public/og/about.webp"`}
                      language="typescript"
                      filename="build-og.ts"
                    />
                  </DocCard>

                  <DocCard id="api-defineconfig" title="defineConfig(config)">
                    <p className="text-[var(--text-secondary)] mb-3">
                      Merges your partial config with library defaults and
                      validates required fields. Throws a{" "}
                      <code className="text-[var(--accent-primary)]">
                        ConfigValidationError
                      </code>{" "}
                      if{" "}
                      <code className="text-[var(--accent-primary)]">
                        baseUrl
                      </code>{" "}
                      or{" "}
                      <code className="text-[var(--accent-primary)]">
                        outputDir
                      </code>{" "}
                      is missing.
                    </p>
                    <CodeBlock
                      code={`import { defineConfig } from '@ogrite/ogrite';

const config = defineConfig({
  baseUrl: 'http://localhost:3000',
  outputDir: 'public/og',
  compression: { quality: 90 },
});
// All other fields are filled with defaults`}
                      language="typescript"
                    />
                  </DocCard>

                  <DocCard id="api-oggenerator" title="OgGenerator interface">
                    <CodeBlock
                      code={`interface OgGenerator {
  /** Run the full pipeline for all discovered routes. */
  build(): Promise<BuildReport>;

  /** Render and optimise a single route. Returns the output path. */
  buildRoute(route: RoutePath): Promise<string>;

  /** Map a route to its deterministic output path (no I/O). */
  normalize(route: RoutePath): string;
}`}
                      language="typescript"
                    />
                  </DocCard>

                  <DocCard id="api-buildreport" title="BuildReport">
                    <p className="text-[var(--text-secondary)] mb-3">
                      Returned by{" "}
                      <code className="text-[var(--accent-primary)]">
                        generator.build()
                      </code>
                      . Aggregates results across all routes.
                    </p>
                    <CodeBlock
                      code={`interface BuildReport {
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
}`}
                      language="typescript"
                    />
                  </DocCard>
                </div>
              </section>

              {/* ────────────────── Runtime Helper ──────────────── */}
              <section id="runtime" className="scroll-mt-24">
                <h2 className="text-3xl font-bold mb-4">Runtime Helper</h2>
                <p className="text-[var(--text-secondary)] mb-8">
                  A lightweight function for resolving OG image paths{" "}
                  <em>inside your app</em>, without importing the full Ogrite
                  pipeline.
                </p>

                <DocCard
                  id="runtime-getogimagepath"
                  title="getOgImagePath(route, manifestDir?)"
                >
                  <p className="text-[var(--text-secondary)] mb-3">
                    Reads the{" "}
                    <code className="text-[var(--accent-primary)]">
                      .ogrite-manifest.json
                    </code>{" "}
                    from disk and returns the{" "}
                    <code className="text-[var(--accent-primary)]">
                      outputPath
                    </code>{" "}
                    for the given route. Returns{" "}
                    <code className="text-[var(--accent-primary)]">
                      undefined
                    </code>{" "}
                    if the manifest or entry is not found.
                  </p>
                  <CodeBlock
                    code={`import { getOgImagePath } from '@ogrite/ogrite/runtime';

// Reads from <cwd>/public/og/.ogrite-manifest.json by default
const path = getOgImagePath('/blog/hello-world');
// → "public/og/blog/hello-world.webp"

// Custom manifest directory
const path2 = getOgImagePath('/about', './dist/og');`}
                    language="typescript"
                    filename="app/layout.tsx"
                  />
                  <div className="mt-4 bg-[var(--background-surface)] rounded-xl p-5 border border-[var(--border-subtle)]">
                    <h4 className="text-sm font-semibold mb-2">Parameters</h4>
                    <ul className="text-sm text-[var(--text-secondary)] space-y-2">
                      <li>
                        <code className="text-[var(--accent-primary)]">
                          route
                        </code>{" "}
                        — The route path (e.g.{" "}
                        <code className="text-[var(--accent-primary)]">
                          /blog/post
                        </code>
                        ).
                      </li>
                      <li>
                        <code className="text-[var(--accent-primary)]">
                          manifestDir
                        </code>{" "}
                        — Optional. Defaults to{" "}
                        <code className="text-[var(--accent-primary)]">
                          public/og
                        </code>
                        .
                      </li>
                    </ul>
                  </div>
                </DocCard>
              </section>

              {/* ────────────────── Route Normalization ─────────── */}
              <section id="normalization" className="scroll-mt-24">
                <h2 className="text-3xl font-bold mb-4">Route Normalization</h2>
                <p className="text-[var(--text-secondary)] mb-8">
                  Normalization converts URL paths into deterministic file
                  paths. This ensures the same route always produces the same
                  file name, regardless of order or run.
                </p>

                <div className="space-y-10">
                  <div id="norm-overview" className="scroll-mt-24">
                    <h3 className="text-xl font-semibold mb-3">How it works</h3>
                    <div className="bg-[var(--background-surface)] rounded-xl p-5 border border-[var(--border-subtle)]">
                      <ul className="text-sm text-[var(--text-secondary)] space-y-2">
                        <li>
                          The root route{" "}
                          <code className="text-[var(--accent-primary)]">
                            /
                          </code>{" "}
                          maps to{" "}
                          <code className="text-[var(--accent-primary)]">{`<baseOutput>/home.<format>`}</code>{" "}
                          (configurable via{" "}
                          <code className="text-[var(--accent-primary)]">
                            homeFileName
                          </code>
                          ).
                        </li>
                        <li>
                          Each URL segment becomes a directory or filename:{" "}
                          <code className="text-[var(--accent-primary)]">
                            /blog/my-post
                          </code>{" "}
                          →{" "}
                          <code className="text-[var(--accent-primary)]">
                            blog/my-post.webp
                          </code>
                        </li>
                        <li>
                          Dynamic segments (
                          <code className="text-[var(--accent-primary)]">
                            [slug]
                          </code>
                          ,{" "}
                          <code className="text-[var(--accent-primary)]">{`{id}`}</code>
                          ,{" "}
                          <code className="text-[var(--accent-primary)]">
                            :id
                          </code>
                          ) are processed by the chosen{" "}
                          <code className="text-[var(--accent-primary)]">
                            paramStrategy
                          </code>
                          .
                        </li>
                        <li>
                          An optional{" "}
                          <code className="text-[var(--accent-primary)]">
                            sanitize
                          </code>{" "}
                          function runs on each segment first.
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div id="norm-strategies" className="scroll-mt-24">
                    <h3 className="text-xl font-semibold mb-3">
                      Param strategies
                    </h3>
                    <div className="space-y-4">
                      <DocCard codeTitle="slugify" isDefault className="!mb-0">
                        <p className="text-sm text-[var(--text-secondary)] mb-2">
                          Lowercases, strips diacritics, replaces spaces with
                          hyphens, removes special characters.
                        </p>
                        <CodeBlock
                          code={`/blog/[slug] → blog/slug.webp`}
                          language="bash"
                        />
                      </DocCard>

                      <DocCard codeTitle="keep" className="!mb-0">
                        <p className="text-sm text-[var(--text-secondary)] mb-2">
                          Strips bracket/brace/colon characters but otherwise
                          keeps the original text.
                        </p>
                        <CodeBlock
                          code={`/blog/[slug] → blog/slug.webp`}
                          language="bash"
                        />
                      </DocCard>

                      <DocCard codeTitle="hash" className="!mb-0">
                        <p className="text-sm text-[var(--text-secondary)] mb-2">
                          Generates a truncated SHA-256 hash of the segment.
                          Configurable length (default 8).
                        </p>
                        <CodeBlock
                          code={`/blog/[slug] → blog/a1b2c3d4.webp`}
                          language="bash"
                        />
                      </DocCard>
                    </div>
                  </div>
                </div>
              </section>

              {/* ────────────────── Type Reference ──────────────── */}
              <section id="types" className="scroll-mt-24">
                <h2 className="text-3xl font-bold mb-4">Type Reference</h2>
                <p className="text-[var(--text-secondary)] mb-6">
                  All public types are exported from the{" "}
                  <code className="text-[var(--accent-primary)]">
                    @ogrite/ogrite
                  </code>{" "}
                  package and can be imported directly.
                </p>
                <CodeBlock
                  code={`import type {
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
} from '@ogrite/ogrite';`}
                  language="typescript"
                  showLineNumbers
                />
              </section>
            </div>

            {/* ── Bottom CTA ───────────────────────────────────── */}
            <FadeIn delay={0.3}>
              <div className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-[var(--background-surface)] to-[var(--background-elevated)] border border-[var(--border-subtle)] text-center">
                <h2 className="text-2xl font-bold mb-4">
                  Ready to get started?
                </h2>
                <p className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto">
                  Follow the quickstart guide to integrate Ogrite into your
                  project in under 5 minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.a
                    href="/getting-started"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-full bg-[var(--accent-primary)] text-black font-bold hover:shadow-[0_0_20px_rgba(var(--accent-primary-rgb),0.3)] transition-all"
                  >
                    Quick Start Guide
                  </motion.a>
                  <motion.a
                    href="https://github.com/Kvnq-Poza/ogrite"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    View on GitHub
                  </motion.a>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
