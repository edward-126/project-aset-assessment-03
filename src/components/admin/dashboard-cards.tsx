import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/components/booking/format";

export function DashboardCards({
  summary,
}: {
  summary: {
    totalMovies: number;
    activeShowtimes: number;
    totalScreens: number;
    totalBookings: number;
    heldBookings: number;
    confirmedBookings: number;
    confirmedRevenue: number;
  };
}) {
  const cards = [
    { label: "Movies", value: summary.totalMovies },
    { label: "Active showtimes", value: summary.activeShowtimes },
    { label: "Screens", value: summary.totalScreens },
    { label: "Bookings", value: summary.totalBookings },
    { label: "Held", value: summary.heldBookings },
    { label: "Confirmed", value: summary.confirmedBookings },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.label} className="gap-1.5">
          <CardHeader>
            <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-semibold">{card.value}</p>
          </CardContent>
        </Card>
      ))}
      <Card className="bg-primary text-primary-foreground gap-2 md:col-span-3">
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Confirmed revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge
            variant={"default"}
            className="py-4! bg-card/15 rounded-md font-mono text-xl"
          >
            {formatCurrency(summary.confirmedRevenue)}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
