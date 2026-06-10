"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/auth-client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CREATOR_NICHES, CREATOR_CHALLENGES, CREATOR_EXPERIENCES, CREATOR_GOALS, PLATFORMS } from "@/constants";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = React.useState(1);
  const [subStep, setSubStep] = React.useState(1);

  // Step 1 State
  const [niches, setNiches] = React.useState<string[]>([]);
  const [activePlatforms, setActivePlatforms] = React.useState<string[]>([]);
  const [challenge, setChallenge] = React.useState("");
  const [experience, setExperience] = React.useState("");
  const [goal, setGoal] = React.useState("");
  const [savingProfile, setSavingProfile] = React.useState(false);

  // Step 2 State
  const [handles, setHandles] = React.useState<Record<string, string>>({});
  const [previews, setPreviews] = React.useState<Record<string, any>>({});
  const [loadingScrape, setLoadingScrape] = React.useState<Record<string, boolean>>({});
  const [connected, setConnected] = React.useState<Record<string, boolean>>({});
  const [scrapeError, setScrapeError] = React.useState<Record<string, string>>({});
  const [completing, setCompleting] = React.useState(false);

  const handleNextSubStep = async () => {
    if (subStep < 5) {
      setSubStep(subStep + 1);
    } else {
      // Save profile
      setSavingProfile(true);
      await fetch("/api/onboarding/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niches, platforms: activePlatforms, challenge, experience, goal }),
      });
      setSavingProfile(false);
      setStep(2);
    }
  };

  const handleFindAccount = async (platformId: string) => {
    const handle = handles[platformId];
    if (!handle) return;

    setLoadingScrape(prev => ({ ...prev, [platformId]: true }));
    setScrapeError(prev => ({ ...prev, [platformId]: "" }));
    setPreviews(prev => ({ ...prev, [platformId]: null }));

    try {
      const res = await fetch(`/api/scrape/${platformId.toLowerCase()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle, preview: true }),
      });
      const data = await res.json();
      if (res.ok && data.profile) {
        if (data.profile.followersCount === 0 && !data.profile.avatarUrl) {
          setScrapeError(prev => ({ ...prev, [platformId]: "This account is private. Vyrlo only works with public accounts." }));
        } else {
          setPreviews(prev => ({ ...prev, [platformId]: data.profile }));
        }
      } else {
        setScrapeError(prev => ({ ...prev, [platformId]: `No account found with this handle on ${platformId}. Check the spelling and try again.` }));
      }
    } catch (e) {
      setScrapeError(prev => ({ ...prev, [platformId]: "Failed to fetch account." }));
    }
    setLoadingScrape(prev => ({ ...prev, [platformId]: false }));
  };

  const handleConfirmAccount = async (platformId: string) => {
    const handle = handles[platformId];

    setLoadingScrape(prev => ({ ...prev, [platformId]: true }));
    try {
      const res = await fetch(`/api/scrape/${platformId.toLowerCase()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle, preview: false }), // Actually save
      });
      if (res.ok) {
        setConnected(prev => ({ ...prev, [platformId]: true }));
      } else {
        setScrapeError(prev => ({ ...prev, [platformId]: "Failed to connect account." }));
      }
    } catch (e) {
      setScrapeError(prev => ({ ...prev, [platformId]: "Failed to connect account." }));
    }
    setLoadingScrape(prev => ({ ...prev, [platformId]: false }));
  };

  const handleRejectAccount = (platformId: string) => {
    setPreviews(prev => ({ ...prev, [platformId]: null }));
    setHandles(prev => ({ ...prev, [platformId]: "" }));
  };

  const finishOnboarding = async () => {
    setCompleting(true);
    await fetch("/api/onboarding/complete", { method: "POST" });
    toast.success("Onboarding complete!");
    router.push("/dashboard");
  };

  return (
    <div className="space-y-6">
      <div className="text-sm font-medium text-muted mb-4">Step {step} of 3</div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {subStep === 1 && "What's your primary niche?"}
              {subStep === 2 && "Which platforms are you most active on?"}
              {subStep === 3 && "What's your biggest challenge as a creator right now?"}
              {subStep === 4 && "How long have you been creating content?"}
              {subStep === 5 && "What's your main content goal?"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {subStep === 1 && (
              <div className="grid grid-cols-2 gap-2">
                {CREATOR_NICHES.map(n => (
                  <Button 
                    key={n} 
                    variant={niches.includes(n) ? "default" : "outline"} 
                    onClick={() => {
                      if (niches.includes(n)) setNiches(niches.filter(id => id !== n));
                      else setNiches([...niches, n]);
                    }}
                  >
                    {n}
                  </Button>
                ))}
              </div>
            )}
            {subStep === 2 && (
              <div className="grid grid-cols-2 gap-2">
                {PLATFORMS.map(p => (
                  <Button
                    key={p.id}
                    variant={activePlatforms.includes(p.id) ? "default" : "outline"}
                    onClick={() => {
                      if (activePlatforms.includes(p.id)) setActivePlatforms(activePlatforms.filter(id => id !== p.id));
                      else setActivePlatforms([...activePlatforms, p.id]);
                    }}
                  >
                    {p.name}
                  </Button>
                ))}
              </div>
            )}
            {subStep === 3 && (
              <div className="flex flex-col gap-2">
                {CREATOR_CHALLENGES.map(c => (
                  <Button key={c} variant={challenge === c ? "default" : "outline"} onClick={() => setChallenge(c)}>
                    {c}
                  </Button>
                ))}
              </div>
            )}
            {subStep === 4 && (
              <div className="flex flex-col gap-2">
                {CREATOR_EXPERIENCES.map(e => (
                  <Button key={e} variant={experience === e ? "default" : "outline"} onClick={() => setExperience(e)}>
                    {e}
                  </Button>
                ))}
              </div>
            )}
            {subStep === 5 && (
              <div className="flex flex-col gap-2">
                {CREATOR_GOALS.map(g => (
                  <Button key={g} variant={goal === g ? "default" : "outline"} onClick={() => setGoal(g)}>
                    {g}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              onClick={handleNextSubStep}
              disabled={
                (subStep === 1 && niches.length === 0) ||
                (subStep === 2 && activePlatforms.length === 0) ||
                (subStep === 3 && !challenge) ||
                (subStep === 4 && !experience) ||
                (subStep === 5 && !goal) || savingProfile
              }
            >
              {savingProfile ? "Saving..." : subStep === 5 ? "Continue" : "Next"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Connect your social accounts</CardTitle>
            <CardDescription>
              Enter your public username for each platform. We'll confirm it's the right account before saving.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {PLATFORMS.map(p => (
              <div key={p.id} className="space-y-2 border-b border-surface-mid pb-4 last:border-0">
                <div className="flex items-center gap-3">
                  <p.icon className="w-5 h-5 text-muted" />
                  <span className="font-medium w-24">{p.name}</span>
                  <Input
                    placeholder="@username"
                    value={handles[p.id] || ""}
                    onChange={(e) => setHandles({ ...handles, [p.id]: e.target.value })}
                    disabled={connected[p.id] || loadingScrape[p.id]}
                    className="flex-1"
                  />
                  {!connected[p.id] ? (
                    <Button
                      variant="outline"
                      onClick={() => handleFindAccount(p.id)}
                      disabled={!handles[p.id] || loadingScrape[p.id]}
                    >
                      {loadingScrape[p.id] ? "..." : "Find"}
                    </Button>
                  ) : (
                    <span className="text-green-500 font-bold px-4">✓</span>
                  )}
                </div>

                {scrapeError[p.id] && (
                  <div className="text-sm text-red-500 pl-8">{scrapeError[p.id]}</div>
                )}

                {previews[p.id] && !connected[p.id] && (
                  <div className="ml-8 mt-2 p-4 border border-surface-mid rounded-lg bg-bg space-y-3">
                    <div className="flex items-center gap-4">
                      {previews[p.id].avatarUrl && (
                        <img src={previews[p.id].avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full bg-surface" />
                      )}
                      <div>
                        <div className="font-semibold text-foreground">{previews[p.id].handle}</div>
                        <div className="text-sm text-muted">{previews[p.id].followersCount.toLocaleString()} followers</div>
                      </div>
                    </div>
                    {previews[p.id].bio && (
                      <p className="text-sm text-muted line-clamp-2">{previews[p.id].bio}</p>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" onClick={() => handleConfirmAccount(p.id)} disabled={loadingScrape[p.id]}>
                        Yes, this is me
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleRejectAccount(p.id)} disabled={loadingScrape[p.id]}>
                        Not me — try again
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              className="w-full"
              onClick={() => setStep(3)}
              disabled={Object.values(connected).filter(Boolean).length === 0}
            >
              Continue
            </Button>
            <button className="text-sm text-muted underline" onClick={() => setStep(3)}>
              Skip for now
            </button>
          </CardFooter>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">You're all set, {session?.user?.name || "Creator"}.</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted space-y-4">
            <div>
              <strong>Niches:</strong> {niches.join(", ")}
            </div>
            <div>
              <strong>Connected Platforms:</strong> {Object.keys(connected).filter(k => connected[k]).join(", ") || "No accounts connected yet — add them anytime in Settings"}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={finishOnboarding} size="lg" disabled={completing}>
              {completing ? "Loading Dashboard..." : "Go to Dashboard"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
