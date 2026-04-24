import type { Screen, Seat } from "@/types/domain";

export type RowSeatGroup = {
  rowLabel: string;
  positionY: number;
  seats: Seat[];
};

export function seatKey(seat: Pick<Seat, "rowLabel" | "seatNumber">) {
  return `${seat.rowLabel}:${seat.seatNumber}`;
}

export function getSeatKeySet(seats: readonly Seat[]) {
  return new Set(seats.map(seatKey));
}

export function sortSeatsForAllocation(seats: readonly Seat[]) {
  return [...seats].sort((a, b) => {
    if (a.positionY !== b.positionY) {
      return a.positionY - b.positionY;
    }

    if (a.seatNumber !== b.seatNumber) {
      return a.seatNumber - b.seatNumber;
    }

    return a.id.localeCompare(b.id);
  });
}

export function groupSeatsByRow(seats: readonly Seat[]): RowSeatGroup[] {
  const rowMap = new Map<string, RowSeatGroup>();

  for (const seat of sortSeatsForAllocation(seats)) {
    const existing = rowMap.get(seat.rowLabel);

    if (existing) {
      existing.seats.push(seat);
      existing.positionY = Math.min(existing.positionY, seat.positionY);
      continue;
    }

    rowMap.set(seat.rowLabel, {
      rowLabel: seat.rowLabel,
      positionY: seat.positionY,
      seats: [seat],
    });
  }

  return [...rowMap.values()].sort((a, b) => {
    if (a.positionY !== b.positionY) {
      return a.positionY - b.positionY;
    }

    return a.rowLabel.localeCompare(b.rowLabel);
  });
}

export function getAllocatableSeats(screen: Screen) {
  return sortSeatsForAllocation(
    screen.seats.filter((seat) => seat.status === "AVAILABLE")
  );
}

export function getRowSeats(screen: Screen, rowLabel: string) {
  return sortSeatsForAllocation(
    screen.seats.filter((seat) => seat.rowLabel === rowLabel)
  );
}

export function getRowCenter(screen: Screen) {
  return (screen.totalColumns + 1) / 2;
}

export function isContiguousSeatGroup(seats: readonly Seat[]) {
  if (seats.length <= 1) {
    return true;
  }

  const sorted = sortSeatsForAllocation(seats);
  const [firstSeat] = sorted;

  return sorted.every(
    (seat, index) =>
      seat.rowLabel === firstSeat.rowLabel &&
      seat.seatNumber === firstSeat.seatNumber + index
  );
}

export function splitIntoClusters(seats: readonly Seat[]) {
  const clusters: Seat[][] = [];

  for (const row of groupSeatsByRow(seats)) {
    let currentCluster: Seat[] = [];

    for (const seat of row.seats) {
      const previousSeat = currentCluster.at(-1);

      if (
        previousSeat &&
        previousSeat.rowLabel === seat.rowLabel &&
        previousSeat.seatNumber + 1 === seat.seatNumber
      ) {
        currentCluster.push(seat);
        continue;
      }

      if (currentCluster.length > 0) {
        clusters.push(currentCluster);
      }

      currentCluster = [seat];
    }

    if (currentCluster.length > 0) {
      clusters.push(currentCluster);
    }
  }

  return clusters;
}

export function compareSeatSets(a: readonly Seat[], b: readonly Seat[]) {
  const aSeats = sortSeatsForAllocation(a);
  const bSeats = sortSeatsForAllocation(b);
  const length = Math.min(aSeats.length, bSeats.length);

  for (let index = 0; index < length; index += 1) {
    const aSeat = aSeats[index];
    const bSeat = bSeats[index];

    if (aSeat.positionY !== bSeat.positionY) {
      return aSeat.positionY - bSeat.positionY;
    }

    if (aSeat.seatNumber !== bSeat.seatNumber) {
      return aSeat.seatNumber - bSeat.seatNumber;
    }

    const idComparison = aSeat.id.localeCompare(bSeat.id);

    if (idComparison !== 0) {
      return idComparison;
    }
  }

  return aSeats.length - bSeats.length;
}
