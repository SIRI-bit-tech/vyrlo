"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Platform } from "@prisma/client";
import { getEvalColor } from "@/lib/utils";

export function IdeaGenerator({ accounts, initialIdeas }: { accounts: any[], initialIdeas: any[] }) {
  const [ideas, setIdeas] = React.useState<any[]>(initialIdeas);
  const [loading, setLoading] = React.useState(false);
  const [platform, setPlatform] = React.useState<Platform | "">(accounts[0]?.platform || "");
  const [evaluating, setEvaluating] = React.useState<Record<string, boolean>>({});

  const generateIdeas = async () => {
    if (!platform) return;
    setLoading(true);
    try {
      const res = await fetch("/api/content-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform })
      });
      if (res.ok) {
        const { data } = await res.json();
        setIdeas([...data, ...ideas]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const evaluateIdea = async (id: string) => {
    setEvaluating(prev => ({ ...prev, [id]: true }));
    try {
      const res = await fetch("/api/evals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentIdeaId: id })
      });
      // In a real app we'd poll or use SSE to get the eval result
      // For this implementation we'll just optimistically simulate it or wait for a refresh
    } catch (e) {
      console.error(e);
    } finally {
      setEvaluating(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center bg-surface p-4 rounded-xl border border-surface-mid">
        <select 
          className="bg-bg text-foreground border border-surface-mid rounded-md p-2"
          value={platform}
          onChange={(e) => setPlatform(e.target.value as Platform)}
        >
          {accounts.map(acc => (
            <option key={acc.platform} value={acc.platform}>{acc.platform} - {acc.handle}</option>
          ))}
        </select>
        <Button onClick={generateIdeas} disabled={loading || !platform}>
          {loading ? "Generating..." : "Generate New Ideas"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-muted border border-dashed border-surface-mid rounded-xl">
            Click "Generate New Ideas" to use AI to analyze your performance and suggest content.
          </div>
        )}
        
        {loading && (
          <div className="col-span-full py-12 text-center text-muted border border-surface-mid rounded-xl animate-pulse">
            Generating 10 custom ideas based on your recent analytics...
          </div>
        )}

        {ideas.map((idea) => (
          <Card key={idea.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg line-clamp-2">{idea.title}</CardTitle>
              <CardDescription>{idea.platform} • {idea.format}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm flex-1">
              <div>
                <strong className="text-foreground block mb-1">Hook:</strong>
                <div className="p-2 bg-bg rounded-md text-accent text-xs">{idea.hook}</div>
              </div>
              <div>
                <strong className="text-foreground">Description:</strong>
                <p className="text-muted mt-1 text-xs line-clamp-4">{idea.description}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t border-surface-mid pt-4 mt-auto">
              <div className="text-xs text-muted">Est: <span className="text-foreground">{idea.estimatedEngagement}</span></div>
              {idea.evalScore !== null ? (
                <div 
                  className="text-xs font-bold px-2 py-1 rounded-full text-bg"
                  style={{ backgroundColor: getEvalColor(idea.evalScore) }}
                >
                  Score: {Math.round(idea.evalScore * 100)}
                </div>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => evaluateIdea(idea.id)}
                  disabled={evaluating[idea.id]}
                >
                  {evaluating[idea.id] ? "Evaluating..." : "Evaluate"}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
