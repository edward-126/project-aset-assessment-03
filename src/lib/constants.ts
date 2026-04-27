export const APP_NAME = "TR SeatFlow";

export const APP_DESCRIPTION =
  "A cinema booking system focused on deterministic seat allocation, holds, and booking lifecycle flows.";

export const HOLD_DURATION_MINUTES = 5;

export const STANDARD_SEAT_PRICE = 10;
export const PREMIUM_SEAT_PRICE = 15;

export const ALLOCATION_WEIGHTS = {
  fragmentation: 10,
  center: 3,
  viewingZone: 2,
  splitPenalty: 20,
} as const;
