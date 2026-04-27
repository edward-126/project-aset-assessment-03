import { handleApiError } from "@/lib/api/route-helpers";
import { movieRepository } from "@/lib/repositories/movie-repository";
import type { MoviesResponse } from "@/types/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const movies = await movieRepository.findAll({ activeOnly: true });
    const response: MoviesResponse = { movies };

    return Response.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}
