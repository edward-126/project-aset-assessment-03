import { seedScreens } from "@/seed/screens";
import type { Showtime, ShowtimeSeatState } from "@/types/domain";

const now = "2026-04-27T00:00:00.000Z";

function seatStatesForScreen(screenId: string): ShowtimeSeatState[] {
  const screen = seedScreens.find((candidate) => candidate.id === screenId);

  if (!screen) {
    return [];
  }

  return screen.seats.map((seat) => ({
    seatId: seat.id,
    status: seat.status,
    heldByBookingId: seat.heldByBookingId ?? null,
  }));
}

export const seedShowtimes: Showtime[] = [
  {
    id: "showtime-avatar-aang-main-20260502-1030",
    movieId: "movie-avatar-aang-the-last-airbender",
    screenId: "screen-1",
    startsAt: "2026-05-02T10:30:00.000Z",
    basePrice: 10,
    isActive: true,
    seatStates: seatStatesForScreen("screen-1"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "showtime-parasite-studio-20260502-1315",
    movieId: "movie-parasite",
    screenId: "screen-3",
    startsAt: "2026-05-02T13:15:00.000Z",
    basePrice: 11,
    isActive: true,
    seatStates: seatStatesForScreen("screen-3"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "showtime-inside-out-2-grand-20260502-1430",
    movieId: "movie-inside-out-2",
    screenId: "screen-2",
    startsAt: "2026-05-02T14:30:00.000Z",
    basePrice: 9,
    isActive: true,
    seatStates: seatStatesForScreen("screen-2"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "showtime-ne-zha-2-grand-20260502-1730",
    movieId: "movie-ne-zha-2",
    screenId: "screen-2",
    startsAt: "2026-05-02T17:30:00.000Z",
    basePrice: 12,
    isActive: true,
    seatStates: seatStatesForScreen("screen-2"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "showtime-the-legend-of-hei-main-20260502-1910",
    movieId: "movie-the-legend-of-hei",
    screenId: "screen-1",
    startsAt: "2026-05-02T19:10:00.000Z",
    basePrice: 10,
    isActive: true,
    seatStates: seatStatesForScreen("screen-1"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "showtime-dune-part-two-grand-20260502-2130",
    movieId: "movie-dune-part-two",
    screenId: "screen-2",
    startsAt: "2026-05-02T21:30:00.000Z",
    basePrice: 14,
    isActive: true,
    seatStates: seatStatesForScreen("screen-2"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "showtime-flow-studio-20260503-1115",
    movieId: "movie-flow",
    screenId: "screen-3",
    startsAt: "2026-05-03T11:15:00.000Z",
    basePrice: 8,
    isActive: true,
    seatStates: seatStatesForScreen("screen-3"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "showtime-spider-verse-main-20260503-1410",
    movieId: "movie-spider-man-across-the-spider-verse",
    screenId: "screen-1",
    startsAt: "2026-05-03T14:10:00.000Z",
    basePrice: 11,
    isActive: true,
    seatStates: seatStatesForScreen("screen-1"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "showtime-parasite-main-20260503-1700",
    movieId: "movie-parasite",
    screenId: "screen-1",
    startsAt: "2026-05-03T17:00:00.000Z",
    basePrice: 12,
    isActive: true,
    seatStates: seatStatesForScreen("screen-1"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "showtime-godzilla-minus-one-grand-20260503-1945",
    movieId: "movie-godzilla-minus-one",
    screenId: "screen-2",
    startsAt: "2026-05-03T19:45:00.000Z",
    basePrice: 13,
    isActive: true,
    seatStates: seatStatesForScreen("screen-2"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "showtime-ne-zha-2-main-20260504-1535",
    movieId: "movie-ne-zha-2",
    screenId: "screen-1",
    startsAt: "2026-05-04T15:35:00.000Z",
    basePrice: 12,
    isActive: true,
    seatStates: seatStatesForScreen("screen-1"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "showtime-avatar-aang-grand-20260504-1845",
    movieId: "movie-avatar-aang-the-last-airbender",
    screenId: "screen-2",
    startsAt: "2026-05-04T18:45:00.000Z",
    basePrice: 11,
    isActive: true,
    seatStates: seatStatesForScreen("screen-2"),
    createdAt: now,
    updatedAt: now,
  },
];
