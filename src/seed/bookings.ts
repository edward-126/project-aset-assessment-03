import { PREMIUM_SEAT_PRICE, STANDARD_SEAT_PRICE } from "@/lib/constants";
import { seedMovies } from "@/seed/movies";
import { seedScreens } from "@/seed/screens";
import { seedShowtimes } from "@/seed/showtimes";
import type {
  Booking,
  BookingSeat,
  SeatStatus,
  Showtime,
} from "@/types/domain";

const now = "2026-04-27T00:00:00.000Z";

type SeedBookingInput = Omit<
  Booking,
  "movieId" | "movieTitle" | "showtimeStartsAt" | "seats" | "totalCost"
> & {
  seatKeys: string[];
};

function findShowtime(showtimeId: string) {
  const showtime = seedShowtimes.find(
    (candidate) => candidate.id === showtimeId
  );

  if (!showtime) {
    throw new Error(`Seed showtime ${showtimeId} was not found.`);
  }

  return showtime;
}

function findMovie(movieId: string) {
  const movie = seedMovies.find((candidate) => candidate.id === movieId);

  if (!movie) {
    throw new Error(`Seed movie ${movieId} was not found.`);
  }

  return movie;
}

function buildBookingSeats(screenId: string, seatKeys: string[]) {
  const screen = seedScreens.find((candidate) => candidate.id === screenId);

  if (!screen) {
    throw new Error(`Seed screen ${screenId} was not found.`);
  }

  return seatKeys.map<BookingSeat>((seatKey) => {
    const seat = screen.seats.find(
      (candidate) => `${candidate.rowLabel}${candidate.seatNumber}` === seatKey
    );

    if (!seat) {
      throw new Error(`Seed seat ${screenId}-${seatKey} was not found.`);
    }

    return {
      seatId: seat.id,
      rowLabel: seat.rowLabel,
      seatNumber: seat.seatNumber,
      seatType: seat.type,
      price: seat.type === "PREMIUM" ? PREMIUM_SEAT_PRICE : STANDARD_SEAT_PRICE,
    };
  });
}

function buildBooking(input: SeedBookingInput): Booking {
  const showtime = input.showtimeId ? findShowtime(input.showtimeId) : null;
  const movie = showtime ? findMovie(showtime.movieId) : null;
  const seats = buildBookingSeats(input.screenId, input.seatKeys);

  return {
    ...input,
    movieId: movie?.id,
    movieTitle: movie?.title,
    showtimeStartsAt: showtime?.startsAt,
    seats,
    totalCost: seats.reduce((total, seat) => total + seat.price, 0),
  };
}

export const seedBookings: Booking[] = [
  buildBooking({
    id: "booking-seed-adon-bilivit",
    showtimeId: "showtime-avatar-aang-main-20260502-1030",
    screenId: "screen-1",
    bookingReference: "TR-ADON-1030",
    customerName: "Adon Bilivit",
    customerEmail: "adon.bilivit@example.com",
    customerPhone: "+94 77 100 4101",
    status: "CONFIRMED",
    allocationMode: "AUTO",
    seatKeys: ["D5", "D6"],
    holdExpiresAt: null,
    createdAt: "2026-04-27T07:20:00.000Z",
    updatedAt: now,
  }),
  buildBooking({
    id: "booking-seed-justin-case",
    showtimeId: "showtime-parasite-studio-20260502-1315",
    screenId: "screen-3",
    bookingReference: "TR-JUSTIN-1315",
    customerName: "Justin Case",
    customerEmail: "justin.case@example.com",
    customerPhone: "+94 77 100 4102",
    status: "CONFIRMED",
    allocationMode: "MANUAL",
    seatKeys: ["C3", "C4"],
    holdExpiresAt: null,
    createdAt: "2026-04-27T08:05:00.000Z",
    updatedAt: now,
  }),
  buildBooking({
    id: "booking-seed-anita-break",
    showtimeId: "showtime-ne-zha-2-grand-20260502-1730",
    screenId: "screen-2",
    bookingReference: "TR-ANITA-1730",
    customerName: "Anita Break",
    customerEmail: "anita.break@example.com",
    customerPhone: "+94 77 100 4103",
    status: "HELD",
    allocationMode: "AUTO",
    seatKeys: ["E6", "E7", "E8"],
    holdExpiresAt: "2026-05-02T17:10:00.000Z",
    createdAt: "2026-04-27T09:40:00.000Z",
    updatedAt: now,
  }),
  buildBooking({
    id: "booking-seed-al-beback",
    showtimeId: "showtime-the-legend-of-hei-main-20260502-1910",
    screenId: "screen-1",
    bookingReference: "TR-AL-1910",
    customerName: "Al Beback",
    customerEmail: "al.beback@example.com",
    customerPhone: "+94 77 100 4104",
    status: "CONFIRMED",
    allocationMode: "MANUAL",
    seatKeys: ["E4", "E5", "E6", "E7"],
    holdExpiresAt: null,
    createdAt: "2026-04-27T11:10:00.000Z",
    updatedAt: now,
  }),
  buildBooking({
    id: "booking-seed-iona-ticket",
    showtimeId: "showtime-flow-studio-20260503-1115",
    screenId: "screen-3",
    bookingReference: "TR-IONA-1115",
    customerName: "Iona Ticket",
    customerEmail: "iona.ticket@example.com",
    customerPhone: "+94 77 100 4105",
    status: "CANCELLED",
    allocationMode: "AUTO",
    seatKeys: ["B2", "B3"],
    holdExpiresAt: null,
    createdAt: "2026-04-27T12:25:00.000Z",
    updatedAt: now,
  }),
  buildBooking({
    id: "booking-seed-paige-turner",
    showtimeId: "showtime-parasite-main-20260503-1700",
    screenId: "screen-1",
    bookingReference: "TR-PAIGE-1700",
    customerName: "Paige Turner",
    customerEmail: "paige.turner@example.com",
    customerPhone: "+94 77 100 4106",
    status: "CONFIRMED",
    allocationMode: "AUTO",
    seatKeys: ["F4", "F5", "F6"],
    holdExpiresAt: null,
    createdAt: "2026-04-27T14:45:00.000Z",
    updatedAt: now,
  }),
  buildBooking({
    id: "booking-seed-bea-rightback",
    showtimeId: "showtime-godzilla-minus-one-grand-20260503-1945",
    screenId: "screen-2",
    bookingReference: "TR-BEA-1945",
    customerName: "Bea Rightback",
    customerEmail: "bea.rightback@example.com",
    customerPhone: "+94 77 100 4107",
    status: "EXPIRED",
    allocationMode: "MANUAL",
    seatKeys: ["G5", "G6"],
    holdExpiresAt: "2026-04-27T12:30:00.000Z",
    createdAt: "2026-04-27T15:30:00.000Z",
    updatedAt: now,
  }),
  buildBooking({
    id: "booking-seed-noah-lott",
    showtimeId: "showtime-avatar-aang-grand-20260504-1845",
    screenId: "screen-2",
    bookingReference: "TR-NOAH-1845",
    customerName: "Noah Lott",
    customerEmail: "noah.lott@example.com",
    customerPhone: "+94 77 100 4108",
    status: "CONFIRMED",
    allocationMode: "AUTO",
    seatKeys: ["F5", "F6", "F7", "F8"],
    holdExpiresAt: null,
    createdAt: "2026-04-27T16:15:00.000Z",
    updatedAt: now,
  }),
];

function seatStatusForBooking(booking: Booking): SeatStatus | null {
  if (booking.status === "CONFIRMED") {
    return "BOOKED";
  }

  if (booking.status === "HELD") {
    return "HELD";
  }

  return null;
}

export function applySeedBookingsToShowtimes(showtimes: Showtime[]) {
  const bookingSeatStates = new Map<
    string,
    Map<string, { status: SeatStatus; heldByBookingId: string | null }>
  >();

  for (const booking of seedBookings) {
    if (!booking.showtimeId) {
      continue;
    }

    const status = seatStatusForBooking(booking);

    if (!status) {
      continue;
    }

    const statesForShowtime =
      bookingSeatStates.get(booking.showtimeId) ?? new Map();

    for (const seat of booking.seats) {
      statesForShowtime.set(seat.seatId, {
        status,
        heldByBookingId: status === "HELD" ? booking.id : null,
      });
    }

    bookingSeatStates.set(booking.showtimeId, statesForShowtime);
  }

  return showtimes.map<Showtime>((showtime) => {
    const statesForShowtime = bookingSeatStates.get(showtime.id);

    if (!statesForShowtime) {
      return showtime;
    }

    return {
      ...showtime,
      seatStates: showtime.seatStates.map((seatState) => {
        const bookedState = statesForShowtime.get(seatState.seatId);

        return bookedState ? { ...seatState, ...bookedState } : seatState;
      }),
    };
  });
}
