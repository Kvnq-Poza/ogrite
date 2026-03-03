import React from "react";

/** Renders an inline <code> with the standard accent colour. */
export function CodeHelper({ children }: { children: React.ReactNode }) {
  return <code className="text-[var(--accent-primary)]">{children}</code>;
}
