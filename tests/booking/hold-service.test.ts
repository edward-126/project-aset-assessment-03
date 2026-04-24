import { describe, expect, it, vi } from "vitest";
import { HoldService } from "@/lib/booking/hold-service";
import type {
  BookingRepositoryPort,
  ScreenRepositoryPort,
} from "@/lib/booking/booking-types";
import type { Booking } from "@/types/domain";

function makeBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    id: "booking-1",
    screenId: "screen-1",
    bookingReference: "CSP-0001",
    customerName: "Test Customer",
    customerEmail: "test@example.com",
    status: "HELD",
    seats: [
      {
        seatId: "screen-1-A1",
        rowLabel: "A",
        seatNumber: 1,
        seatType: "STANDARD",
        price: 10,
      },
    ],
    holdExpiresAt: "2026-01-01T00:05:00.000Z",
    totalCost: 10,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function makeRepositories(expiredBookings: Booking[] = []) {
  const bookings: BookingRepositoryPort = {
    save: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(async (bookingId, patch) => ({
      ...makeBooking({ id: bookingId }),
      ...patch,
    })),
    findExpiredHeldBookings: vi.fn(async () => expiredBookings),
  };
  const screens: ScreenRepositoryPort = {
    findScreenWithSeats: vi.fn(),
    updateSeatStates: vi.fn(),
  };

  return { bookings, screens };
}

describe("HoldService", () => {
  it("recognises a valid hold before expiry", () => {
    const { bookings, screens } = makeRepositories();
    const service = new HoldService(
      bookings,
      screens,
      () => new Date("2026-01-01T00:04:59.000Z")
    );

    expect(service.isHoldValid(makeBooking())).toBe(true);
  });

  it("recognises an expired hold after expiry", () => {
    const { bookings, screens } = makeRepositories();
    const service = new HoldService(
      bookings,
      screens,
      () => new Date("2026-01-01T00:05:00.000Z")
    );

    expect(service.isHoldValid(makeBooking())).toBe(false);
  });

  it("expires held bookings and releases their seats", async () => {
    const expiredBooking = makeBooking();
    const { bookings, screens } = makeRepositories([expiredBooking]);
    const service = new HoldService(
      bookings,
      screens,
      () => new Date("2026-01-01T00:10:00.000Z")
    );

    await expect(service.expireHeldBookings()).resolves.toBe(1);

    expect(bookings.findExpiredHeldBookings).toHaveBeenCalledWith(
      new Date("2026-01-01T00:10:00.000Z")
    );
    expect(screens.updateSeatStates).toHaveBeenCalledWith(
      "screen-1",
      ["screen-1-A1"],
      {
        status: "AVAILABLE",
        heldByBookingId: null,
      }
    );
    expect(bookings.update).toHaveBeenCalledWith("booking-1", {
      status: "EXPIRED",
      holdExpiresAt: null,
    });
  });
});
