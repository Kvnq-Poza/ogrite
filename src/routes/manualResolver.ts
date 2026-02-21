import type { RoutePath, RouteSource } from "../types/index.js";

/**
 * Returns the explicit `routes[]` array from config as-is.
 */
export function createManualSource(routes: string[]): RouteSource {
  return {
    name: "manual",
    async getRoutes(): Promise<RoutePath[]> {
      return routes.map((r) => {
        const cleaned = r.startsWith("/") ? r : `/${r}`;
        return cleaned as RoutePath;
      });
    },
  };
}
