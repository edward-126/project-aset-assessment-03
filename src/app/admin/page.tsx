import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  AdminDataError,
  getAdminDataErrorMessage,
} from "@/components/admin/admin-data-error";
import { DashboardCards } from "@/components/admin/dashboard-cards";
import { AdminShell } from "@/components/layout/admin-shell";
import { adminSummaryService } from "@/lib/admin/admin-summary-service";
import { hasAdminSession } from "@/lib/admin/session";
import { APP_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description:
    "Cinema administration panel. Manage bookings, showtimes, screens, and movies.",
  alternates: {
    canonical: `${APP_URL}/admin`,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await hasAdminSession())) {
    redirect("/admin/login");
  }

  let summary;

  try {
    summary = await adminSummaryService.getSummary();
  } catch (error) {
    console.error(
      "[admin] Failed to load dashboard data:",
      getAdminDataErrorMessage(error)
    );

    return (
      <AdminShell>
        <AdminDataError error={error} />
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-normal">
            Admin dashboard
          </h1>
          <p className="text-muted-foreground text-sm">
            Operational summary for movies, showtimes, screens, and bookings.
          </p>
        </div>
        <DashboardCards summary={summary} />
      </div>
    </AdminShell>
  );
}
