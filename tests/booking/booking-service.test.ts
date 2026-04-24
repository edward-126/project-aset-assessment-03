import { beforeEach, describe, expect, it, vi } from "vitest";
import { BookingService } from "@/lib/booking/booking-service";
import { BookingServiceError } from "@/lib/booking/booking-errors";
import { HoldService } from "@/lib/booking/hold-service";
import type {
  BookingRepositoryPort,
  ScreenRepositoryPort,
} from "@/lib/booking/booking-types";
import type { Booking } from "@/types/domain";
import { makeTestScreen } from "../allocation/test-helpers";

const NOW = new Date("2026-01-01T00:00:00.000Z");

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

function makeService({
  screen = makeTestScreen({
    id: "screen-1",
    totalRows: 1,
    totalColumns: 4,
    preferredRowStart: 1,
    preferredRowEnd: 1,
    plan: {
      available: ["A1", "A2", "A3", "A4"],
    },
  }),
  booking = makeBooking(),
  paymentSucceeded = true,
}: {
  screen?: ReturnType<typeof makeTestScreen> | null;
  booking?: Booking | null;
  paymentSucceeded?: boolean;
} = {}) {
  const bookings: BookingRepositoryPort = {
    save: vi.fn(async (newBooking) => newBooking),
    findById: vi.fn(async () => booking),
    update: vi.fn(async (_bookingId, patch) => ({
      ...(booking ?? makeBooking()),
      ...patch,
    })),
    findExpiredHeldBookings: vi.fn(async () => []),
  };
  const screens: ScreenRepositoryPort = {
    findScreenWithSeats: vi.fn(async () => screen),
    updateSeatStates: vi.fn(),
  };
  const holdService = new HoldService(bookings, screens, () => NOW);
  const service = new BookingService({
    bookings,
    screens,
    holdService,
    idGenerator: () => "booking-1",
    referenceGenerator: () => "CSP-TEST-1",
    nowProvider: () => NOW,
    paymentService: {
      processMockPayment: vi.fn(async () => paymentSucceeded),
    },
  });

  return { bookings, screens, service };
}

describe("BookingService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a held booking and marks allocated seats as held", async () => {
    const { bookings, screens, service } = makeService();

    const booking = await service.createHeldBooking({
      screenId: "screen-1",
      groupSize: 2,
      customerName: " Test Customer ",
      customerEmail: " test@example.com ",
    });

    expect(booking).toEqual(
      expect.objectContaining({
        id: "booking-1",
        bookingReference: "CSP-TEST-1",
        status: "HELD",
        totalCost: 20,
        holdExpiresAt: "2026-01-01T00:05:00.000Z",
      })
    );
    expect(screens.updateSeatStates).toHaveBeenCalledWith(
      "screen-1",
      ["screen-1-A1", "screen-1-A2"],
      {
        status: "HELD",
        heldByBookingId: "booking-1",
      }
    );
    expect(bookings.save).toHaveBeenCalledWith(
      expect.objectContaining({
        customerName: "Test Customer",
        customerEmail: "test@example.com",
      })
    );
  });

  it("confirms a valid held booking after mock payment", async () => {
    const { bookings, screens, service } = makeService();

    const booking = await service.confirmBooking("booking-1");

    expect(screens.updateSeatStates).toHaveBeenCalledWith(
      "screen-1",
      ["screen-1-A1"],
      {
        status: "BOOKED",
        heldByBookingId: null,
      }
    );
    expect(bookings.update).toHaveBeenCalledWith("booking-1", {
      status: "CONFIRMED",
      holdExpiresAt: null,
    });
    expect(booking.status).toBe("CONFIRMED");
  });

  it("cancels a held booking and releases its seats", async () => {
    const { bookings, screens, service } = makeService();

    const booking = await service.cancelBooking("booking-1");

    expect(screens.updateSeatStates).toHaveBeenCalledWith(
      "screen-1",
      ["screen-1-A1"],
      {
        status: "AVAILABLE",
        heldByBookingId: null,
      }
    );
    expect(bookings.update).toHaveBeenCalledWith("booking-1", {
      status: "CANCELLED",
      holdExpiresAt: null,
    });
    expect(booking.status).toBe("CANCELLED");
  });

  it("edits a valid held booking and replaces held seats", async () => {
    const screen = makeTestScreen({
      id: "screen-1",
      totalRows: 1,
      totalColumns: 4,
      preferredRowStart: 1,
      preferredRowEnd: 1,
      plan: {
        held: ["A1"],
        available: ["A2", "A3", "A4"],
      },
    });
    const { bookings, screens, service } = makeService({ screen });

    const booking = await service.editHeldBooking({
      bookingId: "booking-1",
      groupSize: 2,
    });

    expect(screens.updateSeatStates).toHaveBeenNthCalledWith(
      1,
      "screen-1",
      ["screen-1-A1"],
      {
        status: "AVAILABLE",
        heldByBookingId: null,
      }
    );
    expect(screens.updateSeatStates).toHaveBeenNthCalledWith(
      2,
      "screen-1",
      ["screen-1-A1", "screen-1-A2"],
      {
        status: "HELD",
        heldByBookingId: "booking-1",
      }
    );
    expect(bookings.update).toHaveBeenCalledWith("booking-1", {
      seats: expect.arrayContaining([
        expect.objectContaining({ seatId: "screen-1-A1" }),
        expect.objectContaining({ seatId: "screen-1-A2" }),
      ]),
      totalCost: 20,
    });
    expect(booking.seats).toHaveLength(2);
  });

  it("expires an expired hold during confirmation", async () => {
    const { bookings, screens, service } = makeService({
      booking: makeBooking({
        holdExpiresAt: "2025-12-31T23:59:59.000Z",
      }),
    });

    await expect(service.confirmBooking("booking-1")).rejects.toMatchObject({
      code: "HOLD_EXPIRED",
    } satisfies Partial<BookingServiceError>);

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
