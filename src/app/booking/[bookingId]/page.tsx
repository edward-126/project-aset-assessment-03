import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { BookingDetailClient } from "@/components/booking/booking-detail-client";
import { APP_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Booking Details",
  description:
    "View and manage your cinema seat booking. Confirm or cancel your reservation.",
  alternates: {
    canonical: `${APP_URL}/booking`,
  },
};

export const dynamic = "force-dynamic";

type BookingPageProps = {
  params: Promise<{
    bookingId: string;
  }>;
};

export default async function BookingPage({ params }: BookingPageProps) {
  const { bookingId } = await params;

  return (
    <AppShell>
      <BookingDetailClient bookingId={bookingId} />
    </AppShell>
  );
}
