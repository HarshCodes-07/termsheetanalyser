import type { Metadata, Viewport } from "next";
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

const SITE_NAME = "Termsheet Analyser";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://termsheet-analyser.vercel.app";
const SITE_TITLE = "Termsheet Analyser — understand before you sign";
const SITE_DESCRIPTION =
  "AI-powered termsheet analyser for founders. Get red flags, green flags, a safety score, and negotiation notes in plain english — before you sign.";
const OG_IMAGE = "/banner.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · Termsheet Analyser",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  keywords: [
    "termsheet analyser",
    "term sheet analyzer",
    "VC term sheet",
    "startup termsheet review",
    "founder tools",
    "venture capital",
    "SAFE note analysis",
    "investor negotiation",
    "liquidation preference",
    "cap table",
    "equity dilution",
    "fundraising",
    "seed round",
    "Series A termsheet",
    "AI termsheet review",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1536,
        height: 1024,
        alt: "Termsheet Analyser — understand before you sign",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        alt: "Termsheet Analyser — understand before you sign",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.jpeg", type: "image/jpeg", sizes: "1024x1024" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/logo.jpeg", sizes: "1024x1024", type: "image/jpeg" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#ea5b0c" },
  ],
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-grid-warm">{children}</body>
    </html>
  );
}
