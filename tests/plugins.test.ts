import { describe, it, expect } from "vitest";
import { ogriteVitePlugin } from "../src/plugins/vite.js";
import { ogriteAstroPlugin } from "../src/plugins/astro.js";
import { withOgrite, runOgrite } from "../src/plugins/next.js";

describe("Framework Plugins", () => {
  describe("Vite Plugin", () => {
    it("returns a valid Vite plugin object", () => {
      const plugin = ogriteVitePlugin();
      expect(plugin.name).toBe("ogrite:vite");
      expect(plugin.apply).toBe("build");
      expect(typeof plugin.closeBundle).toBe("function");
    });
  });

  describe("Astro Plugin", () => {
    it("returns a valid Astro integration object", () => {
      const plugin = ogriteAstroPlugin();
      expect(plugin.name).toBe("ogrite:astro");
      expect(typeof plugin.hooks["astro:build:done"]).toBe("function");
    });
  });

  describe("Next.js Wrapper", () => {
    it("returns the config with a modified webpack function", () => {
      const baseConfig = { reactStrictMode: true };
      const wrapped = withOgrite(baseConfig);

      expect(wrapped.reactStrictMode).toBe(true);
      expect(typeof wrapped.webpack).toBe("function");
    });

    it("preserves existing webpack function", () => {
      let called = false;
      const baseConfig = {
        webpack: (config: any) => {
          called = true;
          return config;
        },
      };
      const wrapped = withOgrite(baseConfig);
      const res = wrapped.webpack(
        { defaultProp: true },
        { isServer: true, nextRuntime: "nodejs" },
      );

      expect(called).toBe(true);
      expect(res.defaultProp).toBe(true);
    });
  });
});
