import type { Seat, SeatMap, SeatRow, SeatZone } from "./types";

export const CINEMA_ROW_LABELS = [
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
] as const;

export type CinemaRowLabel = (typeof CINEMA_ROW_LABELS)[number];

export const CINEMA_LAYOUT_ID = "assessment-cinema-sparse-layout";

type SeatColumnRange = readonly [number, number];

const ROW_BLOCKS: Record<CinemaRowLabel, readonly SeatColumnRange[]> = {
  A: [
    [1, 2],
    [5, 24],
    [27, 28],
  ],
  B: [
    [1, 4],
    [5, 24],
    [25, 28],
  ],
  C: [
    [1, 4],
    [5, 24],
    [25, 28],
  ],
  D: [
    [1, 4],
    [5, 24],
    [25, 28],
  ],
  E: [
    [1, 4],
    [5, 24],
    [25, 28],
  ],
  F: [
    [2, 5],
    [6, 24],
    [25, 28],
  ],
  G: [
    [3, 6],
    [7, 24],
    [25, 28],
  ],
  H: [
    [4, 7],
    [8, 24],
    [25, 28],
  ],
  I: [
    [5, 8],
    [9, 24],
    [25, 28],
  ],
  J: [
    [6, 9],
    [10, 24],
    [25, 28],
  ],
  K: [
    [7, 10],
    [11, 24],
    [25, 28],
  ],
  L: [
    [8, 11],
    [12, 24],
    [25, 28],
  ],
  M: [
    [9, 12],
    [13, 24],
    [25, 28],
  ],
  N: [
    [5, 8],
    [10, 20],
    [21, 24],
  ],
  O: [
    [5, 8],
    [11, 20],
    [22, 25],
  ],
};

const VIP_SEAT_RANGES: Partial<Record<CinemaRowLabel, SeatColumnRange>> = {
  E: [9, 20],
  F: [9, 21],
  G: [9, 22],
  H: [9, 23],
};
const ACCESSIBLE_SEATS = new Set(["N5", "N6", "O5", "O6", "O19", "O20"]);

export function createAssessmentCinemaSeatMap(): SeatMap {
  return {
    id: CINEMA_LAYOUT_ID,
    name: "Assessment Cinema Seating Plan",
    rows: CINEMA_ROW_LABELS.map(buildRow),
  };
}

export function getCinemaRowColumns(row: CinemaRowLabel) {
  return getCinemaRowBlocks(row).flatMap((block) => block.columns);
}

export function getCinemaRowBlocks(row: CinemaRowLabel) {
  return ROW_BLOCKS[row].map(([start, end], index) => ({
    id: cinemaBlockId(row, index),
    columns: expandColumns([start, end]),
  }));
}

export function getAccessibleSeatIds() {
  return [...ACCESSIBLE_SEATS].sort(compareSeatIds);
}

function buildRow(row: CinemaRowLabel): SeatRow {
  const blocks = getCinemaRowBlocks(row);

  return {
    id: row,
    seats: blocks.flatMap((block, blockIndex) =>
      block.columns.map((column, columnIndex) => {
        const id = seatId(row, column);
        const isFirstSeatInBlock = columnIndex === 0;
        const isLastSeatInBlock = columnIndex === block.columns.length - 1;

        return {
          id,
          row,
          column,
          blockId: block.id,
          state: "available",
          zone: getSeatZone(row, column, id),
          isEdge:
            (blockIndex === 0 && isFirstSeatInBlock) ||
            (blockIndex === blocks.length - 1 && isLastSeatInBlock),
          isAisle: isFirstSeatInBlock || isLastSeatInBlock,
        };
      })
    ),
  };
}

function getSeatZone(
  row: CinemaRowLabel,
  column: number,
  id: string
): SeatZone {
  if (ACCESSIBLE_SEATS.has(id)) {
    return "accessible";
  }

  const vipRange = VIP_SEAT_RANGES[row];

  if (vipRange && column >= vipRange[0] && column <= vipRange[1]) {
    return "vip";
  }

  return "standard";
}

function seatId(row: string, column: number) {
  return `${row}${column}`;
}

function cinemaBlockId(row: CinemaRowLabel, blockIndex: number) {
  return `${row}-${blockIndex + 1}`;
}

function expandColumns(...ranges: readonly [number, number][]) {
  const columns = ranges.flatMap(([start, end]) =>
    Array.from({ length: end - start + 1 }, (_, index) => start + index)
  );

  return [...new Set(columns)].sort((left, right) => left - right);
}

function compareSeatIds(left: string, right: string) {
  const leftMatch = /^([A-Z]+)(\d+)$/.exec(left);
  const rightMatch = /^([A-Z]+)(\d+)$/.exec(right);

  if (!leftMatch || !rightMatch) {
    return left.localeCompare(right);
  }

  if (leftMatch[1] !== rightMatch[1]) {
    return leftMatch[1].localeCompare(rightMatch[1]);
  }

  return Number(leftMatch[2]) - Number(rightMatch[2]);
}

export function flattenSeats(seatMap: SeatMap): Seat[] {
  return seatMap.rows.flatMap((row) => row.seats);
}
