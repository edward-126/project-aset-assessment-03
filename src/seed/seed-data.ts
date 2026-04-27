import { connectToDatabase } from "@/lib/db/mongodb";
import { BookingModel } from "@/models/Booking";
import { MovieModel } from "@/models/Movie";
import { ScreenModel } from "@/models/Screen";
import { ShowtimeModel } from "@/models/Showtime";
import { applySeedBookingsToShowtimes, seedBookings } from "@/seed/bookings";
import { seedMovies } from "@/seed/movies";
import { seedScreens } from "@/seed/screens";
import { seedShowtimes } from "@/seed/showtimes";

export async function seedApplicationData() {
  await connectToDatabase();

  const movieIds = seedMovies.map((movie) => movie.id);
  const screenIds = seedScreens.map((screen) => screen.id);
  const showtimes = applySeedBookingsToShowtimes(seedShowtimes);
  const showtimeIds = showtimes.map((showtime) => showtime.id);
  const bookingIds = seedBookings.map((booking) => booking.id);

  await Promise.all([
    BookingModel.deleteMany({}),
    ShowtimeModel.deleteMany({}),
    ScreenModel.deleteMany({}),
    MovieModel.deleteMany({}),
  ]);

  await MovieModel.insertMany(seedMovies, { ordered: true });
  await ScreenModel.insertMany(seedScreens, { ordered: true });
  await ShowtimeModel.insertMany(showtimes, { ordered: true });
  await BookingModel.insertMany(seedBookings, { ordered: true });

  return {
    insertedMovies: seedMovies.length,
    insertedScreens: seedScreens.length,
    insertedShowtimes: showtimes.length,
    insertedBookings: seedBookings.length,
    movieIds,
    screenIds,
    showtimeIds,
    bookingIds,
  };
}
