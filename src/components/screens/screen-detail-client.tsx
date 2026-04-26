"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingRequestForm } from "@/components/booking/booking-request-form";
import { BookingSummary } from "@/components/booking/booking-summary";
import { SeatMap } from "@/components/seat-map/seat-map";
import { fetchJson } from "@/lib/api/client";
import type { ScreenResponse } from "@/types/api";
import type { Booking, Screen } from "@/types/domain";

function isActiveHeldBooking(booking: Booking | null) {
  return (
    booking?.status === "HELD" &&
    !!booking.holdExpiresAt &&
    Date.parse(booking.holdExpiresAt) > Date.now()
  );
}

export function ScreenDetailClient({ screenId }: { screenId: string }) {
  const [screen, setScreen] = useState<Screen | null>(null);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadScreen = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetchJson<ScreenResponse>(
        `/api/screens/${screenId}`
      );
      setScreen(response.screen);
      setCreatedBooking((booking) =>
        booking && !isActiveHeldBooking(booking)
          ? { ...booking, status: "EXPIRED", holdExpiresAt: null }
          : booking
      );
      setError(null);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Screen could not be loaded."
      );
    } finally {
      setIsLoading(false);
    }
  }, [screenId]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadScreen();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadScreen]);

  const selectedSeatIds = useMemo(
    () =>
      new Set(
        isActiveHeldBooking(createdBooking)
          ? createdBooking?.seats.map((bookingSeat) => bookingSeat.seatId)
          : []
      ),
    [createdBooking]
  );
  const availableSeatCount =
    screen?.seats.filter((seat) => seat.status === "AVAILABLE").length ?? 0;

  function handleBookingCreated(booking: Booking) {
    setCreatedBooking(booking);
    void loadScreen();
  }

  if (isLoading && !screen) {
    return (
      <div className="gap-4.5 flex flex-col">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="md:w-100 h-8" />
        <Skeleton className="h-3.5 w-60" />

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error && !screen) {
    return (
      <div className="flex flex-col gap-4">
        <Button asChild variant="ghost" className="w-fit">
          <Link href="/screens">
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            Screens
          </Link>
        </Button>
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>Unable to load screen</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!screen) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Button asChild variant="ghost" className="w-fit">
          <Link href="/screens">
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            Screens
          </Link>
        </Button>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-normal">
              {screen.name}
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm">
              {screen.totalRows} rows, {screen.totalColumns} columns,{" "}
              {availableSeatCount} seats available.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{availableSeatCount} available</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadScreen()}
            >
              <RefreshCw data-icon="inline-start" aria-hidden="true" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>Latest screen refresh failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Seat map</CardTitle>
            <CardDescription>
              Held and booked seats are unavailable for new requests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SeatMap screen={screen} selectedSeatIds={selectedSeatIds} />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking request</CardTitle>
              <CardDescription>
                Enter the group size and customer details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookingRequestForm
                screenId={screen.id}
                maxSeats={availableSeatCount}
                activeBooking={createdBooking}
                onBookingCreated={handleBookingCreated}
              />
            </CardContent>
          </Card>

          {createdBooking ? (
            <BookingSummary
              booking={createdBooking}
              screenName={screen.name}
              showReviewLink
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
