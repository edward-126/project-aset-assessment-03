import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { ShowtimeCard } from "@/components/showtimes/showtime-card";
import { showtimeRepository } from "@/lib/repositories/showtime-repository";
import { APP_URL } from "@/lib/constants";
import type { ShowtimeWithDetails } from "@/types/domain";

export const metadata: Metadata = {
  title: "Showtimes",
  description:
    "Browse available cinema showtimes. Select a session to book seats.",
  alternates: {
    canonical: `${APP_URL}/showtimes`,
  },
};

export const dynamic = "force-dynamic";

function sortByStartTime(showtimes: ShowtimeWithDetails[]) {
  return [...showtimes].sort(
    (first, second) =>
      new Date(first.startsAt).getTime() - new Date(second.startsAt).getTime()
  );
}

function formatDay(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

function formatDateKey(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function groupShowtimesByDay(showtimes: ShowtimeWithDetails[]) {
  const groups = new Map<
    string,
    { day: string; label: string; showtimes: ShowtimeWithDetails[] }
  >();

  for (const showtime of sortByStartTime(showtimes)) {
    const day = formatDateKey(showtime.startsAt);
    const group = groups.get(day);

    if (group) {
      group.showtimes.push(showtime);
      continue;
    }

    groups.set(day, {
      day,
      label: formatDay(showtime.startsAt),
      showtimes: [showtime],
    });
  }

  return Array.from(groups.values());
}

export default async function ShowtimesPage() {
  const showtimes = await showtimeRepository.findAll({ activeOnly: true });
  const showtimeGroups = groupShowtimesByDay(showtimes);

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-normal">Showtimes</h1>
          <p className="text-muted-foreground max-w-2xl text-sm">
            Browse sessions by date and time, then choose seats for the show
            that works best.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {showtimeGroups.map((group) => (
            <section
              key={group.day}
              className="pt-5 border-t flex flex-col gap-3"
            >
              <div className="flex flex-wrap items-end justify-between gap-2 pb-3">
                <div>
                  <h2 className="text-xl font-semibold tracking-normal">
                    {group.label}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    <span className="text-primary">
                      {group.showtimes.length}
                    </span>{" "}
                    {group.showtimes.length === 1 ? "session" : "sessions"}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {group.showtimes.map((showtime) => (
                  <ShowtimeCard key={showtime.id} showtime={showtime} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
