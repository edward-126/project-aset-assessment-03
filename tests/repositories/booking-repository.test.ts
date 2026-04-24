import { beforeEach, describe, expect, it, vi } from "vitest";
import { BookingRepository } from "@/lib/repositories/booking-repository";
import type { BookingDocument } from "@/models/Booking";
import type { Booking } from "@/types/domain";

const mocks = vi.hoisted(() => ({
  connectToDatabase: vi.fn(),
  create: vi.fn(),
  find: vi.fn(),
  findOne: vi.fn(),
  findOneAndUpdate: vi.fn(),
}));

vi.mock("@/lib/db/mongodb", () => ({
  connectToDatabase: mocks.connectToDatabase,
}));

vi.mock("@/models/Booking", () => ({
  BookingModel: {
    create: mocks.create,
    find: mocks.find,
    findOne: mocks.findOne,
    findOneAndUpdate: mocks.findOneAndUpdate,
  },
}));

function makeBookingDocument(
  overrides: Partial<BookingDocument> = {}
): BookingDocument {
  return {
    id: "booking-1",
    screenId: "screen-1",
    bookingReference: "CSP-0001",
    customerName: "Test Customer",
    customerEmail: "test@example.com",
    customerPhone: "0712345678",
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
    holdExpiresAt: "2026-01-01T00:10:00.000Z",
    totalCost: 10,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:01:00.000Z"),
    ...overrides,
  };
}

function makeBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    ...makeBookingDocument(),
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:01:00.000Z",
    ...overrides,
  };
}

function makeLeanQuery<T>(value: T) {
  return {
    lean: vi.fn(() => ({
      exec: vi.fn().mockResolvedValue(value),
    })),
  };
}

function makeSortedLeanQuery<T>(value: T) {
  return {
    sort: vi.fn(() => makeLeanQuery(value)),
  };
}

describe("BookingRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.connectToDatabase.mockResolvedValue(undefined);
  });

  it("saves a booking and returns a domain booking", async () => {
    const repository = new BookingRepository();
    const booking = makeBooking();
    mocks.create.mockResolvedValue({
      toObject: () => makeBookingDocument(),
    });

    const result = await repository.save(booking);

    expect(mocks.connectToDatabase).toHaveBeenCalledOnce();
    expect(mocks.create).toHaveBeenCalledWith(booking);
    expect(result).toEqual(
      expect.objectContaining({
        id: "booking-1",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:01:00.000Z",
      })
    );
  });

  it("findById returns null when the booking does not exist", async () => {
    const repository = new BookingRepository();
    mocks.findOne.mockReturnValue(makeLeanQuery(null));

    await expect(repository.findById("missing-booking")).resolves.toBeNull();

    expect(mocks.findOne).toHaveBeenCalledWith({ id: "missing-booking" });
  });

  it("updates a booking and returns the updated booking", async () => {
    const repository = new BookingRepository();
    const updatedBooking = makeBookingDocument({ status: "CONFIRMED" });
    mocks.findOneAndUpdate.mockReturnValue(makeLeanQuery(updatedBooking));

    const result = await repository.update("booking-1", {
      status: "CONFIRMED",
    });

    expect(mocks.findOneAndUpdate).toHaveBeenCalledWith(
      { id: "booking-1" },
      { $set: { status: "CONFIRMED" } },
      { new: true, runValidators: true }
    );
    expect(result.status).toBe("CONFIRMED");
  });

  it("throws when updating a missing booking", async () => {
    const repository = new BookingRepository();
    mocks.findOneAndUpdate.mockReturnValue(makeLeanQuery(null));

    await expect(repository.update("missing-booking", {})).rejects.toThrow(
      "Booking missing-booking was not found."
    );
  });

  it("finds expired held bookings using ISO date ordering", async () => {
    const repository = new BookingRepository();
    const expiredBooking = makeBookingDocument();
    const query = makeSortedLeanQuery([expiredBooking]);
    mocks.find.mockReturnValue(query);
    const now = new Date("2026-01-01T00:15:00.000Z");

    const result = await repository.findExpiredHeldBookings(now);

    expect(mocks.find).toHaveBeenCalledWith({
      status: "HELD",
      holdExpiresAt: { $ne: null, $lte: "2026-01-01T00:15:00.000Z" },
    });
    expect(query.sort).toHaveBeenCalledWith({ holdExpiresAt: 1 });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("booking-1");
  });
});
