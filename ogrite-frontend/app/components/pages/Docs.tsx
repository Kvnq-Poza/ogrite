"use client";

import { motion } from "framer-motion";
import { FadeIn } from "../animations/FadeIn";
import { DocSidebar, MobileDocNav } from "../ui/DocsSidebar";
import {
  IntroductionSection,
  InstallationSection,
  ConfigurationSection,
  FrameworksSection,
  CliSection,
  ApiSection,
  RuntimeSection,
  NormalizationSection,
  TypesSection,
} from "../ui/docs-sections";

export function Docs() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[240px_1fr] gap-10 min-w-0">
          <DocSidebar />

          <div className="min-w-0 w-full overflow-hidden">
            <FadeIn className="mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
                Documentation
              </h1>
              <p className="text-base sm:text-xl text-[var(--text-secondary)]">
                Complete reference for the Ogrite build-time OG image compiler.
              </p>
            </FadeIn>

            <MobileDocNav />

            <div className="space-y-20">
              <IntroductionSection />
              <InstallationSection />
              <ConfigurationSection />
              <FrameworksSection />
              <CliSection />
              <ApiSection />
              <RuntimeSection />
              <NormalizationSection />
              <TypesSection />
            </div>

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
