"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, BarChart2, Sparkles, Crosshair, 
  TrendingUp, Flame, FileText, Menu,
  Link2, Target, LayoutDashboard, Activity
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PLATFORM_COLORS, STATUS_COLORS } from "@/constants";

// Helper components for Icons if needed (Lucide doesn't have a perfect TikTok icon)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

export default function LandingPage() {
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-bg text-foreground flex flex-col font-sans selection:bg-surface-mid overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full relative">
        {/* Subtle radial gradient background behind Hero */}
        <div className="absolute top-0 left-0 right-0 h-screen pointer-events-none" style={{ background: "radial-gradient(ellipse at center top, #353536 0%, #080808 60%)", opacity: 0.5 }} />

        {/* Section 2: Hero */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-24 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 bg-surface border border-surface-mid rounded-full px-4 py-1.5 mb-8"
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: STATUS_COLORS.success }} />
            <span className="text-xs font-medium text-foreground">Vyrlo 1.0 is now live</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-foreground max-w-4xl leading-tight mb-6"
          >
            The Intelligence Layer for <br />
            <span className="text-muted">Serious Creators.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="text-lg text-muted max-w-[600px] mb-10 leading-relaxed"
          >
            Track your growth across every platform. Get AI-powered content ideas, analyze engagement, and monitor competitors — all in one unified dashboard.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link href="/register" className="w-full sm:w-auto">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                className="w-full sm:w-auto bg-foreground text-bg font-semibold rounded-full px-8 py-4 flex items-center justify-center transition-colors hover:bg-subtle"
              >
                Start tracking for free
                <ArrowRight className="ml-2 w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="#how-it-works" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto border border-surface-mid text-muted font-semibold rounded-full px-8 py-4 transition-colors hover:border-foreground hover:text-foreground">
                See how it works
              </button>
            </Link>
          </motion.div>
        </section>

        {/* Section 3: Dashboard Preview */}
        <section className="px-6 md:px-16 pb-32 flex flex-col items-center">
          <p className="text-xs text-muted font-semibold tracking-widest uppercase mb-8">Product Preview</p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-6xl rounded-2xl border border-surface-mid bg-[#1a1a1a] shadow-[0_0_80px_rgba(255,255,255,0.04)] overflow-hidden"
          >
            {/* Browser Chrome */}
            <div className="h-12 border-b border-surface-mid bg-surface flex items-center px-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-error" />
                <div className="w-3 h-3 rounded-full bg-warning" />
                <div className="w-3 h-3 rounded-full bg-success" />
              </div>
              <div className="flex-1 max-w-md mx-auto bg-bg border border-surface-mid rounded-md h-7 flex items-center justify-center text-xs text-muted font-mono">
                app.vyrlo.co/dashboard
              </div>
              <div className="w-12" /> {/* Spacer for symmetry */}
            </div>
            {/* Inner App Preview */}
            <div className="w-full aspect-video min-h-[500px]">
              <DashboardPreview />
            </div>
          </motion.div>
        </section>

        {/* Section 4: Features */}
        <section id="features" className="py-24 px-6 md:px-16 max-w-6xl mx-auto flex flex-col items-center text-center">
          <p className="text-xs text-muted font-semibold tracking-widest uppercase mb-4">Everything You Need</p>
          <h2 className="text-4xl font-bold text-foreground max-w-[600px] mb-16">
            Built for creators who take growth seriously.
          </h2>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left"
          >
            {[
              { icon: BarChart2, title: "Cross-Platform Analytics", desc: "Consolidate your metrics from Instagram, TikTok, Twitter, and Facebook into one unified view. No more switching between four apps to check your numbers." },
              { icon: Sparkles, title: "AI-Powered Content Ideas", desc: "Gemini analyzes your top-performing posts and current niche trends to generate content ideas tailored specifically to what's already working for you — not generic advice." },
              { icon: Crosshair, title: "Competitor Intelligence", desc: "Track any public account on any platform. Monitor follower growth, engagement spikes, and top content to understand exactly what's driving their success." },
              { icon: TrendingUp, title: "Growth Tracking Over Time", desc: "Vyrlo snapshots your profile daily. See your follower velocity, engagement trends, and posting frequency over 7, 14, 30, or 90-day windows." },
              { icon: Flame, title: "Niche Trend Discovery", desc: "Stay ahead of what's gaining traction in your niche. Vyrlo surfaces emerging content angles before they peak so you can post at the right time." },
              { icon: FileText, title: "AI Performance Reports", desc: "Every week, Vyrlo emails you a Gemini-generated performance report — what worked, what didn't, and exactly what to focus on next." }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                variants={fadeUp}
                whileHover={{ scale: 1.01 }}
                className="bg-surface border border-surface-mid rounded-2xl p-6 transition-colors hover:border-[#706f70]"
              >
                <div className="bg-[#1a1a1a] rounded-xl p-2 w-10 h-10 flex items-center justify-center mb-6">
                  <feature.icon className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted leading-loose">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Section 5: How It Works */}
        <section id="how-it-works" className="py-24 px-6 md:px-16 max-w-4xl mx-auto flex flex-col items-center text-center">
          <p className="text-xs text-muted font-semibold tracking-widest uppercase mb-4">How It Works</p>
          <h2 className="text-4xl font-bold text-foreground mb-20">
            From sign-up to insights in minutes.
          </h2>

          <div className="w-full flex flex-col md:flex-row relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-12 right-12 border-t border-surface-mid -z-10" />

            {[
              { num: "1", icon: Link2, title: "Connect Your Accounts", desc: "Enter your public username for Instagram, TikTok, Twitter, or Facebook. Vyrlo confirms it's your account before saving anything." },
              { num: "2", icon: Target, title: "Tell Us About Your Goals", desc: "Answer 5 quick questions about your niche, your challenges, and what you're trying to achieve. This makes every AI suggestion specific to you." },
              { num: "3", icon: LayoutDashboard, title: "Get Your Intelligence Dashboard", desc: "Your personalized analytics dashboard is ready immediately. Growth charts, content ideas, competitor tracking, and AI reports — all live." },
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex-1 flex flex-col items-center relative px-6 pb-12 md:pb-0"
              >
                <div className="w-24 h-24 bg-bg flex items-center justify-center relative mb-6">
                  <span className="text-8xl font-bold text-surface-mid opacity-20 absolute select-none font-mono">{step.num}</span>
                  <div className="bg-surface border border-surface-mid rounded-full w-12 h-12 flex items-center justify-center relative z-10">
                    <step.icon className="w-5 h-5 text-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-sm text-muted">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 6: Platforms Supported */}
        <section id="platforms" className="py-24 px-6 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-foreground mb-12">Works across every major platform.</h2>
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl"
          >
            {[
              { name: "Instagram", icon: InstagramIcon, color: PLATFORM_COLORS.instagram },
              { name: "TikTok", icon: TikTokIcon, color: PLATFORM_COLORS.tiktok },
              { name: "Twitter / X", icon: TwitterIcon, color: PLATFORM_COLORS.twitter },
              { name: "Facebook", icon: FacebookIcon, color: PLATFORM_COLORS.facebook },
            ].map((platform, i) => (
              <motion.div 
                key={i}
                variants={fadeUp}
                className="bg-surface border border-surface-mid rounded-2xl p-6 flex flex-col items-center gap-4 transition-colors group cursor-default"
                style={{ "--hover-color": platform.color } as React.CSSProperties}
              >
                <style jsx>{`
                  .group:hover { border-color: var(--hover-color); }
                `}</style>
                <platform.icon className="w-8 h-8 text-foreground" />
                <span className="font-bold text-foreground">{platform.name}</span>
                <div className="w-6 h-1 rounded-full" style={{ backgroundColor: platform.color }} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Section 7: FAQ */}
        <section id="faq" className="py-24 px-6 max-w-2xl mx-auto w-full flex flex-col items-center text-center">
          <p className="text-xs text-muted font-semibold tracking-widest uppercase mb-4">FAQ</p>
          <h2 className="text-4xl font-bold text-foreground mb-16">Common questions.</h2>

          <Accordion type="single" collapsible className="w-full text-left">
            {[
              { q: "Do I need to give Vyrlo access to my social accounts?", a: "No. Vyrlo only tracks public account data. You enter your username and we confirm it's you — no passwords, no OAuth tokens, no permissions required." },
              { q: "Which platforms does Vyrlo support?", a: "Vyrlo currently supports Instagram, TikTok, Twitter/X, and Facebook. You can connect one or all four — it's up to you." },
              { q: "How often is my data updated?", a: "Your profile stats and post performance data are refreshed automatically every 24 hours. You can also trigger a manual refresh from your settings at any time." },
              { q: "How does the AI content idea generation work?", a: "Vyrlo feeds your last 30–90 days of post performance data to Gemini along with your niche, goals, and content challenges. Gemini analyzes what formats and topics are actually working for you and generates specific, actionable content ideas — not generic tips." },
              { q: "Is my data private?", a: "Vyrlo only stores publicly available data from your social profiles. We never store passwords, private messages, or any non-public information." },
              { q: "Can I track accounts I don't own?", a: "Yes. The Competitors feature lets you track up to 10 public accounts on any supported platform so you can benchmark against others in your niche." }
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Section 8: Final CTA */}
        <section className="py-32 w-full flex justify-center">
          <div className="bg-surface rounded-3xl mx-6 md:mx-16 p-12 md:p-24 max-w-5xl w-full flex flex-col items-center text-center border border-surface-mid">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Start growing with intelligence.
            </h2>
            <p className="text-muted max-w-[500px] mb-12 text-lg">
              Join creators who use Vyrlo to understand their audience, outpace their competitors, and post with purpose.
            </p>
            <Link href="/register">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                className="bg-foreground text-bg font-semibold rounded-full px-10 py-4 text-lg transition-colors hover:bg-subtle"
              >
                Get started for free <ArrowRight className="inline ml-2 w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
