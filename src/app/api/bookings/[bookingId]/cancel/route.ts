import { handleApiError } from "@/lib/api/route-helpers";
import { bookingService } from "@/lib/booking/booking-service";
import type { BookingResponse } from "@/types/api";

export const dynamic = "force-dynamic";

type CancelBookingRouteContext = {
  params: Promise<{
    bookingId: string;
  }>;
};

export async function POST(
  _request: Request,
  context: CancelBookingRouteContext
) {
  try {
    const { bookingId } = await context.params;
    const booking = await bookingService.cancelBooking(bookingId);
    const response: BookingResponse = { booking };

    return Response.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}
