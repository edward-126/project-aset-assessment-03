import Link from "next/link";
import { CalendarClock, Clapperboard, Monitor } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateTime } from "@/components/booking/format";
import type { ShowtimeWithDetails } from "@/types/domain";

export function ShowtimeCard({ showtime }: { showtime: ShowtimeWithDetails }) {
  const unavailableSeats = showtime.seatStates.filter(
    (state) => state.status !== "AVAILABLE"
  ).length;
  const availableSeats = Math.max(
    showtime.screen.seats.length - unavailableSeats,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{showtime.movie.title}</CardTitle>
        <CardDescription>{showtime.movie.genre}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            <CalendarClock data-icon="inline-start" aria-hidden="true" />
            {formatDateTime(showtime.startsAt)}
          </Badge>
          <Badge variant="outline">
            <Monitor data-icon="inline-start" aria-hidden="true" />
            {showtime.screen.name}
          </Badge>
          <Badge variant="outline">
            <Clapperboard data-icon="inline-start" aria-hidden="true" />
            {availableSeats} seats
          </Badge>
        </div>
        <p className="text-muted-foreground">{showtime.movie.synopsis}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/showtimes/${showtime.id}`}>Choose seats</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
