import { handleApiError, readJson } from "@/lib/api/route-helpers";
import { editHeldBookingRequestSchema } from "@/lib/api/schemas";
import { bookingService } from "@/lib/booking/booking-service";
import type { BookingResponse } from "@/types/api";

export const dynamic = "force-dynamic";

type ChangeAllocationRouteContext = {
  params: Promise<{
    bookingId: string;
  }>;
};

export async function POST(
  request: Request,
  context: ChangeAllocationRouteContext
) {
  try {
    const { bookingId } = await context.params;
    const input = editHeldBookingRequestSchema.parse(await readJson(request));
    const booking = await bookingService.editHeldBooking({
      bookingId,
      groupSize: input.groupSize,
    });
    const response: BookingResponse = { booking };

    return Response.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}
