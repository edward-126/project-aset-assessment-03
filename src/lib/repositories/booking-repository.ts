import { connectToDatabase } from "@/lib/db/mongodb";
import { BookingModel, type BookingDocument } from "@/models/Booking";
import type { Booking } from "@/types/domain";

type PersistedBooking = Omit<BookingDocument, "createdAt" | "updatedAt"> & {
  createdAt: Date | string;
  updatedAt: Date | string;
};

type DocumentLike<T> = T & {
  toObject?: () => T;
};

function unwrapDocument<T>(document: DocumentLike<T>): T {
  return typeof document.toObject === "function" ? document.toObject() : document;
}

function toIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : value;
}

function toBooking(document: PersistedBooking): Booking {
  return {
    id: document.id,
    screenId: document.screenId,
    bookingReference: document.bookingReference,
    customerName: document.customerName,
    customerEmail: document.customerEmail,
    customerPhone: document.customerPhone,
    status: document.status,
    seats: document.seats,
    holdExpiresAt: document.holdExpiresAt,
    totalCost: document.totalCost,
    createdAt: toIsoString(document.createdAt),
    updatedAt: toIsoString(document.updatedAt),
  };
}

export class BookingRepository {
  async save(booking: Booking): Promise<Booking> {
    await connectToDatabase();

    const savedBooking = await BookingModel.create(booking);

    return toBooking(
      unwrapDocument(savedBooking as unknown as DocumentLike<PersistedBooking>)
    );
  }

  async findById(bookingId: string): Promise<Booking | null> {
    await connectToDatabase();

    const booking = await BookingModel.findOne({ id: bookingId })
      .lean<PersistedBooking | null>()
      .exec();

    return booking ? toBooking(booking) : null;
  }

  async update(
    bookingId: string,
    patch: Partial<Booking>
  ): Promise<Booking> {
    await connectToDatabase();

    const booking = await BookingModel.findOneAndUpdate(
      { id: bookingId },
      { $set: patch },
      { new: true, runValidators: true }
    )
      .lean<PersistedBooking | null>()
      .exec();

    if (!booking) {
      throw new Error(`Booking ${bookingId} was not found.`);
    }

    return toBooking(booking);
  }

  async findExpiredHeldBookings(now: Date): Promise<Booking[]> {
    await connectToDatabase();

    const expiredBookings = await BookingModel.find({
      status: "HELD",
      holdExpiresAt: { $ne: null, $lte: now.toISOString() },
    })
      .sort({ holdExpiresAt: 1 })
      .lean<PersistedBooking[]>()
      .exec();

    return expiredBookings.map(toBooking);
  }
}

export const bookingRepository = new BookingRepository();
