import {
  BookingServiceError,
  type BookingErrorCode,
} from "@/lib/booking/booking-errors";
import type {
  CreateHeldBookingInput,
  EditHeldBookingInput,
} from "@/lib/booking/booking-types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function assertPresent(value: string, code: BookingErrorCode, message: string) {
  if (value.trim().length === 0) {
    throw new BookingServiceError(code, message);
  }
}

export function validateGroupSize(groupSize: number) {
  if (!Number.isInteger(groupSize) || groupSize <= 0) {
    throw new BookingServiceError(
      "INVALID_GROUP_SIZE",
      "Group size must be a positive whole number."
    );
  }
}

export function validateCreateHeldBookingInput(input: CreateHeldBookingInput) {
  if (!input.showtimeId && !input.screenId) {
    throw new BookingServiceError(
      "MISSING_SHOWTIME_ID",
      "A showtime must be selected before creating a booking."
    );
  }

  if (input.showtimeId) {
    assertPresent(
      input.showtimeId,
      "MISSING_SHOWTIME_ID",
      "A showtime must be selected before creating a booking."
    );
  } else {
    assertPresent(
      input.screenId ?? "",
      "MISSING_SCREEN_ID",
      "A screen must be selected before creating a booking."
    );
  }

  assertPresent(
    input.customerName,
    "MISSING_CUSTOMER_NAME",
    "Customer name is required before creating a booking."
  );

  if (!EMAIL_PATTERN.test(input.customerEmail.trim())) {
    throw new BookingServiceError(
      "INVALID_CUSTOMER_EMAIL",
      "A valid customer email is required before creating a booking."
    );
  }

  validateGroupSize(input.groupSize);
}

export function validateEditHeldBookingInput(input: EditHeldBookingInput) {
  assertPresent(
    input.bookingId,
    "MISSING_BOOKING_ID",
    "A booking id is required before editing a booking."
  );
  validateGroupSize(input.groupSize);
}
