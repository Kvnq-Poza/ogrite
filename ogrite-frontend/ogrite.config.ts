import { defineConfig } from "@ogrite/ogrite";

export default defineConfig({
  baseUrl: "http://localhost:3000",
  outputDir: "public/og",
  routeDiscovery: {
    strategy: "filesystem",
  },
  incremental: false,
  wait: {
    type: "networkidle",
    timeoutMs: 30000,
    extraDelayMs: 1000,
  },
  capture: {
    type: "viewport",
    selector: null,
    format: "png",
    quality: 90,
  },
});
