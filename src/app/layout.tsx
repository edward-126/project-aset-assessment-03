import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  keywords: [
    "TR SeatFlow",
    "Next.js",
    "TypeScript",
    "MongoDB",
    "shadcn/ui",
    "Seat Allocation",
  ],
  authors: [{ name: "Thilina Rathnayaka" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(geistMono.variable, "font-sans", geist.variable)}
    >
      <body
        className={cn(
          "bg-background text-foreground relative h-full font-sans antialiased"
        )}
      >
        <main className="relative flex min-h-screen flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            <div className="flex-1 grow">{children}</div>
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
