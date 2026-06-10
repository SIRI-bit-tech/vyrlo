import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata = {
  title: "Privacy Policy | Vyrlo",
  description: "Learn how Vyrlo handles your data, analytics, and AI processing.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg text-foreground flex flex-col font-sans selection:bg-surface-mid overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full relative pt-32 pb-24">
        <section className="px-6 max-w-3xl mx-auto relative z-10">
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Privacy Policy</h1>
            <p className="text-muted">Last Updated: June 2026</p>
          </div>

          <div className="prose prose-invert max-w-none text-muted prose-h2:text-foreground prose-h2:mt-12 prose-h2:mb-4 prose-h2:font-bold prose-h2:text-2xl prose-p:leading-relaxed prose-li:leading-relaxed">
            <p>At Vyrlo, founded in 2026 by SIRITECH, we believe in radical transparency regarding how your data is collected, processed, and utilized to fuel your creator growth.</p>

            <h2>1. Information We Collect</h2>
            <p>Vyrlo operates as an intelligence layer on top of publicly available data. We collect two types of information:</p>
            <ul>
              <li><strong>Account Information:</strong> When you register for Vyrlo, we collect your email address, name, and billing information (handled securely via Stripe).</li>
              <li><strong>Public Social Data:</strong> We track the public metrics of the social media accounts you explicitly connect or add as competitors. This includes follower counts, post engagement (likes, views, comments), and post captions.</li>
            </ul>

            <h2>2. What We Do Not Collect</h2>
            <p>We are firmly committed to user privacy. We explicitly <strong>do not</strong>:</p>
            <ul>
              <li>Extract, store, or sell the Personally Identifiable Information (PII) of your audience or followers.</li>
              <li>Access private messages (DMs), unlisted posts, or any data hidden behind an authentication wall.</li>
              <li>Require your social media passwords.</li>
            </ul>

            <h2>3. AI Processing and Third Parties</h2>
            <p>To provide you with AI-powered content ideas and performance reports, Vyrlo integrates with Google's Gemini API.</p>
            <ul>
              <li><strong>Data Sharing:</strong> Only aggregate metrics and text (such as your past captions and engagement numbers) are sent to Gemini for contextual analysis.</li>
              <li><strong>Model Training:</strong> We have strictly configured our enterprise AI integrations such that your specific data is <strong>never</strong> used to train Google's global foundation models without your explicit consent. Your data remains siloed to your requests.</li>
            </ul>

            <h2>4. Cookies and Tracking</h2>
            <p>We use essential cookies to keep you logged in and functional cookies to remember your theme preferences. We do not use intrusive third-party advertising trackers on the Vyrlo dashboard.</p>

            <h2>5. Your Rights</h2>
            <p>You have the right to access the data we have stored about you, request corrections, or demand complete deletion. If you delete your Vyrlo account, all associated tracking jobs in our Redis queues and analytical snapshots in our PostgreSQL database are permanently erased.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
