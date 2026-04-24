import { PREMIUM_SEAT_PRICE, STANDARD_SEAT_PRICE } from "@/lib/constants";
import type { BookingSeat, PricingSummary, SeatType } from "@/types/domain";

export class PricingService {
  getSeatPrice(type: SeatType) {
    return type === "PREMIUM" ? PREMIUM_SEAT_PRICE : STANDARD_SEAT_PRICE;
  }

  calculateTotal(seats: readonly BookingSeat[]): PricingSummary {
    return seats.reduce<PricingSummary>(
      (summary, seat) => {
        if (seat.seatType === "PREMIUM") {
          summary.premiumSubtotal += seat.price;
        } else {
          summary.standardSubtotal += seat.price;
        }

        summary.total += seat.price;
        return summary;
      },
      {
        standardSubtotal: 0,
        premiumSubtotal: 0,
        total: 0,
      }
    );
  }
}

export const pricingService = new PricingService();
