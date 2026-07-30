import { cn } from "@/shared/lib/utils";

export function DiscoveryPageStateSection({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string | undefined;
}) {
  return (
    <section className={cn("home-card-shadow rounded-[16px] bg-white p-6 md:p-8", className)}>
      <h1 className="text-page-title text-neutral-950">{title}</h1>
      <p className="text-body-default mt-4 max-w-3xl text-neutral-700">{description}</p>
    </section>
  );
}
