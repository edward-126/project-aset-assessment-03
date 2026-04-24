export const APP_NAME = "CineSeat Planner";

export const APP_DESCRIPTION =
  "A plan-driven cinema seat allocation system focused on deterministic booking, hold, and confirmation flows.";

export const HOLD_DURATION_MINUTES = 5;

export const STANDARD_SEAT_PRICE = 10;
export const PREMIUM_SEAT_PRICE = 15;

export const ALLOCATION_WEIGHTS = {
  fragmentation: 10,
  center: 3,
  viewingZone: 2,
  splitPenalty: 20,
} as const;
