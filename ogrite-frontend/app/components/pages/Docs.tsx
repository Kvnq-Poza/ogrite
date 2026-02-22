"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Menu,
  Terminal,
  Settings,
  Search,
  Zap,
  Book,
} from "lucide-react";
import { FadeIn } from "../animations/FadeIn";
import { CodeBlock } from "../CodeBlock";

interface DocSection {
  id: string;
  title: string;
  content: string;
  subsections?: { id: string; title: string }[];
}

const docSections: DocSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    content: `Ogrite is a deterministic visual artifact compiler for Open Graph images. It converts application routes into static, optimized images at build time — extending the build system's compilation model to UI representations.

By moving OG image generation from runtime to a deterministic build pipeline, Ogrite eliminates runtime rendering costs, surfaces failures at build time, and ensures reproducible visual outputs across environments.`,
  },
  {
    id: "installation",
    title: "Installation",
    content:
      "Install Ogrite and its peer dependencies (Playwright and Sharp) in your project.",
    subsections: [
      { id: "installation-step", title: "Installation" },
      { id: "playwright-setup", title: "Playwright Setup" },
    ],
  },
  {
    id: "configuration",
    title: "Configuration",
    content:
      "Ogrite uses a centralized configuration file to define how your images are generated and optimized.",
    subsections: [
      { id: "config-file", title: "Configuration File" },
      { id: "core-options", title: "Core Options" },
      { id: "route-discovery", title: "Route Discovery" },
      { id: "normalization", title: "Normalization" },
      { id: "rendering-options", title: "Rendering Options" },
      { id: "optimization", title: "Optimization" },
    ],
  },
  {
    id: "cli",
    title: "CLI Reference",
    content:
      "The ogrite binary provides several commands to manage your visual artifacts.",
    subsections: [
      { id: "generate", title: "ogrite generate" },
      { id: "watch", title: "ogrite watch" },
      { id: "check", title: "ogrite check" },
      { id: "clean", title: "ogrite clean" },
    ],
  },
  {
    id: "api",
    title: "API Reference",
    content:
      "Ogrite can be used programmatically within your build scripts or runtime code.",
    subsections: [
      { id: "generator", title: "OgGenerator" },
      { id: "runtime", title: "Runtime Helper" },
    ],
  },
];

export function Docs() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["introduction", "configuration"]),
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSection = (id: string) => {
    const newSet = new Set(expandedSections);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedSections(newSet);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <FadeIn>
                <nav className="space-y-1">
                  {docSections.map((section) => (
                    <div key={section.id}>
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between px-4 py-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-surface)] transition-colors text-sm font-medium"
                      >
                        {section.title}
                        {section.subsections && (
                          <ChevronRight
                            className={`w-4 h-4 transition-transform ${
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
                            <div className="space-y-1 pl-4 mt-1">
                              {section.subsections.map((sub) => (
                                <a
                                  key={sub.id}
                                  href={`#${sub.id}`}
                                  className="block px-4 py-2 rounded-md text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--background-surface)] transition-colors"
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

          {/* Main Content */}
          <div className="lg:col-span-3">
            <FadeIn className="mb-12">
              <h1 className="text-5xl font-bold mb-4">Documentation</h1>
              <p className="text-xl text-[var(--text-secondary)]">
                Technical reference for Ogrite.
              </p>
            </FadeIn>

            {/* Mobile Menu */}
            <div className="lg:hidden mb-8">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--background-surface)] text-[var(--text-primary)] font-medium hover:bg-[var(--background-elevated)] transition-colors w-full"
              >
                <Menu className="w-4 h-4" />
                Sections
              </button>
              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.nav
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 space-y-1 bg-[var(--background-surface)] rounded-md p-4"
                  >
                    {docSections.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-2 rounded text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-elevated)] transition-colors"
                      >
                        {section.title}
                      </a>
                    ))}
                  </motion.nav>
                )}
              </AnimatePresence>
            </div>

            {/* Documentation Sections */}
            <div className="space-y-16">
              {docSections.map((section, index) => (
                <FadeIn key={section.id} delay={index * 0.1}>
                  <section id={section.id} className="scroll-mt-24">
                    <motion.div
                      className="mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <h2 className="text-3xl font-bold mb-4">
                        {section.title}
                      </h2>
                      <p className="text-[var(--text-secondary)] whitespace-pre-wrap">
                        {section.content}
                      </p>
                    </motion.div>

                    {section.id === "installation" && (
                      <div className="space-y-8">
                        <div id="installation-step">
                          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <Terminal className="w-5 h-5 text-[var(--accent-primary)]" />
                            Installation
                          </h3>
                          <CodeBlock
                            code="npm install ogrite playwright sharp --save-dev"
                            language="bash"
                            variant="terminal"
                          />
                        </div>
                        <div id="playwright-setup">
                          <h3 className="text-xl font-semibold mb-3">
                            Playwright Setup
                          </h3>
                          <p className="text-[var(--text-secondary)] mb-4">
                            Ogrite uses Playwright as a peer dependency. You
                            need to install the browser binaries separately.
                          </p>
                          <CodeBlock
                            code="npx playwright install chromium"
                            language="bash"
                            variant="terminal"
                          />
                        </div>
                      </div>
                    )}

                    {section.id === "configuration" && (
                      <div className="space-y-10">
                        <div id="config-file">
                          <h3 className="text-xl font-semibold mb-3">
                            Configuration File
                          </h3>
                          <p className="text-[var(--text-secondary)] mb-4">
                            Create a `ogrite.config.ts` (or `.js`, `.mjs`) in
                            your project root.
                          </p>
                          <CodeBlock
                            code={`import { defineConfig } from 'ogrite';

export default defineConfig({
  baseUrl: 'http://localhost:3000',
  outputDir: 'public/og',
  routeDiscovery: {
    strategy: 'sitemap',
    sitemapUrl: '/sitemap.xml',
  },
});`}
                            language="typescript"
                            filename="ogrite.config.ts"
                          />
                        </div>

                        <div id="core-options">
                          <h3 className="text-xl font-semibold mb-3">
                            Core Options
                          </h3>
                          <div className="bg-[var(--background-surface)] rounded-xl p-6 border border-[var(--border-subtle)]">
                            <ul className="space-y-4 text-sm">
                              <li>
                                <code className="text-[var(--accent-primary)]">
                                  baseUrl
                                </code>
                                <span className="text-[var(--text-muted)] ml-2">
                                  — Required. The base URL of your running
                                  application.
                                </span>
                              </li>
                              <li>
                                <code className="text-[var(--accent-primary)]">
                                  outputDir
                                </code>
                                <span className="text-[var(--text-muted)] ml-2">
                                  — Required. Directory where images will be
                                  saved.
                                </span>
                              </li>
                              <li>
                                <code className="text-[var(--accent-primary)]">
                                  concurrency
                                </code>
                                <span className="text-[var(--text-muted)] ml-2">
                                  — Limit simultaneous renderings (default: 5).
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div id="route-discovery">
                          <h3 className="text-xl font-semibold mb-3">
                            Route Discovery
                          </h3>
                          <CodeBlock
                            code={`// Strategies: 'sitemap' | 'filesystem' | 'manual' | 'custom'
routeDiscovery: {
  strategy: 'filesystem',
  pagesDir: 'src/app', // for Next.js app dir
  extensions: ['.tsx', '.js'],
}`}
                            language="typescript"
                          />
                        </div>

                        <div id="rendering-options">
                          <h3 className="text-xl font-semibold mb-3">
                            Rendering Options
                          </h3>
                          <CodeBlock
                            code={`viewport: {
  width: 1200,
  height: 630,
  deviceScaleFactor: 2,
},
wait: {
  selector: '#og-rendered', // Wait for this element
  timeout: 30000,
},
capture: {
  fullPage: false,
  omitBackground: true,
}`}
                            language="typescript"
                          />
                        </div>
                      </div>
                    )}

                    {section.id === "cli" && (
                      <div className="space-y-8 text-[var(--text-secondary)]">
                        <div id="generate">
                          <h3 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">
                            ogrite generate
                          </h3>
                          <p className="mb-4">
                            The main command to compile your OG images.
                            Discovers routes, renders them, and optimizes the
                            output.
                          </p>
                          <CodeBlock
                            code="npx ogrite generate"
                            language="bash"
                            variant="terminal"
                          />
                        </div>
                        <div id="watch">
                          <h3 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">
                            ogrite watch
                          </h3>
                          <p className="mb-4">
                            Daemon mode that watches for file changes and
                            incrementally rebuilds affected images.
                          </p>
                          <CodeBlock
                            code="npx ogrite watch"
                            language="bash"
                            variant="terminal"
                          />
                        </div>
                        <div id="check">
                          <h3 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">
                            ogrite check
                          </h3>
                          <p className="mb-4">
                            Verifies that all generated artifacts match the
                            current manifest and configuration.
                          </p>
                          <CodeBlock
                            code="npx ogrite check"
                            language="bash"
                            variant="terminal"
                          />
                        </div>
                      </div>
                    )}

                    {section.id === "api" && (
                      <div className="space-y-8">
                        <div id="generator">
                          <h3 className="text-xl font-semibold mb-3">
                            OgGenerator
                          </h3>
                          <CodeBlock
                            code={`import { createOgGenerator } from 'ogrite';

const gen = createOgGenerator({ /* config */ });
const report = await gen.build();`}
                            language="typescript"
                          />
                        </div>
                        <div id="runtime">
                          <h3 className="text-xl font-semibold mb-3">
                            Runtime Helper
                          </h3>
                          <p className="text-[var(--text-secondary)] mb-4">
                            Resolve image paths based on your normalization
                            strategy.
                          </p>
                          <CodeBlock
                            code={`import { getOgImagePath } from 'ogrite/runtime';

const imagePath = getOgImagePath('/blog/hello-world', config);
// Returns: "/og/blog/hello-world.png"`}
                            language="typescript"
                          />
                        </div>
                      </div>
                    )}
                  </section>
                </FadeIn>
              ))}
            </div>

            {/* Bottom CTA */}
            <FadeIn delay={0.3}>
              <div className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-[var(--background-surface)] to-[var(--background-elevated)] border border-[var(--border-subtle)] text-center">
                <h2 className="text-2xl font-bold mb-4">
                  Ready to try Ogrite?
                </h2>
                <p className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto">
                  Follow the getting started guide to integrate Ogrite into your
                  current project in less than 5 minutes.
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
                    href="https://github.com/kvnqpoza/ogrite"
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
