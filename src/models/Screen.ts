import { model, models, Schema, type Model } from "mongoose";
import {
  SEAT_STATUS_VALUES,
  SEAT_TYPE_VALUES,
  type Screen,
} from "@/types/domain";

export type ScreenDocument = Omit<Screen, "createdAt" | "updatedAt"> & {
  createdAt: Date;
  updatedAt: Date;
};

const preferredViewingZoneSchema = new Schema(
  {
    rowStart: { type: Number, required: true, min: 1 },
    rowEnd: { type: Number, required: true, min: 1 },
    centerBias: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const seatSchema = new Schema(
  {
    id: { type: String, required: true },
    screenId: { type: String, required: true, index: true },
    rowLabel: { type: String, required: true },
    seatNumber: { type: Number, required: true, min: 1 },
    type: { type: String, enum: SEAT_TYPE_VALUES, required: true },
    status: { type: String, enum: SEAT_STATUS_VALUES, required: true },
    positionX: { type: Number, required: true, min: 1 },
    positionY: { type: Number, required: true, min: 1 },
    heldByBookingId: { type: String, default: null },
  },
  { _id: false }
);

const screenSchema = new Schema<ScreenDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    totalRows: { type: Number, required: true, min: 1 },
    totalColumns: { type: Number, required: true, min: 1 },
    preferredViewingZone: { type: preferredViewingZoneSchema, required: true },
    seats: { type: [seatSchema], required: true },
  },
  {
    collection: "screens",
    timestamps: true,
    versionKey: false,
  }
);

screenSchema.index({ id: 1, "seats.id": 1 });

export const ScreenModel =
  (models.Screen as Model<ScreenDocument> | undefined) ??
  model<ScreenDocument>("Screen", screenSchema);
