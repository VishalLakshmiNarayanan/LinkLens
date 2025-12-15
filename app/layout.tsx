import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinkLens - Event Link Analyzer",
  description: "Paste an event link, get instant details",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
