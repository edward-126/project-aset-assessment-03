import type { AllocationRequest, ValidationResult } from "./allocation-types";
import { wouldPlaceSoloBetweenOccupiedSeats } from "./orphan-gap";
import type { Seat, SeatMap } from "./types";

const NORMAL_BLOCKED_STATES = new Set([
  "booked",
  "held",
  "selected",
  "broken",
  "unavailable",
]);

export function validateCandidate(
  candidate: readonly Seat[],
  request: AllocationRequest,
  seatMap: SeatMap
): ValidationResult {
  const reasons: string[] = [];

  if (request.requestType !== "adminOverride") {
    const blockedSeats = candidate.filter((seat) =>
      NORMAL_BLOCKED_STATES.has(seat.state)
    );

    if (blockedSeats.length > 0) {
      reasons.push("Candidate contains occupied or unavailable seats.");
    }

    if (
      request.requestType !== "vip" &&
      candidate.some((seat) => seat.zone === "vip")
    ) {
      reasons.push("VIP seats are reserved for VIP requests.");
    }

    if (
      request.requestType !== "accessible" &&
      candidate.some((seat) => seat.zone === "accessible")
    ) {
      reasons.push("Accessible seats are reserved for accessibility requests.");
    }

    if (
      request.requestType === "standard" &&
      request.groupSize === 1 &&
      wouldPlaceSoloBetweenOccupiedSeats(seatMap, candidate)
    ) {
      reasons.push("Solo attendee would be placed between occupied groups.");
    }
  }

  return {
    valid: reasons.length === 0,
    reasons,
  };
}
