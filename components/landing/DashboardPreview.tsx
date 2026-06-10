"use client"

import React from "react"
import { BarChart3, Users, Heart, Target, LayoutDashboard, Search, Settings, Home, Activity } from "lucide-react"

export function DashboardPreview() {
  return (
    <div className="w-full h-full bg-bg text-foreground flex flex-col font-sans overflow-hidden text-left relative">
      {/* Top Navbar */}
      <div className="h-14 border-b border-surface-mid flex items-center justify-between px-6 bg-bg/80 backdrop-blur z-10">
        <div className="font-bold text-lg tracking-tight">Vyrlo</div>
        <div className="flex items-center gap-4">
          <div className="w-64 h-8 bg-surface rounded-md border border-surface-mid flex items-center px-3 text-muted">
            <Search className="w-4 h-4 mr-2" />
            <span className="text-xs">Search metrics...</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-mid/30" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 border-r border-surface-mid bg-bg/50 hidden md:flex flex-col p-4 gap-2">
          <div className="flex items-center gap-3 px-3 py-2 bg-surface rounded-md text-sm font-medium text-foreground">
            <LayoutDashboard className="w-4 h-4" /> Overview
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted">
            <BarChart3 className="w-4 h-4" /> Analytics
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted">
            <Target className="w-4 h-4" /> Competitors
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted">
            <Activity className="w-4 h-4" /> Ideas
          </div>
          <div className="mt-auto flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted">
            <Settings className="w-4 h-4" /> Settings
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">Audience Overview</h2>
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-xl border border-surface-mid bg-surface/30">
              <div className="text-xs font-medium text-muted mb-1 flex items-center gap-2">
                <Users className="w-3 h-3" /> Total Followers
              </div>
              <div className="text-2xl font-mono font-bold">142,890</div>
              <div className="text-xs text-success mt-1">+12.5% this week</div>
            </div>
            <div className="p-4 rounded-xl border border-surface-mid bg-surface/30">
              <div className="text-xs font-medium text-muted mb-1 flex items-center gap-2">
                <Heart className="w-3 h-3" /> Avg. Engagement
              </div>
              <div className="text-2xl font-mono font-bold">4.2%</div>
              <div className="text-xs text-success mt-1">+0.8% this week</div>
            </div>
            <div className="p-4 rounded-xl border border-surface-mid bg-surface/30">
              <div className="text-xs font-medium text-muted mb-1 flex items-center gap-2">
                <Home className="w-3 h-3 text-instagram" /> Instagram Reach
              </div>
              <div className="text-2xl font-mono font-bold">890K</div>
              <div className="text-xs text-error mt-1">-2.1% this week</div>
            </div>
            <div className="p-4 rounded-xl border border-surface-mid bg-surface/30">
              <div className="text-xs font-medium text-muted mb-1 flex items-center gap-2">
                <Home className="w-3 h-3 text-tiktok" /> TikTok Views
              </div>
              <div className="text-2xl font-mono font-bold">2.4M</div>
              <div className="text-xs text-success mt-1">+45% this week</div>
            </div>
          </div>

          {/* Fake Chart Area */}
          <div className="w-full h-64 rounded-xl border border-surface-mid bg-surface/20 mb-6 p-4 flex flex-col relative overflow-hidden">
            <div className="text-sm font-medium mb-4">Follower Growth (30 Days)</div>
            {/* We draw a fake SVG line chart */}
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path 
                d="M 0 90 Q 20 80, 40 70 T 80 40 T 100 20 L 100 100 L 0 100 Z" 
                fill="currentColor" 
                className="text-info/10"
              />
              <path 
                d="M 0 90 Q 20 80, 40 70 T 80 40 T 100 20" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                className="text-info"
              />
            </svg>
            <div className="absolute inset-x-0 bottom-0 h-px bg-surface-mid" />
            <div className="absolute inset-y-0 left-0 w-px bg-surface-mid" />
          </div>

          {/* Bottom Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-surface-mid bg-surface/30">
              <div className="text-sm font-medium mb-4">Top Performing Post</div>
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-surface-mid/30 rounded-md" />
                <div>
                  <div className="text-xs text-instagram font-medium mb-1">Instagram Reel</div>
                  <div className="text-sm font-medium">"5 rules for modern web design..."</div>
                  <div className="text-xs text-muted mt-2">124K Views • 14K Likes</div>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-xl border border-surface-mid bg-surface/30">
              <div className="text-sm font-medium mb-4">AI Insight</div>
              <div className="text-sm text-muted leading-relaxed">
                Your audience heavily engages with tutorials under 60 seconds. Consider creating a 3-part micro-series about your design process to capitalize on this trend.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
