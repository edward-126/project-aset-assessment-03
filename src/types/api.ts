import type { Booking, Screen } from "@/types/domain";

export interface ApiErrorResponse {
  error: string;
  details?: string[];
}

export interface ScreenSummary {
  id: string;
  name: string;
  totalRows: number;
  totalColumns: number;
  totalSeats: number;
  availableSeats: number;
}

export interface ScreensResponse {
  screens: ScreenSummary[];
}

export interface ScreenResponse {
  screen: Screen;
}

export interface CreateHeldBookingRequest {
  screenId: string;
  groupSize: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}

export interface EditHeldBookingRequest {
  bookingId: string;
  groupSize: number;
}

export interface BookingResponse {
  booking: Booking;
}

export interface ApiHealthResponse {
  status: "ok" | "error";
  app: {
    name: string;
    uptimeSeconds: number;
    timestamp: string;
  };
  database: {
    status: "connected" | "disconnected" | "connecting" | "disconnecting";
    ok: boolean;
    message?: string;
  };
}
