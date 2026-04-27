import type {
  Booking,
  Movie,
  Screen,
  ShowtimeWithDetails,
} from "@/types/domain";

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

export interface MoviesResponse {
  movies: Movie[];
}

export interface ShowtimesResponse {
  showtimes: ShowtimeWithDetails[];
}

export interface ShowtimeResponse {
  showtime: ShowtimeWithDetails;
}

export interface CreateHeldBookingRequest {
  screenId?: string;
  showtimeId?: string;
  groupSize: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  allocationMode?: "AUTO" | "MANUAL";
  seatIds?: string[];
}

export interface EditHeldBookingRequest {
  groupSize: number;
}

export interface BookingResponse {
  booking: Booking;
}

export interface ExpireHeldBookingsResponse {
  expiredCount: number;
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
