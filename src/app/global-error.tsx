"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-4 px-6 py-12">
          <h1 className="font-display text-3xl font-bold">Application error</h1>
          <p className="text-base text-foreground">{error.message || "An unexpected error interrupted the foundation shell."}</p>
          <button className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white" onClick={reset} type="button">
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
