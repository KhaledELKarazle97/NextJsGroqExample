import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";

export const metadata: Metadata = {
  title: "Groq Chat + OCR Demo",
  description: "A Next.js demo using the Groq API for a chatbot and OCR, styled with shadcn/ui.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Nav />
        <main className="container py-8">{children}</main>
      </body>
    </html>
  );
}
