"use client";

import {
  Github,
  ArrowRight,
  Route,
  Camera,
  Zap,
  Hash,
  Layers,
  Terminal,
} from "lucide-react";
import { CodeBlock } from "../CodeBlock";
import { motion } from "framer-motion";
import { FeatureCard } from "../FeatureCard";
import { PipelineDiagram } from "../PipelineDiagram";
import { AnimatedButton } from "../ui/AnimatedButton";
import { FadeIn } from "../animations/FadeIn";
import { StaggerContainer, StaggerItem } from "../animations/StaggerContainer";
import { ScaleIn } from "../animations/ScaleIn";
import { useState, useEffect } from "react";

const configExample = `import { defineConfig } from 'ogrite';

export default defineConfig({
  baseUrl: 'http://localhost:3000',
  outputDir: 'public/og'
});`;

const cliOutput = `$ npx ogrite generate

  Discovered  48 routes
  Rendered    48 / 48
  Optimized   48 images → WebP
  Written     public/og/

  ✓ Done in 43s`;

const features = [
  {
    icon: Route,
    title: "Smart route discovery",
    description:
      "Detects routes via sitemap, filesystem, or your own resolver. No framework assumptions.",
  },
  {
    icon: Camera,
    title: "Headless rendering",
    description:
      "Playwright-powered screenshots with custom viewports, wait conditions, and element capture.",
  },
  {
    icon: Zap,
    title: "Optimized output",
    description:
      "Sharp-powered compression to WebP, AVIF, or PNG. Configurable quality and resize targets.",
  },
  {
    icon: Hash,
    title: "Deterministic by design",
    description:
      "Content hashing and a manifest file detect stale images and enable incremental builds.",
  },
  {
    icon: Layers,
    title: "Pipeline architecture",
    description:
      "Each stage is independently extensible. Swap renderers, optimizers, and route sources without touching the rest.",
  },
  {
    icon: Terminal,
    title: "CI-ready CLI",
    description:
      "ogrite generate, watch, check, and clean. Non-zero exit on failure. JSON reports for downstream tooling.",
  },
];

const trustItems = [
  "Works with Next.js, Astro, SvelteKit, and any static site",
  "Zero runtime dependency",
  "100% deterministic outputs",
];

const terminalLines = [
  { text: "→ Discovering routes...", delay: 0, color: "accent" },
  { text: "✓ Found 48 routes", delay: 800, color: "success" },
  { text: "→ Rendering pages...", delay: 1200, color: "accent" },
  { text: "✓ Rendered 48/48", delay: 2000, color: "success" },
  { text: "→ Optimizing images...", delay: 2400, color: "accent" },
  { text: "✓ Done in 43s", delay: 3000, color: "success", bold: true },
];

function AnimatedTerminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    const timers = terminalLines.map((line, index) => {
      return setTimeout(() => {
        setVisibleLines(index + 1);
      }, line.delay);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  const getColorClass = (color: string) => {
    if (color === "accent") return "text-[var(--accent-primary)]";
    if (color === "success") return "text-[var(--success)]";
    return "text-[var(--text-secondary)]";
  };

  return (
    <div className="relative p-8 rounded-2xl border border-[var(--border-default)] bg-[var(--background-surface)]">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-sm">
          <motion.div
            className="w-3 h-3 rounded-full bg-[var(--error)]"
            whileHover={{ scale: 1.2 }}
          />
          <motion.div
            className="w-3 h-3 rounded-full bg-[var(--warning)]"
            whileHover={{ scale: 1.2 }}
          />
          <motion.div
            className="w-3 h-3 rounded-full bg-[var(--success)]"
            whileHover={{ scale: 1.2 }}
          />
          <span className="ml-4 text-[var(--text-muted)] font-mono">
            ogrite generate
          </span>
        </div>
        <div className="font-mono text-sm space-y-1 min-h-[120px]">
          {terminalLines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: index < visibleLines ? 1 : 0,
                x: index < visibleLines ? 0 : -10,
              }}
              transition={{ duration: 0.3 }}
              className={`${getColorClass(line.color)} ${line.bold ? "font-semibold" : ""}`}
            >
              <span className="mr-2">
                {line.text.startsWith("✓") ? "✓" : "→"}
              </span>
              {line.text.replace(/^[✓→]\s*/, "")}
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div
        className="absolute -bottom-4 -right-4 w-32 h-32 bg-[var(--accent-primary)] rounded-full blur-[100px] opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

export function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background grid pattern */}
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20"
          animate={{
            backgroundPosition: ["0px 0px", "64px 64px"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-primary)] rounded-full blur-[120px] opacity-10"
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--accent-primary)] rounded-full blur-[120px] opacity-10"
          animate={{
            y: [0, -40, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative max-w-7xl mx-auto w-full pt-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="text-center lg:text-left">
              <FadeIn delay={0.1}>
                <motion.div
                  className="inline-block px-3 py-1 mb-6 rounded-full border border-[var(--accent-border)] bg-[var(--accent-muted)] text-[var(--accent-primary)] text-xs font-medium"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  Build-time OG image compiler
                </motion.div>
              </FadeIn>

              <FadeIn delay={0.2} direction="up">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[1.05]">
                  Your routes.
                  <br />
                  <span className="text-[var(--accent-primary)] inline-block">
                    <motion.span
                      className="inline-block"
                      initial={{ backgroundPosition: "0% 50%" }}
                      animate={{ backgroundPosition: "100% 50%" }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg, var(--accent-primary), var(--accent-hover), var(--accent-primary))",
                        backgroundSize: "200% 100%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Compiled to images.
                    </motion.span>
                  </span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.3} direction="up">
                <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-2xl leading-relaxed">
                  Ogrite discovers your app's routes, renders them with a
                  headless browser, and outputs deterministic static OG image
                  artifacts at build time. No runtime. No surprises.
                </p>
              </FadeIn>

              <FadeIn delay={0.4} direction="up">
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <AnimatedButton
                    href="/getting-started"
                    variant="primary"
                    size="lg"
                    magnetic
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </AnimatedButton>
                  <AnimatedButton
                    href="https://github.com/Kvnq-Poza/ogrite"
                    variant="secondary"
                    size="lg"
                    external
                  >
                    <Github className="mr-2 w-4 h-4" />
                    View on GitHub
                  </AnimatedButton>
                </div>
              </FadeIn>
            </div>

            {/* Right: Animated Terminal */}
            <ScaleIn delay={0.3}>
              <AnimatedTerminal />
            </ScaleIn>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-y border-[var(--border-default)] bg-[var(--background-surface)] mt-12 lg:mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="flex flex-wrap justify-center gap-8 text-sm text-[var(--text-muted)]">
            {trustItems.map((item, index) => (
              <StaggerItem key={index}>
                <motion.div
                  className="flex items-center"
                  whileHover={{ scale: 1.05, color: "var(--text-secondary)" }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] mr-3"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                  />
                  {item}
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <FadeIn direction="left">
              <motion.div
                className="relative p-8 rounded-2xl border border-[var(--error)]/20 bg-[var(--background-surface)] overflow-hidden"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[var(--error)]/5 to-transparent"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                />
                <div className="relative z-10">
                  <motion.div
                    className="w-12 h-12 rounded-lg bg-[var(--error)]/10 flex items-center justify-center mb-6"
                    whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-2xl">⚠️</span>
                  </motion.div>
                  <h2 className="text-2xl font-semibold mb-4">
                    Runtime generation is fragile.
                  </h2>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    Serverless OG renderers fail under load, incur cold start
                    latency, and produce inconsistent output across
                    environments. Manual creation doesn't scale.
                  </p>
                </div>
              </motion.div>
            </FadeIn>

            <FadeIn direction="right">
              <motion.div
                className="relative p-8 rounded-2xl border border-[var(--success)]/20 bg-[var(--background-surface)] overflow-hidden"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[var(--success)]/5 to-transparent"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                />
                <div className="relative z-10">
                  <motion.div
                    className="w-12 h-12 rounded-lg bg-[var(--success)]/10 flex items-center justify-center mb-6"
                    whileHover={{ rotate: [0, 5, -5, 5, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-2xl">✨</span>
                  </motion.div>
                  <h2 className="text-2xl font-semibold mb-4">
                    Compile it. Ship it. Forget it.
                  </h2>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    Ogrite runs at build time, outputs static artifacts, and
                    integrates into your existing pipeline. Failures surface
                    before production. Images ship to the CDN with everything
                    else.
                  </p>
                </div>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--background-surface)]">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Built for reliability</h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Every aspect of Ogrite is designed for deterministic, repeatable
              builds in production environments.
            </p>
          </FadeIn>

          <StaggerContainer
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            staggerDelay={0.08}
          >
            {features.map((feature) => (
              <StaggerItem key={feature.title} className="h-full">
                <FeatureCard {...feature} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Zero config for common setups
            </h2>
            <p className="text-[var(--text-secondary)]">
              Get started in seconds with sensible defaults
            </p>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-6">
            <CodeBlock
              code={configExample}
              language="typescript"
              filename="ogrite.config.ts"
            />
            <CodeBlock code={cliOutput} language="bash" variant="terminal" />
          </div>
        </div>
      </section>

      {/* Pipeline Diagram */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--background-surface)]">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How it works</h2>
            <p className="text-[var(--text-secondary)]">
              A multi-stage pipeline that transforms routes into optimized
              images
            </p>
          </FadeIn>

          <PipelineDiagram />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-[var(--accent-primary)]/5 to-transparent"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-4xl font-bold mb-6">
              Ship OG images with your next build.
            </h2>
            <p className="text-lg text-[var(--text-secondary)] mb-8">
              Start generating deterministic Open Graph images in minutes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AnimatedButton
                href="/getting-started"
                variant="primary"
                size="lg"
                magnetic
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </AnimatedButton>
              <AnimatedButton href="/docs" variant="secondary" size="lg">
                Read the docs
              </AnimatedButton>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
