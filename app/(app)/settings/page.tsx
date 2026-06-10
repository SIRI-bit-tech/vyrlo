import { auth } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Vyrlo",
  description: "Manage your account and connected platforms.",
};
import { prisma } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PLATFORMS } from "@/constants";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { creatorProfile: true, accounts: true },
  });

  if (!user) return null;

  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-foreground">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted">
          <div>
            <strong className="text-foreground">Name:</strong> {user.name}
          </div>
          <div>
            <strong className="text-foreground">Email:</strong> {user.email} (Verified: {user.emailVerified ? "Yes" : "No"})
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Creator Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted">
          <div>
            <strong className="text-foreground">Niche:</strong> {user.creatorProfile?.niches?.join(", ") || "Not set"}
          </div>
          <div>
            <strong className="text-foreground">Primary Goal:</strong> {user.creatorProfile?.goal || "Not set"}
          </div>
          <div>
            <strong className="text-foreground">Experience:</strong> {user.creatorProfile?.experience || "Not set"}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user.accounts.length === 0 && (
            <p className="text-sm text-muted">No accounts connected.</p>
          )}
          {user.accounts.map(acc => (
            <div key={acc.id} className="flex items-center justify-between p-4 border border-surface-mid rounded-md bg-bg">
              <div className="flex items-center gap-4">
                {acc.avatarUrl && <img src={acc.avatarUrl} className="w-10 h-10 rounded-full" alt="avatar" />}
                <div>
                  <div className="font-medium text-foreground">{acc.platform}</div>
                  <div className="text-sm text-muted">{acc.handle}</div>
                </div>
              </div>
              <div className="text-sm text-muted">
                Status: {acc.isActive ? <span className="text-green-500">Active</span> : <span className="text-red-500">Error</span>}
              </div>
            </div>
          ))}
          <Button variant="outline" className="mt-4">Add New Account</Button>
        </CardContent>
      </Card>
      
      <Card className="border-red-500/20">
        <CardHeader>
          <CardTitle className="text-red-500">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
