import { APP_NAME } from "@/lib/constants";
import { Clapperboard } from "lucide-react";
import Link from "next/link";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-dvh">
      <header className="bg-background/75 supports-backdrop-filter:bg-background/75 sticky top-0 border-b backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link href="/screens" className="flex min-w-0 items-center gap-2">
            <span className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
              <Clapperboard aria-hidden="true" className="size-5" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold">{APP_NAME}</span>
              <span className="text-muted-foreground truncate text-xs">
                Seat allocation system
              </span>
            </span>
          </Link>
          {/* <p className="text-muted-foreground hidden max-w-md text-right text-sm md:block">
            {APP_DESCRIPTION}
          </p> */}
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
        {children}
      </main>
    </div>
  );
}
