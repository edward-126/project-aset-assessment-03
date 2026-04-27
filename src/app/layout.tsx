import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import {
  APP_AUTHOR,
  APP_AUTHOR_URL,
  APP_DESCRIPTION,
  APP_NAME,
  APP_SHORT_DESCRIPTION,
  APP_URL,
} from "@/lib/constants";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    default: `${APP_NAME} | Cinema Seat Booking System`,
    template: `%s | ${APP_NAME}`,
  },

  description: APP_DESCRIPTION,

  applicationName: APP_NAME,

  authors: [{ name: APP_AUTHOR, url: APP_AUTHOR_URL }],
  creator: APP_AUTHOR,
  publisher: APP_AUTHOR,

  keywords: [
    "cinema seat booking system",
    "movie theatre seat allocation",
    "seat reservation system",
    "deterministic seat allocation",
    "booking lifecycle management",
    "temporary seat holds",
    "cinema booking prototype",
    "plan driven software development",
    "software engineering assessment",
    "TR SeatFlow",
  ],

  alternates: {
    canonical: APP_URL,
  },

  openGraph: {
    type: "website",
    url: APP_URL,
    title: `${APP_NAME} | Cinema Seat Booking System`,
    description: APP_SHORT_DESCRIPTION,
    siteName: APP_NAME,
    locale: "en_GB",
  },

  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} | Cinema Seat Booking System`,
    description: APP_SHORT_DESCRIPTION,
  },

  robots: {
    index: true,
    follow: true,
  },

  category: "education",
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
      className={cn(geist.variable, geistMono.variable)}
    >
      <body className="bg-background text-foreground relative h-full font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <main className="relative flex min-h-screen flex-col">
            <div className="flex-1 grow">{children}</div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
