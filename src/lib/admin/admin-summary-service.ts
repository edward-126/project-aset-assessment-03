import { bookingRepository } from "@/lib/repositories/booking-repository";
import { movieRepository } from "@/lib/repositories/movie-repository";
import { screenRepository } from "@/lib/repositories/screen-repository";
import { showtimeRepository } from "@/lib/repositories/showtime-repository";

export class AdminSummaryService {
  async getSummary() {
    const [movies, screens, showtimes, bookings] = await Promise.all([
      movieRepository.findAll(),
      screenRepository.findAll(),
      showtimeRepository.findAll(),
      bookingRepository.findAll(),
    ]);

    const confirmedRevenue = bookings
      .filter((booking) => booking.status === "CONFIRMED")
      .reduce((total, booking) => total + booking.totalCost, 0);

    return {
      totalMovies: movies.length,
      activeShowtimes: showtimes.filter((showtime) => showtime.isActive).length,
      totalScreens: screens.length,
      totalBookings: bookings.length,
      heldBookings: bookings.filter((booking) => booking.status === "HELD")
        .length,
      confirmedBookings: bookings.filter(
        (booking) => booking.status === "CONFIRMED"
      ).length,
      confirmedRevenue,
    };
  }
}

export const adminSummaryService = new AdminSummaryService();
