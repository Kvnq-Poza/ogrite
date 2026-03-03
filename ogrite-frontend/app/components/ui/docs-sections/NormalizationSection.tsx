import { CodeBlock } from "../CodeBlock";
import { DocCard } from "../DocCard";
import { DocSection } from "../DocSection";
import { CodeHelper } from "../CodeHelper";

const strategies = [
  {
    name: "slugify",
    isDefault: true,
    description:
      "Lowercases, strips diacritics, replaces spaces with hyphens, removes special characters.",
    example: `/blog/[slug] → blog/slug.webp`,
  },
  {
    name: "keep",
    description:
      "Strips bracket/brace/colon characters but otherwise keeps the original text.",
    example: `/blog/[slug] → blog/slug.webp`,
  },
  {
    name: "hash",
    description:
      "Generates a truncated SHA-256 hash of the segment. Configurable length (default 8).",
    example: `/blog/[slug] → blog/a1b2c3d4.webp`,
  },
];

const howItWorksItems = [
  <>
    The root route <CodeHelper>/</CodeHelper> maps to{" "}
    <CodeHelper>{`<baseOutput>/home.<format>`}</CodeHelper> (configurable via{" "}
    <CodeHelper>homeFileName</CodeHelper>).
  </>,
  <>
    Each URL segment becomes a directory or filename:{" "}
    <CodeHelper>/blog/my-post</CodeHelper> →{" "}
    <CodeHelper>blog/my-post.webp</CodeHelper>
  </>,
  <>
    Dynamic segments (<CodeHelper>[slug]</CodeHelper>,{" "}
    <CodeHelper>{`{id}`}</CodeHelper>,<CodeHelper>:id</CodeHelper>) are
    processed by the chosen <CodeHelper>paramStrategy</CodeHelper>.
  </>,
  <>
    An optional <CodeHelper>sanitize</CodeHelper> function runs on each segment
    first.
  </>,
];

export function NormalizationSection() {
  return (
    <DocSection
      id="normalization"
      title="Route Normalization"
      lead="Normalization converts URL paths into deterministic file paths. This ensures the same route always produces the same file name, regardless of order or run."
      spaced
    >
      <DocCard id="norm-overview" title="How it works">
        <ul className="text-sm text-[var(--text-secondary)] space-y-2">
          {howItWorksItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </DocCard>

      <DocCard id="norm-strategies" title="Param strategies">
        <div className="space-y-4">
          {strategies.map(({ name, isDefault, description, example }) => (
            <DocCard
              key={name}
              codeTitle={name}
              isDefault={isDefault}
              className="!mb-0"
            >
              <p className="text-sm text-[var(--text-secondary)] mb-2">
                {description}
              </p>
              <CodeBlock code={example} language="bash" />
            </DocCard>
          ))}
        </div>
      </DocCard>
    </DocSection>
  );
}
