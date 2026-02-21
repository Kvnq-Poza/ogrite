"use client";

import {
  Search,
  SlidersHorizontal,
  Monitor,
  Zap,
  HardDrive,
  FileText,
  BarChart2,
} from "lucide-react";
import { useState, useCallback, memo } from "react";

const stages = [
  {
    id: "discovery",
    label: "Route Discovery",
    description: "Find all routes in your app",
    Icon: Search,
  },
  {
    id: "normalize",
    label: "Normalization",
    description: "Clean and validate URLs",
    Icon: SlidersHorizontal,
  },
  {
    id: "render",
    label: "Rendering",
    description: "Headless browser capture",
    Icon: Monitor,
  },
  {
    id: "optimize",
    label: "Optimization",
    description: "Compress to WebP/AVIF",
    Icon: Zap,
  },
  {
    id: "persist",
    label: "Persistence",
    description: "Write to output directory",
    Icon: HardDrive,
  },
  {
    id: "manifest",
    label: "Manifest",
    description: "Generate manifest file",
    Icon: FileText,
  },
  {
    id: "report",
    label: "Report",
    description: "Build summary and stats",
    Icon: BarChart2,
  },
] as const;

// ── Desktop stage card ──────────────────────────────────────────────────────
const DesktopCard = memo(function DesktopCard({
  stage,
  index,
  isActive,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: {
  stage: (typeof stages)[number];
  index: number;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}) {
  const { Icon } = stage;
  return (
    <button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`${stage.label}: ${stage.description}`}
      className="desktop-card"
      data-active={isActive ? "true" : undefined}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* Step badge */}
      <span className="step-badge" data-active={isActive ? "true" : undefined}>
        {index + 1}
      </span>

      <Icon
        size={20}
        strokeWidth={1.75}
        aria-hidden
        className="card-icon"
        data-active={isActive ? "true" : undefined}
      />

      <span className="card-label" data-active={isActive ? "true" : undefined}>
        {stage.label}
      </span>

      {/* Description — always in DOM, shown via CSS height transition */}
      <span
        className="card-desc"
        data-active={isActive ? "true" : undefined}
        aria-hidden={!isActive}
      >
        {stage.description}
      </span>
    </button>
  );
});

// ── Connector arrow ─────────────────────────────────────────────────────────
const Connector = memo(function Connector({
  highlight,
}: {
  highlight: boolean;
}) {
  return (
    <div
      className="connector"
      data-highlight={highlight ? "true" : undefined}
      aria-hidden
    >
      <div className="connector-line" />
      <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
        <path
          d="M1 1l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
});

// ── Mobile row ──────────────────────────────────────────────────────────────
const MobileRow = memo(function MobileRow({
  stage,
  index,
  isActive,
  isLast,
  onClick,
}: {
  stage: (typeof stages)[number];
  index: number;
  isActive: boolean;
  isLast: boolean;
  onClick: () => void;
}) {
  const { Icon } = stage;
  return (
    <div className="mobile-row" style={{ animationDelay: `${index * 55}ms` }}>
      {/* Spine */}
      <div className="spine-col">
        <button
          onClick={onClick}
          className="spine-dot"
          data-active={isActive ? "true" : undefined}
          aria-label={`${stage.label}: ${stage.description}`}
          aria-expanded={isActive}
        >
          {index + 1}
        </button>
        {!isLast && (
          <div
            className="spine-line"
            data-active={isActive ? "true" : undefined}
          />
        )}
      </div>

      {/* Content */}
      <div className="mobile-content">
        <button
          onClick={onClick}
          className="mobile-header"
          aria-expanded={isActive}
        >
          <Icon
            size={16}
            strokeWidth={1.75}
            aria-hidden
            className="mobile-icon"
            data-active={isActive ? "true" : undefined}
          />
          <span
            className="mobile-label"
            data-active={isActive ? "true" : undefined}
          >
            {stage.label}
          </span>
          <svg
            className="mobile-chevron"
            data-active={isActive ? "true" : undefined}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden
          >
            <path
              d="M4 2l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div
          className="mobile-desc-wrap"
          data-active={isActive ? "true" : undefined}
        >
          <p className="mobile-desc">{stage.description}</p>
        </div>
      </div>
    </div>
  );
});

// ── Main component ──────────────────────────────────────────────────────────
export function PipelineDiagram() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const displayedId = activeId ?? hoveredId;

  const handleMouseEnter = useCallback((id: string) => setHoveredId(id), []);
  const handleMouseLeave = useCallback(() => setHoveredId(null), []);
  const handleClick = useCallback(
    (id: string) => setActiveId((prev) => (prev === id ? null : id)),
    [],
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="pipeline-root">
        {/* ── Desktop ── */}
        <div className="pipeline-desktop" role="list">
          {stages.map((stage, index) => {
            const isActive = displayedId === stage.id;
            const nextStage = stages[index + 1];
            const isBeforeActive = nextStage?.id === displayedId;

            return (
              <div key={stage.id} className="pipeline-cell" role="listitem">
                <DesktopCard
                  stage={stage}
                  index={index}
                  isActive={isActive}
                  onMouseEnter={() => handleMouseEnter(stage.id)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(stage.id)}
                />
                {index < stages.length - 1 && (
                  <Connector highlight={isActive || isBeforeActive} />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Mobile ── */}
        <div className="pipeline-mobile" role="list">
          {stages.map((stage, index) => (
            <MobileRow
              key={stage.id}
              stage={stage}
              index={index}
              isActive={displayedId === stage.id}
              isLast={index === stages.length - 1}
              onClick={() => handleClick(stage.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

// ── Styles: pure CSS transitions, zero Framer Motion overhead ────────────────
const CSS = `
  @media (prefers-reduced-motion: no-preference) {
    .desktop-card,
    .mobile-row {
      animation: fade-up 0.35s both cubic-bezier(0.22, 1, 0.36, 1);
    }
  }

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .pipeline-root {
    width: 100%;
    /* Top padding accounts for badge overflow + lift; bottom gives room for shadow */
    padding: 40px 24px 36px;
    box-sizing: border-box;
  }

  /* ── Desktop layout ── */
  .pipeline-desktop {
    display: none;
  }
  @media (min-width: 768px) {
    .pipeline-desktop {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      flex-wrap: nowrap;
      overflow-x: auto;
      /*
        Top: 20px so the -10px badge + 4px lift don't get clipped by overflow-x.
        The outer pipeline-root adds more breathing room above that.
      */
      padding: 20px 4px 28px;
      gap: 0;
    }
  }

  .pipeline-cell {
    display: flex;
    align-items: flex-start;
  }

  /* ── Desktop card ── */
  .desktop-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    /*
      Top padding must be > badge overhang (10px) so inner content clears it.
      We use 22px to give a comfortable gap.
    */
    padding: 22px 16px 14px;
    border-radius: 14px;
    border: 1px solid var(--border-default);
    background: var(--background-surface);
    min-width: 112px;
    max-width: 134px;
    text-align: center;
    cursor: pointer;
    /* Only transform/opacity/shadow — GPU composited, no layout thrash */
    transition:
      border-color 0.18s ease,
      box-shadow 0.18s ease,
      transform 0.18s ease,
      background-color 0.18s ease;
    will-change: transform, box-shadow;
  }
  .desktop-card:hover,
  .desktop-card[data-active] {
    border-color: var(--accent-primary);
    background-color: color-mix(in srgb, var(--accent-primary) 8%, var(--background-surface));
    transform: translateY(-4px);
    box-shadow: 0 10px 28px -6px color-mix(in srgb, var(--accent-primary) 20%, transparent);
    outline: none;
  }
  .desktop-card:focus-visible {
    outline: 2px solid var(--accent-primary);
    outline-offset: 3px;
  }

  /* Step badge — positioned relative to card, needs parent overflow: visible */
  .step-badge {
    position: absolute;
    top: -10px;
    left: -10px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    font-size: 10px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--border-default);
    color: var(--text-secondary);
    transition: background-color 0.18s ease, color 0.18s ease;
    /* Ensure it's never clipped by the card itself */
    z-index: 1;
  }
  .step-badge[data-active] {
    background: var(--accent-primary);
    color: var(--background-surface);
  }

  .card-icon {
    color: var(--text-secondary);
    transition: color 0.18s ease;
    flex-shrink: 0;
  }
  .card-icon[data-active] { color: var(--accent-primary); }

  .card-label {
    font-size: 11.5px;
    font-weight: 600;
    line-height: 1.3;
    color: var(--text-primary);
    transition: color 0.18s ease;
  }
  .card-label[data-active] { color: var(--accent-primary); }

  /* Description: CSS-only height reveal — no JS/Framer needed */
  .card-desc {
    font-size: 11px;
    line-height: 1.4;
    color: var(--text-secondary);
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transition: max-height 0.22s ease, opacity 0.22s ease;
  }
  .card-desc[data-active] {
    max-height: 3rem;
    opacity: 1;
  }

  /* ── Connector ── */
  .connector {
    display: flex;
    align-items: center;
    /*
      mt = card top padding (22px) + half icon height (~10px) - self height (~5px).
      Visually centers the arrow with the icon row.
    */
    margin-top: 42px;
    margin-left: 4px;
    margin-right: 4px;
    color: var(--border-default);
    transition: color 0.18s ease;
    flex-shrink: 0;
  }
  .connector[data-highlight] { color: var(--accent-primary); }

  .connector-line {
    width: 20px;
    height: 1px;
    background: currentColor;
  }

  /* ── Mobile layout ── */
  .pipeline-mobile {
    display: flex;
    flex-direction: column;
  }
  @media (min-width: 768px) {
    .pipeline-mobile { display: none; }
  }

  .mobile-row {
    display: flex;
    gap: 12px;
  }

  .spine-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
  }
  .spine-dot {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid var(--border-default);
    background: var(--background-surface);
    color: var(--text-secondary);
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: border-color 0.18s ease, background-color 0.18s ease, color 0.18s ease;
  }
  .spine-dot[data-active] {
    border-color: var(--accent-primary);
    background-color: var(--accent-primary);
    color: var(--background-surface);
  }
  .spine-dot:focus-visible {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
  }
  .spine-line {
    width: 1px;
    flex: 1;
    min-height: 16px;
    margin: 4px 0;
    background: var(--border-default);
    opacity: 0.4;
    transition: background-color 0.18s ease, opacity 0.18s ease;
  }
  .spine-line[data-active] {
    background: var(--accent-primary);
    opacity: 0.55;
  }

  .mobile-content {
    padding-bottom: 16px;
    padding-top: 4px;
    flex: 1;
    min-width: 0;
  }
  .mobile-header {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    text-align: left;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
  }
  .mobile-header:focus-visible {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
    border-radius: 4px;
  }
  .mobile-icon {
    color: var(--text-secondary);
    flex-shrink: 0;
    transition: color 0.18s ease;
  }
  .mobile-icon[data-active] { color: var(--accent-primary); }

  .mobile-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    transition: color 0.18s ease;
  }
  .mobile-label[data-active] { color: var(--accent-primary); }

  .mobile-chevron {
    margin-left: auto;
    flex-shrink: 0;
    color: var(--text-secondary);
    transition: transform 0.2s ease;
  }
  .mobile-chevron[data-active] { transform: rotate(90deg); }

  .mobile-desc-wrap {
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transition: max-height 0.22s ease, opacity 0.22s ease;
  }
  .mobile-desc-wrap[data-active] {
    max-height: 4rem;
    opacity: 1;
  }
  .mobile-desc {
    margin: 4px 0 0;
    font-size: 12px;
    line-height: 1.5;
    color: var(--text-secondary);
  }
`;
