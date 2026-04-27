import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  AdminDataError,
  getAdminDataErrorMessage,
} from "@/components/admin/admin-data-error";
import { AdminShell } from "@/components/layout/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hasAdminSession } from "@/lib/admin/session";
import { movieRepository } from "@/lib/repositories/movie-repository";
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
  title: "Manage Movies",
  description:
    "Administer cinema movies. Add, edit, or remove movies from the system.",
  alternates: {
    canonical: `${APP_URL}/admin/movies`,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminMoviesPage() {
  if (!(await hasAdminSession())) {
    redirect("/admin/login");
  }

  let movies;

  try {
    movies = await movieRepository.findAll();
  } catch (error) {
    console.error(
      "[admin] Failed to load movies:",
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
          <CardTitle>Movies</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {movies.map((movie) => (
                  <TableRow key={movie.id}>
                    <TableCell className="font-medium">{movie.title}</TableCell>

                    <TableCell>{movie.genre ?? "Not set"}</TableCell>

                    <TableCell className="font-mono">
                      {movie.durationMinutes} min
                    </TableCell>

                    <TableCell>
                      <Badge variant={movie.isActive ? "default" : "outline"}>
                        {movie.isActive ? "Active" : "Inactive"}
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
