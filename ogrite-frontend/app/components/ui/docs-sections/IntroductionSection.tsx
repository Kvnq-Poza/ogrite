import { DocSection } from "../DocSection";

export function IntroductionSection() {
  return (
    <DocSection id="introduction" title="Introduction">
      <div className="prose-custom space-y-4 text-[var(--text-secondary)]">
        <p>
          <strong className="text-[var(--text-primary)]">Ogrite</strong> is a
          deterministic, build-time Open Graph image compiler. It discovers your
          application routes, renders each one in a headless browser, optimizes
          the output, and writes static image artifacts to disk — all during
          your build step.
        </p>
        <p>
          Instead of generating images at runtime (serverless functions, edge
          workers), Ogrite handles everything at build time so your images ship
          as static files alongside the rest of your site. This eliminates
          cold-start latency, runtime failures, and non-deterministic output.
        </p>
        <p>
          The pipeline is composed of discrete stages — route discovery,
          normalization, rendering, optimization, persistence, manifest
          tracking, and reporting — each of which can be configured
          independently.
        </p>
      </div>
    </DocSection>
  );
}
