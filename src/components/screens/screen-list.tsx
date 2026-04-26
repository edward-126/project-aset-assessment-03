"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchJson } from "@/lib/api/client";
import type { ScreensResponse, ScreenSummary } from "@/types/api";
import { ScreenCard } from "@/components/screens/screen-card";

export function ScreenList() {
  const [screens, setScreens] = useState<ScreenSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchJson<ScreensResponse>("/api/screens")
      .then((response) => {
        if (!isMounted) {
          return;
        }

        setScreens(response.screens);
        setError(null);
      })
      .catch((requestError: unknown) => {
        if (!isMounted) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Screens could not be loaded."
        );
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle aria-hidden="true" />
        <AlertTitle>Unable to load screens</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (screens.length === 0) {
    return (
      <Alert>
        <AlertTitle>No screens available</AlertTitle>
        <AlertDescription>
          Seed the cinema screens before starting the booking walkthrough.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {screens.map((screen) => (
        <ScreenCard key={screen.id} screen={screen} />
      ))}
    </div>
  );
}
