export const BOOKING_ERROR_CODES = [
  "MISSING_SCREEN_ID",
  "MISSING_SHOWTIME_ID",
  "SCREEN_NOT_FOUND",
  "SHOWTIME_NOT_FOUND",
  "MISSING_CUSTOMER_NAME",
  "INVALID_CUSTOMER_EMAIL",
  "INVALID_GROUP_SIZE",
  "INVALID_SEAT_SELECTION",
  "MISSING_BOOKING_ID",
  "BOOKING_NOT_FOUND",
  "BOOKING_NOT_HELD",
  "HOLD_EXPIRED",
  "BOOKING_NOT_CANCELLABLE",
  "PAYMENT_FAILED",
  "SERVICE_DEPENDENCY_MISSING",
] as const;

export type BookingErrorCode = (typeof BOOKING_ERROR_CODES)[number];

export class BookingServiceError extends Error {
  constructor(
    public readonly code: BookingErrorCode,
    message: string
  ) {
    super(message);
    this.name = "BookingServiceError";
  }
}
