import React from "react";

interface DocSectionProps {
  id: string;
  title: string;
  lead?: React.ReactNode;
  children: React.ReactNode;
  /** Adds space-y-10 wrapper around children, useful for card groups */
  spaced?: boolean;
}

export function DocSection({
  id,
  title,
  lead,
  children,
  spaced = false,
}: DocSectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      {lead && (
        <p className="text-[var(--text-secondary)] mb-8">{lead}</p>
      )}
      {spaced ? (
        <div className="space-y-10">{children}</div>
      ) : (
        children
      )}
    </section>
  );
}