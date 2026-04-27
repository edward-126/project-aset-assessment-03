import { BookingServiceError } from "@/lib/booking/booking-errors";
import type { Screen, Seat } from "@/types/domain";
import { sortSeatsForAllocation } from "./seat-utils";

export interface ManualSeatSelectionInput {
  screen: Screen;
  groupSize: number;
  seatIds: string[];
}

export interface ManualSeatSelectionResult {
  seats: Seat[];
  isContiguous: boolean;
}

export class ManualSeatSelectionService {
  validateSelection({
    screen,
    groupSize,
    seatIds,
  }: ManualSeatSelectionInput): ManualSeatSelectionResult {
    if (!Number.isInteger(groupSize) || groupSize <= 0) {
      throw new BookingServiceError(
        "INVALID_GROUP_SIZE",
        "Group size must be a positive whole number."
      );
    }

    const uniqueSeatIds = Array.from(new Set(seatIds));

    if (uniqueSeatIds.length !== groupSize) {
      throw new BookingServiceError(
        "INVALID_SEAT_SELECTION",
        "Manual selection must match the requested group size."
      );
    }

    const seatsById = new Map(screen.seats.map((seat) => [seat.id, seat]));
    const seats = uniqueSeatIds.map((seatId) => seatsById.get(seatId));

    if (seats.some((seat) => !seat)) {
      throw new BookingServiceError(
        "INVALID_SEAT_SELECTION",
        "Manual selection contains a seat that is not on this screen."
      );
    }

    const selectedSeats = seats as Seat[];
    const blockedSeat = selectedSeats.find(
      (seat) => seat.status !== "AVAILABLE"
    );

    if (blockedSeat) {
      throw new BookingServiceError(
        "INVALID_SEAT_SELECTION",
        "Manual selection can only use available seats."
      );
    }

    const sortedSeats = sortSeatsForAllocation(selectedSeats);
    const isContiguous =
      sortedSeats.every((seat) => seat.rowLabel === sortedSeats[0]?.rowLabel) &&
      sortedSeats.every(
        (seat, index) =>
          index === 0 ||
          sortedSeats[index - 1].seatNumber + 1 === seat.seatNumber
      );

    return {
      seats: sortedSeats,
      isContiguous,
    };
  }
}
