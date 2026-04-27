import mongoose, { type Model } from "mongoose";
import { SEAT_STATUS_VALUES, type Showtime } from "@/types/domain";

const { model, models, Schema } = mongoose;

export type ShowtimeDocument = Omit<Showtime, "createdAt" | "updatedAt"> & {
  createdAt: Date;
  updatedAt: Date;
};

const showtimeSeatStateSchema = new Schema(
  {
    seatId: { type: String, required: true },
    status: { type: String, enum: SEAT_STATUS_VALUES, required: true },
    heldByBookingId: { type: String, default: null },
  },
  { _id: false }
);

const showtimeSchema = new Schema<ShowtimeDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    movieId: { type: String, required: true, index: true },
    screenId: { type: String, required: true, index: true },
    startsAt: { type: String, required: true, index: true },
    basePrice: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, required: true, default: true, index: true },
    seatStates: { type: [showtimeSeatStateSchema], required: true },
  },
  {
    collection: "showtimes",
    timestamps: true,
    versionKey: false,
  }
);

showtimeSchema.index({ movieId: 1, startsAt: 1 });
showtimeSchema.index({ screenId: 1, startsAt: 1 });

export const ShowtimeModel =
  (models.Showtime as Model<ShowtimeDocument> | undefined) ??
  model<ShowtimeDocument>("Showtime", showtimeSchema);
