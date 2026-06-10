import { auth } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Vyrlo",
  description: "Your overall creator performance at a glance.",
};
import { prisma } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PLATFORMS, CHART_COLORS } from "@/constants";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { DashboardCharts } from "@/components/dashboard/charts";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const accounts = await prisma.connectedAccount.findMany({
    where: { userId: session.user.id },
    include: {
      snapshots: {
        orderBy: { date: "desc" },
        take: 30,
      },
      posts: {
        where: { postedAt: { gte: weekAgo } },
        orderBy: { engagementRate: "desc" },
      }
    }
  });

  const totalFollowers = accounts.reduce((acc, a) => acc + a.followersCount, 0);
  const avgEngagement = accounts.length > 0 
    ? accounts.reduce((acc, a) => acc + (a.snapshots[0]?.engagementRate || 0), 0) / accounts.length 
    : 0;

  const totalPostsThisWeek = accounts.reduce((acc, a) => acc + a.posts.length, 0);
  
  let fastestGrowing = "N/A";
  let highestGrowthRate = -1;
  
  accounts.forEach(acc => {
    if (acc.snapshots.length >= 2) {
      const current = acc.snapshots[0].followersCount;
      const previous = acc.snapshots[acc.snapshots.length - 1].followersCount;
      const growthRate = previous > 0 ? (current - previous) / previous : 0;
      if (growthRate > highestGrowthRate) {
        highestGrowthRate = growthRate;
        fastestGrowing = acc.platform;
      }
    }
  });

  // Prepare chart data
  // Combine snapshots by date across all accounts
  const chartDataMap = new Map<string, any>();
  accounts.forEach(account => {
    account.snapshots.forEach(snap => {
      const dateStr = snap.date.toISOString().split("T")[0];
      if (!chartDataMap.has(dateStr)) {
        chartDataMap.set(dateStr, { date: dateStr });
      }
      const existing = chartDataMap.get(dateStr);
      existing[account.platform] = snap.engagementRate * 100; // Store as percentage
    });
  });
  
  const chartData = Array.from(chartDataMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <div className="flex gap-4">
          <Link href="/settings">
            <Button variant="outline">Add Account</Button>
          </Link>
          <Link href="/content-ideas">
            <Button>Generate Ideas</Button>
          </Link>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted">Total Followers</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-mono text-foreground">{totalFollowers.toLocaleString()}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted">Avg Engagement Rate</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-mono text-foreground">{(avgEngagement * 100).toFixed(2)}%</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted">Posts This Week</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-mono text-foreground">{totalPostsThisWeek}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted">Fastest Growing</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-mono text-green-500">{fastestGrowing}</div></CardContent>
        </Card>
      </div>

      {/* Connected Platforms Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {accounts.map(account => {
          const platformConf = PLATFORMS.find(p => p.id === account.platform);
          return (
            <Card key={account.id} className="overflow-hidden">
              <div className="p-4 flex items-center gap-4">
                {account.avatarUrl ? (
                  <img src={account.avatarUrl} alt="avatar" className="w-12 h-12 rounded-full" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-surface-mid" />
                )}
                <div>
                  <div className="font-semibold text-foreground flex items-center gap-2">
                    {platformConf && <platformConf.icon className="w-4 h-4" style={{color: platformConf.color}} />}
                    {account.handle}
                  </div>
                  <div className="text-sm text-muted font-mono">{account.followersCount.toLocaleString()} followers</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cross-platform Engagement Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardCharts data={chartData} platforms={accounts.map(a => a.platform)} />
        </CardContent>
      </Card>

      {/* Top Posts */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-foreground">Top Performing Posts This Week</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accounts.map(account => {
            const topPost = account.posts[0];
            if (!topPost) return null;
            return (
              <Card key={topPost.id}>
                <CardHeader>
                  <CardTitle className="text-sm text-muted">{account.platform} - {account.handle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm line-clamp-3 text-foreground">{topPost.caption || "No caption"}</p>
                  <div className="grid grid-cols-2 gap-2 font-mono text-sm text-muted">
                    <div>Likes: {topPost.likesCount.toLocaleString()}</div>
                    <div>Comments: {topPost.commentsCount.toLocaleString()}</div>
                    <div className="col-span-2 text-accent">ER: {(topPost.engagementRate * 100).toFixed(2)}%</div>
                  </div>
                  <Link href={topPost.url || "#"} target="_blank">
                    <Button variant="outline" className="w-full mt-2">View Post</Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  );
}
