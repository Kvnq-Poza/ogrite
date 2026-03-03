/* ------------------------------------------------------------------ */
/*  Scroll helper                                                       */
/* ------------------------------------------------------------------ */

export const HEADER_OFFSET = 80;

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}

/* ------------------------------------------------------------------ */
/*  Navigation data                                                     */
/* ------------------------------------------------------------------ */

export interface NavSubsection {
  id: string;
  title: string;
}

export interface NavSection {
  id: string;
  title: string;
  subsections?: NavSubsection[];
}

export const NAV_SECTIONS: NavSection[] = [
  { id: "introduction", title: "Introduction" },
  {
    id: "installation",
    title: "Installation",
    subsections: [
      { id: "install-packages", title: "Install packages" },
      { id: "install-browser", title: "Install browser binary" },
    ],
  },
  {
    id: "configuration",
    title: "Configuration",
    subsections: [
      { id: "config-file", title: "Config file" },
      { id: "config-baseurl", title: "baseUrl" },
      { id: "config-outputdir", title: "outputDir" },
      { id: "config-concurrency", title: "concurrency" },
      { id: "config-loglevel", title: "logLevel" },
      { id: "config-viewport", title: "viewport" },
      { id: "config-wait", title: "wait" },
      { id: "config-capture", title: "capture" },
      { id: "config-compression", title: "compression" },
      { id: "config-routediscovery", title: "routeDiscovery" },
      { id: "config-normalize", title: "normalize" },
      { id: "config-meta", title: "meta" },
      { id: "config-autometa", title: "autoMeta" },
      { id: "config-template", title: "template" },
      { id: "config-inject", title: "inject" },
      { id: "config-incremental", title: "incremental" },
      { id: "config-defaults", title: "Full defaults" },
    ],
  },
  {
    id: "frameworks",
    title: "Framework Integrations",
    subsections: [
      { id: "framework-vite", title: "Vite" },
      { id: "framework-next", title: "Next.js" },
      { id: "framework-astro", title: "Astro" },
    ],
  },
  {
    id: "cli",
    title: "CLI Reference",
    subsections: [
      { id: "cli-generate", title: "ogrite generate" },
      { id: "cli-watch", title: "ogrite watch" },
      { id: "cli-check", title: "ogrite check" },
      { id: "cli-clean", title: "ogrite clean" },
    ],
  },
  {
    id: "api",
    title: "Programmatic API",
    subsections: [
      { id: "api-createoggenerator", title: "createOgGenerator()" },
      { id: "api-defineconfig", title: "defineConfig()" },
      { id: "api-oggenerator", title: "OgGenerator interface" },
      { id: "api-buildreport", title: "BuildReport" },
    ],
  },
  {
    id: "runtime",
    title: "Runtime Helper",
    subsections: [{ id: "runtime-getogimagepath", title: "getOgImagePath()" }],
  },
  {
    id: "normalization",
    title: "Route Normalization",
    subsections: [
      { id: "norm-overview", title: "How it works" },
      { id: "norm-strategies", title: "Param strategies" },
    ],
  },
  { id: "types", title: "Type Reference" },
];
