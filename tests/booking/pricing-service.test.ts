import { describe, expect, it } from "vitest";
import { PricingService } from "@/lib/booking/pricing-service";
import type { BookingSeat } from "@/types/domain";

function bookingSeat(
  seatNumber: number,
  seatType: BookingSeat["seatType"],
  price: number
): BookingSeat {
  return {
    seatId: `screen-1-A${seatNumber}`,
    rowLabel: "A",
    seatNumber,
    seatType,
    price,
  };
}

describe("PricingService", () => {
  it("calculates totals for standard seats", () => {
    const service = new PricingService();

    expect(
      service.calculateTotal([
        bookingSeat(1, "STANDARD", 10),
        bookingSeat(2, "STANDARD", 10),
      ])
    ).toEqual({
      standardSubtotal: 20,
      premiumSubtotal: 0,
      total: 20,
    });
  });

  it("calculates totals for mixed standard and premium seats", () => {
    const service = new PricingService();

    expect(
      service.calculateTotal([
        bookingSeat(1, "STANDARD", 10),
        bookingSeat(2, "PREMIUM", 15),
        bookingSeat(3, "PREMIUM", 15),
      ])
    ).toEqual({
      standardSubtotal: 10,
      premiumSubtotal: 30,
      total: 40,
    });
  });
});
