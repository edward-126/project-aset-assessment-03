import { handleApiError } from "@/lib/api/route-helpers";
import { screenRepository } from "@/lib/repositories/screen-repository";
import type { ScreenSummary, ScreensResponse } from "@/types/api";
import type { Screen } from "@/types/domain";

export const dynamic = "force-dynamic";

function toScreenSummary(screen: Screen): ScreenSummary {
  return {
    id: screen.id,
    name: screen.name,
    totalRows: screen.totalRows,
    totalColumns: screen.totalColumns,
    totalSeats: screen.seats.length,
    availableSeats: screen.seats.filter((seat) => seat.status === "AVAILABLE")
      .length,
  };
}

export async function GET() {
  try {
    const screens = await screenRepository.findAll();
    const response: ScreensResponse = {
      screens: screens.map(toScreenSummary),
    };

    return Response.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}
