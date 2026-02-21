"use client";

import { motion } from "framer-motion";
import { ReactNode, MouseEvent, useRef, useState } from "react";
import Link from "next/link";

interface AnimatedButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  magnetic?: boolean;
  external?: boolean;
}

export function AnimatedButton({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
  magnetic = false,
  external = false,
}: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [magneticPos, setMagneticPos] = useState({ x: 0, y: 0 });

  const variants = {
    primary:
      "bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)] shadow-lg shadow-[var(--accent-primary)]/20",
    secondary:
      "bg-[var(--background-surface)] text-[var(--text-primary)] border border-[var(--border-default)] hover:bg-[var(--background-elevated)] hover:border-[var(--accent-primary)]",
    ghost:
      "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-surface)]",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const baseClasses = `inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className}`;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!magnetic || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setMagneticPos({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setMagneticPos({ x: 0, y: 0 });
  };

  const content = (
    <motion.div
      ref={buttonRef}
      className={baseClasses}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={magnetic ? { x: magneticPos.x, y: magneticPos.y } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {children}
    </motion.div>
  );

  if (href && href.startsWith("http")) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return <button onClick={onClick}>{content}</button>;
}
