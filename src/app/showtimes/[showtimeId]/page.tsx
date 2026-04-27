import { AppShell } from "@/components/layout/app-shell";
import { ShowtimeDetailClient } from "@/components/showtimes/showtime-detail-client";

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
