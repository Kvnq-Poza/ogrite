"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group relative p-6 rounded-xl border border-[var(--border-default)] bg-[var(--background-surface)] overflow-hidden cursor-pointer h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Animated gradient border top */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: isHovered ? 1 : 0, scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10">
        {/* Icon container with rotation animation */}
        <motion.div
          className="w-12 h-12 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center mb-4"
          animate={{ rotate: isHovered ? [0, -10, 10, 0] : 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Icon
              className="w-6 h-6 text-[var(--accent-primary)]"
              strokeWidth={1.5}
            />
          </motion.div>
        </motion.div>

        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-primary)] transition-colors duration-200">
          {title}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {description}
        </p>
      </div>

      {/* Border animation on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-[var(--accent-primary)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.2 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}
