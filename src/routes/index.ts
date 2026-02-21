import type { RouteDiscovery, RouteSource } from "../types/index.js";
import { createSitemapSource } from "./sitemapResolver.js";
import { createFilesystemSource } from "./filesystemResolver.js";
import { createManualSource } from "./manualResolver.js";
import { createCustomSource } from "./customResolver.js";

/**
 * Factory: create the appropriate RouteSource from config.
 */
export function createRouteSource(
  discovery: RouteDiscovery,
  baseUrl: string,
): RouteSource {
  const strategy = discovery.strategy ?? "manual";

  switch (strategy) {
    case "sitemap":
      return createSitemapSource(baseUrl, discovery.source ?? "/sitemap.xml");

    case "filesystem":
      if (!discovery.source) {
        throw new Error(
          '[ogrite] RouteDiscoveryError: "source" is required for filesystem strategy (e.g. "pages/" or "app/").',
        );
      }
      return createFilesystemSource(discovery.source);

    case "manual":
      return createManualSource(discovery.routes ?? []);

    case "custom":
      if (!discovery.resolver) {
        throw new Error(
          '[ogrite] RouteDiscoveryError: "resolver" function is required for custom strategy.',
        );
      }
      return createCustomSource(discovery.resolver);

    default:
      throw new Error(
        `[ogrite] RouteDiscoveryError: Unknown strategy "${strategy}".`,
      );
  }
}
