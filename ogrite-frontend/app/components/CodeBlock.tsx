"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import { motion, AnimatePresence } from "framer-motion";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  variant?: "inline" | "block" | "terminal";
  filename?: string;
}

export function CodeBlock({
  code,
  language = "typescript",
  showLineNumbers = false,
  variant = "block",
  filename,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (variant === "inline") {
    return (
      <code className="px-1.5 py-0.5 rounded bg-[var(--code-bg)] border border-[var(--code-border)] text-[var(--accent-primary)] font-mono text-sm">
        {code}
      </code>
    );
  }

  if (variant === "terminal") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="relative group rounded-lg border border-[var(--code-border)] bg-[var(--code-bg)] overflow-hidden"
      >
        {filename && (
          <div className="px-4 py-2 border-b border-[var(--code-border)] text-xs text-[var(--text-secondary)] font-mono">
            {filename}
          </div>
        )}
        <div className="relative">
          <motion.button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-2 rounded-md bg-[var(--background-surface)] border border-[var(--border-default)] opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Copy code"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="w-4 h-4 text-[var(--success)]" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          <pre className="p-4 overflow-x-auto">
            <code className="font-mono text-sm text-[var(--text-secondary)]">
              {code}
            </code>
          </pre>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="relative group rounded-lg border border-[var(--code-border)] bg-[var(--code-bg)] overflow-hidden"
    >
      {filename && (
        <div className="px-4 py-2 border-b border-[var(--code-border)] text-xs text-[var(--text-secondary)] font-mono">
          {filename}
        </div>
      )}
      <div className="relative">
        <motion.button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 rounded-md bg-[var(--background-surface)] border border-[var(--border-default)] opacity-0 group-hover:opacity-100 transition-opacity z-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Copy code"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                <Check className="w-4 h-4 text-[var(--success)]" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        <Highlight
          theme={{
            plain: { backgroundColor: "transparent", color: "#fafafa" },
            styles: [
              {
                types: ["comment", "prolog", "doctype", "cdata"],
                style: { color: "#6b7280" },
              },
              { types: ["punctuation"], style: { color: "#a1a1aa" } },
              {
                types: [
                  "property",
                  "tag",
                  "boolean",
                  "number",
                  "constant",
                  "symbol",
                ],
                style: { color: "#fb923c" },
              },
              {
                types: [
                  "selector",
                  "attr-name",
                  "string",
                  "char",
                  "builtin",
                  "inserted",
                ],
                style: { color: "#34d399" },
              },
              {
                types: ["operator", "entity", "url", "variable"],
                style: { color: "#fafafa" },
              },
              {
                types: ["atrule", "attr-value", "keyword"],
                style: { color: "#fbbf24" },
              },
              {
                types: ["function", "class-name"],
                style: { color: "#a78bfa" },
              },
              { types: ["regex", "important"], style: { color: "#f59e0b" } },
            ],
          }}
          code={code.trim()}
          language={language as any}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={`${className} p-4 overflow-x-auto`} style={style}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {showLineNumbers && (
                    <span className="inline-block w-8 text-[var(--text-muted)] select-none text-right mr-4">
                      {i + 1}
                    </span>
                  )}
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </motion.div>
  );
}
