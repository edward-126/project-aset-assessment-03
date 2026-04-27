"use client";

import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Clapperboard, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/movies", label: "Movies" },
  { href: "/showtimes", label: "Showtimes" },
  { href: "/admin", label: "Admin" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-background min-h-dvh">
      <header className="bg-background/90 supports-backdrop-filter:bg-background/90 sticky top-0 z-50 border-b backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <span className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
              <Clapperboard aria-hidden="true" className="size-5" />
            </span>

            <span className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold">{APP_NAME}</span>
              <span className="text-muted-foreground truncate text-xs">
                Cinema booking and seat allocation
              </span>
            </span>
          </Link>

          <nav className="flex shrink-0 items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Button
                  key={link.href}
                  variant={isActive ? "secondary" : "ghost"}
                  // variant={"ghost"}
                  size="sm"
                  asChild
                >
                  <Link
                    href={link.href}
                    className={
                      isActive ? "text-primary! font-medium" : undefined
                    }
                  >
                    {link.label}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
        {children}
      </main>

      <footer className="text-muted-foreground text-xs">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="group/copyright">
            Designed and Developed by{" "}
            <Link
              href="https://thilina.dev/"
              className="text-primary inline-flex items-center gap-0.5 transition-all duration-300 ease-in-out group-hover/copyright:font-medium"
              target="_blank"
            >
              Thilina R. <ExternalLinkIcon className="-mt-px size-3" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
