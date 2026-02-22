"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Menu, X } from "lucide-react";
import { FadeIn } from "../animations/FadeIn";
import { CodeBlock } from "../CodeBlock";

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
      { id: "config-defaults", title: "Full defaults" },
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
                      code="npm install ogrite playwright sharp --save-dev"
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
                    code={`import { defineConfig } from 'ogrite';

export default defineConfig({
  baseUrl: 'http://localhost:3000',
  outputDir: 'public/og',
});`}
                    language="typescript"
                    filename="ogrite.config.ts"
                  />
                </div>

                {/* baseUrl */}
                <div id="config-baseurl" className="mb-8 scroll-mt-24">
                  <h3 className="text-xl font-semibold mb-2">baseUrl</h3>
                  <div className="bg-[var(--background-surface)] rounded-xl p-5 border border-[var(--border-subtle)]">
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
                  </div>
                </div>

                {/* outputDir */}
                <div id="config-outputdir" className="mb-8 scroll-mt-24">
                  <h3 className="text-xl font-semibold mb-2">outputDir</h3>
                  <div className="bg-[var(--background-surface)] rounded-xl p-5 border border-[var(--border-subtle)]">
                    <p className="text-sm text-[var(--text-secondary)]">
                      <strong className="text-[var(--text-primary)]">
                        Required.
                      </strong>{" "}
                      Where generated images are written. Typically inside your
                      public directory so the images are served as static
                      assets.
                    </p>
                    <CodeBlock
                      code={`outputDir: 'public/og'`}
                      language="typescript"
                    />
                  </div>
                </div>

                {/* concurrency */}
                <div id="config-concurrency" className="mb-8 scroll-mt-24">
                  <h3 className="text-xl font-semibold mb-2">concurrency</h3>
                  <div className="bg-[var(--background-surface)] rounded-xl p-5 border border-[var(--border-subtle)]">
                    <p className="text-sm text-[var(--text-secondary)]">
                      Maximum number of routes rendered in parallel.{" "}
                      <strong className="text-[var(--text-primary)]">
                        Default:{" "}
                        <code className="text-[var(--accent-primary)]">4</code>
                      </strong>
                    </p>
                  </div>
                </div>

                {/* logLevel */}
                <div id="config-loglevel" className="mb-8 scroll-mt-24">
                  <h3 className="text-xl font-semibold mb-2">logLevel</h3>
                  <div className="bg-[var(--background-surface)] rounded-xl p-5 border border-[var(--border-subtle)]">
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
                  </div>
                </div>

                {/* viewport */}
                <div id="config-viewport" className="mb-8 scroll-mt-24">
                  <h3 className="text-xl font-semibold mb-2">viewport</h3>
                  <div className="bg-[var(--background-surface)] rounded-xl p-5 border border-[var(--border-subtle)]">
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
                  </div>
                </div>

                {/* wait */}
                <div id="config-wait" className="mb-8 scroll-mt-24">
                  <h3 className="text-xl font-semibold mb-2">wait</h3>
                  <div className="bg-[var(--background-surface)] rounded-xl p-5 border border-[var(--border-subtle)]">
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
                  </div>
                </div>

                {/* capture */}
                <div id="config-capture" className="mb-8 scroll-mt-24">
                  <h3 className="text-xl font-semibold mb-2">capture</h3>
                  <div className="bg-[var(--background-surface)] rounded-xl p-5 border border-[var(--border-subtle)]">
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
                  </div>
                </div>

                {/* compression */}
                <div id="config-compression" className="mb-8 scroll-mt-24">
                  <h3 className="text-xl font-semibold mb-2">compression</h3>
                  <div className="bg-[var(--background-surface)] rounded-xl p-5 border border-[var(--border-subtle)]">
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
                  </div>
                </div>

                {/* routeDiscovery */}
                <div id="config-routediscovery" className="mb-8 scroll-mt-24">
                  <h3 className="text-xl font-semibold mb-2">routeDiscovery</h3>
                  <div className="bg-[var(--background-surface)] rounded-xl p-5 border border-[var(--border-subtle)]">
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

// Filesystem — scans your pages directory
routeDiscovery: {
  strategy: 'filesystem',
  source: 'src/app',  // or 'src/pages'
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
                  </div>
                </div>

                {/* normalize */}
                <div id="config-normalize" className="mb-8 scroll-mt-24">
                  <h3 className="text-xl font-semibold mb-2">normalize</h3>
                  <div className="bg-[var(--background-surface)] rounded-xl p-5 border border-[var(--border-subtle)]">
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
                  </div>
                </div>

                {/* meta */}
                <div id="config-meta" className="mb-8 scroll-mt-24">
                  <h3 className="text-xl font-semibold mb-2">meta</h3>
                  <div className="bg-[var(--background-surface)] rounded-xl p-5 border border-[var(--border-subtle)]">
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
  slug: route.replace(/^\//, ''),
})`}
                      language="typescript"
                    />
                  </div>
                </div>

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
  viewport: { width: 1200, height: 630, deviceScaleFactor: 2 },
  wait: { type: 'networkidle', timeoutMs: 30000, extraDelayMs: 500 },
  capture: { type: 'viewport', selector: null, format: 'png', quality: 90 },
  compression: { enabled: true, target: 'webp', quality: 80, maxWidth: 1200 },
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

              {/* ────────────────── CLI Reference ───────────────── */}
              <section id="cli" className="scroll-mt-24">
                <h2 className="text-3xl font-bold mb-4">CLI Reference</h2>
                <p className="text-[var(--text-secondary)] mb-8">
                  The{" "}
                  <code className="text-[var(--accent-primary)]">ogrite</code>{" "}
                  binary ships with the package. Run commands via{" "}
                  <code className="text-[var(--accent-primary)]">
                    npx ogrite
                  </code>{" "}
                  or add scripts to your{" "}
                  <code className="text-[var(--accent-primary)]">
                    package.json
                  </code>
                  .
                </p>

                <div className="space-y-10">
                  <div id="cli-generate" className="scroll-mt-24">
                    <h3 className="text-xl font-semibold mb-2">
                      ogrite generate
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-3">
                      Run the full pipeline: discover routes → render → optimize
                      → write artifacts → update manifest.
                    </p>
                    <CodeBlock
                      code="npx ogrite generate"
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
                  </div>

                  <div id="cli-watch" className="scroll-mt-24">
                    <h3 className="text-xl font-semibold mb-2">ogrite watch</h3>
                    <p className="text-[var(--text-secondary)] mb-3">
                      Start an incremental watcher. Monitors your source files
                      and regenerates affected images on change. Uses{" "}
                      <code className="text-[var(--accent-primary)]">
                        chokidar
                      </code>{" "}
                      under the hood.
                    </p>
                    <CodeBlock
                      code="npx ogrite watch"
                      language="bash"
                      variant="terminal"
                    />
                  </div>

                  <div id="cli-check" className="scroll-mt-24">
                    <h3 className="text-xl font-semibold mb-2">ogrite check</h3>
                    <p className="text-[var(--text-secondary)] mb-3">
                      Validate that current artifacts on disk match the manifest
                      and route list. Exits with a non-zero code if stale or
                      missing images are found — ideal for CI.
                    </p>
                    <CodeBlock
                      code="npx ogrite check"
                      language="bash"
                      variant="terminal"
                    />
                  </div>

                  <div id="cli-clean" className="scroll-mt-24">
                    <h3 className="text-xl font-semibold mb-2">ogrite clean</h3>
                    <p className="text-[var(--text-secondary)] mb-3">
                      Remove all generated artifacts and clear the{" "}
                      <code className="text-[var(--accent-primary)]">
                        .ogrite-manifest.json
                      </code>{" "}
                      file.
                    </p>
                    <CodeBlock
                      code="npx ogrite clean"
                      language="bash"
                      variant="terminal"
                    />
                  </div>
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
                  <div id="api-createoggenerator" className="scroll-mt-24">
                    <h3 className="text-xl font-semibold mb-3">
                      createOgGenerator(config)
                    </h3>
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
                      code={`import { createOgGenerator } from 'ogrite';

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
                  </div>

                  <div id="api-defineconfig" className="scroll-mt-24">
                    <h3 className="text-xl font-semibold mb-3">
                      defineConfig(config)
                    </h3>
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
                      code={`import { defineConfig } from 'ogrite';

const config = defineConfig({
  baseUrl: 'http://localhost:3000',
  outputDir: 'public/og',
  compression: { quality: 90 },
});
// All other fields are filled with defaults`}
                      language="typescript"
                    />
                  </div>

                  <div id="api-oggenerator" className="scroll-mt-24">
                    <h3 className="text-xl font-semibold mb-3">
                      OgGenerator interface
                    </h3>
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
                  </div>

                  <div id="api-buildreport" className="scroll-mt-24">
                    <h3 className="text-xl font-semibold mb-3">BuildReport</h3>
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
                  </div>
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

                <div id="runtime-getogimagepath" className="scroll-mt-24">
                  <h3 className="text-xl font-semibold mb-3">
                    getOgImagePath(route, manifestDir?)
                  </h3>
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
                    code={`import { getOgImagePath } from 'ogrite/runtime';

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
                </div>
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
                      <div className="bg-[var(--background-surface)] rounded-xl p-5 border border-[var(--border-subtle)]">
                        <h4 className="font-semibold mb-2">
                          <code className="text-[var(--accent-primary)]">
                            slugify
                          </code>{" "}
                          <span className="text-xs text-[var(--text-muted)] font-normal">
                            (default)
                          </span>
                        </h4>
                        <p className="text-sm text-[var(--text-secondary)] mb-2">
                          Lowercases, strips diacritics, replaces spaces with
                          hyphens, removes special characters.
                        </p>
                        <CodeBlock
                          code={`/blog/[slug] → blog/slug.webp`}
                          language="bash"
                        />
                      </div>
                      <div className="bg-[var(--background-surface)] rounded-xl p-5 border border-[var(--border-subtle)]">
                        <h4 className="font-semibold mb-2">
                          <code className="text-[var(--accent-primary)]">
                            keep
                          </code>
                        </h4>
                        <p className="text-sm text-[var(--text-secondary)] mb-2">
                          Strips bracket/brace/colon characters but otherwise
                          keeps the original text.
                        </p>
                        <CodeBlock
                          code={`/blog/[slug] → blog/slug.webp`}
                          language="bash"
                        />
                      </div>
                      <div className="bg-[var(--background-surface)] rounded-xl p-5 border border-[var(--border-subtle)]">
                        <h4 className="font-semibold mb-2">
                          <code className="text-[var(--accent-primary)]">
                            hash
                          </code>
                        </h4>
                        <p className="text-sm text-[var(--text-secondary)] mb-2">
                          Generates a truncated SHA-256 hash of the segment.
                          Configurable length (default 8).
                        </p>
                        <CodeBlock
                          code={`/blog/[slug] → blog/a1b2c3d4.webp`}
                          language="bash"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ────────────────── Type Reference ──────────────── */}
              <section id="types" className="scroll-mt-24">
                <h2 className="text-3xl font-bold mb-4">Type Reference</h2>
                <p className="text-[var(--text-secondary)] mb-6">
                  All public types are exported from the{" "}
                  <code className="text-[var(--accent-primary)]">ogrite</code>{" "}
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
  OgGenerator,         // { build(), buildRoute(), normalize() }
  BuildReport,         // { success, generated, failed, skipped, durationMs, errors }
  OgriteError,         // { route, type, message, stack? }
  ManifestEntry,       // { route, outputPath, hash, generatedAt }
  Manifest,            // Record<string, ManifestEntry>
  Renderer,            // Adapter interface: { init(), render(), close() }
  Optimizer,           // Adapter interface: { optimize() }
} from 'ogrite';`}
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
