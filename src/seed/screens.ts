import type { Screen, Seat, SeatStatus, SeatType } from "@/types/domain";

type SeatOverride = {
  status?: SeatStatus;
  type?: SeatType;
  heldByBookingId?: string | null;
};

type ScreenSeatPlan = {
  screenId: string;
  totalRows: number;
  totalColumns: number;
  premiumSeats: ReadonlySet<string>;
  overrides?: Readonly<Record<string, SeatOverride>>;
};

const ROW_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function seatKey(rowLabel: string, seatNumber: number) {
  return `${rowLabel}${seatNumber}`;
}

function buildSeats({
  screenId,
  totalRows,
  totalColumns,
  premiumSeats,
  overrides = {},
}: ScreenSeatPlan): Seat[] {
  return ROW_LABELS.slice(0, totalRows).flatMap((rowLabel, rowIndex) =>
    Array.from({ length: totalColumns }, (_, columnIndex) => {
      const seatNumber = columnIndex + 1;
      const key = seatKey(rowLabel, seatNumber);
      const override = overrides[key];
      const type =
        override?.type ?? (premiumSeats.has(key) ? "PREMIUM" : "STANDARD");

      return {
        id: `${screenId}-${key}`,
        screenId,
        rowLabel,
        seatNumber,
        type,
        status: override?.status ?? "AVAILABLE",
        positionX: seatNumber,
        positionY: rowIndex + 1,
        heldByBookingId: override?.heldByBookingId ?? null,
      };
    })
  );
}

function premiumBlock(
  rowLabels: readonly string[],
  firstSeat: number,
  lastSeat: number
) {
  return new Set(
    rowLabels.flatMap((rowLabel) =>
      Array.from({ length: lastSeat - firstSeat + 1 }, (_, index) =>
        seatKey(rowLabel, firstSeat + index)
      )
    )
  );
}

export const seedScreens: Screen[] = [
  {
    id: "screen-1",
    name: "Screen 1 - Main Hall",
    totalRows: 8,
    totalColumns: 10,
    preferredViewingZone: {
      rowStart: 4,
      rowEnd: 6,
      centerBias: 1,
    },
    seats: buildSeats({
      screenId: "screen-1",
      totalRows: 8,
      totalColumns: 10,
      premiumSeats: premiumBlock(["D", "E", "F"], 4, 7),
      overrides: {
        A1: { status: "UNAVAILABLE" },
        A10: { status: "UNAVAILABLE" },
        B9: { status: "BOOKED" },
        C2: { status: "BOOKED" },
        H1: { status: "UNAVAILABLE" },
        H10: { status: "UNAVAILABLE" },
      },
    }),
  },
  {
    id: "screen-2",
    name: "Screen 2 - Grand Auditorium",
    totalRows: 10,
    totalColumns: 12,
    preferredViewingZone: {
      rowStart: 5,
      rowEnd: 8,
      centerBias: 1,
    },
    seats: buildSeats({
      screenId: "screen-2",
      totalRows: 10,
      totalColumns: 12,
      premiumSeats: premiumBlock(["E", "F", "G", "H"], 4, 9),
      overrides: {
        A1: { status: "UNAVAILABLE" },
        A2: { status: "UNAVAILABLE" },
        A11: { status: "UNAVAILABLE" },
        A12: { status: "UNAVAILABLE" },
        B1: { status: "UNAVAILABLE" },
        B12: { status: "UNAVAILABLE" },
        E6: { status: "HELD", heldByBookingId: "seed-held-grand-1" },
        E7: { status: "HELD", heldByBookingId: "seed-held-grand-1" },
        F5: { status: "BOOKED" },
        F8: { status: "BOOKED" },
        J1: { status: "UNAVAILABLE" },
        J12: { status: "UNAVAILABLE" },
      },
    }),
  },
  {
    id: "screen-3",
    name: "Screen 3 - Compact Studio",
    totalRows: 5,
    totalColumns: 6,
    preferredViewingZone: {
      rowStart: 2,
      rowEnd: 4,
      centerBias: 1,
    },
    seats: buildSeats({
      screenId: "screen-3",
      totalRows: 5,
      totalColumns: 6,
      premiumSeats: premiumBlock(["C"], 3, 4),
      overrides: {
        A3: { status: "BOOKED" },
        A6: { status: "BOOKED" },
        B1: { status: "HELD", heldByBookingId: "seed-held-compact-1" },
        B4: { status: "BOOKED" },
        C2: { status: "BOOKED" },
        C5: { status: "BOOKED" },
        D3: { status: "UNAVAILABLE" },
        D6: { status: "BOOKED" },
        E1: { status: "UNAVAILABLE" },
        E4: { status: "BOOKED" },
      },
    }),
  },
];
