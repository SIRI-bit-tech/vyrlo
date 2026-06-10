"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/auth-client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  return `${local[0]}***@${domain}`;
}

export default function VerifyPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  
  const [otp, setOtp] = React.useState(["", "", "", "", "", ""]);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [resendCooldown, setResendCooldown] = React.useState(0);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    // Automatically trigger send OTP on mount if no cooldown
    handleSendOtp();
  }, []);

  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSendOtp = async () => {
    try {
      const res = await fetch("/api/auth/send-otp", { method: "POST" });
      if (res.ok) {
        setResendCooldown(60);
        setError("");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to send OTP.");
      }
    } catch (e) {
      setError("Failed to send OTP.");
    }
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) return;
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: code }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        toast.success("Email verified successfully!");
        router.push("/onboarding");
      } else {
        setError(data.error || "Verification failed");
        setLoading(false);
      }
    } catch (e) {
      setError("Verification failed.");
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (otp.join("").length === 6) {
      verifyOtp();
    }
  }, [otp]);

  if (isPending) return <div>Loading...</div>;
  if (!session) return null;

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Check your email</CardTitle>
        <CardDescription className="text-center">
          We sent a verification code to {maskEmail(session.user.email)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-mono bg-surface border border-surface-mid rounded-md focus:outline-none focus:ring-1 focus:ring-foreground"
              disabled={loading}
            />
          ))}
        </div>
        {error && <div className="text-sm text-red-500 text-center animate-shake">{error}</div>}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          variant="ghost" 
          onClick={handleSendOtp} 
          disabled={resendCooldown > 0 || loading}
        >
          {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
        </Button>
      </CardFooter>
    </Card>
  );
}
