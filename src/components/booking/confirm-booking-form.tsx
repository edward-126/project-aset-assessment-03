"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiClientError, fetchJson } from "@/lib/api/client";
import type { BookingResponse } from "@/types/api";
import type { Booking } from "@/types/domain";

export function ConfirmBookingForm({
  booking,
  onBookingUpdated,
  onError,
}: {
  booking: Booking;
  onBookingUpdated: (booking: Booking) => void;
  onError: (message: string) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleConfirm() {
    setIsSubmitting(true);
    onError("");

    try {
      const response = await fetchJson<BookingResponse>(
        `/api/bookings/${booking.id}/confirm`,
        { method: "POST" }
      );
      onBookingUpdated(response.booking);
    } catch (requestError) {
      onError(
        requestError instanceof ApiClientError || requestError instanceof Error
          ? requestError.message
          : "Booking could not be confirmed."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Button onClick={handleConfirm} disabled={isSubmitting}>
      {isSubmitting ? (
        <Loader2 data-icon="inline-start" aria-hidden="true" />
      ) : (
        <Check data-icon="inline-start" aria-hidden="true" />
      )}
      Confirm
    </Button>
  );
}
