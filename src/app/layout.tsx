import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Template-NEXT",
  description:
    "A reusable Next.js starter with TypeScript, Tailwind CSS, React Compiler, Turbopack, shadcn/ui preset b1YmqvjRA, and next-themes.",
  keywords: [
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "shadcn/ui",
    "next-themes",
    "Template",
  ],
  authors: [{ name: "Thilina R. (Edward Hyde)", url: "https://thilina.dev" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background text-foreground relative h-full font-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <main className="relative flex min-h-screen flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex-1 grow">{children}</div>
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
