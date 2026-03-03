import { CodeBlock } from "../CodeBlock";
import { DocCard } from "../DocCard";
import { DocSection } from "../DocSection";
import { CodeHelper } from "../CodeHelper";

const snippets = {
  vite: `// vite.config.ts
import { defineConfig } from 'vite';
import { ogriteVitePlugin } from '@ogrite/ogrite/plugins/vite';

export default defineConfig({
  plugins: [
    ogriteVitePlugin(),
  ],
});`,
  next: `// next.config.js
import { withOgrite } from '@ogrite/ogrite/plugins/next';

export default withOgrite({
  reactStrictMode: true,
  // your other next configs
});`,
  astro: `// astro.config.mjs
import { defineConfig } from 'astro/config';
import { ogriteAstroPlugin } from '@ogrite/ogrite/plugins/astro';

export default defineConfig({
  integrations: [
    ogriteAstroPlugin(),
  ],
});`,
};

export function FrameworksSection() {
  return (
    <DocSection
      id="frameworks"
      title="Framework Integrations"
      lead="Ogrite provides first-class plugins for modern frontend meta-frameworks to run automatically post-build."
      spaced
    >
      <DocCard id="framework-vite" title="Vite">
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          Add the Ogrite Vite plugin to automatically run image generation when
          your Vite build completes.
        </p>
        <CodeBlock code={snippets.vite} language="typescript" />
      </DocCard>

      <DocCard id="framework-next" title="Next.js">
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          Use the Next.js wrapper or programmatic utility in your build scripts.
        </p>
        <CodeBlock code={snippets.next} language="typescript" />
        <p className="text-sm text-[var(--text-secondary)] mt-3">
          Since Next.js doesn't natively expose post-build hooks, the wrapper
          logs a reminder locally. It is recommended to run{" "}
          <CodeHelper>ogrite generate</CodeHelper> as a postbuild script in{" "}
          <CodeHelper>package.json</CodeHelper>:
          <br />
          <CodeHelper>"build": "next build && ogrite generate"</CodeHelper>
        </p>
      </DocCard>

      <DocCard id="framework-astro" title="Astro">
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          Hook into Astro's <CodeHelper>astro:buiCd:done</CodeHelper> target to
          generate images perfectly timed after your static pages are emitted.
        </p>
        <CodeBlock code={snippets.astro} language="typescript" />
      </DocCard>
    </DocSection>
  );
}
