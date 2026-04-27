"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingSummary } from "@/components/booking/booking-summary";
import { CancelBookingButton } from "@/components/booking/cancel-booking-button";
import { ConfirmBookingForm } from "@/components/booking/confirm-booking-form";
import { EditHeldBookingForm } from "@/components/booking/edit-held-booking-form";
import { HoldCountdown } from "@/components/booking/hold-countdown";
import { PricingSummary } from "@/components/booking/pricing-summary";
import { fetchJson } from "@/lib/api/client";
import type {
  BookingResponse,
  ScreenResponse,
  ShowtimeResponse,
} from "@/types/api";
import type { Booking, Screen, ShowtimeWithDetails } from "@/types/domain";

export function BookingDetailClient({ bookingId }: { bookingId: string }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [screen, setScreen] = useState<Screen | null>(null);
  const [showtime, setShowtime] = useState<ShowtimeWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadBooking = useCallback(async () => {
    setIsLoading(true);

    try {
      const bookingResponse = await fetchJson<BookingResponse>(
        `/api/bookings/${bookingId}`
      );
      setBooking(bookingResponse.booking);
      setError(null);

      if (bookingResponse.booking.showtimeId) {
        try {
          const showtimeResponse = await fetchJson<ShowtimeResponse>(
            `/api/showtimes/${bookingResponse.booking.showtimeId}`
          );
          setShowtime(showtimeResponse.showtime);
          setScreen(showtimeResponse.showtime.screen);
        } catch {
          setShowtime(null);
          setScreen(null);
        }
      } else {
        try {
          const screenResponse = await fetchJson<ScreenResponse>(
            `/api/screens/${bookingResponse.booking.screenId}`
          );
          setScreen(screenResponse.screen);
        } catch {
          setScreen(null);
        }
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Booking could not be loaded."
      );
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadBooking();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadBooking]);

  function handleBookingUpdated(updatedBooking: Booking) {
    setBooking(updatedBooking);
    setActionError(null);
    void loadBooking();
  }

  if (isLoading && !booking) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-56 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  if (error && !booking) {
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
          <AlertTitle>Unable to load booking</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  const canMutate = booking.status === "HELD";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Button asChild variant="ghost" className="w-fit">
          <Link
            href={
              booking.showtimeId
                ? `/showtimes/${booking.showtimeId}`
                : `/screens/${booking.screenId}`
            }
          >
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            {booking.showtimeId ? "Showtime" : "Screen"}
          </Link>
        </Button>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-normal">
              Booking summary
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm">
              {booking.bookingReference}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void loadBooking()}
          >
            <RefreshCw data-icon="inline-start" aria-hidden="true" />
            Refresh
          </Button>
        </div>
      </div>

      {actionError ? (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>Action failed</AlertTitle>
          <AlertDescription>{actionError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          <BookingSummary
            booking={booking}
            screenName={
              showtime
                ? `${showtime.movie.title}, ${showtime.screen.name}`
                : screen?.name
            }
          />
          <PricingSummary seats={booking.seats} totalCost={booking.totalCost} />
        </div>

        <div className="flex flex-col gap-4">
          {booking.status === "HELD" ? (
            <HoldCountdown
              expiresAt={booking.holdExpiresAt}
              onExpire={() => void loadBooking()}
            />
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>
                Available actions depend on the current booking status.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {canMutate ? (
                <>
                  <ConfirmBookingForm
                    booking={booking}
                    onBookingUpdated={handleBookingUpdated}
                    onError={setActionError}
                  />
                  <EditHeldBookingForm
                    booking={booking}
                    onBookingUpdated={handleBookingUpdated}
                    onError={setActionError}
                  />
                  <CancelBookingButton
                    booking={booking}
                    onBookingUpdated={handleBookingUpdated}
                    onError={setActionError}
                  />
                </>
              ) : (
                <Alert>
                  <AlertTitle>No held-seat actions</AlertTitle>
                  <AlertDescription>
                    This booking is {booking.status.toLowerCase()}.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
