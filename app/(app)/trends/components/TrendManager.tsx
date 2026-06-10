"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CHART_COLORS, COLORS } from "@/constants";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export function TrendManager({ initialTrends, niche }: { initialTrends: any[], niche: string }) {
  if (initialTrends.length === 0) {
    return (
      <div className="py-12 text-center text-muted border border-dashed border-surface-mid rounded-xl">
        No trends found for "{niche || "your niche"}". Check back later!
      </div>
    );
  }

  const chartData = initialTrends.slice(0, 5).map(t => ({
    name: t.title.substring(0, 15) + "...",
    signal: t.engagementSignal
  }));

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader><CardTitle>Trend Velocity in {niche || "Your Niche"}</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.surfaceMid} />
                <XAxis type="number" stroke={CHART_COLORS.muted} />
                <YAxis dataKey="name" type="category" stroke={CHART_COLORS.muted} width={150} />
                <Tooltip contentStyle={{ backgroundColor: COLORS.surface, border: "none" }} />
                <Bar dataKey="signal" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialTrends.map(trend => (
          <Card key={trend.id}>
            <CardHeader>
              <CardTitle className="text-lg">{trend.title}</CardTitle>
              <CardDescription>{trend.platform}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-muted">{trend.description}</p>
              {trend.exampleUrl && (
                <Link href={trend.exampleUrl} target="_blank" className="flex items-center gap-2 text-accent hover:underline">
                  <ExternalLink className="w-4 h-4" />
                  View Example
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
