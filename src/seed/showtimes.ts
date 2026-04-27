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
    id: "showtime-project-hail-mary-main-20260502-1830",
    movieId: "movie-project-hail-mary",
    screenId: "screen-1",
    startsAt: "2026-05-02T18:30:00.000Z",
    basePrice: 12,
    isActive: true,
    seatStates: seatStatesForScreen("screen-1"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "showtime-avatar-aang-grand-20260502-2000",
    movieId: "movie-avatar-aang-the-last-airbender",
    screenId: "screen-2",
    startsAt: "2026-05-02T20:00:00.000Z",
    basePrice: 10,
    isActive: true,
    seatStates: seatStatesForScreen("screen-2"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "showtime-hoppers-studio-20260503-1600",
    movieId: "movie-hoppers",
    screenId: "screen-3",
    startsAt: "2026-05-03T16:00:00.000Z",
    basePrice: 9,
    isActive: true,
    seatStates: seatStatesForScreen("screen-3"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "showtime-avatar-fire-and-ash-grand-20260503-2130",
    movieId: "movie-avatar-fire-and-ash",
    screenId: "screen-2",
    startsAt: "2026-05-03T21:30:00.000Z",
    basePrice: 14,
    isActive: true,
    seatStates: seatStatesForScreen("screen-2"),
    createdAt: now,
    updatedAt: now,
  },
];
