import { CodeBlock } from "../CodeBlock";
import { DocCard } from "../DocCard";
import { DocSection } from "../DocSection";
import { CodeHelper } from "../CodeHelper";

const commands = [
  {
    id: "cli-generate",
    title: "ogrite generate",
    code: "npx @ogrite/ogrite generate",
    description:
      "Run the full pipeline: discover routes → render → optimize → write artifacts → update manifest.",
    options: [
      {
        flag: "-c, --concurrency <number>",
        description: "Override parallel rendering workers",
      },
    ],
  },
  {
    id: "cli-watch",
    title: "ogrite watch",
    code: "npx @ogrite/ogrite watch",
    description: (
      <>
        Start an incremental watcher. Monitors your source files and regenerates
        affected images on change. Uses <CodeHelper>chokidar</CodeHelper> under
        the hood.
      </>
    ),
  },
  {
    id: "cli-check",
    title: "ogrite check",
    code: "npx @ogrite/ogrite check",
    description:
      "Validate that current artifacts on disk match the manifest and route list. Exits with a non-zero code if stale or missing images are found — ideal for CI.",
  },
  {
    id: "cli-clean",
    title: "ogrite clean",
    code: "npx @ogrite/ogrite clean",
    description: (
      <>
        Remove all generated artifacts and clear the{" "}
        <CodeHelper>.ogrite-manifest.json</CodeHelper> file.
      </>
    ),
  },
  {
    id: "cli-preview",
    title: "ogrite preview",
    code: "npx @ogrite/ogrite preview",
    description:
      "Start a local preview server that serves the generated artifacts and the manifest.",
  },
];

export function CliSection() {
  return (
    <DocSection
      id="cli"
      title="CLI Reference"
      lead={
        <>
          The <CodeHelper>ogrite</CodeHelper> binary ships with the package. Run
          commands via <CodeHelper>npx @ogrite/ogrite</CodeHelper> or add
          scripts to your <CodeHelper>package.json</CodeHelper>.
        </>
      }
      spaced
    >
      {commands.map(({ id, title, code, description, options }) => (
        <DocCard key={id} id={id} title={title}>
          <p className="text-[var(--text-secondary)] mb-3">{description}</p>
          <CodeBlock code={code} language="bash" variant="terminal" />
          {options && (
            <div className="mt-3 bg-[var(--background-surface)] rounded-xl p-4 border border-[var(--border-subtle)]">
              <h4 className="text-sm font-semibold mb-2">Options</h4>
              <ul className="text-sm text-[var(--text-secondary)] space-y-1">
                {options.map(({ flag, description: desc }) => (
                  <li key={flag}>
                    <CodeHelper>{flag}</CodeHelper> — {desc}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DocCard>
      ))}
    </DocSection>
  );
}
