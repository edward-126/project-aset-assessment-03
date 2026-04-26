import type { BookingSeat, BookingStatus } from "@/types/domain";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatSeats(seats: BookingSeat[]) {
  return seats.map((seat) => `${seat.rowLabel}${seat.seatNumber}`).join(", ");
}

export function statusLabel(status: BookingStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}
