import { Metadata } from "next";
import { LayoutWrapper } from "../components/LayoutWrapper";
import { GettingStarted } from "../components/pages/GettingStarted";

export const metadata: Metadata = {
  title: "Getting Started",
  description: "Get started with Ogrite",
  keywords: ["Ogrite", "Open Graph", "OG Image", "OG Image Compiler"],
  authors: [
    {
      name: "Kvnqpoza",
      url: "https://github.com/kvnqpoza",
    },
  ],
  openGraph: {
    title: "Getting Started",
    description: "Get started with Ogrite",
    type: "website",
    locale: "en_US",
    siteName: "Ogrite",
    images: [
      {
        url: "/og/getting-started.webp",
        width: 1200,
        height: 630,
        alt: "Ogrite - Build-time OG Image Compiler",
      },
    ],
  },
  twitter: {
    title: "Getting Started",
    description: "Get started with Ogrite",
    card: "summary_large_image",
    images: [
      {
        url: "/og/getting-started.webp",
        width: 1200,
        height: 630,
        alt: "Ogrite - Build-time OG Image Compiler",
      },
    ],
  },
};

export default function GettingStartedPage() {
  return (
    <LayoutWrapper>
      <GettingStarted />
    </LayoutWrapper>
  );
}
