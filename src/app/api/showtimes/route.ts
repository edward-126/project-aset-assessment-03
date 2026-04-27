import { handleApiError } from "@/lib/api/route-helpers";
import { holdService } from "@/lib/booking/hold-service";
import { showtimeRepository } from "@/lib/repositories/showtime-repository";
import type { ShowtimesResponse } from "@/types/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await holdService.expireHeldBookings();
    const showtimes = await showtimeRepository.findAll({ activeOnly: true });
    const response: ShowtimesResponse = { showtimes };

    return Response.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}
