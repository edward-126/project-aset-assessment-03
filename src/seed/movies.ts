import type { Movie } from "@/types/domain";

const now = "2026-04-27T00:00:00.000Z";

export const seedMovies: Movie[] = [
  {
    id: "movie-project-hail-mary",
    title: "Project Hail Mary",
    slug: "project-hail-mary",
    synopsis:
      "A lone astronaut wakes up on a desperate mission to save humanity, with no memory of who he is or how he got there.",
    durationMinutes: 120,
    rating: "PG-13",
    genre: "Sci-Fi",
    posterUrl:
      "https://media.themoviedb.org/t/p/w1066_and_h600_face/8Tfys3mDZVp4tNoH2ktm06a0Tau.jpg",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "movie-hoppers",
    title: "Hoppers",
    slug: "hoppers",
    synopsis:
      "A young animal lover joins an experimental project that lets humans communicate with animals in a whole new way.",
    durationMinutes: 95,
    rating: "PG",
    genre: "Animation",
    posterUrl:
      "https://media.themoviedb.org/t/p/w1066_and_h600_face/u53UYu5XG2hNgWGvs3xGhAVzypl.jpg",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "movie-avatar-fire-and-ash",
    title: "Avatar: Fire and Ash",
    slug: "avatar-fire-and-ash",
    synopsis:
      "The next chapter of the Avatar saga explores new regions of Pandora and the dangerous power of fire.",
    durationMinutes: 180,
    rating: "PG-13",
    genre: "Sci-Fi",
    posterUrl:
      "https://media.themoviedb.org/t/p/w1066_and_h600_face/9QW8bQ0BK4GjtpHPuZvH6cfcBDS.jpg",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
];
