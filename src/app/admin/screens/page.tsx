import { redirect } from "next/navigation";
import {
  AdminDataError,
  getAdminDataErrorMessage,
} from "@/components/admin/admin-data-error";
import { AdminShell } from "@/components/layout/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hasAdminSession } from "@/lib/admin/session";
import { screenRepository } from "@/lib/repositories/screen-repository";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function AdminScreensPage() {
  if (!(await hasAdminSession())) {
    redirect("/admin/login");
  }

  let screens;

  try {
    screens = await screenRepository.findAll();
  } catch (error) {
    console.error(
      "[admin] Failed to load screens:",
      getAdminDataErrorMessage(error)
    );

    return (
      <AdminShell>
        <AdminDataError error={error} />
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <Card>
        <CardHeader>
          <CardTitle>Screens</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Layout</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {screens.map((screen) => (
                  <TableRow key={screen.id}>
                    <TableCell className="font-medium">{screen.name}</TableCell>

                    <TableCell className="font-mono">
                      {screen.totalRows} x {screen.totalColumns}
                    </TableCell>

                    <TableCell className="font-mono">
                      {screen.seats.length}
                    </TableCell>

                    <TableCell>
                      <Badge variant={screen.isActive ? "default" : "outline"}>
                        {screen.isActive ? "Active" : "Inactive"}
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
