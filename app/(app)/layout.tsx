"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDEBAR_LINKS } from "@/constants";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth/auth-client";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-surface-mid bg-surface transition-transform md:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center px-6 border-b border-surface-mid">
          <span className="text-xl font-bold text-foreground">Vyrlo</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {SIDEBAR_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-surface-mid text-foreground"
                    : "text-muted hover:bg-surface-mid/50 hover:text-foreground"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-surface-mid">
          <button
            onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/login"; } } })}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-mid/50 hover:text-foreground"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:pl-64">
        {/* Topbar for mobile */}
        <header className="flex h-16 items-center justify-between border-b border-surface-mid bg-surface px-4 md:hidden">
          <span className="text-xl font-bold text-foreground">Vyrlo</span>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 p-4 md:px-8 md:py-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
