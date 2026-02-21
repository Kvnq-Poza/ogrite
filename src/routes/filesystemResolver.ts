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

/**
 * Scans a directory to infer routes from file paths.
 * Works for flat (pages/) and nested (app/) directory conventions.
 */
export function createFilesystemSource(source: string): RouteSource {
  return {
    name: "filesystem",
    async getRoutes(): Promise<RoutePath[]> {
      const routes: RoutePath[] = [];
      await walk(source, "", routes);
      return routes;
    },
  };
}

async function walk(
  base: string,
  prefix: string,
  routes: RoutePath[],
): Promise<void> {
  const entries = await fs.readdir(path.join(base, prefix), {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const name = entry.name;

    // Skip hidden files and ignored patterns
    if (name.startsWith(".") || name.startsWith("_") || IGNORED.has(name)) {
      continue;
    }

    const relativePath = path.join(prefix, name);

    if (entry.isDirectory()) {
      // Check for page file inside (app router convention)
      const hasPage = await hasPageFile(path.join(base, relativePath));
      if (hasPage) {
        const routePath = `/${relativePath.replace(/\\/g, "/")}` as RoutePath;
        routes.push(routePath);
      }
      await walk(base, relativePath, routes);
    } else if (entry.isFile()) {
      const ext = path.extname(name);
      if (!PAGE_EXTENSIONS.has(ext)) continue;

      const baseName = path.basename(name, ext);

      // Skip non-page files
      if (IGNORED.has(baseName)) continue;

      // pages/index.tsx → /
      // pages/about.tsx → /about
      // pages/blog/[slug].tsx → /blog/[slug]
      if (baseName === "index" || baseName === "page") {
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
