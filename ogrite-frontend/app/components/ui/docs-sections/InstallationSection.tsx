import { CodeBlock } from "../CodeBlock";
import { DocCard } from "../DocCard";
import { DocSection } from "../DocSection";
import { CodeHelper } from "../CodeHelper";

const snippets = {
  installPackages: `npm install @ogrite/ogrite playwright sharp --save-dev`,
  installBrowser: `npx playwright install chromium`,
};

export function InstallationSection() {
  return (
    <DocSection
      id="installation"
      title="Installation"
      lead={
        <>
          Ogrite uses{" "}
          <strong className="text-[var(--text-primary)]">Playwright</strong>{" "}
          (headless rendering) and{" "}
          <strong className="text-[var(--text-primary)]">Sharp</strong> (image
          optimisation) as <em>peer dependencies</em> so you control their
          versions.
        </>
      }
      spaced
    >
      <DocCard id="install-packages" title="Install packages">
        <CodeBlock
          code={snippets.installPackages}
          language="bash"
          variant="terminal"
        />
        <p className="text-xs text-[var(--text-muted)] mt-2">
          Or with <CodeHelper>yarn add -D</CodeHelper> /{" "}
          <CodeHelper>pnpm add -D</CodeHelper>.
        </p>
      </DocCard>

      <DocCard id="install-browser" title="Install browser binary">
        <p className="text-[var(--text-secondary)] mb-3">
          Playwright requires a browser binary for rendering. Install Chromium:
        </p>
        <CodeBlock
          code={snippets.installBrowser}
          language="bash"
          variant="terminal"
        />
      </DocCard>
    </DocSection>
  );
}
