"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/movies", label: "Movies" },
  { href: "/admin/screens", label: "Screens" },
  { href: "/admin/showtimes", label: "Showtimes" },
  { href: "/admin/bookings", label: "Bookings" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AppShell>
      <div className="grid min-w-0 gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="border-border h-fit rounded-lg border px-1.5 py-2.5">
          <nav className="flex flex-col gap-1">
            {adminLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "hover:bg-muted rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive && "bg-muted text-primary"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </AppShell>
  );
}
