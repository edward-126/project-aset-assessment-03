import nextEnv from "@next/env";
import mongoose from "mongoose";
import { seedApplicationData } from "../src/seed/seed-data";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

try {
  const result = await seedApplicationData();

  console.log(
    `Seeded ${result.insertedMovies} movies, ${result.insertedScreens} screens, and ${result.insertedShowtimes} showtimes.`
  );
} catch (error) {
  console.error("Failed to seed TR SeatFlow data.");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
