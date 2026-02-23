import { defineConfig } from "@ogrite/ogrite";

export default defineConfig({
  baseUrl: "http://localhost:3000",
  outputDir: "public/og",
  routeDiscovery: {
    strategy: "filesystem",
  },
});
