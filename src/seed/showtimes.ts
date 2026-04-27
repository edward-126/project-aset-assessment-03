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
    id: "showtime-avatar-aang-main-20260502-0930",
    movieId: "movie-avatar-aang-the-last-airbender",
    screenId: "screen-1",
    startsAt: "2026-05-02T04:00:00.000Z",
    basePrice: 10,
    isActive: true,
    seatStates: seatStatesForScreen("screen-1"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "showtime-parasite-studio-20260502-1230",
    movieId: "movie-parasite",
    screenId: "screen-3",
    startsAt: "2026-05-02T07:00:00.000Z",
    basePrice: 11,
    isActive: true,
    seatStates: seatStatesForScreen("screen-3"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "showtime-inside-out-2-grand-20260502-1530",
    movieId: "movie-inside-out-2",
    screenId: "screen-2",
    startsAt: "2026-05-02T10:00:00.000Z",
    basePrice: 9,
    isActive: true,
    seatStates: seatStatesForScreen("screen-2"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "showtime-ne-zha-2-grand-20260502-1830",
    movieId: "movie-ne-zha-2",
    screenId: "screen-2",
    startsAt: "2026-05-02T13:00:00.000Z",
    basePrice: 12,
    isActive: true,
    seatStates: seatStatesForScreen("screen-2"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "showtime-the-legend-of-hei-main-20260503-0930",
    movieId: "movie-the-legend-of-hei",
    screenId: "screen-1",
    startsAt: "2026-05-03T04:00:00.000Z",
    basePrice: 10,
    isActive: true,
    seatStates: seatStatesForScreen("screen-1"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "showtime-dune-part-two-grand-20260503-1230",
    movieId: "movie-dune-part-two",
    screenId: "screen-2",
    startsAt: "2026-05-03T07:00:00.000Z",
    basePrice: 14,
    isActive: true,
    seatStates: seatStatesForScreen("screen-2"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "showtime-flow-studio-20260503-1530",
    movieId: "movie-flow",
    screenId: "screen-3",
    startsAt: "2026-05-03T10:00:00.000Z",
    basePrice: 8,
    isActive: true,
    seatStates: seatStatesForScreen("screen-3"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "showtime-spider-verse-main-20260503-1830",
    movieId: "movie-spider-man-across-the-spider-verse",
    screenId: "screen-1",
    startsAt: "2026-05-03T13:00:00.000Z",
    basePrice: 11,
    isActive: true,
    seatStates: seatStatesForScreen("screen-1"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "showtime-parasite-main-20260504-0930",
    movieId: "movie-parasite",
    screenId: "screen-1",
    startsAt: "2026-05-04T04:00:00.000Z",
    basePrice: 12,
    isActive: true,
    seatStates: seatStatesForScreen("screen-1"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "showtime-godzilla-minus-one-grand-20260504-1230",
    movieId: "movie-godzilla-minus-one",
    screenId: "screen-2",
    startsAt: "2026-05-04T07:00:00.000Z",
    basePrice: 13,
    isActive: true,
    seatStates: seatStatesForScreen("screen-2"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "showtime-ne-zha-2-main-20260504-1530",
    movieId: "movie-ne-zha-2",
    screenId: "screen-1",
    startsAt: "2026-05-04T10:00:00.000Z",
    basePrice: 12,
    isActive: true,
    seatStates: seatStatesForScreen("screen-1"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "showtime-avatar-aang-grand-20260504-1830",
    movieId: "movie-avatar-aang-the-last-airbender",
    screenId: "screen-2",
    startsAt: "2026-05-04T13:00:00.000Z",
    basePrice: 11,
    isActive: true,
    seatStates: seatStatesForScreen("screen-2"),
    createdAt: now,
    updatedAt: now,
  },
];
