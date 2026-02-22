"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Terminal,
  Code,
  Upload,
  CheckCircle2,
  ArrowRight,
  Layers,
  Eye,
  FileText,
} from "lucide-react";
import { FadeIn } from "../animations/FadeIn";
import { CodeBlock } from "../CodeBlock";

/* ------------------------------------------------------------------ */
/*  Steps                                                             */
/* ------------------------------------------------------------------ */

const steps = [
  {
    number: "01",
    title: "Install packages",
    icon: Terminal,
    description:
      "Add Ogrite and its peer dependencies — Playwright (rendering) and Sharp (optimisation).",
  },
  {
    number: "02",
    title: "Install browser binary",
    icon: Layers,
    description:
      "Playwright needs a headless browser. Install Chromium with a single command.",
  },
  {
    number: "03",
    title: "Create config file",
    icon: Code,
    description:
      "Define your baseUrl and outputDir. Everything else has sensible defaults.",
  },
  {
    number: "04",
    title: "Add route discovery",
    icon: Eye,
    description:
      "Tell Ogrite how to find your routes — via sitemap, filesystem, a manual list, or a custom resolver.",
  },
  {
    number: "05",
    title: "Generate images",
    icon: Upload,
    description:
      "Run the CLI and Ogrite will discover, render, optimise, and write your OG images.",
  },
  {
    number: "06",
    title: "Use in your app",
    icon: FileText,
    description:
      "Import the runtime helper to resolve image paths inside your components.",
  },
  {
    number: "07",
    title: "Add to CI",
    icon: CheckCircle2,
    description:
      "Add generate and check to your build pipeline for fully automated, deterministic OG images.",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function GettingStarted() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeIn className="mb-16 text-center">
          <h1 className="text-5xl font-bold mb-4">Getting Started</h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Go from zero to deterministic OG images in under 5 minutes.
          </p>
        </FadeIn>

        {/* Steps */}
        <div className="space-y-16">
          {/* ── Step 1 — Install packages ─────────────────────── */}
          <FadeIn delay={0.05}>
            <StepHeader step={steps[0]} />
            <div className="space-y-3 mt-4">
              <CodeBlock
                code="npm install ogrite playwright sharp --save-dev"
                language="bash"
                variant="terminal"
              />
              <p className="text-xs text-[var(--text-muted)]">
                Or use{" "}
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
          </FadeIn>

          {/* ── Step 2 — Browser binary ───────────────────────── */}
          <FadeIn delay={0.1}>
            <StepHeader step={steps[1]} />
            <div className="mt-4">
              <CodeBlock
                code="npx playwright install chromium"
                language="bash"
                variant="terminal"
              />
            </div>
          </FadeIn>

          {/* ── Step 3 — Config file ──────────────────────────── */}
          <FadeIn delay={0.15}>
            <StepHeader step={steps[2]} />
            <div className="mt-4">
              <CodeBlock
                code={`import { defineConfig } from 'ogrite';

export default defineConfig({
  baseUrl: 'http://localhost:3000',
  outputDir: 'public/og',
});`}
                language="typescript"
                filename="ogrite.config.ts"
              />
              <p className="text-sm text-[var(--text-muted)] mt-3">
                <code className="text-[var(--accent-primary)]">baseUrl</code>{" "}
                and{" "}
                <code className="text-[var(--accent-primary)]">outputDir</code>{" "}
                are the only required fields. All other options have defaults.
                See the{" "}
                <a
                  href="/docs#config-defaults"
                  className="text-[var(--accent-primary)] underline"
                >
                  full default values
                </a>{" "}
                in the docs.
              </p>
            </div>
          </FadeIn>

          {/* ── Step 4 — Route discovery ──────────────────────── */}
          <FadeIn delay={0.2}>
            <StepHeader step={steps[3]} />
            <div className="mt-4 space-y-6">
              <p className="text-sm text-[var(--text-secondary)]">
                Choose a strategy that matches your framework:
              </p>

              {/* Sitemap */}
              <div className="bg-[var(--background-surface)] rounded-xl p-5 border border-[var(--border-subtle)]">
                <h4 className="text-sm font-semibold mb-2">
                  Sitemap{" "}
                  <span className="text-xs text-[var(--text-muted)] font-normal">
                    — Parses your sitemap.xml
                  </span>
                </h4>
                <CodeBlock
                  code={`routeDiscovery: {
  strategy: 'sitemap',
  source: '/sitemap.xml',
}`}
                  language="typescript"
                />
              </div>

              {/* Filesystem */}
              <div className="bg-[var(--background-surface)] rounded-xl p-5 border border-[var(--border-subtle)]">
                <h4 className="text-sm font-semibold mb-2">
                  Filesystem{" "}
                  <span className="text-xs text-[var(--text-muted)] font-normal">
                    — Scans your pages/app directory
                  </span>
                </h4>
                <CodeBlock
                  code={`routeDiscovery: {
  strategy: 'filesystem',
  source: 'src/app',  // or 'src/pages'
}`}
                  language="typescript"
                />
              </div>

              {/* Manual */}
              <div className="bg-[var(--background-surface)] rounded-xl p-5 border border-[var(--border-subtle)]">
                <h4 className="text-sm font-semibold mb-2">
                  Manual{" "}
                  <span className="text-xs text-[var(--text-muted)] font-normal">
                    — Explicit list (default)
                  </span>
                </h4>
                <CodeBlock
                  code={`routeDiscovery: {
  strategy: 'manual',
  routes: ['/', '/about', '/blog/hello-world'],
}`}
                  language="typescript"
                />
              </div>

              {/* Custom */}
              <div className="bg-[var(--background-surface)] rounded-xl p-5 border border-[var(--border-subtle)]">
                <h4 className="text-sm font-semibold mb-2">
                  Custom{" "}
                  <span className="text-xs text-[var(--text-muted)] font-normal">
                    — Your own async resolver
                  </span>
                </h4>
                <CodeBlock
                  code={`routeDiscovery: {
  strategy: 'custom',
  resolver: async () => {
    const res = await fetch('https://api.example.com/routes');
    return res.json(); // returns RoutePath[]
  },
}`}
                  language="typescript"
                />
              </div>
            </div>
          </FadeIn>

          {/* ── Step 5 — Generate ─────────────────────────────── */}
          <FadeIn delay={0.25}>
            <StepHeader step={steps[4]} />
            <div className="mt-4 space-y-4">
              <CodeBlock
                code="npx ogrite generate"
                language="bash"
                variant="terminal"
              />
              <CodeBlock
                code={`$ npx ogrite generate

  Discovered  12 routes
  Rendered    12 / 12
  Optimised   12 images → WebP
  Written     public/og/

  ✓ Done in 18s`}
                language="bash"
                variant="terminal"
                filename="Example output"
              />
            </div>
          </FadeIn>

          {/* ── Step 6 — Runtime helper ───────────────────────── */}
          <FadeIn delay={0.3}>
            <StepHeader step={steps[5]} />
            <div className="mt-4 space-y-4">
              <p className="text-sm text-[var(--text-secondary)]">
                Use the lightweight runtime helper to resolve image paths from
                the manifest — no need to import the full pipeline.
              </p>
              <CodeBlock
                code={`import { getOgImagePath } from 'ogrite/runtime';

export function generateMetadata({ params }) {
  const ogImage = getOgImagePath(\`/blog/\${params.slug}\`);

  return {
    openGraph: {
      images: ogImage ? [{ url: ogImage }] : [],
    },
  };
}`}
                language="typescript"
                filename="app/blog/[slug]/page.tsx"
              />
            </div>
          </FadeIn>

          {/* ── Step 7 — CI ───────────────────────────────────── */}
          <FadeIn delay={0.35}>
            <StepHeader step={steps[6]} />
            <div className="mt-4 space-y-4">
              <p className="text-sm text-[var(--text-secondary)]">
                Add{" "}
                <code className="text-[var(--accent-primary)]">
                  ogrite generate
                </code>{" "}
                to your build step and{" "}
                <code className="text-[var(--accent-primary)]">
                  ogrite check
                </code>{" "}
                as a validation gate.{" "}
                <code className="text-[var(--accent-primary)]">check</code>{" "}
                exits non-zero if artifacts are stale or missing.
              </p>
              <CodeBlock
                code={`# GitHub Actions example
- name: Install browsers
  run: npx playwright install chromium

- name: Generate OG images
  run: npx ogrite generate

- name: Verify images
  run: npx ogrite check`}
                language="yaml"
                filename=".github/workflows/build.yml"
              />
            </div>
          </FadeIn>
        </div>

        {/* ── Output mapping explainer ─────────────────────────── */}
        <FadeIn delay={0.4} className="mt-20">
          <div className="p-6 rounded-2xl bg-[var(--background-surface)] border border-[var(--border-subtle)]">
            <h3 className="text-xl font-semibold mb-4">Output mapping</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Ogrite normalises each route into a deterministic file path. The
              default paramStrategy is{" "}
              <code className="text-[var(--accent-primary)]">slugify</code>.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <th className="text-left py-2 pr-4 text-[var(--text-muted)] font-medium">
                      Route
                    </th>
                    <th className="text-left py-2 text-[var(--text-muted)] font-medium">
                      Output
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[var(--text-secondary)]">
                  <tr className="border-b border-[var(--border-subtle)]">
                    <td className="py-2 pr-4 font-mono text-xs">/</td>
                    <td className="py-2 font-mono text-xs">
                      public/og/home.webp
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <td className="py-2 pr-4 font-mono text-xs">/about</td>
                    <td className="py-2 font-mono text-xs">
                      public/og/about.webp
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <td className="py-2 pr-4 font-mono text-xs">
                      /blog/my-post
                    </td>
                    <td className="py-2 font-mono text-xs">
                      public/og/blog/my-post.webp
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-xs">
                      /blog/[slug]
                    </td>
                    <td className="py-2 font-mono text-xs">
                      public/og/blog/slug.webp
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-3">
              Change the strategy with{" "}
              <a
                href="/docs#config-normalize"
                className="text-[var(--accent-primary)] underline"
              >
                normalize.paramStrategy
              </a>
              .
            </p>
          </div>
        </FadeIn>

        {/* ── Next steps ───────────────────────────────────────── */}
        <FadeIn delay={0.45} className="mt-12">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[var(--accent-primary)]/10 to-transparent border border-[var(--accent-primary)]/20">
            <h2 className="text-2xl font-bold mb-6">What&apos;s next?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <NextStepCard
                title="Configuration"
                description="All config options with defaults."
                href="/docs#configuration"
              />
              <NextStepCard
                title="CLI Reference"
                description="generate, watch, check, clean."
                href="/docs#cli"
              />
              <NextStepCard
                title="API Reference"
                description="Programmatic usage in build scripts."
                href="/docs#api"
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                    */
/* ------------------------------------------------------------------ */

function StepHeader({ step }: { step: (typeof steps)[number] }) {
  const Icon = step.icon;
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--background-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-primary)] shadow-[0_0_12px_rgba(var(--accent-primary-rgb),0.08)]">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-[var(--text-muted)] font-mono mb-0.5">
          Step {step.number}
        </p>
        <h3 className="text-xl font-semibold">{step.title}</h3>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          {step.description}
        </p>
      </div>
    </div>
  );
}

function NextStepCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group p-5 rounded-2xl bg-[var(--background-surface)] hover:bg-[var(--background-elevated)] border border-[var(--border-subtle)] transition-all"
    >
      <h3 className="text-sm font-semibold mb-1 flex items-center justify-between">
        {title}
        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity group-hover:translate-x-0.5 transform" />
      </h3>
      <p className="text-xs text-[var(--text-secondary)]">{description}</p>
    </a>
  );
}
