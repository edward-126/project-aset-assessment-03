import { handleApiError, jsonError } from "@/lib/api/route-helpers";
import { holdService } from "@/lib/booking/hold-service";
import { showtimeRepository } from "@/lib/repositories/showtime-repository";
import type { ShowtimeResponse } from "@/types/api";

export const dynamic = "force-dynamic";

type ShowtimeRouteContext = {
  params: Promise<{
    showtimeId: string;
  }>;
};

export async function GET(_request: Request, context: ShowtimeRouteContext) {
  try {
    const { showtimeId } = await context.params;
    await holdService.expireHeldBookings();
    const showtime = await showtimeRepository.findById(showtimeId);

    if (!showtime) {
      return jsonError(`Showtime ${showtimeId} was not found.`, {
        status: 404,
      });
    }

    const response: ShowtimeResponse = { showtime };

    return Response.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}
