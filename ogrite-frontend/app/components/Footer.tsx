"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "./animations/StaggerContainer";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  heading: string;
  links: FooterLink[];
}

export function Footer() {
  const footerSections: FooterSection[] = [
    {
      heading: "Ogrite",
      links: [
        { label: "Getting Started", href: "/getting-started" },
        { label: "Docs", href: "/docs" },
        { label: "Changelog", href: "#" },
      ],
    },
    {
      heading: "Resources",
      links: [
        {
          label: "GitHub",
          href: "https://github.com/Kvnq-Poza/ogrite",
          external: true,
        },
        { label: "npm", href: "https://npmjs.com", external: true },
        {
          label: "Issues",
          href: "https://github.com/Kvnq-Poza/ogrite/issues",
          external: true,
        },
      ],
    },
  ];

  return (
    <footer className="border-t border-[var(--border-default)] bg-[var(--background-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
          staggerDelay={0.1}
        >
          {footerSections.map((section) => (
            <StaggerItem key={section.heading}>
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
                  {section.heading}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <motion.li
                      key={link.label}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors inline-block"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors inline-block"
                        >
                          {link.label}
                        </Link>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
        <div className="pt-8 border-t border-[var(--border-default)]">
          <motion.p
            className="text-sm text-[var(--text-muted)] text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            MIT License · Built with Ogrite
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
