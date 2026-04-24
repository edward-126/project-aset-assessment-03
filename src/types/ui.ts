import type { BookingSeat, Seat, SeatStatus, SeatType } from "@/types/domain";

export interface SeatMapSeatView {
  id: string;
  label: string;
  rowLabel: string;
  seatNumber: number;
  type: SeatType;
  status: SeatStatus;
  isSelected: boolean;
}

export interface SeatMapRowView {
  rowLabel: string;
  seats: SeatMapSeatView[];
}

export interface BookingSummaryView {
  bookingReference: string;
  statusLabel: string;
  selectedSeats: BookingSeat[];
  totalCostLabel: string;
  holdExpiresAtLabel?: string;
}

export function toSeatMapSeatView(
  seat: Seat,
  selectedSeatIds: ReadonlySet<string> = new Set<string>()
): SeatMapSeatView {
  return {
    id: seat.id,
    label: `${seat.rowLabel}${seat.seatNumber}`,
    rowLabel: seat.rowLabel,
    seatNumber: seat.seatNumber,
    type: seat.type,
    status: seat.status,
    isSelected: selectedSeatIds.has(seat.id),
  };
}
