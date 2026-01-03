import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flowdo | Your thoughts, perfectly captured.",
  description: "Stop forgetting important tasks. Flowdo turns your scattered ideas into organized action items that actually get done. Premium, minimal, and AI-powered.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/logo.svg", type: "image/svg+xml" }],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  keywords: ["todo app", "productivity", "task manager", "flowdo", "ai todo", "focus", "daily planner"],
  authors: [{ name: "Flowdo Team" }],
  openGraph: {
    title: "Flowdo — Your thoughts, perfectly captured.",
    description: "The premium task manager for high-performers.",
    url: "https://flowdo.io",
    siteName: "Flowdo",
    locale: "en_US",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
