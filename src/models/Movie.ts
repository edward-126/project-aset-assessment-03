import mongoose, { type Model } from "mongoose";
import type { Movie } from "@/types/domain";

const { model, models, Schema } = mongoose;

export type MovieDocument = Omit<Movie, "createdAt" | "updatedAt"> & {
  createdAt: Date;
  updatedAt: Date;
};

const movieSchema = new Schema<MovieDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    synopsis: { type: String, required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    rating: { type: String },
    genre: { type: String },
    posterUrl: { type: String },
    isActive: { type: Boolean, required: true, default: true, index: true },
  },
  {
    collection: "movies",
    timestamps: true,
    versionKey: false,
  }
);

export const MovieModel =
  (models.Movie as Model<MovieDocument> | undefined) ??
  model<MovieDocument>("Movie", movieSchema);
