import { redirect } from "next/navigation";
import { AdminShell } from "@/components/layout/admin-shell";
import { formatDateTime } from "@/components/booking/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hasAdminSession } from "@/lib/admin/session";
import { showtimeRepository } from "@/lib/repositories/showtime-repository";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function AdminShowtimesPage() {
  if (!(await hasAdminSession())) {
    redirect("/admin/login");
  }

  const showtimes = await showtimeRepository.findAll();

  return (
    <AdminShell>
      <Card>
        <CardHeader>
          <CardTitle>Showtimes</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Movie</TableHead>
                  <TableHead>Screen</TableHead>
                  <TableHead>Starts</TableHead>
                  <TableHead>Unavailable</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {showtimes.map((showtime) => (
                  <TableRow key={showtime.id}>
                    <TableCell className="font-medium">
                      {showtime.movie.title}
                    </TableCell>

                    <TableCell>{showtime.screen.name}</TableCell>

                    <TableCell>{formatDateTime(showtime.startsAt)}</TableCell>

                    <TableCell className="font-mono">
                      {
                        showtime.seatStates.filter(
                          (state) => state.status !== "AVAILABLE"
                        ).length
                      }
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={showtime.isActive ? "default" : "outline"}
                      >
                        {showtime.isActive ? "Active" : "Inactive"}
                      </Badge>
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
