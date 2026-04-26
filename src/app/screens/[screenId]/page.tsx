import { AppShell } from "@/components/layout/app-shell";
import { ScreenDetailClient } from "@/components/screens/screen-detail-client";

export const dynamic = "force-dynamic";

type ScreenPageProps = {
  params: Promise<{
    screenId: string;
  }>;
};

export default async function ScreenPage({ params }: ScreenPageProps) {
  const { screenId } = await params;

  return (
    <AppShell>
      <ScreenDetailClient screenId={screenId} />
    </AppShell>
  );
}
