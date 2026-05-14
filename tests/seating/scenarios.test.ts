import { describe, expect, it } from "vitest";
import {
  DEFAULT_BROKEN_SEATS,
  SCENARIO_IDS,
  createScenarioSeatMap,
  flattenSeats,
} from "@/domain/seating";
import type { Seat, SeatMap, SeatState } from "@/domain/seating";

describe("assessment seating scenarios", () => {
  it("generates every required scenario deterministically", () => {
    for (const scenarioId of SCENARIO_IDS) {
      const first = createScenarioSeatMap(scenarioId);
      const second = createScenarioSeatMap(scenarioId);

      expect(first).toEqual(second);
    }
  });

  it("keeps the empty scenario available while preserving restricted zones", () => {
    const seatMap = createScenarioSeatMap("empty");
    const seats = flattenSeats(seatMap);

    expect(seats.every((seat) => seat.state === "available")).toBe(true);
    expect(findSeat(seatMap, "E12").zone).toBe("vip");
    expect(findSeat(seatMap, "N5").zone).toBe("accessible");
  });

  it("adds deterministic broken seats to occupied demo scenarios", () => {
    const halfFull = createScenarioSeatMap("halfFull");
    const brokenSeats = seatsWithState(halfFull, "broken").map(
      (seat) => seat.id
    );

    expect(brokenSeats).toEqual([...DEFAULT_BROKEN_SEATS]);
    expect(brokenSeats).toHaveLength(7);
    expect(findSeat(halfFull, "C7").state).toBe("broken");
    expect(findSeat(halfFull, "E24").state).toBe("broken");
    expectBrokenSeatsFollowAssessmentRules(halfFull);
  });

  it("defines expected occupied seats for half-full and nearly-full scenarios", () => {
    const halfFull = createScenarioSeatMap("halfFull");
    const nearlyFull = createScenarioSeatMap("nearlyFull");

    expect(findSeat(halfFull, "A5").state).toBe("booked");
    expect(findSeat(halfFull, "D22").state).toBe("held");
    expect(findSeat(halfFull, "G24").state).toBe("held");

    expect(findSeat(nearlyFull, "A1").state).toBe("booked");
    expect(findSeat(nearlyFull, "J6").state).toBe("held");
    expect(findSeat(nearlyFull, "B13").state).toBe("available");
    expect(seatsWithState(nearlyFull, "booked").length).toBeGreaterThan(
      seatsWithState(halfFull, "booked").length
    );
  });

  it("keeps accessibility seats only in rows N and O as adjacent pairs", () => {
    const accessibleSeats = flattenSeats(createScenarioSeatMap("empty")).filter(
      (seat) => seat.zone === "accessible"
    );

    expect(accessibleSeats.map((seat) => seat.id)).toEqual([
      "N5",
      "N6",
      "O5",
      "O6",
      "O19",
      "O20",
    ]);
    expect(accessibleSeats.every((seat) => ["N", "O"].includes(seat.row))).toBe(
      true
    );
  });
});

function findSeat(seatMap: SeatMap, seatId: string): Seat {
  const seat = flattenSeats(seatMap).find((candidate) => candidate.id === seatId);

  if (!seat) {
    throw new Error(`Expected seat ${seatId} to exist.`);
  }

  return seat;
}

function seatsWithState(seatMap: SeatMap, state: SeatState) {
  return flattenSeats(seatMap).filter((seat) => seat.state === state);
}

function expectBrokenSeatsFollowAssessmentRules(seatMap: SeatMap) {
  const brokenSeats = seatsWithState(seatMap, "broken");
  const brokenByRow = new Map<string, Seat[]>();

  for (const seat of brokenSeats) {
    const rowSeats = brokenByRow.get(seat.row) ?? [];
    rowSeats.push(seat);
    brokenByRow.set(seat.row, rowSeats);
  }

  for (const rowSeats of brokenByRow.values()) {
    expect(rowSeats.length).toBeLessThanOrEqual(2);

    const sorted = [...rowSeats].sort((left, right) => left.column - right.column);

    for (let index = 1; index < sorted.length; index += 1) {
      expect(sorted[index].column - sorted[index - 1].column).toBeGreaterThan(1);
    }
  }
}
