import { createServer } from "node:http";
import { join, normalize, resolve } from "node:path";
import { readFile, stat } from "node:fs/promises";
import { loadConfig } from "./loadConfig.js";
import { readManifest } from "../fs/manifest.js";

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".html": "text/html",
};

/**
 * CLI: `ogrite preview`
 * Serves a local HTML gallery showing all generated OG images.
 */
export async function previewCommand(
  options: { port?: number } = {},
): Promise<void> {
  const config = await loadConfig();
  const manifest = await readManifest(config.outputDir);
  const items = Object.values(manifest);
  const port = options.port || 4000;

  const absoluteOutputDir = resolve(config.outputDir);

  const server = createServer(async (req, res) => {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);

    // Serve the Gallery HTML
    if (url.pathname === "/") {
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ogrite Preview Gallery</title>
  <style>
    :root {
      --bg: #09090b;
      --surface: #18181b;
      --text: #f4f4f5;
      --text-muted: #a1a1aa;
      --border: #27272a;
      --accent: #3b82f6;
    }
    body {
      margin: 0;
      font-family: system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      padding: 2rem;
    }
    header {
      margin-bottom: 2rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 1rem;
    }
    h1 { margin: 0; font-size: 1.5rem; font-weight: 600; }
    p.stats { color: var(--text-muted); margin-top: 0.5rem; }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 2rem;
    }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .img-container {
      aspect-ratio: 1200 / 630;
      background: #000;
      position: relative;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .info {
      padding: 1rem;
    }
    .route {
      font-weight: 600;
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      word-break: break-all;
    }
    .meta {
      font-size: 0.85rem;
      color: var(--text-muted);
      display: flex;
      justify-content: space-between;
    }
    .empty {
      text-align: center;
      padding: 4rem;
      color: var(--text-muted);
    }
  </style>
</head>
<body>
  <header>
    <h1>Ogrite Gallery</h1>
    <p class="stats">${items.length} generated artifact${items.length === 1 ? "" : "s"}</p>
  </header>
  
  ${items.length === 0 ? '<div class="empty">No images found in manifest</div>' : ""}
  
  <div class="grid">
    ${items
      .map(
        (item) => `
      <div class="card">
        <div class="img-container">
          <!-- Serving local file via /image/... path -->
          <img src="/image/${item.outputPath}" alt="${item.route}" loading="lazy" />
        </div>
        <div class="info">
          <div class="route">${item.route}</div>
          <div class="meta">
            <span>${item.outputPath}</span>
          </div>
        </div>
      </div>
    `,
      )
      .join("")}
  </div>
</body>
</html>
      `;
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
      return;
    }

    // Serve static images from outputDir
    if (url.pathname.startsWith("/image/")) {
      try {
        // Safe path resolution to prevent directory traversal
        const fileReq = url.pathname.replace("/image/", "");
        const safePath = normalize(fileReq).replace(/^(\.\.(\/|\\|$))+/, "");
        const filePath = join(absoluteOutputDir, safePath);

        // Ensure the resolved path is actually inside the output directory
        if (!filePath.startsWith(absoluteOutputDir)) {
          res.writeHead(403);
          res.end("Forbidden");
          return;
        }

        const fileStat = await stat(filePath);
        if (fileStat.isFile()) {
          const ext =
            Object.keys(MIME_TYPES).find((e) => filePath.endsWith(e)) || "";
          const mime = MIME_TYPES[ext] || "application/octet-stream";
          const content = await readFile(filePath);

          res.writeHead(200, {
            "Content-Type": mime,
            "Cache-Control": "public, max-age=3600",
          });
          res.end(content);
          return;
        }
      } catch (err) {
        // Fall through to 404
      }
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  });

  return new Promise<void>((resolve, reject) => {
    server.listen(port, () => {
      console.log(
        `\n🖼️  Ogrite Preview Gallery available at: http://localhost:${port}\n`,
      );
      // Keeping the process alive for the server
    });

    server.on("error", (err) => reject(err));
  });
}
