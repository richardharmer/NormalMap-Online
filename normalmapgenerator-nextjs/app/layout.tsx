import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// SEO优化的Metadata
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://normalmapgenerator.io";
const siteName = "NormalMapGenerator.io";
const siteDescription = "Free online normal map generator. Create high-quality normal maps, displacement maps, AO maps & specular maps from textures. GPU-powered, privacy-first (no upload). Best for Unity, Unreal, Blender & Game Dev.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - Free Online Normal Map Generator for Unity & Unreal`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  authors: [{ name: "NormalMapGenerator.io Team" }],
  creator: "NormalMapGenerator.io",
  publisher: "NormalMapGenerator.io",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: `${siteName} - Create Normal Maps Online Free`,
    description: siteDescription,
    siteName: siteName,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} - Create Normal Maps Online Free`,
    description: siteDescription,
    images: [`${siteUrl}/twitter-card.png`],
    creator: "@NormalMapGen",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",

};

// 结构化数据 (JSON-LD)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteName,
  url: siteUrl,
  applicationCategory: "DesignApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description: siteDescription,
  featureList: [
    "Normal Map Generation",
    "Displacement Map Creation",
    "Ambient Occlusion Maps",
    "Specular Maps",
    "Batch Processing",
    "Photo-based Normal Maps",
    "Real-time 3D Preview",
    "No Upload Required",
  ],
  screenshot: `${siteUrl}/screenshot.png`,
  softwareVersion: "2.0",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1250",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-white min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        {/* 渐变背景网格 */}
        <div className="gradient-mesh fixed inset-0 z-0 pointer-events-none" aria-hidden="true" />

        <Header />

        {/* 主要内容 */}
        <div className="relative z-10 flex-1 pt-16">
          {children}
        </div>

        <Footer />

        {/* Google Analytics (如果配置了) */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
