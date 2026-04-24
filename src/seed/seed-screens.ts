import { connectToDatabase } from "@/lib/db/mongodb";
import { ScreenModel } from "@/models/Screen";
import { seedScreens } from "@/seed/screens";

export async function seedScreenCollection() {
  await connectToDatabase();

  const screenIds = seedScreens.map((screen) => screen.id);

  await ScreenModel.deleteMany({ id: { $in: screenIds } });
  await ScreenModel.insertMany(seedScreens, { ordered: true });

  return {
    insertedScreens: seedScreens.length,
    screenIds,
  };
}
