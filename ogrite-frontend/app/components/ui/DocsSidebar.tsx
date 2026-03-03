"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Menu, X } from "lucide-react";
import { FadeIn } from "../animations/FadeIn";
import { NAV_SECTIONS, HEADER_OFFSET, scrollToId } from "./docs.config";

/* ------------------------------------------------------------------ */
/*  Shared sidebar nav — renders both desktop and mobile variants       */
/* ------------------------------------------------------------------ */

function SidebarNav({
  expandedSections,
  onSectionClick,
  onSubClick,
}: {
  expandedSections: Set<string>;
  onSectionClick: (id: string, hasSubsections: boolean) => void;
  onSubClick: (e: React.MouseEvent, id: string) => void;
}) {
  return (
    <nav className="space-y-0.5">
      {NAV_SECTIONS.map((section) => (
        <div key={section.id}>
          <button
            onClick={() => onSectionClick(section.id, !!section.subsections)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-surface)] transition-colors text-sm font-medium"
          >
            {section.title}
            {section.subsections && (
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform ${
                  expandedSections.has(section.id) ? "rotate-90" : ""
                }`}
              />
            )}
          </button>

          {section.subsections && expandedSections.has(section.id) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-0.5 pl-3 mt-0.5">
                {section.subsections.map((sub) => (
                  <a
                    key={sub.id}
                    href={`#${sub.id}`}
                    onClick={(e) => onSubClick(e, sub.id)}
                    className="block px-3 py-1.5 rounded-md text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--background-surface)] transition-colors"
                  >
                    {sub.title}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      ))}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Desktop sidebar                                                     */
/* ------------------------------------------------------------------ */

export function DocSidebar() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(NAV_SECTIONS.map((s) => s.id)),
  );

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSectionClick = useCallback(
    (id: string, hasSubsections: boolean) => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const isInView = rect.top >= 0 && rect.top <= HEADER_OFFSET + 30;
      scrollToId(id);
      if (hasSubsections) {
        if (isInView) {
          toggleSection(id);
        } else {
          setExpandedSections((prev) => new Set([...prev, id]));
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [expandedSections],
  );

  const handleSubClick = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    scrollToId(id);
  }, []);

  return (
    <div className="hidden lg:block">
      <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
        <FadeIn>
          <SidebarNav
            expandedSections={expandedSections}
            onSectionClick={handleSectionClick}
            onSubClick={handleSubClick}
          />
        </FadeIn>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile nav                                                          */
/* ------------------------------------------------------------------ */

export function MobileDocNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden mb-8 relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--background-surface)] text-[var(--text-primary)] font-medium hover:bg-[var(--background-elevated)] transition-colors w-full"
      >
        <Menu className="w-4 h-4" />
        <span className="flex-1 text-left">Jump to section</span>
        <X
          className={`w-4 h-4 transition-transform ${
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 right-0 z-20 mt-1 bg-[var(--background-elevated)] rounded-xl border border-[var(--border-subtle)] shadow-xl overflow-hidden"
            >
              <div className="p-2 max-h-72 overflow-y-auto">
                {NAV_SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(false);
                      setTimeout(() => scrollToId(s.id), 150);
                    }}
                    className="block px-4 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-surface)] transition-colors"
                  >
                    {s.title}
                  </a>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
