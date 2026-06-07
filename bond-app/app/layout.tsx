import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bond — Relationship AI",
  description: "Speak the language of love your partner actually hears. AI-powered emotional translation for couples.",
  keywords: ["relationship", "couples", "communication", "AI", "emotional intelligence"],
  openGraph: {
    title: "Bond — Relationship AI",
    description: "Speak the language of love your partner actually hears.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf8f6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
