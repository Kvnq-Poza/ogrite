"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Terminal,
  Code,
  Layout,
  Upload,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { FadeIn } from "../animations/FadeIn";
import { CodeBlock } from "../CodeBlock";

export function GettingStarted() {
  const steps = [
    {
      title: "Install Ogrite",
      description:
        "Ogrite requires Playwright (for rendering) and Sharp (for optimization) as peer dependencies.",
      icon: Terminal,
      content: (
        <div className="space-y-4">
          <CodeBlock
            code="npm install ogrite playwright sharp --save-dev"
            language="bash"
            variant="terminal"
          />
          <CodeBlock
            code="npx playwright install chromium"
            language="bash"
            variant="terminal"
          />
        </div>
      ),
    },
    {
      title: "Create Configuration",
      description:
        "Define your app's base URL and where images should be saved.",
      icon: Code,
      content: (
        <CodeBlock
          code={`import { defineConfig } from 'ogrite';

export default defineConfig({
  baseUrl: 'http://localhost:3000',
  outputDir: 'public/og',
  routeDiscovery: {
    strategy: 'filesystem',
    pagesDir: 'src/app',
  },
});`}
          language="typescript"
          filename="ogrite.config.ts"
        />
      ),
    },
    {
      title: "Generate Images",
      description: "Run the compiler to generate your visual artifacts.",
      icon: Upload,
      content: (
        <CodeBlock
          code="npx ogrite generate"
          language="bash"
          variant="terminal"
        />
      ),
    },
    {
      title: "Verify & Deploy",
      description: "Check the generated images and commit to your repository.",
      icon: CheckCircle2,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[var(--background-surface)] border border-[var(--border-subtle)]">
            <h4 className="font-semibold mb-2">Build Report</h4>
            <p className="text-xs text-[var(--text-muted)]">
              View the CLI summary of success/failures.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--background-surface)] border border-[var(--border-subtle)]">
            <h4 className="font-semibold mb-2">Deterministic Output</h4>
            <p className="text-xs text-[var(--text-muted)]">
              Images are named based on your normalization strategy.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4">Getting Started</h1>
          <p className="text-xl text-[var(--text-secondary)]">
            Get Ogrite up and running in your project in minutes.
          </p>
        </FadeIn>

        <div className="space-y-12">
          {steps.map((step, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div className="relative pl-12 sm:pl-16">
                {/* Step Number Line */}
                {index !== steps.length - 1 && (
                  <div className="absolute left-[23px] sm:left-[31px] top-12 bottom-0 w-px bg-gradient-to-b from-[var(--accent-primary)] to-transparent opacity-20" />
                )}

                <div className="absolute left-0 top-0 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[var(--background-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-primary)] shadow-[0_0_15px_rgba(var(--accent-primary-rgb),0.1)]">
                  <step.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>

                <div className="mb-4">
                  <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
                  <p className="text-[var(--text-secondary)]">
                    {step.description}
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--background-surface)]/50 backdrop-blur-sm"
                >
                  {step.content}
                </motion.div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Next Steps Section */}
        <FadeIn delay={0.5} className="mt-20">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[var(--accent-primary)]/10 to-transparent border border-[var(--accent-primary)]/20">
            <h2 className="text-2xl font-bold mb-6">What's Next?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <a
                href="/docs#route-discovery"
                className="group p-6 rounded-2xl bg-[var(--background-surface)] hover:bg-[var(--background-elevated)] border border-[var(--border-subtle)] transition-all"
              >
                <h3 className="text-lg font-semibold mb-2 flex items-center justify-between">
                  Route Discovery
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Learn how Ogrite automatically finds your application routes
                  via sitemaps or filesystem.
                </p>
              </a>
              <a
                href="/docs#normalization"
                className="group p-6 rounded-2xl bg-[var(--background-surface)] hover:bg-[var(--background-elevated)] border border-[var(--border-subtle)] transition-all"
              >
                <h3 className="text-lg font-semibold mb-2 flex items-center justify-between">
                  Output Mapping
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Configure how URLs are mapped to deterministic file paths.
                </p>
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
