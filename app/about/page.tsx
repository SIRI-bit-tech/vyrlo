import React from "react";
import Image from "next/image";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

// SEO Metadata
export const metadata = {
  title: "About Vyrlo | The Intelligence Layer for Serious Creators",
  description: "Learn about Vyrlo, founded in 2026 by Emuesiri Onovwiona (SIRITECH). We are building the ultimate cross-platform analytics and AI growth engine for creators.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg text-foreground flex flex-col font-sans selection:bg-surface-mid overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full relative pt-32 pb-24">
        {/* Subtle radial gradient background */}
        <div className="absolute top-0 left-0 right-0 h-screen pointer-events-none" style={{ background: "radial-gradient(ellipse at center top, #353536 0%, #080808 60%)", opacity: 0.3 }} />

        {/* Hero Section */}
        <section className="px-6 max-w-4xl mx-auto text-center mb-24 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            The story behind <span className="text-muted">Vyrlo.</span>
          </h1>
          <p className="text-lg text-muted max-w-[700px] mx-auto leading-relaxed">
            We believe that creators are the next generation of global businesses. Our mission is to give you the enterprise-grade intelligence you need to grow, outpace competitors, and own your audience.
          </p>
        </section>

        {/* Zig-Zag Content Section */}
        <section className="px-6 md:px-16 max-w-6xl mx-auto flex flex-col gap-32 relative z-10">
          
          {/* Block 1: Image Left, Text Right */}
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="flex-1 w-full rounded-2xl overflow-hidden border border-surface-mid shadow-[0_0_80px_rgba(255,255,255,0.03)] bg-surface aspect-[4/3] relative">
              <Image 
                src="/images/about-1.png" 
                alt="Abstract visualization of Vyrlo data analytics"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <p className="text-xs text-muted font-semibold tracking-widest uppercase">The Beginning</p>
              <h2 className="text-3xl font-bold text-foreground">
                Founded in 2026 by SIRITECH.
              </h2>
              <div className="text-muted leading-relaxed space-y-4">
                <p>
                  Vyrlo was founded in 2026 by <strong>Emuesiri Onovwiona</strong>, widely known in the tech community as <strong>SIRITECH</strong>. 
                </p>
                <p>
                  As the creator economy exploded, a glaring problem emerged: creators were operating in the dark. They had to juggle four different apps just to check their daily analytics, guess which content trends were actually working, and manually track their competitors' moves.
                </p>
                <p>
                  There was no central nervous system for a creator's digital footprint. Emuesiri realized that what creators needed wasn't just another dashboard, but an intelligence layer that actually told them what their data meant.
                </p>
              </div>
            </div>
          </div>

          {/* Block 2: Text Left, Image Right */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20">
            <div className="flex-1 w-full rounded-2xl overflow-hidden border border-surface-mid shadow-[0_0_80px_rgba(255,255,255,0.03)] bg-surface aspect-[4/3] relative">
              <Image 
                src="/images/about-2.png" 
                alt="Abstract representation of creator growth and upward trajectory"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <p className="text-xs text-muted font-semibold tracking-widest uppercase">Our Mission</p>
              <h2 className="text-3xl font-bold text-foreground">
                Bringing AI intelligence to growth.
              </h2>
              <div className="text-muted leading-relaxed space-y-4">
                <p>
                  Today, Vyrlo uses cutting-edge AI (powered by Google Gemini) to do the heavy lifting. We don't just show you a chart of your followers — we analyze your engagement velocity, track your niche competitors, and generate specific, actionable content ideas tailored perfectly to your audience.
                </p>
                <p>
                  Our architecture is built for scale, silently processing millions of data points across Instagram, TikTok, Twitter, and Facebook so you can focus on what you do best: creating.
                </p>
                <p>
                  Whether you have ten thousand followers or ten million, Vyrlo is the unfair advantage you need to scale your personal monopoly.
                </p>
              </div>
            </div>
          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}
