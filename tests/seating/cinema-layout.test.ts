import { describe, expect, it } from "vitest";
import {
  CINEMA_ROW_LABELS,
  createAssessmentCinemaSeatMap,
  flattenSeats,
  getAccessibleSeatIds,
  getCinemaRowBlocks,
  getCinemaRowColumns,
} from "@/domain/seating";
import type { Seat, SeatMap } from "@/domain/seating";

describe("assessment cinema layout", () => {
  it("encodes rows A-O including row I", () => {
    const seatMap = createAssessmentCinemaSeatMap();

    expect(seatMap.rows.map((row) => row.id)).toEqual([
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
    ]);
    expect(CINEMA_ROW_LABELS).toContain("I");
  });

  it("uses the sparse row map from the assessment markdown", () => {
    expect(getCinemaRowColumns("A")).toEqual([
      1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 27, 28,
    ]);
    expect(getCinemaRowColumns("I")).toEqual([
      5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
      24, 25, 26, 27, 28,
    ]);
    expect(getCinemaRowColumns("O")).toEqual([
      5, 6, 7, 8, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23, 24,
      25,
    ]);
  });

  it("preserves physical row blocks across cinema aisles", () => {
    expect(getCinemaRowBlocks("A").map((block) => block.columns)).toEqual([
      [1, 2],
      [
        5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
        22, 23, 24,
      ],
      [27, 28],
    ]);
    expect(getCinemaRowBlocks("B").map((block) => block.columns)).toEqual([
      [1, 2, 3, 4],
      [
        5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
        22, 23, 24,
      ],
      [25, 26, 27, 28],
    ]);
    expect(getCinemaRowBlocks("G").map((block) => block.columns)).toEqual([
      [3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      [25, 26, 27, 28],
    ]);
    expect(getCinemaRowBlocks("H").map((block) => block.columns)).toEqual([
      [4, 5, 6, 7],
      [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      [25, 26, 27, 28],
    ]);
    expect(getCinemaRowBlocks("I").map((block) => block.columns)).toEqual([
      [5, 6, 7, 8],
      [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      [25, 26, 27, 28],
    ]);
    expect(getCinemaRowBlocks("J").map((block) => block.columns)).toEqual([
      [6, 7, 8, 9],
      [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      [25, 26, 27, 28],
    ]);
    expect(getCinemaRowBlocks("K").map((block) => block.columns)).toEqual([
      [7, 8, 9, 10],
      [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      [25, 26, 27, 28],
    ]);
    expect(getCinemaRowBlocks("L").map((block) => block.columns)).toEqual([
      [8, 9, 10, 11],
      [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      [25, 26, 27, 28],
    ]);
    expect(getCinemaRowBlocks("M").map((block) => block.columns)).toEqual([
      [9, 10, 11, 12],
      [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      [25, 26, 27, 28],
    ]);
    expect(getCinemaRowBlocks("N").map((block) => block.columns)).toEqual([
      [5, 6, 7, 8],
      [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [21, 22, 23, 24],
    ]);
    expect(getCinemaRowBlocks("O").map((block) => block.columns)).toEqual([
      [5, 6, 7, 8],
      [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [22, 23, 24, 25],
    ]);
  });

  it("uses the requested lower centre block sizes", () => {
    expect(centreBlockSize("F")).toBe(19);
    expect(centreBlockSize("G")).toBe(18);
    expect(centreBlockSize("H")).toBe(17);
    expect(centreBlockSize("I")).toBe(16);
    expect(centreBlockSize("J")).toBe(15);
    expect(centreBlockSize("K")).toBe(14);
    expect(centreBlockSize("L")).toBe(13);
    expect(centreBlockSize("M")).toBe(12);
    expect(centreBlockSize("N")).toBe(11);
    expect(centreBlockSize("O")).toBe(10);
  });

  it("marks aisle boundaries by physical block instead of numeric adjacency", () => {
    const seatMap = createAssessmentCinemaSeatMap();

    expect(findSeat(seatMap, "B4").blockId).not.toBe(
      findSeat(seatMap, "B5").blockId
    );
    expect(findSeat(seatMap, "B24").blockId).not.toBe(
      findSeat(seatMap, "B25").blockId
    );
    expect(findSeat(seatMap, "B12").blockId).toBe(
      findSeat(seatMap, "B13").blockId
    );

    expect(findSeat(seatMap, "B4").isAisle).toBe(true);
    expect(findSeat(seatMap, "B5").isAisle).toBe(true);
    expect(findSeat(seatMap, "B12").isAisle).toBe(false);
  });

  it("does not expose aisle-spanning seats as a single physical block", () => {
    const rowBBlocks = getCinemaRowBlocks("B");

    expect(
      rowBBlocks.some(
        (block) => block.columns.includes(4) && block.columns.includes(5)
      )
    ).toBe(false);
    expect(
      rowBBlocks.some(
        (block) => block.columns.includes(24) && block.columns.includes(25)
      )
    ).toBe(false);
  });

  it("gives every visible seat a unique stable id", () => {
    const seats = flattenSeats(createAssessmentCinemaSeatMap());
    const ids = seats.map((seat) => seat.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain("A1");
    expect(ids).not.toContain("A3");
    expect(ids).not.toContain("O9");
  });

  it("represents standard, VIP, and accessible zones", () => {
    const seats = flattenSeats(createAssessmentCinemaSeatMap());
    const zoneBySeatId = new Map(seats.map((seat) => [seat.id, seat.zone]));

    expect(zoneBySeatId.get("A1")).toBe("standard");
    expect(vipSeatIds(seatMapById(seats), "E")).toEqual(expandRange("E", 9, 20));
    expect(vipSeatIds(seatMapById(seats), "F")).toEqual(expandRange("F", 9, 21));
    expect(vipSeatIds(seatMapById(seats), "G")).toEqual(expandRange("G", 9, 22));
    expect(vipSeatIds(seatMapById(seats), "H")).toEqual(expandRange("H", 9, 23));
    expect(zoneBySeatId.get("F8")).toBe("standard");
    expect(zoneBySeatId.get("G8")).toBe("standard");
    expect(zoneBySeatId.get("H8")).toBe("standard");
    expect(zoneBySeatId.get("G21")).toBe("vip");
    expect(zoneBySeatId.get("G22")).toBe("vip");
    expect(zoneBySeatId.get("H21")).toBe("vip");
    expect(zoneBySeatId.get("H22")).toBe("vip");
    expect(zoneBySeatId.get("H23")).toBe("vip");
    expect(zoneBySeatId.get("I15")).toBe("standard");
    expect(zoneBySeatId.get("J12")).toBe("standard");
    expect(getAccessibleSeatIds()).toEqual([
      "N5",
      "N6",
      "O5",
      "O6",
      "O19",
      "O20",
    ]);
    expect(getAccessibleSeatIds().map((seatId) => zoneBySeatId.get(seatId))).toEqual(
      Array.from({ length: 6 }, () => "accessible")
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

function seatMapById(seats: readonly Seat[]) {
  return new Map(seats.map((seat) => [seat.id, seat]));
}

function vipSeatIds(seatsById: ReadonlyMap<string, Seat>, row: string) {
  return [...seatsById.values()]
    .filter((seat) => seat.row === row && seat.zone === "vip")
    .map((seat) => seat.id);
}

function expandRange(row: string, start: number, end: number) {
  return Array.from(
    { length: end - start + 1 },
    (_, index) => `${row}${start + index}`
  );
}

function centreBlockSize(row: Parameters<typeof getCinemaRowBlocks>[0]) {
  const [, centreBlock] = getCinemaRowBlocks(row);

  return centreBlock.columns.length;
}
