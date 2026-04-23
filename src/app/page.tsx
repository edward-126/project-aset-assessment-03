import Link from "next/link";
import { ArrowRight, FileCog, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

const scripts = [
  { name: "npm run dev", description: "Start the development server." },
  { name: "npm run build", description: "Create a production build." },
  {
    name: "npm run start",
    description: "Start the production server after building the app.",
  },
  { name: "npm run lint", description: "Check the project with ESLint." },
  { name: "npm run format", description: "Format the codebase with Prettier." },
  {
    name: "npm run format:check",
    description: "Check formatting without writing changes.",
  },
];

export default function Home() {
  return (
    <section className="flex min-h-dvh w-full">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-12 px-4 py-24 md:px-6">
        <div className="w-full max-w-3xl text-center">
          <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
            Template-NEXT
          </h1>

          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-base leading-7 md:text-lg">
            <span className="dark:text-chart-3 text-primary font-medium">
              Your project is ready.
            </span>{" "}
            A clean Next.js starter with TypeScript, TailwindCSS, React
            Compiler, Turbopack, shadcn/ui preset:{" "}
            <Link
              href="https://ui.shadcn.com/create?preset=b1YmqvjRA"
              target="_blank"
              rel="noreferrer"
              className="text-foreground hover:text-primary dark:hover:text-chart-3"
            >
              b1YmqvjRA
            </Link>
            , next-themes, and formatting + linting already configured.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <Link
                href="https://blog.thilina.dev/blog/template-next-get-started"
                target="_blank"
                rel="noreferrer"
              >
                Get Started
                <ArrowRight className="size-4" />
              </Link>
            </Button>

            <Button asChild variant="outline">
              <Link
                href="https://blog.thilina.dev/blog/template-next-changelog-4-2"
                target="_blank"
                rel="noreferrer"
              >
                Changelog
                <FileCog className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="bg-card text-card-foreground w-full max-w-3xl rounded-lg border">
          <div className="bg-secondary/35 border-b px-3.5 py-3.5 text-left">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Terminal className="size-4" />
              Available scripts
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              Handy commands you can use right away.
            </p>
          </div>

          <div className="grid gap-0 sm:grid-cols-2">
            {scripts.map((script, index) => (
              <div
                key={script.name}
                className={[
                  "border-b px-3.5 py-3.5 text-left sm:border-r",
                  index % 2 === 1 ? "sm:border-r-0" : "",
                  index >= scripts.length - 2 ? "border-b-0" : "",
                ].join(" ")}
              >
                <code className="bg-secondary text-secondary-foreground rounded px-1.5 py-0.5 font-mono text-sm font-medium">
                  {script.name}
                </code>
                <p className="text-muted-foreground mt-1.5 text-sm leading-[120%]">
                  {script.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-muted-foreground pb-6 text-center text-sm">
          Developed by{" "}
          <Link
            href="https://thilina.dev/"
            className="text-foreground hover:text-primary font-medium transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            Thilina R. (A.K.A Edward Hyde)
          </Link>
        </div>
      </div>
    </section>
  );
}
