import type { Seat, SeatMap } from "./types";

export function findContiguousBlocks(
  seatMap: SeatMap,
  groupSize: number
): Seat[][] {
  if (!Number.isInteger(groupSize) || groupSize <= 0) {
    return [];
  }

  const candidates: Seat[][] = [];

  for (const row of seatMap.rows) {
    const seatsByBlock = new Map<string, Seat[]>();

    for (const seat of row.seats) {
      const blockSeats = seatsByBlock.get(seat.blockId) ?? [];
      blockSeats.push(seat);
      seatsByBlock.set(seat.blockId, blockSeats);
    }

    for (const blockSeats of seatsByBlock.values()) {
      const sortedBlockSeats = sortSeats(blockSeats);

      for (
        let startIndex = 0;
        startIndex <= sortedBlockSeats.length - groupSize;
        startIndex += 1
      ) {
        const candidate = sortedBlockSeats.slice(
          startIndex,
          startIndex + groupSize
        );

        if (isPhysicallyContiguous(candidate)) {
          candidates.push(candidate);
        }
      }
    }
  }

  return candidates;
}

export function sortSeats(seats: readonly Seat[]) {
  return [...seats].sort((left, right) => {
    if (left.row !== right.row) {
      return left.row.localeCompare(right.row);
    }

    if (left.column !== right.column) {
      return left.column - right.column;
    }

    return left.id.localeCompare(right.id);
  });
}

function isPhysicallyContiguous(seats: readonly Seat[]) {
  if (seats.length <= 1) {
    return true;
  }

  const sortedSeats = sortSeats(seats);
  const firstSeat = sortedSeats[0];

  return sortedSeats.every(
    (seat, index) =>
      seat.row === firstSeat.row &&
      seat.blockId === firstSeat.blockId &&
      seat.column === firstSeat.column + index
  );
}
