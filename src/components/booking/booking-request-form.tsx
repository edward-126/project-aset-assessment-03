"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ApiClientError, fetchJson } from "@/lib/api/client";
import type { BookingResponse, CreateHeldBookingRequest } from "@/types/api";
import type { Booking } from "@/types/domain";

export function BookingRequestForm({
  screenId,
  maxSeats,
  activeBooking,
  onBookingCreated,
}: {
  screenId: string;
  maxSeats: number;
  activeBooking?: Booking | null;
  onBookingCreated: (booking: Booking) => void;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<string[]>([]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (
      activeBooking?.status === "HELD" &&
      activeBooking.holdExpiresAt &&
      Date.parse(activeBooking.holdExpiresAt) > Date.now()
    ) {
      const shouldEditExistingHold = window.confirm(
        `You already have an active hold for ${activeBooking.seats.length} seats. Open that booking to change the group size instead of creating another hold?`
      );

      if (shouldEditExistingHold) {
        router.push(`/booking/${activeBooking.id}`);
      }

      return;
    }

    setIsSubmitting(true);
    setError(null);
    setDetails([]);

    const formData = new FormData(form);
    const payload: CreateHeldBookingRequest = {
      screenId,
      customerName: String(formData.get("customerName") ?? ""),
      customerEmail: String(formData.get("customerEmail") ?? ""),
      customerPhone: String(formData.get("customerPhone") ?? "") || undefined,
      groupSize: Number(formData.get("groupSize") ?? 0),
    };

    try {
      const response = await fetchJson<BookingResponse>("/api/bookings", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      onBookingCreated(response.booking);
      form.reset();
    } catch (requestError) {
      if (requestError instanceof ApiClientError) {
        setError(requestError.message);
        setDetails(requestError.details);
      } else {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Booking could not be created."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error ? (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>Booking request failed</AlertTitle>
          <AlertDescription>
            <span>{error}</span>
            {details.length > 0 ? (
              <ul className="mt-2 flex list-disc flex-col gap-1 pl-4">
                {details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            ) : null}
          </AlertDescription>
        </Alert>
      ) : null}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="customerName">Customer name</FieldLabel>
          <Input
            id="customerName"
            name="customerName"
            placeholder="e.g. Thilina Rathnayaka"
            required
          />
          <FieldDescription>Enter the full name.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="customerEmail">Email</FieldLabel>
          <Input
            id="customerEmail"
            name="customerEmail"
            type="email"
            placeholder="e.g. thilina@example.com"
            required
          />
          <FieldDescription>
            We&apos;ll use this email to send the booking confirmation.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="customerPhone">Phone</FieldLabel>
          <Input
            id="customerPhone"
            name="customerPhone"
            type="tel"
            placeholder="e.g. +94 77 123 4567"
          />
          <FieldDescription>For easier contact.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="groupSize">Group size</FieldLabel>
          <Input
            id="groupSize"
            name="groupSize"
            type="number"
            min={1}
            max={Math.max(maxSeats, 1)}
            placeholder="e.g. 2"
            required
          />
          <FieldDescription>
            Maximum available: {Math.max(maxSeats, 0)}.
          </FieldDescription>
          <FieldError>
            {maxSeats <= 0 ? "No seats are currently available." : null}
          </FieldError>
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={isSubmitting || maxSeats <= 0}>
        {isSubmitting ? (
          <Loader2 data-icon="inline-start" aria-hidden="true" />
        ) : null}
        {isSubmitting ? "Holding seats..." : "Hold seats"}
      </Button>
    </form>
  );
}
