export default function BookDetailLoading() {
  return (
    <main className="min-h-screen bg-page-user-accent px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10" id="main-content" tabIndex={-1}>
      <div className="mx-auto flex max-w-content animate-pulse flex-col gap-6 lg:gap-8">
        <section className="rounded-5xl border border-border bg-white p-6 shadow-card md:p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(15rem,20rem)_minmax(0,1fr)] lg:gap-8">
            <div className="aspect-[4/5] rounded-[28px] bg-muted/60" />
            <div>
              <div className="h-4 w-28 rounded-full bg-muted/60" />
              <div className="mt-4 h-12 w-3/4 rounded-2xl bg-muted/60" />
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="h-20 rounded-3xl bg-muted/50" />
                <div className="h-20 rounded-3xl bg-muted/50" />
                <div className="h-20 rounded-3xl bg-muted/50 sm:col-span-2" />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="h-24 rounded-3xl bg-muted/50" />
                <div className="h-24 rounded-3xl bg-muted/50" />
                <div className="h-24 rounded-3xl bg-muted/50" />
                <div className="h-24 rounded-3xl bg-muted/50" />
              </div>
              <div className="mt-6 h-36 rounded-4xl bg-muted/40" />
            </div>
          </div>
        </section>

        <section className="rounded-5xl border border-border bg-white p-6 shadow-card md:p-8">
          <div className="h-4 w-32 rounded-full bg-muted/60" />
          <div className="mt-3 h-10 w-64 rounded-2xl bg-muted/60" />
          <div className="mt-3 h-6 w-3/4 rounded-xl bg-muted/40" />
          <div className="mt-6 grid gap-4">
            <div className="h-36 rounded-4xl bg-muted/40" />
            <div className="h-36 rounded-4xl bg-muted/40" />
          </div>
        </section>

        <section className="rounded-5xl border border-border bg-white p-6 shadow-card md:p-8">
          <div className="h-4 w-36 rounded-full bg-muted/60" />
          <div className="mt-3 h-10 w-56 rounded-2xl bg-muted/60" />
          <div className="mt-3 h-6 w-2/3 rounded-xl bg-muted/40" />
          <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
            <div className="aspect-[4/5] rounded-[24px] bg-muted/40" />
            <div className="aspect-[4/5] rounded-[24px] bg-muted/40" />
            <div className="aspect-[4/5] rounded-[24px] bg-muted/40" />
            <div className="aspect-[4/5] rounded-[24px] bg-muted/40" />
          </div>
        </section>
      </div>
    </main>
  );
}
