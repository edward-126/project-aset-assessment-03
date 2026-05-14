import { sortSeats } from "./candidate-generator";
import type { Seat, SeatMap } from "./types";

const BLOCKING_STATES = new Set([
  "booked",
  "held",
  "selected",
  "broken",
  "unavailable",
]);

export function countOrphanGapsAfterAllocation(
  seatMap: SeatMap,
  candidate: readonly Seat[]
) {
  const candidateIds = new Set(candidate.map((seat) => seat.id));
  let orphanGapCount = 0;

  for (const row of seatMap.rows) {
    const blockIds = [...new Set(row.seats.map((seat) => seat.blockId))];

    for (const blockId of blockIds) {
      const seats = sortSeats(row.seats.filter((seat) => seat.blockId === blockId));
      let availableRun = 0;

      for (const seat of seats) {
        if (isAvailableAfterAllocation(seat, candidateIds)) {
          availableRun += 1;
          continue;
        }

        if (availableRun === 1) {
          orphanGapCount += 1;
        }

        availableRun = 0;
      }

      if (availableRun === 1) {
        orphanGapCount += 1;
      }
    }
  }

  return orphanGapCount;
}

export function wouldPlaceSoloBetweenOccupiedSeats(
  seatMap: SeatMap,
  candidate: readonly Seat[]
) {
  if (candidate.length !== 1) {
    return false;
  }

  const [seat] = candidate;
  const row = seatMap.rows.find((candidateRow) => candidateRow.id === seat.row);

  if (!row) {
    return false;
  }

  const blockSeats = sortSeats(
    row.seats.filter((rowSeat) => rowSeat.blockId === seat.blockId)
  );
  const seatIndex = blockSeats.findIndex((rowSeat) => rowSeat.id === seat.id);
  const previousSeat = blockSeats[seatIndex - 1];
  const nextSeat = blockSeats[seatIndex + 1];

  return Boolean(
    previousSeat &&
      nextSeat &&
      isBlockingSeat(previousSeat) &&
      isBlockingSeat(nextSeat)
  );
}

function isAvailableAfterAllocation(
  seat: Seat,
  candidateIds: ReadonlySet<string>
) {
  return seat.state === "available" && !candidateIds.has(seat.id);
}

function isBlockingSeat(seat: Seat) {
  return BLOCKING_STATES.has(seat.state) || seat.zone !== "standard";
}
