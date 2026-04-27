import { model, models, Schema, type Model } from "mongoose";
import {
  ALLOCATION_MODE_VALUES,
  BOOKING_STATUS_VALUES,
  SEAT_TYPE_VALUES,
  type Booking,
} from "@/types/domain";

export type BookingDocument = Omit<Booking, "createdAt" | "updatedAt"> & {
  createdAt: Date;
  updatedAt: Date;
};

const bookingSeatSchema = new Schema(
  {
    seatId: { type: String, required: true },
    rowLabel: { type: String, required: true },
    seatNumber: { type: Number, required: true, min: 1 },
    seatType: { type: String, enum: SEAT_TYPE_VALUES, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const bookingSchema = new Schema<BookingDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    showtimeId: { type: String, index: true },
    screenId: { type: String, required: true, index: true },
    movieId: { type: String, index: true },
    movieTitle: { type: String },
    showtimeStartsAt: { type: String },
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String },
    status: { type: String, enum: BOOKING_STATUS_VALUES, required: true },
    allocationMode: {
      type: String,
      enum: ALLOCATION_MODE_VALUES,
      default: "AUTO",
    },
    seats: { type: [bookingSeatSchema], required: true },
    holdExpiresAt: { type: String, default: null },
    totalCost: { type: Number, required: true, min: 0 },
  },
  {
    collection: "bookings",
    timestamps: true,
    versionKey: false,
  }
);

bookingSchema.index({ status: 1, holdExpiresAt: 1 });

export const BookingModel =
  (models.Booking as Model<BookingDocument> | undefined) ??
  model<BookingDocument>("Booking", bookingSchema);
