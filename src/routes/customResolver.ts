import type { RoutePath, RouteSource } from "../types/index.js";

/**
 * Wraps a user-provided async resolver function.
 */
export function createCustomSource(
  resolver: () => Promise<RoutePath[]>,
): RouteSource {
  return {
    name: "custom",
    async getRoutes(): Promise<RoutePath[]> {
      return resolver();
    },
  };
}
