import { APP_NAME } from "@/lib/constants";
import { connectToDatabase } from "@/lib/db/mongodb";
import type { ApiHealthResponse } from "@/types/api";

export const dynamic = "force-dynamic";

function getAppHealth() {
  return {
    name: APP_NAME,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "MongoDB health check failed.";
}

function getDatabaseStatus(
  readyState: number
): ApiHealthResponse["database"]["status"] {
  switch (readyState) {
    case 1:
      return "connected";
    case 2:
      return "connecting";
    case 3:
      return "disconnecting";
    default:
      return "disconnected";
  }
}

export async function GET() {
  try {
    const mongoose = await connectToDatabase();
    const databaseStatus = getDatabaseStatus(mongoose.connection.readyState);

    if (!mongoose.connection.db) {
      throw new Error("MongoDB connection is not ready.");
    }

    await mongoose.connection.db.admin().ping();

    const response: ApiHealthResponse = {
      status: "ok",
      app: getAppHealth(),
      database: {
        status: databaseStatus,
        ok: databaseStatus === "connected",
      },
    };

    return Response.json(response);
  } catch (error) {
    const response: ApiHealthResponse = {
      status: "error",
      app: getAppHealth(),
      database: {
        status: "disconnected",
        ok: false,
        message: getErrorMessage(error),
      },
    };

    return Response.json(response, { status: 503 });
  }
}
