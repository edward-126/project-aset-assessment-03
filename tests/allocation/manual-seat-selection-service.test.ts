import { describe, expect, it } from "vitest";
import { ManualSeatSelectionService } from "@/lib/allocation";
import { BookingServiceError } from "@/lib/booking/booking-errors";
import { makeTestScreen, seatLabels } from "./test-helpers";

describe("ManualSeatSelectionService", () => {
  const service = new ManualSeatSelectionService();

  it("accepts available seats matching the requested group size", () => {
    const screen = makeTestScreen({
      id: "screen-1",
      totalRows: 1,
      totalColumns: 4,
      preferredRowStart: 1,
      preferredRowEnd: 1,
      plan: {
        available: ["A1", "A2", "A3"],
        booked: ["A4"],
      },
    });

    const result = service.validateSelection({
      screen,
      groupSize: 2,
      seatIds: ["screen-1-A2", "screen-1-A1"],
    });

    expect(seatLabels(result.seats)).toEqual(["A1", "A2"]);
    expect(result.isContiguous).toBe(true);
  });

  it("rejects booked seats", () => {
    const screen = makeTestScreen({
      id: "screen-1",
      totalRows: 1,
      totalColumns: 3,
      preferredRowStart: 1,
      preferredRowEnd: 1,
      plan: {
        available: ["A1", "A2"],
        booked: ["A3"],
      },
    });

    expect(() =>
      service.validateSelection({
        screen,
        groupSize: 2,
        seatIds: ["screen-1-A2", "screen-1-A3"],
      })
    ).toThrowError(
      expect.objectContaining({
        code: "INVALID_SEAT_SELECTION",
      }) satisfies Partial<BookingServiceError>
    );
  });
});
