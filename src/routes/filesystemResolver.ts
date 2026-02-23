import fs from "node:fs/promises";
import path from "node:path";
import type { RoutePath, RouteSource } from "../types/index.js";

/**
 * Page-file extensions to consider as routes.
 */
const PAGE_EXTENSIONS = new Set([
  ".tsx",
  ".ts",
  ".jsx",
  ".js",
  ".astro",
  ".svelte",
  ".vue",
  ".mdx",
  ".md",
  ".html",
]);

/** Files/dirs to skip. */
const IGNORED = new Set([
  "node_modules",
  "_app",
  "_document",
  "_error",
  "_layout",
  "layout",
  "loading",
  "error",
  "not-found",
  "middleware",
  "api",
  "_middleware",
]);

/** Matches dynamic route segments: [param], [...param], [[...param]] */
const DYNAMIC_SEGMENT_RE = /^\[{1,2}[\.]{0,3}.+\]{1,2}$/;

const AUTO_DETECT_DIRS = ["app", "src/app", "pages", "src/pages"];

/**
 * Scans a directory to infer routes from file paths.
 * Works for flat (pages/) and nested (app/) directory conventions.
 * If no source is provided, it auto-detects common framework directories.
 *
 * **Static routes only.** Dynamic route segments (e.g. `[slug]`, `[...params]`)
 * are skipped because the filesystem resolver cannot determine the concrete
 * parameter values. For dynamic routes, use the `sitemap` or `custom` strategy.
 */
export function createFilesystemSource(source?: string): RouteSource {
  return {
    name: "filesystem",
    async getRoutes(): Promise<RoutePath[]> {
      const routes: RoutePath[] = [];
      const sourcesToScan: string[] = [];
      const cwd = process.cwd();

      if (source) {
        sourcesToScan.push(source);
      } else {
        // Auto-detect
        for (const dir of AUTO_DETECT_DIRS) {
          try {
            const stat = await fs.stat(path.join(cwd, dir));
            if (stat.isDirectory()) {
              sourcesToScan.push(dir);
            }
          } catch {
            // Ignore if directory doesn't exist
          }
        }

        if (sourcesToScan.length === 0) {
          throw new Error(
            `[ogrite] RouteDiscoveryError: Could not auto-detect a routes directory. Looked for: ${AUTO_DETECT_DIRS.map((d) => `"${d}/"`).join(", ")}. If you are using a custom directory or a different framework, please specify the "source" in your config.`,
          );
        }
      }

      for (const src of sourcesToScan) {
        const isAppRouter =
          src.endsWith("app") || src.endsWith("app/") || src.endsWith("app\\");
        await walk(src, "", routes, isAppRouter);
      }

      // Deduplicate routes (e.g. if both pages/index.tsx and app/page.tsx exist, though usually discouraged)
      return Array.from(new Set(routes));
    },
  };
}

async function walk(
  base: string,
  prefix: string,
  routes: RoutePath[],
  isAppRouter: boolean,
): Promise<void> {
  let entries;
  try {
    entries = await fs.readdir(path.join(base, prefix), {
      withFileTypes: true,
    });
  } catch {
    // Gracefully handle if a directory being walked somehow disappears or is unreadable
    return;
  }

  for (const entry of entries) {
    const name = entry.name;

    // Skip hidden files and ignored patterns
    if (name.startsWith(".") || name.startsWith("_") || IGNORED.has(name)) {
      continue;
    }

    const relativePath = path.join(prefix, name);

    if (entry.isDirectory()) {
      // Skip dynamic route directories — filesystem scanning cannot resolve parameter values
      if (DYNAMIC_SEGMENT_RE.test(name)) {
        console.warn(
          `[ogrite:warn] Skipping dynamic route segment "${name}" in ${path.join(base, prefix)}. ` +
            `The filesystem strategy only detects static routes. ` +
            `Use the "sitemap" or "custom" strategy to include dynamic routes.`,
        );
        continue;
      }
      routeFromDirectory(base, relativePath, routes, isAppRouter);
      await walk(base, relativePath, routes, isAppRouter);
    } else if (entry.isFile()) {
      const ext = path.extname(name);
      if (!PAGE_EXTENSIONS.has(ext)) continue;

      const baseName = path.basename(name, ext);

      // Skip non-page files
      if (IGNORED.has(baseName)) continue;

      // Skip dynamic page files (pages router: [slug].tsx, [...params].tsx, etc.)
      if (DYNAMIC_SEGMENT_RE.test(baseName)) {
        console.warn(
          `[ogrite:warn] Skipping dynamic route file "${name}" in ${path.join(base, prefix)}. ` +
            `The filesystem strategy only detects static routes. ` +
            `Use the "sitemap" or "custom" strategy to include dynamic routes.`,
        );
        continue;
      }

      if (isAppRouter) {
        // App router: only handle root page directly. Sub-pages are handled by directory check.
        if (baseName === "page" && prefix === "") {
          routes.push("/" as RoutePath);
        }
      } else {
        // Pages router logic
        if (baseName === "index") {
          const routePath = prefix
            ? (`/${prefix.replace(/\\/g, "/")}` as RoutePath)
            : ("/" as RoutePath);
          routes.push(routePath);
        } else {
          const routePath =
            `/${path.join(prefix, baseName).replace(/\\/g, "/")}` as RoutePath;
          routes.push(routePath);
        }
      }
    }
  }
}

async function routeFromDirectory(
  base: string,
  relativePath: string,
  routes: RoutePath[],
  isAppRouter: boolean,
) {
  if (isAppRouter) {
    // Check for page file inside (app router convention)
    const hasPage = await hasPageFile(path.join(base, relativePath));
    if (hasPage) {
      // Strip route groups e.g. (marketing)/about -> about
      const cleanedPath = relativePath
        .split(path.sep)
        .filter(
          (segment) => !(segment.startsWith("(") && segment.endsWith(")")),
        )
        .join("/");

      const routePath = `/${cleanedPath}` as RoutePath;
      if (routePath !== "/") {
        // Prevent duplicate root if somehow mapped
        routes.push(routePath);
      }
    }
  }
}

async function hasPageFile(dirPath: string): Promise<boolean> {
  try {
    const entries = await fs.readdir(dirPath);
    return entries.some((e) => {
      const ext = path.extname(e);
      const base = path.basename(e, ext);
      return base === "page" && PAGE_EXTENSIONS.has(ext);
    });
  } catch {
    return false;
  }
}
