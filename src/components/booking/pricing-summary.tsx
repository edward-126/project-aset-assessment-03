import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/components/booking/format";
import type { BookingSeat } from "@/types/domain";

export function PricingSummary({
  seats,
  totalCost,
}: {
  seats: BookingSeat[];
  totalCost: number;
}) {
  const standardTotal = seats
    .filter((seat) => seat.seatType === "STANDARD")
    .reduce((total, seat) => total + seat.price, 0);
  const premiumTotal = seats
    .filter((seat) => seat.seatType === "PREMIUM")
    .reduce((total, seat) => total + seat.price, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Standard seats</dt>
            <dd className="font-mono">{formatCurrency(standardTotal)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Premium seats</dt>
            <dd className="font-mono">{formatCurrency(premiumTotal)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-t pt-3 font-medium">
            <dt>Total</dt>
            <dd className="font-mono">{formatCurrency(totalCost)}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
