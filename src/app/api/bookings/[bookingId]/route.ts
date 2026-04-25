import { handleApiError, jsonError } from "@/lib/api/route-helpers";
import { bookingRepository } from "@/lib/repositories/booking-repository";
import type { BookingResponse } from "@/types/api";

export const dynamic = "force-dynamic";

type BookingRouteContext = {
  params: Promise<{
    bookingId: string;
  }>;
};

export async function GET(_request: Request, context: BookingRouteContext) {
  try {
    const { bookingId } = await context.params;
    const booking = await bookingRepository.findById(bookingId);

    if (!booking) {
      return jsonError(`Booking ${bookingId} was not found.`, { status: 404 });
    }

    const response: BookingResponse = { booking };

    return Response.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}
