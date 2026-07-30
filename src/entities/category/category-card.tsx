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
        "home-card-shadow group flex h-full min-h-[6.75rem] flex-col rounded-[16px] bg-white p-2 transition hover:-translate-y-0.5 sm:min-h-[7.25rem] sm:p-2.5 md:min-h-[7.75rem] md:p-3 lg:min-h-[8.125rem]",
        className,
      )}
      data-category-card="true"
      href={category.href}
    >
      <div className="flex h-14 items-center justify-center rounded-[10.5px] bg-[#E0ECFF] sm:h-[3.75rem] sm:rounded-[11px] md:h-[3.875rem] md:rounded-[12px] lg:h-16">
        <div className="relative h-[44.8px] w-[44.8px] overflow-hidden rounded-[10px] sm:h-12 sm:w-12 md:h-[50px] md:w-[50px] lg:h-[51.2px] lg:w-[51.2px]">
          <Image
            alt={category.artwork.alt}
            className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.04]"
            fill
            sizes="(max-width: 639px) 44.8px, (max-width: 767px) 48px, (max-width: 1023px) 50px, 51.2px"
            src={category.artwork.src}
            unoptimized
          />
        </div>
      </div>
      <h3 className="mt-3 line-clamp-2 text-[12px] font-semibold leading-6 tracking-[-0.02em] text-neutral-950 sm:text-[13px] sm:leading-6 md:text-sm md:leading-6 lg:text-base lg:leading-[30px]">
        {category.name}
      </h3>
    </Link>
  );
}