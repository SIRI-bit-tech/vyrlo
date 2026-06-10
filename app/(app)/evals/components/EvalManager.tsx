"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getEvalColor } from "@/lib/utils";

export function EvalManager({ initialEvals }: { initialEvals: any[] }) {
  const [evals] = useState<any[]>(initialEvals);

  const avgScore = evals.length > 0 
    ? evals.reduce((acc, ev) => acc + ev.score, 0) / evals.length 
    : 0;

  return (
    <div className="space-y-8">
      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted">Total Ideas Evaluated</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-mono text-foreground">{evals.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted">Average Idea Score</CardTitle></CardHeader>
          <CardContent>
            <div 
              className="text-2xl font-mono"
              style={{ color: getEvalColor(avgScore) }}
            >
              {Math.round(avgScore * 100)} / 100
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Eval Table */}
      <Card>
        <CardHeader><CardTitle>Evaluation History</CardTitle></CardHeader>
        <CardContent>
          {evals.length === 0 ? (
             <div className="py-12 text-center text-muted">
               Generate content ideas and click "Evaluate" to see them here.
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-muted border-b border-surface-mid">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Idea Title</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4">Feedback Summary</th>
                  </tr>
                </thead>
                <tbody className="text-foreground divide-y divide-surface-mid">
                  {evals.map(ev => (
                    <tr key={ev.id} className="hover:bg-surface/50">
                      <td className="py-3 px-4 whitespace-nowrap">{new Date(ev.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-medium">{ev.contentIdea.title}</td>
                      <td className="py-3 px-4">
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-bold text-bg"
                          style={{ backgroundColor: getEvalColor(ev.score) }}
                        >
                          {Math.round(ev.score * 100)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted line-clamp-2 max-w-md">{ev.feedback}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
