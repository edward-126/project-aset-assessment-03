import { randomUUID } from "crypto";
import {
  AllocationService,
  ManualSeatSelectionService,
} from "@/lib/allocation";
import { BookingServiceError } from "@/lib/booking/booking-errors";
import type {
  AllocationServicePort,
  BookingRepositoryPort,
  CreateHeldBookingInput,
  EditHeldBookingInput,
  PaymentMockServicePort,
  PricingServicePort,
  ScreenRepositoryPort,
  ShowtimeRepositoryPort,
} from "@/lib/booking/booking-types";
import {
  validateCreateHeldBookingInput,
  validateEditHeldBookingInput,
} from "@/lib/booking/booking-validation";
import { HoldService } from "@/lib/booking/hold-service";
import { PaymentMockService } from "@/lib/booking/payment-mock-service";
import { PricingService } from "@/lib/booking/pricing-service";
import { HOLD_DURATION_MINUTES } from "@/lib/constants";
import { bookingRepository } from "@/lib/repositories/booking-repository";
import { screenRepository } from "@/lib/repositories/screen-repository";
import { showtimeRepository } from "@/lib/repositories/showtime-repository";
import type {
  AllocationMode,
  Booking,
  BookingSeat,
  Movie,
  Screen,
  Seat,
  Showtime,
} from "@/types/domain";

type IdGenerator = () => string;

type BookingServiceDependencies = {
  bookings?: BookingRepositoryPort;
  screens?: ScreenRepositoryPort;
  showtimes?: ShowtimeRepositoryPort;
  allocation?: AllocationServicePort;
  manualSelection?: ManualSeatSelectionService;
  holdService?: HoldService;
  pricingService?: PricingServicePort & Pick<PricingService, "getSeatPrice">;
  paymentService?: PaymentMockServicePort;
  idGenerator?: IdGenerator;
  referenceGenerator?: IdGenerator;
  nowProvider?: () => Date;
};

export class BookingService {
  private readonly bookings: BookingRepositoryPort;
  private readonly screens: ScreenRepositoryPort;
  private readonly showtimes: ShowtimeRepositoryPort;
  private readonly allocation: AllocationServicePort;
  private readonly manualSelection: ManualSeatSelectionService;
  private readonly holdService: HoldService;
  private readonly pricingService: PricingServicePort &
    Pick<PricingService, "getSeatPrice">;
  private readonly paymentService: PaymentMockServicePort;
  private readonly idGenerator: IdGenerator;
  private readonly referenceGenerator: IdGenerator;
  private readonly nowProvider: () => Date;

  constructor({
    bookings = bookingRepository,
    screens = screenRepository,
    showtimes = showtimeRepository,
    allocation = new AllocationService(),
    manualSelection = new ManualSeatSelectionService(),
    holdService,
    pricingService = new PricingService(),
    paymentService = new PaymentMockService(),
    idGenerator = randomUUID,
    referenceGenerator = () =>
      `TRS-${Date.now().toString(36).toUpperCase()}-${randomUUID()
        .slice(0, 8)
        .toUpperCase()}`,
    nowProvider = () => new Date(),
  }: BookingServiceDependencies = {}) {
    this.bookings = bookings;
    this.screens = screens;
    this.showtimes = showtimes;
    this.allocation = allocation;
    this.manualSelection = manualSelection;
    this.holdService =
      holdService ?? new HoldService(bookings, screens, undefined, showtimes);
    this.pricingService = pricingService;
    this.paymentService = paymentService;
    this.idGenerator = idGenerator;
    this.referenceGenerator = referenceGenerator;
    this.nowProvider = nowProvider;
  }

  async createHeldBooking(input: CreateHeldBookingInput) {
    validateCreateHeldBookingInput(input);
    await this.holdService.expireHeldBookings();

    const allocationSource = await this.getBookingAllocationSource(input);
    const { screen } = allocationSource;

    if (!screen) {
      throw new BookingServiceError(
        "SCREEN_NOT_FOUND",
        "The selected screen was not found."
      );
    }

    const allocationMode: AllocationMode = input.allocationMode ?? "AUTO";
    const selectedSeats =
      allocationMode === "MANUAL"
        ? this.manualSelection.validateSelection({
            screen,
            groupSize: input.groupSize,
            seatIds: input.seatIds ?? [],
          }).seats
        : this.allocation.allocate({
            screen,
            groupSize: input.groupSize,
          }).seats;
    const bookingId = this.idGenerator();
    const seats = this.toBookingSeats(selectedSeats);
    const totalCost = this.pricingService.calculateTotal(seats).total;
    const nowIso = this.nowProvider().toISOString();

    const booking: Booking = {
      id: bookingId,
      showtimeId: allocationSource.showtime?.id,
      screenId: screen.id,
      movieId: allocationSource.movie?.id,
      movieTitle: allocationSource.movie?.title,
      showtimeStartsAt: allocationSource.showtime?.startsAt,
      bookingReference: this.referenceGenerator(),
      customerName: input.customerName.trim(),
      customerEmail: input.customerEmail.trim(),
      customerPhone: input.customerPhone?.trim(),
      status: "HELD",
      allocationMode,
      seats,
      holdExpiresAt: this.holdService
        .createHoldExpiry(HOLD_DURATION_MINUTES)
        .toISOString(),
      totalCost,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    await this.updateBookingSeatStates(
      booking,
      seats.map((seat) => seat.seatId),
      {
        status: "HELD",
        heldByBookingId: booking.id,
      }
    );

    return this.bookings.save(booking);
  }

  async confirmBooking(bookingId: string) {
    const booking = await this.requireBooking(bookingId);
    await this.assertHeldAndActive(booking);

    const paymentSucceeded = await this.paymentService.processMockPayment(
      booking.id,
      booking.totalCost
    );

    if (!paymentSucceeded) {
      throw new BookingServiceError(
        "PAYMENT_FAILED",
        "Mock payment did not complete successfully."
      );
    }

    await this.updateBookingSeatStates(
      booking,
      booking.seats.map((seat) => seat.seatId),
      {
        status: "BOOKED",
        heldByBookingId: null,
      }
    );

    return this.bookings.update(booking.id, {
      status: "CONFIRMED",
      holdExpiresAt: null,
    });
  }

  async cancelBooking(bookingId: string) {
    const booking = await this.requireBooking(bookingId);

    if (booking.status === "CANCELLED" || booking.status === "EXPIRED") {
      throw new BookingServiceError(
        "BOOKING_NOT_CANCELLABLE",
        `Booking ${booking.id} cannot be cancelled from ${booking.status} status.`
      );
    }

    if (booking.status === "HELD" && !this.holdService.isHoldValid(booking)) {
      await this.expireBooking(booking);
      throw new BookingServiceError(
        "HOLD_EXPIRED",
        `Booking ${booking.id} hold has expired.`
      );
    }

    await this.holdService.releaseSeats(booking.id);

    return this.bookings.update(booking.id, {
      status: "CANCELLED",
      holdExpiresAt: null,
    });
  }

  async editHeldBooking(input: EditHeldBookingInput) {
    validateEditHeldBookingInput(input);

    const booking = await this.requireBooking(input.bookingId);
    await this.assertHeldAndActive(booking);

    const allocationSource =
      await this.getExistingBookingAllocationSource(booking);
    const { screen } = allocationSource;

    if (!screen) {
      throw new BookingServiceError(
        "SCREEN_NOT_FOUND",
        `Screen ${booking.screenId} was not found.`
      );
    }

    const allocationScreen = this.withBookingSeatsReleased(screen, booking);
    const allocation = this.allocation.allocate({
      screen: allocationScreen,
      groupSize: input.groupSize,
    });
    const seats = this.toBookingSeats(allocation.seats);
    const totalCost = this.pricingService.calculateTotal(seats).total;

    await this.updateBookingSeatStates(
      booking,
      booking.seats.map((seat) => seat.seatId),
      {
        status: "AVAILABLE",
        heldByBookingId: null,
      }
    );
    await this.updateBookingSeatStates(
      booking,
      seats.map((seat) => seat.seatId),
      {
        status: "HELD",
        heldByBookingId: booking.id,
      }
    );

    return this.bookings.update(booking.id, {
      seats,
      totalCost,
    });
  }

  private async requireBooking(bookingId: string) {
    if (bookingId.trim().length === 0) {
      throw new BookingServiceError(
        "MISSING_BOOKING_ID",
        "A booking id is required."
      );
    }

    const booking = await this.bookings.findById(bookingId);

    if (!booking) {
      throw new BookingServiceError(
        "BOOKING_NOT_FOUND",
        `Booking ${bookingId} was not found.`
      );
    }

    return booking;
  }

  private async assertHeldAndActive(booking: Booking) {
    if (booking.status !== "HELD") {
      throw new BookingServiceError(
        "BOOKING_NOT_HELD",
        `Booking ${booking.id} is not currently held.`
      );
    }

    if (!this.holdService.isHoldValid(booking)) {
      await this.expireBooking(booking);
      throw new BookingServiceError(
        "HOLD_EXPIRED",
        `Booking ${booking.id} hold has expired.`
      );
    }
  }

  private async expireBooking(booking: Booking) {
    await this.updateBookingSeatStates(
      booking,
      booking.seats.map((seat) => seat.seatId),
      {
        status: "AVAILABLE",
        heldByBookingId: null,
      }
    );
    await this.bookings.update(booking.id, {
      status: "EXPIRED",
      holdExpiresAt: null,
    });
  }

  private toBookingSeats(seats: readonly Seat[]): BookingSeat[] {
    return seats.map((seat) => ({
      seatId: seat.id,
      rowLabel: seat.rowLabel,
      seatNumber: seat.seatNumber,
      seatType: seat.type,
      price: this.pricingService.getSeatPrice(seat.type),
    }));
  }

  private withBookingSeatsReleased(screen: Screen, booking: Booking): Screen {
    const bookingSeatIds = new Set(booking.seats.map((seat) => seat.seatId));

    return {
      ...screen,
      seats: screen.seats.map((seat) =>
        bookingSeatIds.has(seat.id)
          ? {
              ...seat,
              status: "AVAILABLE",
              heldByBookingId: null,
            }
          : seat
      ),
    };
  }

  private async getBookingAllocationSource(input: CreateHeldBookingInput) {
    if (input.showtimeId) {
      const seatMap = await this.showtimes.findShowtimeWithSeatMap(
        input.showtimeId
      );

      if (!seatMap) {
        throw new BookingServiceError(
          "SHOWTIME_NOT_FOUND",
          `Showtime ${input.showtimeId} was not found.`
        );
      }

      return seatMap;
    }

    const screen = await this.screens.findScreenWithSeats(input.screenId ?? "");

    return {
      screen,
      movie: undefined,
      showtime: undefined,
    };
  }

  private async getExistingBookingAllocationSource(booking: Booking) {
    if (booking.showtimeId) {
      const seatMap = await this.showtimes.findShowtimeWithSeatMap(
        booking.showtimeId
      );

      if (!seatMap) {
        throw new BookingServiceError(
          "SHOWTIME_NOT_FOUND",
          `Showtime ${booking.showtimeId} was not found.`
        );
      }

      return seatMap;
    }

    return {
      screen: await this.screens.findScreenWithSeats(booking.screenId),
      movie: undefined as Movie | undefined,
      showtime: undefined as Showtime | undefined,
    };
  }

  private async updateBookingSeatStates(
    booking: Pick<Booking, "showtimeId" | "screenId">,
    seatIds: string[],
    updater: {
      status: "AVAILABLE" | "HELD" | "BOOKED";
      heldByBookingId: string | null;
    }
  ) {
    if (booking.showtimeId) {
      await this.showtimes.updateSeatStates(
        booking.showtimeId,
        seatIds,
        updater
      );
      return;
    }

    await this.screens.updateSeatStates(booking.screenId, seatIds, updater);
  }
}

export const bookingService = new BookingService();
