"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth/auth-client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error: signUpError } = await signUp.email({
      email,
      password,
      name,
      fetchOptions: {
        onResponse(context) {
          if (context.response.status === 200) {
            toast.success("Account created! Please check your email for the OTP.");
            router.push("/verify");
          }
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message || "Failed to register.");
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Create an account</CardTitle>
        <CardDescription className="text-center">
          Enter your details to sign up for Vyrlo.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleRegister}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={confirmPassword && password !== confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {confirmPassword && password !== confirmPassword && (
              <div className="text-sm text-red-500 font-medium">Passwords do not match.</div>
            )}
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || (confirmPassword !== "" && password !== confirmPassword)}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
          <div className="text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-accent underline hover:text-foreground">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
