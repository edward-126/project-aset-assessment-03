import mongoose from "mongoose";
import { getServerEnv } from "@/lib/env";

declare global {
  var __mongooseConnection:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cached = global.__mongooseConnection ?? {
  conn: null,
  promise: null,
};

global.__mongooseConnection = cached;

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const { MONGODB_URI } = getServerEnv();

    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
