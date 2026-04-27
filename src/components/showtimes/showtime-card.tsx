import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Armchair, Clock, Monitor } from "lucide-react";

import { formatCurrency } from "@/components/booking/format";
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
import type { ShowtimeWithDetails } from "@/types/domain";

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function ShowtimeCard({ showtime }: { showtime: ShowtimeWithDetails }) {
  const unavailableSeats = showtime.seatStates.filter(
    (state) => state.status !== "AVAILABLE"
  ).length;

  const availableSeats = Math.max(
    showtime.screen.seats.length - unavailableSeats,
    0
  );

  return (
    <Card className="group h-fit overflow-hidden pt-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        {showtime.movie.posterUrl ? (
          <Image
            src={showtime.movie.posterUrl}
            alt=""
            width={"200"}
            height={"200"}
            className="h-56 w-full object-cover"
          />
        ) : null}

        <div className="bg-background text-primary absolute right-2 top-2 flex items-center gap-1 rounded-lg px-1.5 pb-0.5 pt-1 text-sm font-medium">
          <Clock
            data-icon="inline-start"
            aria-hidden="true"
            className="-mt-0.5 size-3.5"
          />
          {formatTime(showtime.startsAt)}
        </div>
      </div>

      <CardHeader className="gap-2">
        <CardTitle className="text-xl font-semibold tracking-normal">
          {showtime.movie.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {showtime.movie.synopsis}
        </CardDescription>
        <CardAction>
          {showtime.movie.rating ? (
            <Badge variant="secondary">{showtime.movie.rating}</Badge>
          ) : null}
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-wrap gap-2 pt-2">
        <Badge variant="outline">
          <Monitor data-icon="inline-start" aria-hidden="true" />
          {showtime.screen.name}
        </Badge>
        <Badge variant="outline">
          <Armchair data-icon="inline-start" aria-hidden="true" />
          {availableSeats} seats
        </Badge>
        <Badge variant="outline">{formatCurrency(showtime.basePrice)}</Badge>
      </CardContent>

      <CardFooter className="">
        <Button asChild>
          <Link href={`/showtimes/${showtime.id}`} className="">
            Choose seats
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
