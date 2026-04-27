import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { hasAdminSession } from "@/lib/admin/session";
import { APP_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Sign in to the cinema administration panel.",
  alternates: {
    canonical: `${APP_URL}/admin/login`,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await hasAdminSession()) {
    redirect("/admin");
  }

  return (
    <AppShell>
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Admin sign in</CardTitle>
            <CardDescription>
              Access booking, showtime, screen, and movie operations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminLoginForm />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
