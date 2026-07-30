"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const HERO_SLIDES = [
  { id: "hero-1", src: "/images/hero-image-01.svg" },
  { id: "hero-2", src: "/images/hero-image-01.svg" },
  { id: "hero-3", src: "/images/hero-image-01.svg" },
] as const;

const HERO_AUTOPLAY_MS = 6000;
const HERO_IMAGE_WIDTH = 1200;
const HERO_IMAGE_HEIGHT = 441;

type HomeHeroBannerProps = {
  heading: string;
};

export function HomeHeroBanner({ heading }: HomeHeroBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % HERO_SLIDES.length);
    }, HERO_AUTOPLAY_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative overflow-hidden rounded-[16px] bg-brand-subtle md:rounded-[20px] xl:rounded-[24px]"
      data-home-hero="true"
    >
      <h1 className="sr-only" id="home-hero-title">
        {heading}
      </h1>

      <div className="relative">
        <div
          className="flex transition-transform duration-500 ease-out"
          data-home-hero-track="true"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                className="min-w-full"
                data-home-hero-slide="true"
                data-home-hero-slide-active={isActive ? "true" : "false"}
                key={slide.id}
              >
                {isActive ? (
                  <Image
                    alt=""
                    aria-hidden="true"
                    className="block h-auto w-full rounded-[16px] md:rounded-[20px] xl:rounded-[24px]"
                    height={HERO_IMAGE_HEIGHT}
                    loading="eager"
                    sizes="(max-width: 639px) 361px, (max-width: 1023px) calc(100vw - 3rem), (max-width: 1279px) calc(100vw - 5rem), 1200px"
                    src={slide.src}
                    width={HERO_IMAGE_WIDTH}
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="w-full"
                    style={{ aspectRatio: `${HERO_IMAGE_WIDTH} / ${HERO_IMAGE_HEIGHT}` }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="absolute inset-x-0 bottom-[8px] flex items-center justify-center gap-1 sm:bottom-[10px] md:bottom-5 md:gap-[6px]">
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === activeIndex;
            const dotSizeClass = isActive ? "h-[6px] w-[6px] md:h-[10px] md:w-[10px]" : "h-[6px] w-[6px] md:h-[10px] md:w-[10px]";

            return (
              <button
                aria-label={`${heading} ${index + 1}`}
                aria-pressed={isActive}
                className={dotSizeClass}
                data-home-hero-dot="true"
                data-home-hero-dot-active={isActive ? "true" : "false"}
                key={slide.id}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className={isActive ? `block ${dotSizeClass} rounded-full bg-brand` : `block ${dotSizeClass} rounded-full bg-border`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
