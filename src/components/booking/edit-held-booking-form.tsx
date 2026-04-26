"use client";

import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ApiClientError, fetchJson } from "@/lib/api/client";
import type { BookingResponse, EditHeldBookingRequest } from "@/types/api";
import type { Booking } from "@/types/domain";

export function EditHeldBookingForm({
  booking,
  onBookingUpdated,
  onError,
}: {
  booking: Booking;
  onBookingUpdated: (booking: Booking) => void;
  onError: (message: string) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    onError("");

    const formData = new FormData(event.currentTarget);
    const payload: EditHeldBookingRequest = {
      groupSize: Number(formData.get("groupSize") ?? 0),
    };

    try {
      const response = await fetchJson<BookingResponse>(
        `/api/bookings/${booking.id}/edit`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
      onBookingUpdated(response.booking);
    } catch (requestError) {
      onError(
        requestError instanceof ApiClientError || requestError instanceof Error
          ? requestError.message
          : "Booking could not be edited."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="editGroupSize">Group size</FieldLabel>
          <Input
            id="editGroupSize"
            name="groupSize"
            type="number"
            min={1}
            required
            defaultValue={booking.seats.length}
          />
          <FieldDescription>
            The allocator will release the current hold and choose a fresh set.
          </FieldDescription>
        </Field>
      </FieldGroup>
      <Button type="submit" variant="outline" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 data-icon="inline-start" aria-hidden="true" />
        ) : (
          <RefreshCw data-icon="inline-start" aria-hidden="true" />
        )}
        Reallocate
      </Button>
    </form>
  );
}
