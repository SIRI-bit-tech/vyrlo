import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vyrlo — The Intelligence Layer for Serious Creators",
  description: "Vyrlo is a multi-platform creator analytics SaaS. Track growth, analyze engagement, and get AI-powered content ideas across Instagram, TikTok, Twitter, and Facebook — all in one dashboard.",
  keywords: [
    "creator analytics platform",
    "social media analytics for creators",
    "multi-platform creator dashboard",
    "Instagram analytics tool",
    "TikTok analytics dashboard",
    "content performance tracker",
    "social media growth tracker",
    "AI content ideas for creators",
    "creator intelligence platform",
    "content strategy tool for creators",
  ],
  openGraph: {
    title: "Vyrlo — Creator Analytics & AI Content Intelligence",
    description: "Track your growth across every platform. Get AI-powered content ideas based on what's actually working for you.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Vyrlo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vyrlo — Creator Analytics & AI Content Intelligence",
    description: "Multi-platform analytics and AI content intelligence for serious creators.",
  },
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
        <Toaster theme="dark" position="top-center" />
      </body>
    </html>
  );
}
