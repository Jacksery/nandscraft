import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/footer";
import { ReactLenis, useLenis } from "lenis/react";

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
  title: "NandsCraft",
  description: "Official NandsCraft MC Server",
  openGraph: {
    title: "NandsCraft",
    description: "Official NandsCraft MC Server",
    url: "https://nandscraft.com",
    siteName: "NandsCraft",
    images: [
      {
        url: "/images/chicken-jockey.jpg",
        width: 1200,
        height: 630,
        alt: "NandsCraft",
      },
    ],
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
        <ReactLenis root />
        {children}
        <Analytics />
        <SpeedInsights />
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
