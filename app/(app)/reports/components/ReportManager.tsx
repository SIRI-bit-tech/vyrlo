"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReportPeriod } from "@prisma/client";

export function ReportManager({ initialReports }: { initialReports: any[] }) {
  const [reports, setReports] = useState<any[]>(initialReports);
  const [loading, setLoading] = useState(false);

  const generateReport = async (period: ReportPeriod) => {
    setLoading(true);
    try {
      const res = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period })
      });
      if (res.ok) {
        alert("Report generation queued. It will appear here shortly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        <Button onClick={() => generateReport("WEEKLY")} disabled={loading}>Generate Weekly Report</Button>
        <Button onClick={() => generateReport("MONTHLY")} variant="outline" disabled={loading}>Generate Monthly Report</Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {reports.length === 0 && (
          <div className="py-12 text-center text-muted border border-dashed border-surface-mid rounded-xl">
            No reports generated yet.
          </div>
        )}
        {reports.map((report) => {
          let content;
          try {
            content = JSON.parse(report.content);
          } catch (e) {
            content = { overview: "Error parsing report content." };
          }

          return (
            <Card key={report.id}>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>{report.period} Report • {new Date(report.createdAt).toLocaleDateString()}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Export PDF</Button>
                  <Button variant="outline" size="sm">Export JSON</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Overview</h3>
                  <p className="text-muted text-sm">{content.overview}</p>
                </div>
                
                {content.platformBreakdowns && (
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Platform Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {content.platformBreakdowns.map((p: any, idx: number) => (
                        <div key={idx} className="bg-surface-mid/20 p-3 rounded-md">
                          <strong className="text-foreground">{p.platform}</strong>
                          <p className="text-sm text-muted mt-1">{p.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {content.growthInsights && (
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Growth Insights</h3>
                    <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                      {content.growthInsights.map((insight: string, idx: number) => (
                        <li key={idx}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
