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
import { formatDateTime } from "@/components/booking/format";
import { SeatMap } from "@/components/seat-map/seat-map";
import { fetchJson } from "@/lib/api/client";
import type { ShowtimeResponse } from "@/types/api";
import type {
  AllocationMode,
  Booking,
  ShowtimeWithDetails,
} from "@/types/domain";

function isActiveHeldBooking(booking: Booking | null) {
  return (
    booking?.status === "HELD" &&
    !!booking.holdExpiresAt &&
    Date.parse(booking.holdExpiresAt) > Date.now()
  );
}

export function ShowtimeDetailClient({ showtimeId }: { showtimeId: string }) {
  const [showtime, setShowtime] = useState<ShowtimeWithDetails | null>(null);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [mode, setMode] = useState<AllocationMode>("AUTO");
  const [manualSeatIds, setManualSeatIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadShowtime = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetchJson<ShowtimeResponse>(
        `/api/showtimes/${showtimeId}`
      );
      setShowtime(response.showtime);
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
          : "Showtime could not be loaded."
      );
    } finally {
      setIsLoading(false);
    }
  }, [showtimeId]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadShowtime();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadShowtime]);

  const selectedSeatIds = useMemo(() => {
    if (mode === "MANUAL") {
      return new Set(manualSeatIds);
    }

    return new Set(
      isActiveHeldBooking(createdBooking)
        ? createdBooking?.seats.map((bookingSeat) => bookingSeat.seatId)
        : []
    );
  }, [createdBooking, manualSeatIds, mode]);

  const availableSeatCount =
    showtime?.screen.seats.filter((seat) => seat.status === "AVAILABLE")
      .length ?? 0;

  function handleSeatToggle(seatId: string) {
    setManualSeatIds((current) =>
      current.includes(seatId)
        ? current.filter((currentSeatId) => currentSeatId !== seatId)
        : [...current, seatId]
    );
  }

  function handleBookingCreated(booking: Booking) {
    setCreatedBooking(booking);
    setManualSeatIds([]);
    void loadShowtime();
  }

  if (isLoading && !showtime) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-72" />
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error && !showtime) {
    return (
      <div className="flex flex-col gap-4">
        <Button asChild variant="ghost" className="w-fit">
          <Link href="/showtimes">
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            Showtimes
          </Link>
        </Button>
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>Unable to load showtime</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!showtime) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Button asChild variant="ghost" className="w-fit">
          <Link href="/showtimes">
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            Showtimes
          </Link>
        </Button>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-normal">
              {showtime.movie.title}
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm">
              {formatDateTime(showtime.startsAt)} in {showtime.screen.name}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{availableSeatCount} available</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadShowtime()}
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
          <AlertTitle>Latest showtime refresh failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Seat map</CardTitle>
            <CardDescription>
              {mode === "MANUAL"
                ? "Select available seats before submitting the request."
                : "Automatic allocation prioritises contiguous seats near the preferred zone."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SeatMap
              screen={showtime.screen}
              selectedSeatIds={selectedSeatIds}
              onSeatToggle={mode === "MANUAL" ? handleSeatToggle : undefined}
            />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking request</CardTitle>
              <CardDescription>
                Choose automatic allocation or select seats manually.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={mode === "AUTO" ? "default" : "outline"}
                  onClick={() => setMode("AUTO")}
                >
                  Auto
                </Button>
                <Button
                  type="button"
                  variant={mode === "MANUAL" ? "default" : "outline"}
                  onClick={() => setMode("MANUAL")}
                >
                  Manual
                </Button>
              </div>
              <BookingRequestForm
                showtimeId={showtime.id}
                screenId={showtime.screen.id}
                maxSeats={availableSeatCount}
                activeBooking={createdBooking}
                allocationMode={mode}
                selectedSeatIds={manualSeatIds}
                onBookingCreated={handleBookingCreated}
              />
            </CardContent>
          </Card>

          {createdBooking ? (
            <BookingSummary
              booking={createdBooking}
              screenName={showtime.screen.name}
              showReviewLink
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
