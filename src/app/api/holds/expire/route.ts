import { handleApiError } from "@/lib/api/route-helpers";
import { holdService } from "@/lib/booking/hold-service";
import type { ExpireHeldBookingsResponse } from "@/types/api";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const expiredCount = await holdService.expireHeldBookings();
    const response: ExpireHeldBookingsResponse = { expiredCount };

    return Response.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}
