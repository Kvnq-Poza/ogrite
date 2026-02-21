import type { Optimizer, OptimizeOptions } from "../types/index.js";

/**
 * Sharp-based image optimizer adapter.
 */
export function createSharpOptimizer(): Optimizer {
  return {
    async optimize(buffer: Buffer, options: OptimizeOptions): Promise<Buffer> {
      if (!options.enabled) {
        return buffer;
      }

      const sharp = (await import("sharp")).default;
      let pipeline = sharp(buffer);

      // Resize if maxWidth is set
      if (options.maxWidth) {
        pipeline = pipeline.resize({
          width: options.maxWidth,
          withoutEnlargement: true,
        });
      }

      // Format conversion
      switch (options.target) {
        case "webp":
          pipeline = pipeline.webp({ quality: options.quality });
          break;
        case "avif":
          pipeline = pipeline.avif({ quality: options.quality });
          break;
        case "png":
        default:
          pipeline = pipeline.png({
            quality: options.quality,
            compressionLevel: 9,
          });
          break;
      }

      return pipeline.toBuffer();
    },
  };
}
