import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { ShowtimeDetailClient } from "@/components/showtimes/showtime-detail-client";
import { APP_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Showtime Details",
  description:
    "View showtime details and seat map. Select seats and complete your booking.",
  alternates: {
    canonical: `${APP_URL}/showtimes`,
  },
};

export const dynamic = "force-dynamic";

type ShowtimePageProps = {
  params: Promise<{
    showtimeId: string;
  }>;
};

export default async function ShowtimePage({ params }: ShowtimePageProps) {
  const { showtimeId } = await params;

  return (
    <AppShell>
      <ShowtimeDetailClient showtimeId={showtimeId} />
    </AppShell>
  );
}
