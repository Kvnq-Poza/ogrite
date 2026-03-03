import { CodeBlock } from "../CodeBlock";
import { DocCard } from "../DocCard";
import { DocSection } from "../DocSection";
import { CodeHelper } from "../CodeHelper";

const snippet = `import { getOgImagePath } from '@ogrite/ogrite/runtime';

// Reads from <cwd>/public/og/.ogrite-manifest.json by default
const path = getOgImagePath('/blog/hello-world');
// → "public/og/blog/hello-world.webp"

// Custom manifest directory
const path2 = getOgImagePath('/about', './dist/og');`;

const parameters = [
  {
    name: "route",
    description: (
      <>
        The route path (e.g. <CodeHelper>/blog/post</CodeHelper>).
      </>
    ),
  },
  {
    name: "manifestDir",
    description: (
      <>
        Optional. Defaults to <CodeHelper>public/og</CodeHelper>.
      </>
    ),
  },
];

export function RuntimeSection() {
  return (
    <DocSection
      id="runtime"
      title="Runtime Helper"
      lead={
        <>
          A lightweight function for resolving OG image paths{" "}
          <em>inside your app</em>, without importing the full Ogrite pipeline.
        </>
      }
    >
      <DocCard
        id="runtime-getogimagepath"
        title="getOgImagePath(route, manifestDir?)"
      >
        <p className="text-[var(--text-secondary)] mb-3">
          Reads the <CodeHelper>.ogrite-manifest.json</CodeHelper> from disk and
          returns the <CodeHelper>outputPath</CodeHelper> for the given route.
          Returns <CodeHelper>undefined</CodeHelper> if the manifest or entry is
          not found.
        </p>
        <CodeBlock
          code={snippet}
          language="typescript"
          filename="app/layout.tsx"
        />
        <div className="mt-4 bg-[var(--background-surface)] rounded-xl p-5 border border-[var(--border-subtle)]">
          <h4 className="text-sm font-semibold mb-2">Parameters</h4>
          <ul className="text-sm text-[var(--text-secondary)] space-y-2">
            {parameters.map(({ name, description }) => (
              <li key={name}>
                <CodeHelper>{name}</CodeHelper> — {description}
              </li>
            ))}
          </ul>
        </div>
      </DocCard>
    </DocSection>
  );
}
