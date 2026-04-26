import nextEnv from "@next/env";
import mongoose from "mongoose";
import { seedScreenCollection } from "../src/seed/seed-screens";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

try {
  const result = await seedScreenCollection();

  console.log(
    `Seeded ${result.insertedScreens} screens: ${result.screenIds.join(", ")}`
  );
} catch (error) {
  console.error("Failed to seed screens.");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
