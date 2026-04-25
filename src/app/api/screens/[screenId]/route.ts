import { handleApiError, jsonError } from "@/lib/api/route-helpers";
import { screenRepository } from "@/lib/repositories/screen-repository";
import type { ScreenResponse } from "@/types/api";

export const dynamic = "force-dynamic";

type ScreenRouteContext = {
  params: Promise<{
    screenId: string;
  }>;
};

export async function GET(_request: Request, context: ScreenRouteContext) {
  try {
    const { screenId } = await context.params;
    const screen = await screenRepository.findById(screenId);

    if (!screen) {
      return jsonError(`Screen ${screenId} was not found.`, { status: 404 });
    }

    const response: ScreenResponse = { screen };

    return Response.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}
