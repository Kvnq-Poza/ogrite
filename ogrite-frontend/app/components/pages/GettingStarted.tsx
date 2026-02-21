"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { CodeBlock } from "../CodeBlock";
import { FadeIn } from "../animations/FadeIn";
import { StaggerContainer, StaggerItem } from "../animations/StaggerContainer";
import { AnimatedButton } from "../ui/AnimatedButton";
import { motion } from "framer-motion";

const installCode = `npm install ogrite --save-dev`;

const configCode = `// ogrite.config.ts
import { defineConfig } from 'ogrite';

export default defineConfig({
  baseUrl: 'http://localhost:3000',
  outputDir: 'public/og'
});`;

const generateCode = `npx ogrite generate`;

const routeDiscoveryCode = `// Sitemap-based discovery
export default defineConfig({
  baseUrl: 'http://localhost:3000',
  routeSource: {
    type: 'sitemap',
    url: 'http://localhost:3000/sitemap.xml'
  }
});

// Filesystem-based discovery
export default defineConfig({
  baseUrl: 'http://localhost:3000',
  routeSource: {
    type: 'filesystem',
    directory: 'src/pages',
    pattern: '**/*.{tsx,jsx,astro}'
  }
});`;

const ciCode = `# GitHub Actions
- name: Generate OG images
  run: npx ogrite generate
  
# Non-zero exit on failure
# JSON reports: ogrite generate --json > report.json`;

const steps = [
  {
    number: 1,
    title: "Install the package",
    description: "Add Ogrite to your project as a dev dependency",
    code: installCode,
  },
  {
    number: 2,
    title: "Create a config file",
    description: "Define your base URL and output directory",
    code: configCode,
    language: "typescript",
  },
  {
    number: 3,
    title: "Run the generator",
    description: "Execute Ogrite to generate your OG images",
    code: generateCode,
  },
];

const outputMapping = [
  { route: "/", file: "public/og/home.png" },
  { route: "/about", file: "public/og/about.png" },
  { route: "/blog/post-1", file: "public/og/blog/post-1.png" },
];

const nextSteps = [
  { label: "Full configuration reference", href: "/docs" },
  { label: "Route discovery strategies", href: "/docs" },
  { label: "Custom renderers", href: "/docs" },
  { label: "CLI reference", href: "/docs" },
];

export function GettingStarted() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeIn className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Getting Started</h1>
          <p className="text-xl text-[var(--text-secondary)]">
            Get from zero to generating your first OG image in under 5 minutes
          </p>
        </FadeIn>

        {/* Installation Steps */}
        <section className="mb-16">
          <FadeIn>
            <h2 className="text-3xl font-semibold mb-8">Installation</h2>
          </FadeIn>

          <StaggerContainer className="space-y-12" staggerDelay={0.15}>
            {steps.map((step) => (
              <StaggerItem key={step.number}>
                <div className="relative">
                  <div className="flex items-start gap-6">
                    {/* Step number */}
                    <motion.div
                      className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--accent-primary)] text-[var(--text-inverse)] flex items-center justify-center font-semibold"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {step.number}
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        {step.title}
                      </h3>
                      <p className="text-[var(--text-secondary)] mb-4">
                        {step.description}
                      </p>
                      <CodeBlock
                        code={step.code}
                        language={step.language || "bash"}
                        variant={step.language ? "block" : "terminal"}
                      />
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Route Discovery */}
        <section className="mb-16">
          <FadeIn>
            <h2 className="text-3xl font-semibold mb-4">
              Configuring route discovery
            </h2>
            <p className="text-[var(--text-secondary)] mb-6">
              Ogrite supports multiple strategies for discovering routes in your
              application. Choose the one that fits your framework and
              architecture.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <motion.div
              className="p-6 rounded-xl border border-[var(--border-default)] bg-[var(--background-surface)] mb-6"
              whileHover={{ borderColor: "var(--accent-border)" }}
              transition={{ duration: 0.2 }}
            >
              <h4 className="font-semibold mb-3">Available strategies:</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Sitemap",
                  "Filesystem",
                  "Manual array",
                  "Custom resolver",
                ].map((strategy, index) => (
                  <motion.div
                    key={strategy}
                    className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                    >
                      <Check className="w-4 h-4 text-[var(--success)]" />
                    </motion.div>
                    {strategy}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </FadeIn>

          <CodeBlock code={routeDiscoveryCode} language="typescript" />
        </section>

        {/* Output Mapping */}
        <section className="mb-16">
          <FadeIn>
            <h2 className="text-3xl font-semibold mb-4">
              Understanding output
            </h2>
            <p className="text-[var(--text-secondary)] mb-6">
              Ogrite maps each route to a deterministic file path in your output
              directory. This ensures predictable locations for your OG images.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-xl border border-[var(--border-default)] bg-[var(--background-surface)] overflow-hidden">
              <div className="border-b border-[var(--border-default)] px-6 py-3 bg-[var(--code-bg)]">
                <h4 className="text-sm font-semibold">Route → File Mapping</h4>
              </div>
              <div className="divide-y divide-[var(--border-default)]">
                {outputMapping.map((item, index) => (
                  <motion.div
                    key={item.route}
                    className="px-6 py-4 grid sm:grid-cols-2 gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{
                      backgroundColor: "var(--background-elevated)",
                    }}
                  >
                    <code className="text-sm text-[var(--accent-primary)] font-mono">
                      {item.route}
                    </code>
                    <code className="text-sm text-[var(--text-secondary)] font-mono">
                      {item.file}
                    </code>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>
        </section>

        {/* CI Integration */}
        <section className="mb-16">
          <FadeIn>
            <h2 className="text-3xl font-semibold mb-4">Running in CI</h2>
            <p className="text-[var(--text-secondary)] mb-6">
              Add Ogrite to your build step for automated OG image generation.
              The CLI returns a non-zero exit code on failure, making it perfect
              for CI/CD pipelines.
            </p>
          </FadeIn>

          <CodeBlock
            code={ciCode}
            language="yaml"
            filename=".github/workflows/build.yml"
          />
        </section>

        {/* Next Steps */}
        <FadeIn>
          <motion.section
            className="p-8 rounded-2xl border border-[var(--accent-border)] bg-gradient-to-br from-[var(--accent-muted)] to-transparent overflow-hidden relative"
            whileHover={{ borderColor: "var(--accent-primary)" }}
          >
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)] rounded-full blur-[120px] opacity-10"
              animate={{
                scale: [1, 1.3, 1],
                x: [0, 20, 0],
                y: [0, 20, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="relative z-10">
              <h2 className="text-2xl font-semibold mb-4">Next steps</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                Ready to explore advanced features? Check out these resources:
              </p>

              <StaggerContainer
                className="grid sm:grid-cols-2 gap-3"
                staggerDelay={0.08}
              >
                {nextSteps.map((link) => (
                  <StaggerItem key={link.label}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={link.href}
                        className="flex items-center justify-between p-4 rounded-lg bg-[var(--background-surface)] border border-[var(--border-default)] hover:border-[var(--accent-primary)] hover:bg-[var(--background-elevated)] transition-all group"
                      >
                        <span className="font-medium">{link.label}</span>
                        <motion.div
                          className="text-[var(--accent-primary)]"
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </Link>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </motion.section>
        </FadeIn>
      </div>
    </div>
  );
}
