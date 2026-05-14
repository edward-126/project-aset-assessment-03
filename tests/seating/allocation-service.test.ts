import { describe, expect, it } from "vitest";
import {
  allocateSeats,
  createAssessmentCinemaSeatMap,
  createScenarioSeatMap,
  findContiguousBlocks,
  flattenSeats,
} from "@/domain/seating";
import type { SeatMap, SeatState } from "@/domain/seating";

describe("assessment seating allocation service", () => {
  it("UT1: allocates group size 2 contiguously when valid space exists", () => {
    const result = allocateSeats(createScenarioSeatMap("empty"), {
      groupSize: 2,
      requestType: "standard",
    });

    expect(result.status).toBe("ALLOCATED");
    expect(result.selectedSeats).toHaveLength(2);
    expect(seatsShareRowAndBlock(result.selectedSeats)).toBe(true);
    expect(areAdjacent(result.selectedSeats)).toBe(true);
  });

  it("UT2: allocates group size 7 contiguously when a valid row block exists", () => {
    const result = allocateSeats(createScenarioSeatMap("empty"), {
      groupSize: 7,
      requestType: "standard",
    });

    expect(result.status).toBe("ALLOCATED");
    expect(result.selectedSeats).toHaveLength(7);
    expect(seatsShareRowAndBlock(result.selectedSeats)).toBe(true);
    expect(areAdjacent(result.selectedSeats)).toBe(true);
  });

  it("UT3: never selects booked seats", () => {
    const seatMap = seatMapWithStates("booked", {
      available: ["B5", "B6", "B7"],
      booked: ["B8", "B9", "B10"],
    });
    const result = allocateSeats(seatMap, {
      groupSize: 3,
      requestType: "standard",
    });

    expect(result.status).toBe("ALLOCATED");
    expect(result.selectedSeats).toEqual(["B5", "B6", "B7"]);
    expect(result.selectedSeats).not.toEqual(["B8", "B9", "B10"]);
  });

  it("UT4: never selects broken or unavailable seats in normal mode", () => {
    const seatMap = seatMapWithStates("booked", {
      available: ["C5", "C6"],
      broken: ["C7"],
      unavailable: ["C8"],
    });
    const result = allocateSeats(seatMap, {
      groupSize: 2,
      requestType: "standard",
    });

    expect(result.status).toBe("ALLOCATED");
    expect(result.selectedSeats).toEqual(["C5", "C6"]);
    expect(result.selectedSeats).not.toContain("C7");
    expect(result.selectedSeats).not.toContain("C8");
  });

  it("UT5: does not select VIP seats for a standard request", () => {
    const seatMap = seatMapWithStates("booked", {
      available: ["B5", "B6", "E12", "E13"],
    });
    const result = allocateSeats(seatMap, {
      groupSize: 2,
      requestType: "standard",
    });

    expect(result.status).toBe("ALLOCATED");
    expect(result.selectedSeats).toEqual(["B5", "B6"]);
  });

  it("UT6: reserves accessible seats unless request type permits them", () => {
    const standardSeatMap = seatMapWithStates("booked", {
      available: ["B5", "B6", "N5", "N6"],
    });
    const standardResult = allocateSeats(standardSeatMap, {
      groupSize: 2,
      requestType: "standard",
    });

    expect(standardResult.status).toBe("ALLOCATED");
    expect(standardResult.selectedSeats).toEqual(["B5", "B6"]);

    const accessibleSeatMap = seatMapWithStates("booked", {
      available: ["N5", "N6"],
    });
    const accessibleResult = allocateSeats(accessibleSeatMap, {
      groupSize: 2,
      requestType: "accessible",
    });

    expect(accessibleResult.status).toBe("ALLOCATED");
    expect(accessibleResult.selectedSeats).toEqual(["N5", "N6"]);
  });

  it("UT7: ranks a non-orphaning candidate above a single-seat orphan candidate", () => {
    const seatMap = seatMapWithStates("booked", {
      available: [
        "B5",
        "B6",
        "B7",
        "B8",
        "B9",
        "C5",
        "C6",
        "C7",
        "C8",
        "C9",
        "C10",
      ],
    });
    const result = allocateSeats(seatMap, {
      groupSize: 4,
      requestType: "standard",
    });

    expect(result.status).toBe("ALLOCATED");
    expect(result.selectedSeats.every((seatId) => seatId.startsWith("C"))).toBe(
      true
    );
    expect(result.scoreBreakdown?.orphanSeatPenalty).toBe(0);
  });

  it("UT8: does not place a standard solo attendee between occupied groups", () => {
    const seatMap = seatMapWithStates("booked", {
      available: ["B5", "K12"],
      booked: ["K11", "K13"],
    });
    const result = allocateSeats(seatMap, {
      groupSize: 1,
      requestType: "standard",
    });

    expect(result.status).toBe("ALLOCATED");
    expect(result.selectedSeats).toEqual(["B5"]);
  });

  it("UT9: returns the same allocation for identical input", () => {
    const seatMap = createScenarioSeatMap("halfFull");
    const request = { groupSize: 5, requestType: "standard" as const };

    const firstResult = allocateSeats(seatMap, request);
    const secondResult = allocateSeats(seatMap, request);

    expect(firstResult).toEqual(secondResult);
  });

  it("UT10: admin override bypasses normal restrictions", () => {
    const seatMap = seatMapWithStates("booked", {
      unavailable: ["B5", "B6"],
    });
    const result = allocateSeats(seatMap, {
      groupSize: 2,
      requestType: "adminOverride",
    });

    expect(result.status).toBe("OVERRIDE_ALLOCATED");
    expect(result.selectedSeats).toHaveLength(2);
  });

  it("candidate generation does not span physical aisle blocks", () => {
    const candidates = findContiguousBlocks(createAssessmentCinemaSeatMap(), 2);
    const candidateIds = candidates.map((candidate) =>
      candidate.map((seat) => seat.id)
    );

    expect(candidateIds).not.toContainEqual(["B4", "B5"]);
    expect(candidateIds).not.toContainEqual(["B24", "B25"]);
    expect(candidateIds).toContainEqual(["B12", "B13"]);
  });

  it("rejects group sizes outside the assessment range", () => {
    const result = allocateSeats(createScenarioSeatMap("empty"), {
      groupSize: 8,
      requestType: "standard",
    });

    expect(result.status).toBe("REJECTED");
    expect(result.reason).toContain("between 1 and 7");
  });
});

function seatMapWithStates(
  defaultState: SeatState,
  plan: Partial<Record<SeatState, readonly string[]>>
): SeatMap {
  const stateBySeatId = new Map<string, SeatState>();

  for (const [state, seatIds] of Object.entries(plan) as [
    SeatState,
    readonly string[],
  ][]) {
    for (const seatId of seatIds) {
      stateBySeatId.set(seatId, state);
    }
  }

  const seatMap = createAssessmentCinemaSeatMap();

  return {
    ...seatMap,
    rows: seatMap.rows.map((row) => ({
      ...row,
      seats: row.seats.map((seat) => ({
        ...seat,
        state: stateBySeatId.get(seat.id) ?? defaultState,
      })),
    })),
  };
}

function seatsShareRowAndBlock(seatIds: readonly string[]) {
  const seatMap = createAssessmentCinemaSeatMap();
  const seats = flattenSeats(seatMap).filter((seat) => seatIds.includes(seat.id));
  const [firstSeat] = seats;

  return seats.every(
    (seat) => seat.row === firstSeat.row && seat.blockId === firstSeat.blockId
  );
}

function areAdjacent(seatIds: readonly string[]) {
  const columns = seatIds
    .map((seatId) => Number(/\d+$/.exec(seatId)?.[0]))
    .sort((left, right) => left - right);

  return columns.every(
    (column, index) => index === 0 || column === columns[index - 1] + 1
  );
}
