import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Khada Pathway",
  description: "Tell us what you need. We'll help you find the path.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ht">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
