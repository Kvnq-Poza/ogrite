import React from "react";

export function DocCard({
  id,
  title,
  codeTitle,
  isDefault,
  children,
  className = "mb-8 scroll-mt-24",
}: {
  id?: string;
  title?: string;
  codeTitle?: string;
  isDefault?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const card = (
    <div className="bg-[var(--background-surface)] rounded-xl p-5 border border-[var(--border-subtle)]">
      {codeTitle && (
        <h4 className="font-semibold mb-2">
          <code className="text-[var(--accent-primary)]">{codeTitle}</code>
          {isDefault && (
            <>
              {" "}
              <span className="text-xs text-[var(--text-muted)] font-normal">
                (default)
              </span>
            </>
          )}
        </h4>
      )}
      {children}
    </div>
  );

  if (title) {
    return (
      <div id={id} className={className}>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        {card}
      </div>
    );
  }

  if (id) {
    return (
      <div id={id} className={className}>
        {card}
      </div>
    );
  }

  return card;
}
