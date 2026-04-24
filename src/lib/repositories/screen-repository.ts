import { connectToDatabase } from "@/lib/db/mongodb";
import { ScreenModel, type ScreenDocument } from "@/models/Screen";
import type { Screen, SeatStateUpdate } from "@/types/domain";

function toIsoString(value: Date | string | undefined) {
  if (!value) {
    return undefined;
  }

  return value instanceof Date ? value.toISOString() : value;
}

function toScreen(document: ScreenDocument): Screen {
  return {
    id: document.id,
    name: document.name,
    totalRows: document.totalRows,
    totalColumns: document.totalColumns,
    preferredViewingZone: document.preferredViewingZone,
    seats: document.seats,
    createdAt: toIsoString(document.createdAt),
    updatedAt: toIsoString(document.updatedAt),
  };
}

export class ScreenRepository {
  async findAll(): Promise<Screen[]> {
    await connectToDatabase();

    const screens = await ScreenModel.find({})
      .sort({ name: 1 })
      .lean<ScreenDocument[]>()
      .exec();

    return screens.map(toScreen);
  }

  async findById(screenId: string): Promise<Screen | null> {
    await connectToDatabase();

    const screen = await ScreenModel.findOne({ id: screenId })
      .lean<ScreenDocument | null>()
      .exec();

    return screen ? toScreen(screen) : null;
  }

  async findScreenWithSeats(screenId: string): Promise<Screen | null> {
    return this.findById(screenId);
  }

  async updateSeatStates(
    screenId: string,
    seatIds: string[],
    updater: SeatStateUpdate
  ): Promise<void> {
    await connectToDatabase();

    if (seatIds.length === 0) {
      return;
    }

    const update: Record<string, SeatStateUpdate[keyof SeatStateUpdate]> = {
      "seats.$[seat].status": updater.status,
    };

    if (updater.heldByBookingId !== undefined) {
      update["seats.$[seat].heldByBookingId"] = updater.heldByBookingId;
    }

    await ScreenModel.updateOne(
      { id: screenId },
      { $set: update },
      {
        arrayFilters: [{ "seat.id": { $in: seatIds } }],
        runValidators: true,
      }
    ).exec();
  }
}

export const screenRepository = new ScreenRepository();
