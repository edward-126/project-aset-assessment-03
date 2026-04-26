"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiClientError, fetchJson } from "@/lib/api/client";
import type { BookingResponse } from "@/types/api";
import type { Booking } from "@/types/domain";

export function CancelBookingButton({
  booking,
  onBookingUpdated,
  onError,
}: {
  booking: Booking;
  onBookingUpdated: (booking: Booking) => void;
  onError: (message: string) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCancel() {
    if (!window.confirm("Cancel this booking?")) {
      return;
    }

    setIsSubmitting(true);
    onError("");

    try {
      const response = await fetchJson<BookingResponse>(
        `/api/bookings/${booking.id}/cancel`,
        { method: "POST" }
      );
      onBookingUpdated(response.booking);
    } catch (requestError) {
      onError(
        requestError instanceof ApiClientError || requestError instanceof Error
          ? requestError.message
          : "Booking could not be cancelled."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={handleCancel}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <Loader2 data-icon="inline-start" aria-hidden="true" />
      ) : (
        <X data-icon="inline-start" aria-hidden="true" />
      )}
      Cancel
    </Button>
  );
}
