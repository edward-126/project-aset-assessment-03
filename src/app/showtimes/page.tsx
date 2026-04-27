import { AppShell } from "@/components/layout/app-shell";
import { ShowtimeCard } from "@/components/showtimes/showtime-card";
import { showtimeRepository } from "@/lib/repositories/showtime-repository";

export const dynamic = "force-dynamic";

export default async function ShowtimesPage() {
  const showtimes = await showtimeRepository.findAll({ activeOnly: true });

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-normal">Showtimes</h1>
          <p className="text-muted-foreground max-w-2xl text-sm">
            Choose a session to view its seat map, hold seats, and complete a
            booking.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {showtimes.map((showtime) => (
            <ShowtimeCard key={showtime.id} showtime={showtime} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
