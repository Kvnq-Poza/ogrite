import { readFile, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
import type { AutoMetaOptions, Manifest } from "../types/index.js";

/**
 * Automatically injects <meta property="og:image"> tags into the generated HTML files.
 * This runs after the entire artifact generation pipeline is complete.
 */
export async function injectMetaTags(
  options: AutoMetaOptions,
  manifest: Manifest,
): Promise<void> {
  const { htmlOutputDir, baseMetaUrl } = options;
  const baseUrlFixed = baseMetaUrl.endsWith("/")
    ? baseMetaUrl.slice(0, -1)
    : baseMetaUrl;

  for (const [route, entry] of Object.entries(manifest)) {
    const htmlFiles = [
      join(htmlOutputDir, route, "index.html"),
      join(htmlOutputDir, route === "/" ? "index.html" : `${route}.html`),
      join(htmlOutputDir, route), // if route already includes .html
    ];

    let targetHtmlPath: string | undefined;

    for (const p of htmlFiles) {
      try {
        const stats = await stat(p);
        if (stats.isFile()) {
          targetHtmlPath = p;
          break;
        }
      } catch {
        // file does not exist, try next
      }
    }

    if (!targetHtmlPath) {
      console.warn(
        `[ogrite:warn] autoMeta: Could not find HTML file for route "${route}". Scanned: ${htmlFiles.join(", ")}`,
      );
      continue;
    }

    const html = await readFile(targetHtmlPath, "utf-8");
    const imagePathFixed = entry.outputPath.startsWith("/")
      ? entry.outputPath
      : `/${entry.outputPath}`;
    const fullImageUrl = `${baseUrlFixed}${imagePathFixed}`;

    const ogTag = `<meta property="og:image" content="${fullImageUrl}">`;

    // Avoid injecting multiple times
    if (
      html.includes('property="og:image"') ||
      html.includes("property='og:image'")
    ) {
      const replaced = html.replace(
        /<meta\s+property=["']og:image["']\s+content=["'][^"']+["']\s*\/?>/i,
        ogTag,
      );
      if (replaced !== html) {
        await writeFile(targetHtmlPath, replaced, "utf-8");
        console.log(
          `[ogrite] autoMeta: Replaced existing tag in ${targetHtmlPath}`,
        );
      }
    } else {
      // Inject right before </head>
      const headCloseIdx = html.indexOf("</head>");
      if (headCloseIdx !== -1) {
        const newHtml =
          html.slice(0, headCloseIdx) +
          `  ${ogTag}\n` +
          html.slice(headCloseIdx);
        await writeFile(targetHtmlPath, newHtml, "utf-8");
        console.log(`[ogrite] autoMeta: Injected tag into ${targetHtmlPath}`);
      } else {
        console.warn(
          `[ogrite:warn] autoMeta: No </head> tag found in ${targetHtmlPath}`,
        );
      }
    }
  }
}
