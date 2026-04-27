import Link from "next/link";
import { ArrowRight, CalendarClock, Clapperboard, Monitor } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
    <Card className="border-border/60 hover:border-primary/30 group h-fit overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <CardTitle className="line-clamp-1 text-xl font-semibold tracking-tight">
              {showtime.movie.title}
            </CardTitle>

            <p className="text-muted-foreground line-clamp-1 text-sm">
              {showtime.movie.genre}
            </p>
          </div>

          <Badge className="bg-primary/10 text-primary hover:bg-primary/10 shrink-0 rounded-full">
            {availableSeats} seats
          </Badge>
        </div>

        <div className="bg-muted/50 grid gap-3 rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="bg-background border-border flex size-10 shrink-0 items-center justify-center rounded-full border">
              <CalendarClock
                className="text-primary size-4"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Showtime
              </p>
              <p className="truncate text-sm font-semibold">
                {formatDateTime(showtime.startsAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-background border-border flex size-10 shrink-0 items-center justify-center rounded-full border">
              <Monitor className="text-primary size-4" aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Screen
              </p>
              <p className="truncate text-sm font-semibold">
                {showtime.screen.name}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-2 text-sm leading-6">
          {showtime.movie.synopsis}
        </p>
      </CardContent>

      <CardFooter>
        <Button asChild>
          <Link href={`/showtimes/${showtime.id}`}>
            Choose seats
            <ArrowRight className="" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
