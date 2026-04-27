export const APP_NAME = "TR SeatFlow";

export const APP_DESCRIPTION =
  "A plan-driven cinema seat booking system that demonstrates deterministic seat allocation, temporary holds, booking confirmation, cancellation, and booking lifecycle management.";

export const APP_SHORT_DESCRIPTION =
  "Deterministic cinema seat allocation and booking lifecycle system.";

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://project-aset-assessment-03.vercel.app";

export const APP_AUTHOR = "Thilina Rathnayaka";
export const APP_AUTHOR_URL = "https://thilina.dev";

export const HOLD_DURATION_MINUTES = 5;

export const STANDARD_SEAT_PRICE = 10;
export const PREMIUM_SEAT_PRICE = 15;

export const ALLOCATION_WEIGHTS = {
  fragmentation: 10,
  center: 3,
  viewingZone: 2,
  splitPenalty: 20,
} as const;
