import { cn } from "@/shared/lib/utils";

function SkeletonBlock({ className }: { className?: string | undefined }) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-[20px] bg-muted/60", className)} />;
}

function BookCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[12px] border border-border bg-white shadow-card">
      <SkeletonBlock className="aspect-[2/3] rounded-none rounded-t-[12px] bg-muted/50" />
      <div className="space-y-2 p-3 sm:p-4">
        <SkeletonBlock className="h-7 w-4/5 rounded-xl" />
        <SkeletonBlock className="h-7 w-3/5 rounded-xl bg-muted/50" />
        <div className="flex items-center gap-2 pt-1">
          <SkeletonBlock className="h-6 w-6 rounded-full" />
          <SkeletonBlock className="h-6 w-12 rounded-lg bg-muted/50" />
        </div>
      </div>
    </div>
  );
}

export function BookDetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-white text-foreground" data-book-detail-page-skeleton="true">
      <header className="home-card-shadow border-b border-border bg-white" data-book-detail-skeleton-header="true">
        <div className="mx-auto flex min-h-16 w-full max-w-canvas items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-3.5 md:px-8 lg:min-h-[72px] lg:px-10 lg:py-4 xl:min-h-[80px] xl:px-[120px] xl:py-[18px]">
          <div className="flex items-center gap-[15px]">
            <SkeletonBlock className="h-10 w-10 rounded-full lg:h-[42px] lg:w-[42px]" />
            <SkeletonBlock className="hidden h-10 w-24 rounded-2xl lg:block" />
          </div>

          <SkeletonBlock className="hidden h-11 w-full max-w-[22rem] rounded-full lg:block xl:max-w-[31.25rem]" />

          <div className="flex items-center gap-4 sm:gap-5 lg:gap-6">
            <SkeletonBlock className="hidden h-10 w-20 rounded-full lg:block" />
            <SkeletonBlock className="h-7 w-7 rounded-full sm:h-[1.875rem] sm:w-[1.875rem] lg:h-8 lg:w-8" />
            <div className="flex items-center gap-3 sm:gap-4">
              <SkeletonBlock className="h-10 w-10 rounded-full sm:h-12 sm:w-12" />
              <SkeletonBlock className="hidden h-8 w-20 rounded-xl lg:block" />
            </div>
          </div>
        </div>
      </header>

      <main
        className="px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-10 lg:px-10 lg:py-8 xl:px-[120px] xl:py-12"
        id="main-content"
        tabIndex={-1}
      >
        <div className="mx-auto flex w-full max-w-[75rem] flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16">
          <div className="hidden items-center gap-2 sm:flex" data-book-detail-skeleton-breadcrumbs="true">
            <SkeletonBlock className="h-7 w-12 rounded-lg" />
            <SkeletonBlock className="h-4 w-4 rounded-full bg-muted/50" />
            <SkeletonBlock className="h-7 w-16 rounded-lg" />
            <SkeletonBlock className="h-4 w-4 rounded-full bg-muted/50" />
            <SkeletonBlock className="h-7 w-36 rounded-lg bg-muted/50" />
          </div>

          <section
            className="rounded-[16px] bg-white p-0 shadow-card sm:rounded-[20px] xl:rounded-[24px]"
            data-book-detail-skeleton-hero="true"
          >
            <div className="flex flex-col gap-9 sm:gap-10 lg:flex-row lg:items-start lg:gap-9">
              <div className="mx-auto w-full max-w-[13.9375rem] rounded-[12px] bg-neutral-200 p-[5px] sm:max-w-[18rem] sm:p-2 lg:mx-0 lg:max-w-[21.0625rem]">
                <SkeletonBlock className="aspect-[321/482] w-full rounded-[8px] bg-muted/50" />
              </div>

              <div className="flex-1 space-y-4 sm:space-y-5">
                <div className="space-y-3">
                  <SkeletonBlock className="h-7 w-40 rounded-lg sm:w-44" />
                  <SkeletonBlock className="h-9 w-full max-w-[22rem] rounded-2xl sm:h-10 md:max-w-[26rem]" />
                  <SkeletonBlock className="h-7 w-40 rounded-lg bg-muted/50 sm:w-48" />
                  <div className="flex items-center gap-2">
                    <SkeletonBlock className="h-6 w-6 rounded-full" />
                    <SkeletonBlock className="h-6 w-12 rounded-lg bg-muted/50" />
                  </div>
                </div>

                <div className="flex items-stretch gap-4 sm:gap-5" data-book-detail-skeleton-metrics="true">
                  <div className="grid flex-1 grid-cols-3 gap-4 sm:gap-5">
                    <div className="space-y-2">
                      <SkeletonBlock className="h-8 w-12 rounded-lg" />
                      <SkeletonBlock className="h-6 w-16 rounded-lg bg-muted/50" />
                    </div>
                    <div className="space-y-2 border-l border-border pl-4 sm:pl-5">
                      <SkeletonBlock className="h-8 w-12 rounded-lg" />
                      <SkeletonBlock className="h-6 w-16 rounded-lg bg-muted/50" />
                    </div>
                    <div className="space-y-2 border-l border-border pl-4 sm:pl-5">
                      <SkeletonBlock className="h-8 w-12 rounded-lg" />
                      <SkeletonBlock className="h-6 w-16 rounded-lg bg-muted/50" />
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-border" />

                <div className="space-y-3">
                  <SkeletonBlock className="h-8 w-32 rounded-lg" />
                  <SkeletonBlock className="h-6 w-full rounded-lg bg-muted/50" />
                  <SkeletonBlock className="h-6 w-full rounded-lg bg-muted/50" />
                  <SkeletonBlock className="h-6 w-11/12 rounded-lg bg-muted/50" />
                </div>

                <div className="hidden gap-3 md:flex" data-book-detail-skeleton-actions="true">
                  <SkeletonBlock className="h-12 w-[12.5rem] rounded-full" />
                  <SkeletonBlock className="h-12 w-[12.5rem] rounded-full bg-muted/80" />
                </div>
              </div>
            </div>
          </section>

          <div className="h-px w-full bg-border" />

          <section className="space-y-5" data-book-detail-skeleton-reviews="true">
            <div className="space-y-3">
              <SkeletonBlock className="h-9 w-40 rounded-xl sm:h-11 sm:w-48" />
              <div className="flex items-center gap-3">
                <SkeletonBlock className="h-8 w-8 rounded-full" />
                <SkeletonBlock className="h-8 w-48 rounded-xl bg-muted/50 sm:w-72" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 md:gap-5 lg:gap-6">
              <SkeletonBlock className="h-[13.875rem] rounded-[16px] bg-white shadow-card" />
              <SkeletonBlock className="h-[13.875rem] rounded-[16px] bg-white shadow-card" />
            </div>

            <div className="flex justify-center">
              <SkeletonBlock className="h-10 w-[9.375rem] rounded-full sm:h-12 sm:w-[12.5rem]" />
            </div>
          </section>

          <div className="h-px w-full bg-border" />

          <section className="space-y-5" data-book-detail-skeleton-related="true">
            <div className="space-y-3">
              <SkeletonBlock className="h-9 w-44 rounded-xl sm:h-11 sm:w-56" />
              <SkeletonBlock className="h-6 w-full max-w-[26rem] rounded-lg bg-muted/50" />
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              <BookCardSkeleton />
              <BookCardSkeleton />
              <BookCardSkeleton />
              <BookCardSkeleton />
              <div className="hidden xl:block">
                <BookCardSkeleton />
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-border bg-white" data-book-detail-skeleton-footer="true">
        <div className="mx-auto flex w-full max-w-canvas justify-center px-4 py-10 sm:px-6 sm:py-12 md:px-8 md:py-14 lg:px-10 lg:py-16 xl:px-[150px] xl:py-20">
          <div className="flex w-full max-w-[71.25rem] flex-col items-center gap-6 sm:gap-8 md:gap-10">
            <div className="flex flex-col items-center gap-4 sm:gap-5 md:gap-[22px]">
              <div className="flex items-center gap-[11.43px] sm:gap-3 md:gap-[15px]">
                <SkeletonBlock className="h-8 w-8 rounded-full sm:h-9 sm:w-9 md:h-[42px] md:w-[42px]" />
                <SkeletonBlock className="h-10 w-24 rounded-2xl md:w-28" />
              </div>
              <SkeletonBlock className="h-6 w-full max-w-[22.5625rem] rounded-lg bg-muted/50 sm:max-w-[30rem] lg:max-w-[40rem]" />
              <SkeletonBlock className="h-6 w-[85%] max-w-[18rem] rounded-lg bg-muted/50 sm:max-w-[24rem] lg:max-w-[32rem]" />
            </div>

            <div className="flex flex-col items-center gap-5">
              <SkeletonBlock className="h-8 w-48 rounded-xl" />
              <div className="flex items-center gap-3">
                <SkeletonBlock className="h-10 w-10 rounded-full" />
                <SkeletonBlock className="h-10 w-10 rounded-full" />
                <SkeletonBlock className="h-10 w-10 rounded-full" />
                <SkeletonBlock className="h-10 w-10 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
