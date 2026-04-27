import { redirect } from "next/navigation";
import { AdminShell } from "@/components/layout/admin-shell";
import {
  formatCurrency,
  formatDateTime,
  formatSeats,
} from "@/components/booking/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hasAdminSession } from "@/lib/admin/session";
import { bookingRepository } from "@/lib/repositories/booking-repository";
import type { BookingStatus } from "@/types/domain";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

type AdminBookingsPageProps = {
  searchParams: Promise<{
    status?: BookingStatus;
    movieId?: string;
    screenId?: string;
    showtimeId?: string;
  }>;
};

const statusVariant = {
  HELD: "secondary",
  CONFIRMED: "default",
  CANCELLED: "outline",
  EXPIRED: "destructive",
} as const;

export default async function AdminBookingsPage({
  searchParams,
}: AdminBookingsPageProps) {
  if (!(await hasAdminSession())) {
    redirect("/admin/login");
  }

  const filters = await searchParams;
  const bookings = await bookingRepository.findAll(filters);

  return (
    <AdminShell>
      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="min-w-0 overflow-x-auto">
            <Table className="min-w-[1100px] table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[190px]">Reference</TableHead>
                  <TableHead className="w-[160px]">Movie</TableHead>
                  <TableHead className="w-[180px]">Customer</TableHead>
                  <TableHead className="w-[260px]">Seats</TableHead>
                  <TableHead className="w-[100px]">Total</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[190px]">Created</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="truncate font-mono">
                      {booking.bookingReference}
                    </TableCell>

                    <TableCell className="truncate">
                      {booking.movieTitle ??
                        booking.movieId ??
                        "Screen booking"}
                    </TableCell>

                    <TableCell className="truncate">
                      {booking.customerName}
                    </TableCell>

                    <TableCell className="truncate font-mono">
                      {formatSeats(booking.seats)}
                    </TableCell>

                    <TableCell className="whitespace-nowrap font-mono">
                      {formatCurrency(booking.totalCost)}
                    </TableCell>

                    <TableCell>
                      <Badge variant={statusVariant[booking.status]}>
                        {booking.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {formatDateTime(booking.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
