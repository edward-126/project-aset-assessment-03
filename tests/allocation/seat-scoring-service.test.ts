import { describe, expect, it } from "vitest";
import { SeatScoringService } from "@/lib/allocation";
import { makeTestScreen } from "./test-helpers";

describe("SeatScoringService", () => {
  it("FR13: calculates horizontal distance from the row center", () => {
    const screen = makeTestScreen({
      totalRows: 1,
      totalColumns: 10,
      preferredRowStart: 1,
      preferredRowEnd: 1,
      plan: {
        available: ["A4", "A5", "A6", "A7"],
      },
    });
    const candidate = screen.seats.filter((seat) =>
      ["A4", "A5", "A6", "A7"].includes(`${seat.rowLabel}${seat.seatNumber}`)
    );
    const scoringService = new SeatScoringService();

    expect(scoringService.calculateCenterDistance(candidate, screen)).toBe(0);
  });

  it("FR14: applies viewing-zone distance outside the preferred row range", () => {
    const screen = makeTestScreen({
      totalRows: 4,
      totalColumns: 4,
      preferredRowStart: 3,
      preferredRowEnd: 3,
      plan: {
        available: ["A2", "B2", "C2"],
      },
    });
    const scoringService = new SeatScoringService();
    const frontSeat = screen.seats.filter(
      (seat) => `${seat.rowLabel}${seat.seatNumber}` === "A2"
    );
    const preferredSeat = screen.seats.filter(
      (seat) => `${seat.rowLabel}${seat.seatNumber}` === "C2"
    );

    expect(
      scoringService.calculateViewingZoneDistance(preferredSeat, screen)
    ).toBe(0);
    expect(scoringService.calculateViewingZoneDistance(frontSeat, screen)).toBe(
      2
    );
  });
});
