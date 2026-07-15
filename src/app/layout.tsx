import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dejabooom.com";
const metadataBase = (() => {
  try {
    return new URL(siteUrl);
  } catch {
    return new URL("https://dejabooom.com");
  }
})();

const title = "Dejabooom | AI-Personalized Surprise Trips";
const description =
  "Discover surprise trips personalized around your budget, dates, preferences and travel style.";

export const metadata: Metadata = {
  metadataBase,
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Dejabooom",
    type: "website",
    images: [
      {
        url: "/2.svg",
        width: 1200,
        height: 630,
        alt: "Dejabooom",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/2.svg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
