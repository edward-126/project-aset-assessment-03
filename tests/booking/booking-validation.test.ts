import { describe, expect, it } from "vitest";
import {
  validateCreateHeldBookingInput,
  validateGroupSize,
} from "@/lib/booking/booking-validation";
import { BookingServiceError } from "@/lib/booking/booking-errors";

describe("booking validation", () => {
  it("rejects invalid email addresses", () => {
    expect(() =>
      validateCreateHeldBookingInput({
        screenId: "screen-1",
        groupSize: 2,
        customerName: "Test Customer",
        customerEmail: "not-an-email",
      })
    ).toThrow(BookingServiceError);
  });

  it("rejects zero or negative group sizes", () => {
    expect(() => validateGroupSize(0)).toThrow(BookingServiceError);
    expect(() => validateGroupSize(-1)).toThrow(BookingServiceError);
  });
});
