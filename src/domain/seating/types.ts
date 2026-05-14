export type SeatState =
  | "available"
  | "selected"
  | "held"
  | "booked"
  | "broken"
  | "unavailable";

export type SeatZone = "standard" | "vip" | "accessible";

export type RequestType = "standard" | "vip" | "accessible" | "adminOverride";

export interface Seat {
  id: string;
  row: string;
  column: number;
  blockId: string;
  state: SeatState;
  zone: SeatZone;
  isAisle?: boolean;
  isEdge?: boolean;
}

export interface SeatRow {
  id: string;
  seats: Seat[];
}

export interface SeatMap {
  id: string;
  name: string;
  rows: SeatRow[];
}
