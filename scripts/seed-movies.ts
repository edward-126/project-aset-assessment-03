import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

import { connectToDatabase } from "@/lib/db/mongodb";
import { MovieModel } from "@/models/Movie";
import { seedMovies } from "@/seed/movies";

async function main() {
  await connectToDatabase();

  const movieIds = seedMovies.map((movie) => movie.id);

  await MovieModel.deleteMany({
    id: { $in: movieIds },
  });

  await MovieModel.insertMany(seedMovies, {
    ordered: true,
  });

  console.log(`Replaced ${seedMovies.length} seeded movies.`);
  console.log("Movie IDs:", movieIds.join(", "));
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to seed movies:", error);
    process.exit(1);
  });