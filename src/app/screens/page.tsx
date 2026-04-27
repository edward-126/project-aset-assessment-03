import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { ScreenList } from "@/components/screens/screen-list";
import { APP_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Screens",
  description:
    "View all cinema screens and their seating capacity. Start a booking.",
  alternates: {
    canonical: `${APP_URL}/screens`,
  },
};

export const dynamic = "force-dynamic";

export default function ScreensPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-normal">
            Choose a screen
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm">
            Review availability and start a held booking for one active
            showtime.
          </p>
        </div>
        <ScreenList />
      </div>
    </AppShell>
  );
}
