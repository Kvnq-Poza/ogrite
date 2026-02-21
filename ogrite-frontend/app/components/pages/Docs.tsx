"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { CodeBlock } from "../CodeBlock";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "../animations/FadeIn";

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
    content: `Ogrite is a build-time Open Graph image compiler. It discovers your application routes, renders them using a headless browser, and outputs deterministic static image artifacts optimized for social media sharing.

Unlike runtime solutions, Ogrite runs entirely at build time, eliminating serverless cold starts, rate limits, and runtime dependencies.`,
  },
  {
    id: "installation",
    title: "Installation",
    content: "Install Ogrite as a dev dependency in your project.",
    subsections: [
      { id: "npm-install", title: "npm" },
      { id: "yarn-install", title: "yarn" },
      { id: "pnpm-install", title: "pnpm" },
    ],
  },
  {
    id: "configuration",
    title: "Configuration",
    content: "Configure Ogrite using a config file or environment variables.",
    subsections: [
      { id: "basic-config", title: "Basic Configuration" },
      { id: "route-discovery", title: "Route Discovery" },
      { id: "rendering-options", title: "Rendering Options" },
    ],
  },
  {
    id: "cli",
    title: "CLI Reference",
    content:
      "Ogrite provides a command-line interface for managing image generation.",
    subsections: [
      { id: "generate", title: "ogrite generate" },
      { id: "watch", title: "ogrite watch" },
      { id: "check", title: "ogrite check" },
    ],
  },
  {
    id: "advanced",
    title: "Advanced Usage",
    content:
      "Extend Ogrite with custom renderers, optimizers, and route resolvers.",
  },
];

export function Docs() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["introduction"]),
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
                Learn everything about Ogrite and how to generate deterministic
                OG images at build time
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
                      className="mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <h2 className="text-3xl font-bold mb-4">
                        {section.title}
                      </h2>
                      <p className="text-[var(--text-secondary)]">
                        {section.content}
                      </p>
                    </motion.div>

                    {section.id === "installation" && (
                      <div className="space-y-6">
                        <motion.div
                          whileHover={{ y: -2 }}
                          transition={{ duration: 0.2 }}
                        >
                          <h3 className="text-lg font-semibold mb-3">npm</h3>
                          <CodeBlock
                            code="npm install ogrite --save-dev"
                            language="bash"
                            variant="terminal"
                          />
                        </motion.div>
                        <motion.div
                          whileHover={{ y: -2 }}
                          transition={{ duration: 0.2 }}
                        >
                          <h3 className="text-lg font-semibold mb-3">yarn</h3>
                          <CodeBlock
                            code="yarn add --dev ogrite"
                            language="bash"
                            variant="terminal"
                          />
                        </motion.div>
                        <motion.div
                          whileHover={{ y: -2 }}
                          transition={{ duration: 0.2 }}
                        >
                          <h3 className="text-lg font-semibold mb-3">pnpm</h3>
                          <CodeBlock
                            code="pnpm add -D ogrite"
                            language="bash"
                            variant="terminal"
                          />
                        </motion.div>
                      </div>
                    )}

                    {section.id === "configuration" && (
                      <div className="space-y-6">
                        <motion.div
                          whileHover={{ y: -2 }}
                          transition={{ duration: 0.2 }}
                        >
                          <h3 className="text-lg font-semibold mb-3">
                            Basic Configuration
                          </h3>
                          <CodeBlock
                            code={`import { defineConfig } from 'ogrite';

export default defineConfig({
  baseUrl: 'http://localhost:3000',
  outputDir: 'public/og',
  quality: 90,
  width: 1200,
  height: 630,
});`}
                            language="typescript"
                            filename="ogrite.config.ts"
                          />
                        </motion.div>
                      </div>
                    )}

                    {section.id === "cli" && (
                      <div className="space-y-6">
                        <motion.div
                          whileHover={{ y: -2 }}
                          transition={{ duration: 0.2 }}
                        >
                          <h3 className="text-lg font-semibold mb-3">
                            ogrite generate
                          </h3>
                          <p className="text-sm text-[var(--text-secondary)] mb-3">
                            Generate OG images for all discovered routes
                          </p>
                          <CodeBlock
                            code="npx ogrite generate"
                            language="bash"
                            variant="terminal"
                          />
                        </motion.div>
                        <motion.div
                          whileHover={{ y: -2 }}
                          transition={{ duration: 0.2 }}
                        >
                          <h3 className="text-lg font-semibold mb-3">
                            ogrite watch
                          </h3>
                          <p className="text-sm text-[var(--text-secondary)] mb-3">
                            Watch mode for development
                          </p>
                          <CodeBlock
                            code="npx ogrite watch"
                            language="bash"
                            variant="terminal"
                          />
                        </motion.div>
                      </div>
                    )}
                  </section>
                </FadeIn>
              ))}
            </div>

            {/* Bottom CTA */}
            <FadeIn delay={0.3}>
              <motion.div
                className="mt-16 p-8 rounded-2xl border border-[var(--accent-border)] bg-gradient-to-br from-[var(--accent-muted)] to-transparent"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-xl font-semibold mb-2">
                  Still have questions?
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Check out our GitHub repository and open an issue for help.
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://github.com/Kvnq-Poza/ogrite"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-[var(--text-inverse)] font-medium hover:bg-[var(--accent-hover)] transition-colors"
                  >
                    GitHub Repository
                  </a>
                </div>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
