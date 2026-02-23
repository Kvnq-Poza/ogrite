import { Metadata } from "next";
import { LayoutWrapper } from "./components/LayoutWrapper";
import { Landing } from "./components/pages/Landing";

export const metadata: Metadata = {
  title: "Ogrite - Build-time OG Image Compiler",
  description:
    "Generate deterministic Open Graph images at build time. No runtime rendering, no serverless, no surprises.",
  keywords: [
    "OG images",
    "social media preview",
    "build time",
    "static generation",
  ],
  authors: [
    {
      name: "Kvnqpoza",
      url: "https://github.com/kvnqpoza",
    },
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  openGraph: {
    title: "Ogrite - Build-time OG Image Compiler",
    description:
      "Generate deterministic Open Graph images at build time. No runtime rendering, no serverless, no surprises.",
    type: "website",
    locale: "en_US",
    siteName: "Ogrite",
    images: [
      {
        url: "/og/home.webp",
        width: 1200,
        height: 630,
        alt: "Ogrite - Build-time OG Image Compiler",
      },
    ],
  },
  twitter: {
    title: "Ogrite - Build-time OG Image Compiler",
    description:
      "Generate deterministic Open Graph images at build time. No runtime rendering, no serverless, no surprises.",
    card: "summary_large_image",
    images: [
      {
        url: "/og/home.webp",
        width: 1200,
        height: 630,
        alt: "Ogrite - Build-time OG Image Compiler",
      },
    ],
  },
};

export default function Home() {
  return (
    <LayoutWrapper>
      <Landing />
    </LayoutWrapper>
  );
}
