import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  AdminDataError,
  getAdminDataErrorMessage,
} from "@/components/admin/admin-data-error";
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
import { showtimeRepository } from "@/lib/repositories/showtime-repository";
import type { BookingStatus } from "@/types/domain";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { APP_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Manage Bookings",
  description:
    "Administer cinema bookings. View, confirm, or cancel customer bookings.",
  alternates: {
    canonical: `${APP_URL}/admin/bookings`,
  },
};

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
  let bookings;
  let showtimes;

  try {
    [bookings, showtimes] = await Promise.all([
      bookingRepository.findAll(filters),
      showtimeRepository.findAll(),
    ]);
  } catch (error) {
    console.error(
      "[admin] Failed to load bookings:",
      getAdminDataErrorMessage(error)
    );

    return (
      <AdminShell>
        <AdminDataError error={error} />
      </AdminShell>
    );
  }
  const showtimeMovieTitles = new Map(
    showtimes.map((showtime) => [showtime.id, showtime.movie.title])
  );

  return (
    <AdminShell>
      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="min-w-0 overflow-x-auto">
            <Table className="min-w-275 table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-47.5">Reference</TableHead>
                  <TableHead className="w-40">Movie</TableHead>
                  <TableHead className="w-45">Customer</TableHead>
                  <TableHead className="w-65">Seats</TableHead>
                  <TableHead className="w-25">Total</TableHead>
                  <TableHead className="w-30">Status</TableHead>
                  <TableHead className="w-47.5">Created</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="truncate font-mono">
                      {booking.bookingReference}
                    </TableCell>

                    <TableCell className="truncate">
                      {(booking.showtimeId
                        ? showtimeMovieTitles.get(booking.showtimeId)
                        : undefined) ??
                        booking.movieTitle ??
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
