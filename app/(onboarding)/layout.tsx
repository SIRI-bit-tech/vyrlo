import * as React from "react";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg p-4">
      <div className="mb-8 text-3xl font-bold tracking-tight text-foreground">
        Vyrlo
      </div>
      <div className="w-full max-w-lg">
        {children}
      </div>
    </div>
  );
}
