import { AppShell } from "@/components/layout/app-shell";
import { BookingDetailClient } from "@/components/booking/booking-detail-client";

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
