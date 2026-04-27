import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Film } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Movie } from "@/types/domain";

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Card className="group/card border-border/60 hover:border-primary/30 group h-fit overflow-hidden pt-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {movie.posterUrl ? (
        <div className="aspect-4/3 relative overflow-hidden">
          <Image
            src={movie.posterUrl}
            alt=""
            fill
            sizes="(min-width: 780px) 33vw, 100vw"
            className="object-cover transition-all duration-300 ease-in-out group-hover/card:grayscale"
          />
        </div>
      ) : null}
      <CardHeader>
        <CardTitle>{movie.title}</CardTitle>
        <CardAction>
          {movie.rating ? (
            <Badge variant="secondary">{movie.rating}</Badge>
          ) : null}
        </CardAction>
        <CardDescription>{movie.synopsis}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2 text-sm">
        {movie.genre ? (
          <Badge variant="outline">
            <Film data-icon="inline-start" aria-hidden="true" />
            {movie.genre}
          </Badge>
        ) : null}
        <Badge variant="outline">
          <Clock data-icon="inline-start" aria-hidden="true" />
          {movie.durationMinutes} min
        </Badge>
      </CardContent>
      <CardFooter>
        <Button asChild className="">
          <Link href="/showtimes">
            View showtimes
            <ArrowRight className="" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
