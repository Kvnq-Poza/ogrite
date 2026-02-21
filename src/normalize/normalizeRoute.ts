import path from "node:path";
import type {
  NormalizeOptions,
  OutputPath,
  RoutePath,
} from "../types/index.js";
import { contentHash } from "../utils/hash.js";
import { slugify } from "../utils/slugify.js";

/**
 * Map a RoutePath to a deterministic output file path.
 *
 * Examples (with default options, format = 'png'):
 *   /               → <baseOutput>/home.png
 *   /about          → <baseOutput>/about.png
 *   /blog/my-post   → <baseOutput>/blog/my-post.png
 */
export function normalizeRoute(
  route: RoutePath,
  options: NormalizeOptions,
  format: string = "png",
): OutputPath {
  const {
    baseOutput,
    paramStrategy = { type: "slugify" },
    homeFileName = "home",
    sanitize,
  } = options;

  // Strip trailing slash, but preserve root
  let cleaned = route === "/" ? "/" : route.replace(/\/+$/, "");

  // Handle root
  if (cleaned === "/") {
    return path.join(baseOutput, `${homeFileName}.${format}`);
  }

  // Split into segments (drop leading empty string from split)
  const segments = cleaned.split("/").filter(Boolean);

  // Process each segment
  const processedSegments = segments.map((segment) => {
    // Apply custom sanitizer first
    if (sanitize) {
      segment = sanitize(segment);
    }

    // Check if segment looks like a dynamic param (contains [ or { or starts with :)
    const isDynamic =
      segment.includes("[") || segment.includes("{") || segment.startsWith(":");

    if (isDynamic) {
      switch (paramStrategy.type) {
        case "keep":
          // Strip brackets/braces/colons for filesystem safety
          return segment.replace(/[\[\]\{\}:]/g, "");
        case "hash":
          return contentHash(segment, paramStrategy.length ?? 8);
        case "slugify":
          return slugify(segment.replace(/[\[\]\{\}:]/g, ""));
        default:
          return segment;
      }
    }

    // For normal segments, slugify if strategy is slugify, otherwise keep
    if (paramStrategy.type === "slugify") {
      return slugify(segment);
    }
    return segment;
  });

  const relativePath = processedSegments.join(path.sep);
  return path.join(baseOutput, `${relativePath}.${format}`);
}
