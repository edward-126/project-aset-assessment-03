import { AppShell } from "@/components/layout/app-shell";
import { MovieCard } from "@/components/movies/movie-card";
import { movieRepository } from "@/lib/repositories/movie-repository";

export const dynamic = "force-dynamic";

export default async function MoviesPage() {
  const movies = await movieRepository.findAll({ activeOnly: true });

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-normal">Movies</h1>
          <p className="text-muted-foreground max-w-2xl text-sm">
            Browse active films and continue to the showtime list to start a
            booking.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
