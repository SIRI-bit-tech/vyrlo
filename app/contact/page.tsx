import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Mail, MessageSquare, MapPin } from "lucide-react";

export const metadata = {
  title: "Contact Us | Vyrlo",
  description: "Get in touch with the Vyrlo team for support, business inquiries, or general questions.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bg text-foreground flex flex-col font-sans selection:bg-surface-mid overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full relative pt-32 pb-24">
        <div className="absolute top-0 left-0 right-0 h-screen pointer-events-none" style={{ background: "radial-gradient(ellipse at center top, #353536 0%, #080808 60%)", opacity: 0.3 }} />

        <section className="px-6 max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Get in touch.
            </h1>
            <p className="text-lg text-muted max-w-[500px] mx-auto">
              Have a question about Vyrlo, need support, or want to discuss an enterprise plan? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-surface border border-surface-mid rounded-2xl p-8 flex flex-col items-center text-center">
              <div className="bg-[#1a1a1a] rounded-full p-4 mb-6">
                <Mail className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Email Us</h3>
              <p className="text-sm text-muted mb-4">For general inquiries and support.</p>
              <a href="mailto:hello@vyrlo.co" className="text-sm font-semibold hover:text-muted transition-colors">hello@vyrlo.co</a>
            </div>

            <div className="bg-surface border border-surface-mid rounded-2xl p-8 flex flex-col items-center text-center">
              <div className="bg-[#1a1a1a] rounded-full p-4 mb-6">
                <MessageSquare className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Enterprise</h3>
              <p className="text-sm text-muted mb-4">Looking for custom API integrations?</p>
              <a href="mailto:enterprise@vyrlo.co" className="text-sm font-semibold hover:text-muted transition-colors">enterprise@vyrlo.co</a>
            </div>

            <div className="bg-surface border border-surface-mid rounded-2xl p-8 flex flex-col items-center text-center">
              <div className="bg-[#1a1a1a] rounded-full p-4 mb-6">
                <MapPin className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="font-bold text-foreground mb-2">HQ</h3>
              <p className="text-sm text-muted">Founded by SIRITECH<br/>Remote First</p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto bg-surface border border-surface-mid rounded-2xl p-8 md:p-12">
            <form className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-semibold text-foreground">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    placeholder="Jane Doe" 
                    className="bg-bg border border-surface-mid rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-semibold text-foreground">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="jane@example.com" 
                    className="bg-bg border border-surface-mid rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-sm font-semibold text-foreground">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  placeholder="How can we help?" 
                  className="bg-bg border border-surface-mid rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-semibold text-foreground">Message</label>
                <textarea 
                  id="message" 
                  rows={6}
                  placeholder="Tell us a little more..." 
                  className="bg-bg border border-surface-mid rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors resize-none"
                />
              </div>

              <button 
                type="button" 
                className="bg-foreground text-bg font-semibold rounded-lg px-6 py-4 mt-2 transition-colors hover:bg-subtle"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
