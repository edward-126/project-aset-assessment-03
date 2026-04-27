import type { AllocationService } from "@/lib/allocation";
import type {
  Booking,
  BookingSeat,
  PricingSummary,
  Screen,
  SeatStateUpdate,
  ShowtimeSeatMap,
} from "@/types/domain";

export interface CreateHeldBookingInput {
  screenId?: string;
  showtimeId?: string;
  groupSize: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  allocationMode?: "AUTO" | "MANUAL";
  seatIds?: string[];
}

export interface EditHeldBookingInput {
  bookingId: string;
  groupSize: number;
}

export interface BookingRepositoryPort {
  save(booking: Booking): Promise<Booking>;
  findById(bookingId: string): Promise<Booking | null>;
  update(bookingId: string, patch: Partial<Booking>): Promise<Booking>;
  findExpiredHeldBookings(now: Date): Promise<Booking[]>;
}

export interface ScreenRepositoryPort {
  findScreenWithSeats(screenId: string): Promise<Screen | null>;
  updateSeatStates(
    screenId: string,
    seatIds: string[],
    updater: SeatStateUpdate
  ): Promise<void>;
}

export interface ShowtimeRepositoryPort {
  findShowtimeWithSeatMap(showtimeId: string): Promise<ShowtimeSeatMap | null>;
  updateSeatStates(
    showtimeId: string,
    seatIds: string[],
    updater: SeatStateUpdate
  ): Promise<void>;
}

export interface PricingServicePort {
  calculateTotal(seats: BookingSeat[]): PricingSummary;
}

export interface PaymentMockServicePort {
  processMockPayment(bookingId: string, amount: number): Promise<boolean>;
}

export type AllocationServicePort = Pick<AllocationService, "allocate">;
