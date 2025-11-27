import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Kween Sans Generator | Create Custom Text Images for Social Media",
  description:
    "Generate beautiful custom text images with Kween Sans font. Perfect for Instagram posts, stories, Facebook, X (Twitter), and LinkedIn. Free meme generator by OSSPH.",
  keywords: [
    "kween sans",
    "text to image generator",
    "social media image creator",
    "instagram post generator",
    "meme generator",
    "custom font generator",
    "png generator",
    "ossph",
  ],
  authors: [{ name: "OSSPH", url: "https://ossph.org" }],
  creator: "OSSPH",
  publisher: "OSSPH",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Kween Sans Generator",
    description:
      "Generate beautiful custom text images with Kween Sans font. Perfect for social media posts and memes.",
    type: "website",
    siteName: "Kween Sans Generator",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kween Sans Generator",
    description:
      "Generate beautiful custom text images with Kween Sans font. Perfect for social media posts and memes.",
    creator: "@nicknacnic",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
