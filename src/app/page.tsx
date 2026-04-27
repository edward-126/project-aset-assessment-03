import Link from "next/link";
import { ArrowRight, CalendarClock, ShieldCheck, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { MovieCard } from "@/components/movies/movie-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { movieRepository } from "@/lib/repositories/movie-repository";

export const dynamic = "force-dynamic";

export default async function Home() {
  const movies = await movieRepository.findAll({ activeOnly: true });

  return (
    <AppShell>
      <div className="flex flex-col gap-10">
        <section
          className="relative overflow-hidden rounded-lg bg-cover bg-center px-6 py-24 text-white md:px-10"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0,0,0,.78), rgba(0,0,0,.38)), url(https://images.unsplash.com/photo-1607376995899-383532a918b3?auto=format&fit=crop&w=1600&q=80)",
          }}
        >
          <div className="flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-white/80">
                Cinema booking and seat allocation
              </p>

              <h1 className="text-4xl font-semibold tracking-normal md:text-6xl">
                TR SeatFlow
              </h1>

              <p className="max-w-xl text-base text-white/85 md:text-lg">
                Book cinema seats with automatic group allocation, temporary
                holds, seat-map visibility, and controlled booking changes.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/movies">
                  Browse movies
                  <ArrowRight data-icon="inline-end" aria-hidden="true" />
                </Link>
              </Button>

              <Button asChild size="lg" variant="secondary">
                <Link href="/showtimes">View showtimes</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Automatic allocation",
              text: "Groups are placed using availability, adjacency, viewing zone, centre preference, and fragmentation rules.",
              icon: Sparkles,
            },
            {
              title: "Temporary holds",
              text: "Held seats are isolated from new requests until the booking is confirmed, cancelled, or expired.",
              icon: ShieldCheck,
            },
            {
              title: "Showtime seat maps",
              text: "Each showtime tracks its own held, booked, unavailable, and available seats.",
              icon: CalendarClock,
            },
          ].map((item) => (
            <Card key={item.title}>
              <CardContent>
                <item.icon aria-hidden="true" />

                <div className="mt-2.5 flex flex-col gap-1.5">
                  <h2 className="font-semibold">{item.title}</h2>
                  <p className="text-muted-foreground text-sm">{item.text}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-semibold tracking-normal">
                Featured movies
              </h2>

              <p className="text-muted-foreground text-sm">
                Explore active movies and choose a showtime to start booking.
              </p>
            </div>

            <Button asChild variant="outline">
              <Link href="/movies">
                All movies <ArrowRight />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {movies.slice(0, 3).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
