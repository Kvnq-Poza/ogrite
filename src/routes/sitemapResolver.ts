import type { RoutePath, RouteSource } from "../types/index.js";

/**
 * Parses a sitemap.xml to extract route URLs.
 */
export function createSitemapSource(
  baseUrl: string,
  source: string,
): RouteSource {
  return {
    name: "sitemap",
    async getRoutes(): Promise<RoutePath[]> {
      const sitemapUrl = source.startsWith("http")
        ? source
        : `${baseUrl}${source.startsWith("/") ? "" : "/"}${source}`;

      const response = await fetch(sitemapUrl);
      if (!response.ok) {
        throw new Error(
          `[ogrite] RouteDiscoveryError: Failed to fetch sitemap from ${sitemapUrl} (${response.status})`,
        );
      }

      const xml = await response.text();

      // Extract all <loc> values
      const locRegex = /<loc>\s*(.*?)\s*<\/loc>/gi;
      const routes: RoutePath[] = [];
      let match: RegExpExecArray | null;

      while ((match = locRegex.exec(xml)) !== null) {
        const url = match[1];
        try {
          const parsed = new URL(url);
          const routePath = parsed.pathname as RoutePath;
          routes.push(routePath);
        } catch {
          // Skip invalid URLs
        }
      }

      return routes;
    },
  };
}
