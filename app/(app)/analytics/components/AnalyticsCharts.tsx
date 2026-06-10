"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter, ZAxis } from "recharts";
import { CHART_COLORS, COLORS } from "@/constants";

export function AnalyticsCharts({ accounts }: { accounts: any[] }) {
  const [activeTab, setActiveTab] = useState<"growth" | "posts" | "formats" | "heatmap">("growth");

  if (!accounts || accounts.length === 0) {
    return <div className="p-8 text-center text-muted">No analytics data available.</div>;
  }

  // Aggregate data for growth chart
  const growthDataMap = new Map<string, any>();
  accounts.forEach(acc => {
    acc.snapshots.forEach((snap: any) => {
      const dateStr = new Date(snap.date).toLocaleDateString();
      if (!growthDataMap.has(dateStr)) {
        growthDataMap.set(dateStr, { date: dateStr, totalFollowers: 0 });
      }
      growthDataMap.get(dateStr).totalFollowers += snap.followersCount;
    });
  });
  const growthData = Array.from(growthDataMap.values());

  // Aggregate formats
  const formatCounts: Record<string, number> = {};
  const posts: any[] = [];
  accounts.forEach(acc => {
    acc.posts.forEach((post: any) => {
      posts.push({ ...post, platform: acc.platform, handle: acc.handle });
      formatCounts[post.type] = (formatCounts[post.type] || 0) + 1;
    });
  });
  const formatData = Object.entries(formatCounts).map(([type, count]) => ({ type, count }));

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-surface-mid pb-2 overflow-x-auto">
        {(["growth", "posts", "formats"] as const).map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`capitalize pb-2 border-b-2 px-1 text-sm font-medium ${
              activeTab === tab ? "border-foreground text-foreground" : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "growth" && (
        <Card>
          <CardHeader><CardTitle>Follower Growth</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.surfaceMid} />
                  <XAxis dataKey="date" stroke={CHART_COLORS.muted} />
                  <YAxis stroke={CHART_COLORS.muted} />
                  <Tooltip contentStyle={{ backgroundColor: COLORS.surface, border: "none" }} />
                  <Area type="monotone" dataKey="totalFollowers" stroke={CHART_COLORS.primary} fill={CHART_COLORS.primary} fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "formats" && (
        <Card>
          <CardHeader><CardTitle>Content Type Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formatData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.surfaceMid} />
                  <XAxis dataKey="type" stroke={CHART_COLORS.muted} />
                  <YAxis stroke={CHART_COLORS.muted} />
                  <Tooltip contentStyle={{ backgroundColor: COLORS.surface, border: "none" }} />
                  <Bar dataKey="count" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "posts" && (
        <Card>
          <CardHeader><CardTitle>Post Performance</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-muted border-b border-surface-mid">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Platform</th>
                    <th className="py-3 px-4">Format</th>
                    <th className="py-3 px-4">Likes</th>
                    <th className="py-3 px-4">Comments</th>
                    <th className="py-3 px-4 text-right">Engagement Rate</th>
                  </tr>
                </thead>
                <tbody className="text-foreground divide-y divide-surface-mid">
                  {posts.slice(0, 20).map(post => (
                    <tr key={post.id} className="hover:bg-surface/50">
                      <td className="py-3 px-4">{new Date(post.postedAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{post.platform}</td>
                      <td className="py-3 px-4">{post.type}</td>
                      <td className="py-3 px-4">{post.likesCount.toLocaleString()}</td>
                      <td className="py-3 px-4">{post.commentsCount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-accent">{(post.engagementRate * 100).toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
