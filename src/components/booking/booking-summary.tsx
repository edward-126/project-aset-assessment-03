import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  formatCurrency,
  formatDateTime,
  formatSeats,
  statusLabel,
} from "@/components/booking/format";
import type { Booking } from "@/types/domain";

const statusVariant = {
  HELD: "secondary",
  CONFIRMED: "default",
  CANCELLED: "outline",
  EXPIRED: "destructive",
} as const;

export function BookingSummary({
  booking,
  screenName,
  showReviewLink = false,
}: {
  booking: Booking;
  screenName?: string;
  showReviewLink?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{booking.bookingReference}</CardTitle>
        <CardAction>
          <Badge variant={statusVariant[booking.status]}>
            {statusLabel(booking.status)}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground">Customer</dt>
            <dd className="font-medium">{booking.customerName}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground">Screen</dt>
            <dd className="font-medium">{screenName ?? booking.screenId}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground">Seats</dt>
            <dd className="font-mono">{formatSeats(booking.seats)}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground">Total</dt>
            <dd className="font-mono font-medium">
              {formatCurrency(booking.totalCost)}
            </dd>
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <dt className="text-muted-foreground">Hold expires</dt>
            <dd>{formatDateTime(booking.holdExpiresAt)}</dd>
          </div>
        </dl>
      </CardContent>
      {showReviewLink ? (
        <CardFooter className="justify-end">
          <Button asChild>
            <Link href={`/booking/${booking.id}`}>Review booking</Link>
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}
