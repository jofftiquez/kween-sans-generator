import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Kween Yasmin Generator | Transform Words to Beautiful Images",
  description:
    "Create stunning word-to-image transformations with Kween Yasmin Generator. Type alphanumeric characters and generate beautiful PNG images instantly.",
  keywords: [
    "word generator",
    "png generator",
    "image creator",
    "text to image",
    "kween yasmin",
  ],
  authors: [{ name: "Kween Yasmin Generator" }],
  openGraph: {
    title: "Kween Yasmin Generator",
    description: "Transform your words into beautiful PNG images",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
