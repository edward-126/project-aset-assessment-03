import Link from "next/link";
import { ArrowRight, Armchair } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ScreenSummary } from "@/types/api";

export function ScreenCard({ screen }: { screen: ScreenSummary }) {
  const occupancy =
    screen.totalSeats === 0
      ? 0
      : Math.round(
          ((screen.totalSeats - screen.availableSeats) / screen.totalSeats) *
            100
        );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{screen.name}</CardTitle>
        <CardDescription>
          {screen.totalRows} rows by {screen.totalColumns} seats
        </CardDescription>
        <CardAction>
          <Badge
            variant={screen.availableSeats > 0 ? "secondary" : "destructive"}
          >
            {screen.availableSeats} free
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Seats</span>
            <span className="font-mono font-medium">{screen.totalSeats}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Available</span>
            <span className="font-mono font-medium">
              {screen.availableSeats}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Occupied</span>
            <span className="font-mono font-medium">{occupancy}%</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Armchair aria-hidden="true" className="size-5" />
          <span>Single active showtime</span>
        </div>
        <Button asChild size="sm">
          <Link href={`/screens/${screen.id}`}>
            Choose
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
