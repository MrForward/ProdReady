import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "ProdReady - AI Code Security Audit",
  description: "Scan your JavaScript/TypeScript repo in seconds. Find exposed API keys, SEO gaps, and code smells before hackers do. Optimized for Next.js, React, Vue, and Node.js.",
  keywords: ["JavaScript security", "TypeScript security", "Next.js security", "code audit", "API key scanner", "SEO checker", "code review", "React security"],
  authors: [{ name: "ProdReady" }],
  creator: "ProdReady",
  openGraph: {
    title: "ProdReady - AI Code Security Audit",
    description: "Scan your JavaScript/TypeScript repo in seconds. Find exposed API keys, SEO gaps, and code smells before hackers do.",
    url: "https://prodready.dev",
    siteName: "ProdReady",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ProdReady - Code Security Audit",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProdReady - AI Code Security Audit",
    description: "Scan your JavaScript/TypeScript repo in seconds. Find security issues before hackers do.",
    images: ["/og-image.png"],
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
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-background`}
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}

