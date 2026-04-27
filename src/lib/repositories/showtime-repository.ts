import { connectToDatabase } from "@/lib/db/mongodb";
import { MovieModel, type MovieDocument } from "@/models/Movie";
import { ScreenModel, type ScreenDocument } from "@/models/Screen";
import { ShowtimeModel, type ShowtimeDocument } from "@/models/Showtime";
import type {
  Movie,
  Screen,
  SeatStateUpdate,
  Showtime,
  ShowtimeSeatMap,
  ShowtimeWithDetails,
} from "@/types/domain";

type PersistedMovie = Omit<MovieDocument, "createdAt" | "updatedAt"> & {
  createdAt: Date | string;
  updatedAt: Date | string;
};

type PersistedScreen = Omit<ScreenDocument, "createdAt" | "updatedAt"> & {
  createdAt: Date | string;
  updatedAt: Date | string;
};

type PersistedShowtime = Omit<ShowtimeDocument, "createdAt" | "updatedAt"> & {
  createdAt: Date | string;
  updatedAt: Date | string;
};

function toIsoString(value: Date | string | undefined) {
  if (!value) {
    return undefined;
  }

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
    createdAt: toIsoString(document.createdAt) ?? "",
    updatedAt: toIsoString(document.updatedAt) ?? "",
  };
}

function toScreen(document: PersistedScreen): Screen {
  return {
    id: document.id,
    name: document.name,
    totalRows: document.totalRows,
    totalColumns: document.totalColumns,
    preferredViewingZone: document.preferredViewingZone,
    seats: document.seats,
    isActive: document.isActive,
    createdAt: toIsoString(document.createdAt),
    updatedAt: toIsoString(document.updatedAt),
  };
}

function toShowtime(document: PersistedShowtime): Showtime {
  return {
    id: document.id,
    movieId: document.movieId,
    screenId: document.screenId,
    startsAt: document.startsAt,
    basePrice: document.basePrice,
    isActive: document.isActive,
    seatStates: document.seatStates,
    createdAt: toIsoString(document.createdAt) ?? "",
    updatedAt: toIsoString(document.updatedAt) ?? "",
  };
}

function mergeSeatStates(screen: Screen, showtime: Showtime): Screen {
  const stateBySeatId = new Map(
    showtime.seatStates.map((state) => [state.seatId, state])
  );

  return {
    ...screen,
    seats: screen.seats.map((seat) => {
      const state = stateBySeatId.get(seat.id);

      return {
        ...seat,
        status: state?.status ?? seat.status,
        heldByBookingId: state?.heldByBookingId ?? null,
      };
    }),
  };
}

export class ShowtimeRepository {
  async findAll({ activeOnly = false }: { activeOnly?: boolean } = {}) {
    await connectToDatabase();

    const showtimes = await ShowtimeModel.find(
      activeOnly ? { isActive: true } : {}
    )
      .sort({ startsAt: 1 })
      .lean<PersistedShowtime[]>()
      .exec();

    const [movies, screens] = await Promise.all([
      MovieModel.find({
        id: { $in: showtimes.map((showtime) => showtime.movieId) },
      })
        .lean<PersistedMovie[]>()
        .exec(),
      ScreenModel.find({
        id: { $in: showtimes.map((showtime) => showtime.screenId) },
      })
        .lean<PersistedScreen[]>()
        .exec(),
    ]);

    const moviesById = new Map(
      movies.map((movie) => [movie.id, toMovie(movie)])
    );
    const screensById = new Map(
      screens.map((screen) => [screen.id, toScreen(screen)])
    );

    return showtimes
      .map((showtime): ShowtimeWithDetails | null => {
        const movie = moviesById.get(showtime.movieId);
        const screen = screensById.get(showtime.screenId);

        if (!movie || !screen) {
          return null;
        }

        return {
          ...toShowtime(showtime),
          movie,
          screen,
        };
      })
      .filter((showtime): showtime is ShowtimeWithDetails => !!showtime);
  }

  async findById(showtimeId: string): Promise<ShowtimeWithDetails | null> {
    const seatMap = await this.findShowtimeWithSeatMap(showtimeId);

    if (!seatMap) {
      return null;
    }

    return {
      ...seatMap.showtime,
      movie: seatMap.movie,
      screen: seatMap.screen,
    };
  }

  async findShowtimeWithSeatMap(
    showtimeId: string
  ): Promise<ShowtimeSeatMap | null> {
    await connectToDatabase();

    const showtime = await ShowtimeModel.findOne({ id: showtimeId })
      .lean<PersistedShowtime | null>()
      .exec();

    if (!showtime) {
      return null;
    }

    const [movie, screen] = await Promise.all([
      MovieModel.findOne({ id: showtime.movieId })
        .lean<PersistedMovie | null>()
        .exec(),
      ScreenModel.findOne({ id: showtime.screenId })
        .lean<PersistedScreen | null>()
        .exec(),
    ]);

    if (!movie || !screen) {
      return null;
    }

    const mappedShowtime = toShowtime(showtime);

    return {
      showtime: mappedShowtime,
      movie: toMovie(movie),
      screen: mergeSeatStates(toScreen(screen), mappedShowtime),
    };
  }

  async updateSeatStates(
    showtimeId: string,
    seatIds: string[],
    updater: SeatStateUpdate
  ): Promise<void> {
    await connectToDatabase();

    if (seatIds.length === 0) {
      return;
    }

    const update: Record<string, SeatStateUpdate[keyof SeatStateUpdate]> = {
      "seatStates.$[seat].status": updater.status,
    };

    if (updater.heldByBookingId !== undefined) {
      update["seatStates.$[seat].heldByBookingId"] = updater.heldByBookingId;
    }

    await ShowtimeModel.updateOne(
      { id: showtimeId },
      { $set: update },
      {
        arrayFilters: [{ "seat.seatId": { $in: seatIds } }],
        runValidators: true,
      }
    ).exec();
  }
}

export const showtimeRepository = new ShowtimeRepository();
