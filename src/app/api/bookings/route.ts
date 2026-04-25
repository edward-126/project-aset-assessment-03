import { handleApiError, readJson } from "@/lib/api/route-helpers";
import { createHeldBookingRequestSchema } from "@/lib/api/schemas";
import { bookingService } from "@/lib/booking/booking-service";
import type { BookingResponse } from "@/types/api";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const input = createHeldBookingRequestSchema.parse(await readJson(request));
    const booking = await bookingService.createHeldBooking(input);
    const response: BookingResponse = { booking };

    return Response.json(response, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
