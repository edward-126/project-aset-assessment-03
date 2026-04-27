import { BookingServiceError } from "@/lib/booking/booking-errors";
import type {
  BookingRepositoryPort,
  ScreenRepositoryPort,
  ShowtimeRepositoryPort,
} from "@/lib/booking/booking-types";
import { bookingRepository } from "@/lib/repositories/booking-repository";
import { screenRepository } from "@/lib/repositories/screen-repository";
import { showtimeRepository } from "@/lib/repositories/showtime-repository";
import type { Booking } from "@/types/domain";

type NowProvider = () => Date;

export class HoldService {
  constructor(
    private readonly bookings: BookingRepositoryPort = bookingRepository,
    private readonly screens: ScreenRepositoryPort = screenRepository,
    private readonly nowProvider: NowProvider = () => new Date(),
    private readonly showtimes: ShowtimeRepositoryPort = showtimeRepository
  ) {}

  createHoldExpiry(minutes: number) {
    return new Date(this.nowProvider().getTime() + minutes * 60_000);
  }

  isHoldValid(booking: Booking) {
    if (booking.status !== "HELD" || !booking.holdExpiresAt) {
      return false;
    }

    const expiryTime = Date.parse(booking.holdExpiresAt);

    if (Number.isNaN(expiryTime)) {
      return false;
    }

    return expiryTime > this.nowProvider().getTime();
  }

  async releaseSeats(bookingId: string) {
    const booking = await this.bookings.findById(bookingId);

    if (!booking) {
      throw new BookingServiceError(
        "BOOKING_NOT_FOUND",
        `Booking ${bookingId} was not found.`
      );
    }

    await this.releaseSeatsForBooking(booking);
  }

  async expireHeldBookings() {
    const expiredBookings = await this.bookings.findExpiredHeldBookings(
      this.nowProvider()
    );

    for (const booking of expiredBookings) {
      await this.releaseSeatsForBooking(booking);
      await this.bookings.update(booking.id, {
        status: "EXPIRED",
        holdExpiresAt: null,
      });
    }

    return expiredBookings.length;
  }

  private async releaseSeatsForBooking(booking: Booking) {
    const repository = booking.showtimeId ? this.showtimes : this.screens;
    const allocationSourceId = booking.showtimeId ?? booking.screenId;

    await repository.updateSeatStates(
      allocationSourceId,
      booking.seats.map((seat) => seat.seatId),
      {
        status: "AVAILABLE",
        heldByBookingId: null,
      }
    );
  }
}

export const holdService = new HoldService();
