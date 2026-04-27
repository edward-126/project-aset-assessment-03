import { connectToDatabase } from "@/lib/db/mongodb";
import { MovieModel, type MovieDocument } from "@/models/Movie";
import type { Movie } from "@/types/domain";

type PersistedMovie = Omit<MovieDocument, "createdAt" | "updatedAt"> & {
  createdAt: Date | string;
  updatedAt: Date | string;
};

function toIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : value;
}

function toMovie(document: PersistedMovie): Movie {
  return {
    id: document.id,
    title: document.title,
    slug: document.slug,
    synopsis: document.synopsis,
    durationMinutes: document.durationMinutes,
    rating: document.rating,
    genre: document.genre,
    posterUrl: document.posterUrl,
    isActive: document.isActive,
    createdAt: toIsoString(document.createdAt),
    updatedAt: toIsoString(document.updatedAt),
  };
}

export class MovieRepository {
  async findAll({ activeOnly = false }: { activeOnly?: boolean } = {}) {
    await connectToDatabase();

    const movies = await MovieModel.find(activeOnly ? { isActive: true } : {})
      .sort({ title: 1 })
      .lean<PersistedMovie[]>()
      .exec();

    return movies.map(toMovie);
  }

  async findById(movieId: string) {
    await connectToDatabase();

    const movie = await MovieModel.findOne({ id: movieId })
      .lean<PersistedMovie | null>()
      .exec();

    return movie ? toMovie(movie) : null;
  }
}

export const movieRepository = new MovieRepository();
