"use client";

import React from "react";
import Link from "next/link";
import { Activity } from "lucide-react";

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

export function Footer() {
  return (
    <footer className="border-t border-surface-mid py-12 px-6 md:px-16 mt-auto bg-bg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-12">
        {/* Brand */}
        <div className="flex flex-col gap-2">
          <Link href="/" className="text-xl font-bold text-foreground">Vyrlo</Link>
          <p className="text-sm text-muted">The intelligence layer for serious creators.</p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-foreground text-sm">Product</span>
            <Link href="/#features" className="text-sm text-muted hover:text-foreground">Features</Link>
            <Link href="/#how-it-works" className="text-sm text-muted hover:text-foreground">How It Works</Link>
            <Link href="/#platforms" className="text-sm text-muted hover:text-foreground">Platforms</Link>
            <Link href="/#faq" className="text-sm text-muted hover:text-foreground">FAQ</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-foreground text-sm">Account</span>
            <Link href="/login" className="text-sm text-muted hover:text-foreground">Login</Link>
            <Link href="/register" className="text-sm text-muted hover:text-foreground">Get Started</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-foreground text-sm">Legal</span>
            <Link href="/privacy" className="text-sm text-muted hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-muted hover:text-foreground">Terms of Service</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-foreground text-sm">Company</span>
            <Link href="/about" className="text-sm text-muted hover:text-foreground">About</Link>
            <Link href="/contact" className="text-sm text-muted hover:text-foreground">Contact</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-surface-mid">
        <p className="text-sm text-muted">© {new Date().getFullYear()} Vyrlo Inc. All rights reserved.</p>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <a href="#" className="text-muted hover:text-foreground transition-colors"><TwitterIcon className="w-5 h-5" /></a>
          <a href="#" className="text-muted hover:text-foreground transition-colors"><Activity className="w-5 h-5" /></a>
        </div>
      </div>
    </footer>
  );
}
