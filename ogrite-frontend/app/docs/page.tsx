import { Metadata } from "next";
import { LayoutWrapper } from "../components/LayoutWrapper";
import { Docs } from "../components/pages/Docs";

export const metadata: Metadata = {
  title: "Docs",
  description: "Documentation for Ogrite",
  keywords: ["Ogrite", "Open Graph", "OG Image", "OG Image Compiler"],
  authors: [
    {
      name: "Kvnqpoza",
      url: "https://github.com/kvnqpoza",
    },
  ],
  openGraph: {
    title: "Docs",
    description: "Documentation for Ogrite",
    type: "website",
    locale: "en_US",
    siteName: "Ogrite",
    images: [
      {
        url: "/og/docs.webp",
        width: 1200,
        height: 630,
        alt: "Ogrite - Build-time OG Image Compiler",
      },
    ],
  },
  twitter: {
    title: "Docs",
    description: "Documentation for Ogrite",
    card: "summary_large_image",
    images: [
      {
        url: "/og/docs.webp",
        width: 1200,
        height: 630,
        alt: "Ogrite - Build-time OG Image Compiler",
      },
    ],
  },
};

export default function DocsPage() {
  return (
    <LayoutWrapper>
      <Docs />
    </LayoutWrapper>
  );
}
