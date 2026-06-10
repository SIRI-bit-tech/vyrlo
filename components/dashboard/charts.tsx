"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PLATFORMS, CHART_COLORS, COLORS } from "@/constants";

export function DashboardCharts({ data, platforms }: { data: Record<string, unknown>[]; platforms: string[] }) {
  if (data.length === 0) {
    return <div className="h-[300px] flex items-center justify-center text-muted">No data available yet.</div>;
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.secondary} opacity={0.5} />
          <XAxis dataKey="date" stroke={CHART_COLORS.muted} tick={{ fill: CHART_COLORS.muted }} />
          <YAxis stroke={CHART_COLORS.muted} tick={{ fill: CHART_COLORS.muted }} />
          <Tooltip 
            contentStyle={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceMid}`, borderRadius: "8px" }}
            itemStyle={{ color: COLORS.foreground }}
          />
          {platforms.map((platform) => {
            const platformConf = PLATFORMS.find(p => p.id === platform);
            return (
              <Line 
                key={platform} 
                type="monotone" 
                dataKey={platform} 
                stroke={platformConf?.color || CHART_COLORS.primary} 
                strokeWidth={2}
                dot={false}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
