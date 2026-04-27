import { redirect } from "next/navigation";
import { DashboardCards } from "@/components/admin/dashboard-cards";
import { AdminShell } from "@/components/layout/admin-shell";
import { adminSummaryService } from "@/lib/admin/admin-summary-service";
import { hasAdminSession } from "@/lib/admin/session";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await hasAdminSession())) {
    redirect("/admin/login");
  }

  const summary = await adminSummaryService.getSummary();

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
