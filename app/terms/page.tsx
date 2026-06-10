import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata = {
  title: "Terms of Service | Vyrlo",
  description: "Vyrlo Terms of Service and API usage guidelines.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg text-foreground flex flex-col font-sans selection:bg-surface-mid overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full relative pt-32 pb-24">
        <section className="px-6 max-w-3xl mx-auto relative z-10">
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Terms of Service</h1>
            <p className="text-muted">Last Updated: June 2026</p>
          </div>

          <div className="prose prose-invert max-w-none text-muted prose-h2:text-foreground prose-h2:mt-12 prose-h2:mb-4 prose-h2:font-bold prose-h2:text-2xl prose-p:leading-relaxed prose-li:leading-relaxed">
            <p>Welcome to Vyrlo. By accessing or using our platform, you agree to be bound by these Terms of Service. Vyrlo is a creator analytics intelligence platform founded in 2026 by Emuesiri Onovwiona (SIRITECH).</p>

            <h2>1. Acceptable Use & Public Data</h2>
            <p>Vyrlo operates by tracking publicly available data across social media platforms (Instagram, TikTok, Twitter/X, and Facebook). By connecting an account to Vyrlo, you acknowledge that:</p>
            <ul>
              <li>We do not require your passwords, OAuth tokens, or administrative access to your social media accounts.</li>
              <li>You may only track accounts that are public. We do not support scraping or accessing private accounts, locked profiles, or paywalled content.</li>
              <li>You are responsible for ensuring your usage of Vyrlo complies with your local laws regarding data analysis and competitor tracking.</li>
            </ul>

            <h2>2. API Limitations and Scraping Mechanisms</h2>
            <p>We rely on official APIs and third-party aggregation tools (such as RapidAPI) to retrieve profile statistics. We employ robust rate-limiting and strictly adhere to platform fair-use policies and robots.txt directives to prevent platform abuse. Vyrlo does not operate botnets or engage in aggressive automated scraping that degrades the performance of target networks.</p>

            <h2>3. AI Processing & Content Generation</h2>
            <p>Vyrlo utilizes Google's Gemini AI to analyze your historical post data and generate content ideas. By using the AI insight features:</p>
            <ul>
              <li>You agree that your anonymized, aggregated performance metrics (e.g., "Post received 10k likes") may be sent via API to Google for processing.</li>
              <li>We do not permit the AI to generate deepfakes, restricted content, or malicious automation scripts.</li>
            </ul>

            <h2>4. Data Ownership & Deletion</h2>
            <p>You retain full ownership of any content you create. You may request the deletion of your Vyrlo account at any time, which will permanently purge all cached statistical snapshots, AI reports, and competitor tracking data associated with your account from our PostgreSQL databases.</p>

            <h2>5. Service Availability</h2>
            <p>While we strive for 99.9% uptime, Vyrlo's functionality depends on the stability of external social media platforms. If a platform significantly changes its public visibility or API rules, Vyrlo's tracking for that specific platform may be temporarily or permanently disrupted.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
