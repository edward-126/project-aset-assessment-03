import type { Screen, Seat, SeatStatus } from "@/types/domain";

type SeatPlan = {
  available?: string[];
  held?: string[];
  booked?: string[];
  unavailable?: string[];
};

const ROW_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function makeTestScreen({
  id = "test-screen",
  totalRows = 3,
  totalColumns = 8,
  preferredRowStart = 2,
  preferredRowEnd = 2,
  plan = {},
}: {
  id?: string;
  totalRows?: number;
  totalColumns?: number;
  preferredRowStart?: number;
  preferredRowEnd?: number;
  plan?: SeatPlan;
} = {}): Screen {
  const statusBySeat = new Map<string, SeatStatus>();

  for (const [status, seats] of [
    ["AVAILABLE", plan.available],
    ["HELD", plan.held],
    ["BOOKED", plan.booked],
    ["UNAVAILABLE", plan.unavailable],
  ] as const) {
    for (const seat of seats ?? []) {
      statusBySeat.set(seat, status);
    }
  }

  const seats: Seat[] = ROW_LABELS.slice(0, totalRows).flatMap(
    (rowLabel, rowIndex) =>
      Array.from({ length: totalColumns }, (_, columnIndex) => {
        const seatNumber = columnIndex + 1;
        const key = `${rowLabel}${seatNumber}`;

        return {
          id: `${id}-${key}`,
          screenId: id,
          rowLabel,
          seatNumber,
          type: "STANDARD",
          status: statusBySeat.get(key) ?? "BOOKED",
          positionX: seatNumber,
          positionY: rowIndex + 1,
          heldByBookingId: null,
        };
      })
  );

  return {
    id,
    name: "Test Screen",
    totalRows,
    totalColumns,
    preferredViewingZone: {
      rowStart: preferredRowStart,
      rowEnd: preferredRowEnd,
      centerBias: 1,
    },
    seats,
  };
}

export function seatLabels(seats: readonly Seat[]) {
  return seats.map((seat) => `${seat.rowLabel}${seat.seatNumber}`);
}
