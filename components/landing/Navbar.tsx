"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/80 backdrop-blur-md border-b border-surface-mid">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold font-sans text-foreground">
          Vyrlo
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="text-sm text-muted hover:text-foreground transition-colors">Features</Link>
          <Link href="/#how-it-works" className="text-sm text-muted hover:text-foreground transition-colors">How It Works</Link>
          <Link href="/#platforms" className="text-sm text-muted hover:text-foreground transition-colors">Platforms</Link>
          <Link href="/#faq" className="text-sm text-muted hover:text-foreground transition-colors">FAQ</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
            Login
          </Link>
          <Link href="/register">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              className="bg-foreground text-bg px-5 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-subtle"
            >
              Get Started
            </motion.button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-bg border-b border-surface-mid p-6 flex flex-col gap-6 shadow-2xl">
          <Link href="/#features" onClick={() => setMobileMenuOpen(false)} className="text-lg text-muted hover:text-foreground transition-colors">Features</Link>
          <Link href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-lg text-muted hover:text-foreground transition-colors">How It Works</Link>
          <Link href="/#platforms" onClick={() => setMobileMenuOpen(false)} className="text-lg text-muted hover:text-foreground transition-colors">Platforms</Link>
          <Link href="/#faq" onClick={() => setMobileMenuOpen(false)} className="text-lg text-muted hover:text-foreground transition-colors">FAQ</Link>
          <div className="h-px bg-surface-mid w-full" />
          <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-muted hover:text-foreground transition-colors">Login</Link>
          <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
            <button className="w-full bg-foreground text-bg px-5 py-3 rounded-full text-lg font-semibold">Get Started</button>
          </Link>
        </div>
      )}
    </nav>
  );
}
