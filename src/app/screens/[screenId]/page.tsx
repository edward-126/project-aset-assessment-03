import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { ScreenDetailClient } from "@/components/screens/screen-detail-client";
import { APP_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Screen Details",
  description: "View cinema screen details, seating layout, and availability.",
  alternates: {
    canonical: `${APP_URL}/screens`,
  },
};

export const dynamic = "force-dynamic";

type ScreenPageProps = {
  params: Promise<{
    screenId: string;
  }>;
};

export default async function ScreenPage({ params }: ScreenPageProps) {
  const { screenId } = await params;

  return (
    <AppShell>
      <ScreenDetailClient screenId={screenId} />
    </AppShell>
  );
}
