import { AllocationError } from "@/lib/allocation/allocation-types";
import { BookingServiceError } from "@/lib/booking/booking-errors";
import type { ApiErrorResponse } from "@/types/api";
import { ZodError } from "zod";

type JsonErrorOptions = {
  status: number;
  details?: string[];
};

class InvalidJsonError extends Error {
  constructor() {
    super("Request body must be valid JSON.");
    this.name = "InvalidJsonError";
  }
}

const bookingErrorStatus = {
  MISSING_SCREEN_ID: 400,
  SCREEN_NOT_FOUND: 404,
  MISSING_CUSTOMER_NAME: 400,
  INVALID_CUSTOMER_EMAIL: 400,
  INVALID_GROUP_SIZE: 400,
  MISSING_BOOKING_ID: 400,
  BOOKING_NOT_FOUND: 404,
  BOOKING_NOT_HELD: 409,
  HOLD_EXPIRED: 409,
  BOOKING_NOT_CANCELLABLE: 409,
  PAYMENT_FAILED: 402,
  SERVICE_DEPENDENCY_MISSING: 500,
} satisfies Record<BookingServiceError["code"], number>;

const allocationErrorStatus = {
  MISSING_SCREEN: 400,
  INVALID_GROUP_SIZE: 400,
  GROUP_TOO_LARGE: 409,
  INSUFFICIENT_AVAILABLE_SEATS: 409,
} satisfies Record<AllocationError["code"], number>;

export function jsonError(
  error: string,
  { status, details }: JsonErrorOptions
) {
  const body: ApiErrorResponse = details ? { error, details } : { error };

  return Response.json(body, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof BookingServiceError) {
    return jsonError(error.message, {
      status: bookingErrorStatus[error.code],
    });
  }

  if (error instanceof AllocationError) {
    return jsonError(error.message, {
      status: allocationErrorStatus[error.code],
    });
  }

  if (error instanceof ZodError) {
    return jsonError("Request body is invalid.", {
      status: 400,
      details: error.issues.map((issue) => issue.message),
    });
  }

  if (error instanceof InvalidJsonError) {
    return jsonError(error.message, { status: 400 });
  }

  return jsonError("An unexpected server error occurred.", {
    status: 500,
  });
}

export async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new InvalidJsonError();
  }
}
