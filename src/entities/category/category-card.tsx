import Image from "next/image";
import Link from "next/link";

import type { CategoryPresentation } from "@/entities/category/model";
import { cn } from "@/shared/lib/utils";

export type CategoryCardProps = {
  category: CategoryPresentation;
  className?: string | undefined;
};

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link
      aria-label={category.name}
      className={cn(
        "home-card-shadow group flex h-full min-h-[8.125rem] flex-col rounded-[16px] bg-white p-3 transition hover:-translate-y-0.5",
        className,
      )}
      data-category-card="true"
      href={category.href}
    >
      <div className="flex h-16 items-center justify-center rounded-[12px] bg-[#E0ECFF]">
        <div className="relative h-[51.2px] w-[51.2px] overflow-hidden rounded-[12px]">
          <Image
            alt={category.artwork.alt}
            className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.04]"
            fill
            sizes="51.2px"
            src={category.artwork.src}
            unoptimized
          />
        </div>
      </div>
      <h3 className="mt-3 text-base font-semibold leading-[30px] tracking-[-0.02em] text-neutral-950">{category.name}</h3>
    </Link>
  );
}
