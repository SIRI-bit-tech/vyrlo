"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Platform } from "@prisma/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CHART_COLORS, COLORS } from "@/constants";

export function CompetitorManager({ initialCompetitors, ownAccounts }: { initialCompetitors: any[], ownAccounts: any[] }) {
  const [competitors, setCompetitors] = useState<any[]>(initialCompetitors);
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState<Platform>(Platform.INSTAGRAM);
  const [handle, setHandle] = useState("");

  const addCompetitor = async () => {
    if (!handle) return;
    setLoading(true);
    try {
      const res = await fetch("/api/competitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, handle })
      });
      if (res.ok) {
        const { data } = await res.json();
        // Just reload page to get full nested data for now
        window.location.reload();
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const removeCompetitor = async (id: string) => {
    if (!confirm("Remove competitor?")) return;
    await fetch(`/api/competitors/${id}`, { method: "DELETE" });
    setCompetitors(competitors.filter(c => c.id !== id));
  };

  // Prepare comparison data (Current follower counts)
  const comparisonData: Array<{ name: string; followers: number; fill: string }> = competitors.map(c => ({
    name: c.handle,
    followers: c.followersCount,
    fill: COLORS.surfaceMid
  }));
  
  // Add own account of matching platform if exists
  const matchingOwn = ownAccounts.find(a => a.platform === platform);
  if (matchingOwn) {
    comparisonData.unshift({
      name: `(You) ${matchingOwn.handle}`,
      followers: matchingOwn.followersCount,
      fill: CHART_COLORS.primary
    });
  }

  return (
    <div className="space-y-8">
      {/* Add Competitor */}
      <Card>
        <CardHeader><CardTitle>Add Competitor</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <select 
              className="bg-bg text-foreground border border-surface-mid rounded-md p-2"
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
            >
              {Object.values(Platform).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <Input 
              placeholder="@handle" 
              value={handle} 
              onChange={e => setHandle(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={addCompetitor} disabled={loading || !handle}>
              {loading ? "Adding..." : "Track Competitor"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Chart */}
      {comparisonData.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Follower Comparison</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.surfaceMid} />
                  <XAxis dataKey="name" stroke={CHART_COLORS.muted} />
                  <YAxis stroke={CHART_COLORS.muted} />
                  <Tooltip contentStyle={{ backgroundColor: COLORS.surface, border: "none" }} />
                  <Bar dataKey="followers" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Competitor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitors.map(comp => (
          <Card key={comp.id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                {comp.avatarUrl ? (
                  <img src={comp.avatarUrl} alt="avatar" className="w-12 h-12 rounded-full" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-surface-mid" />
                )}
                <div>
                  <div className="font-bold text-foreground">{comp.handle}</div>
                  <div className="text-sm text-muted">{comp.platform}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted mb-4">
                <div>Followers: <span className="text-foreground">{comp.followersCount.toLocaleString()}</span></div>
                <div>Avg ER: <span className="text-accent">{comp.snapshots[0] ? (comp.snapshots[0].engagementRate * 100).toFixed(2) : "0"}%</span></div>
              </div>
              <Button variant="outline" size="sm" className="w-full text-red-500 hover:text-red-600" onClick={() => removeCompetitor(comp.id)}>
                Remove Tracking
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
