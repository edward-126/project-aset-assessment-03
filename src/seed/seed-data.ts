import { connectToDatabase } from "@/lib/db/mongodb";
import { MovieModel } from "@/models/Movie";
import { ScreenModel } from "@/models/Screen";
import { ShowtimeModel } from "@/models/Showtime";
import { seedMovies } from "@/seed/movies";
import { seedScreens } from "@/seed/screens";
import { seedShowtimes } from "@/seed/showtimes";

export async function seedApplicationData() {
  await connectToDatabase();

  const movieIds = seedMovies.map((movie) => movie.id);
  const screenIds = seedScreens.map((screen) => screen.id);
  const showtimeIds = seedShowtimes.map((showtime) => showtime.id);

  await Promise.all([
    MovieModel.deleteMany({ id: { $in: movieIds } }),
    ScreenModel.deleteMany({ id: { $in: screenIds } }),
    ShowtimeModel.deleteMany({ id: { $in: showtimeIds } }),
  ]);

  await MovieModel.insertMany(seedMovies, { ordered: true });
  await ScreenModel.insertMany(seedScreens, { ordered: true });
  await ShowtimeModel.insertMany(seedShowtimes, { ordered: true });

  return {
    insertedMovies: seedMovies.length,
    insertedScreens: seedScreens.length,
    insertedShowtimes: seedShowtimes.length,
    movieIds,
    screenIds,
    showtimeIds,
  };
}
