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
      className="relative overflow-hidden rounded-[24px] bg-brand-subtle"
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
                    className="block h-auto w-full"
                    height={HERO_IMAGE_HEIGHT}
                    loading="eager"
                    sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1280px) calc(100vw - 4rem), 1200px"
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

        <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-[6px] md:bottom-5">
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                aria-label={`${heading} ${index + 1}`}
                aria-pressed={isActive}
                className="h-[10px] w-[10px] rounded-full transition"
                data-home-hero-dot="true"
                data-home-hero-dot-active={isActive ? "true" : "false"}
                key={slide.id}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className={isActive ? "block h-[10px] w-[10px] rounded-full bg-brand" : "block h-[10px] w-[10px] rounded-full bg-border"}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}