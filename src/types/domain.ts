export const SEAT_TYPE_VALUES = ["STANDARD", "PREMIUM"] as const;
export type SeatType = (typeof SEAT_TYPE_VALUES)[number];

export const SEAT_STATUS_VALUES = [
  "AVAILABLE",
  "HELD",
  "BOOKED",
  "UNAVAILABLE",
] as const;
export type SeatStatus = (typeof SEAT_STATUS_VALUES)[number];

export const BOOKING_STATUS_VALUES = [
  "HELD",
  "CONFIRMED",
  "CANCELLED",
  "EXPIRED",
] as const;
export type BookingStatus = (typeof BOOKING_STATUS_VALUES)[number];

export interface PreferredViewingZone {
  rowStart: number;
  rowEnd: number;
  centerBias: number;
}

export interface Seat {
  id: string;
  screenId: string;
  rowLabel: string;
  seatNumber: number;
  type: SeatType;
  status: SeatStatus;
  positionX: number;
  positionY: number;
  heldByBookingId?: string | null;
}

export interface Screen {
  id: string;
  name: string;
  totalRows: number;
  totalColumns: number;
  preferredViewingZone: PreferredViewingZone;
  seats: Seat[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BookingSeat {
  seatId: string;
  rowLabel: string;
  seatNumber: number;
  seatType: SeatType;
  price: number;
}

export interface Booking {
  id: string;
  screenId: string;
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: BookingStatus;
  seats: BookingSeat[];
  holdExpiresAt?: string | null;
  totalCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface PricingSummary {
  standardSubtotal: number;
  premiumSubtotal: number;
  total: number;
}

export interface SeatStateUpdate {
  status: SeatStatus;
  heldByBookingId?: string | null;
}
