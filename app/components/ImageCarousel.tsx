"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import type { ProductImage } from "../context/ProductContext";

export default function ImageCarousel({ images }: { images: ProductImage[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    containScroll: false,
  });

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    const onResize = () => emblaApi.reInit();
    window.addEventListener("resize", onResize);
    return () => {
      emblaApi.off("select", onSelect);
      window.removeEventListener("resize", onResize);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="w-full py-6" data-nested-carousel>
      {/* Carousel viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex items-center">
          {images && images.length
            ? images.map((slide, index) => {
                const isActive = index === selectedIndex;
                return (
                  <div
                    key={index}
                    className="min-w-0 grow-0 shrink-0 basis-[55%] sm:basis-[40%] md:basis-[30%] lg:basis-[22%] xl:basis-[18%] px-0.5"
                  >
                    <div
                      className="transition-transform duration-300 ease-in-out origin-center"
                      style={{
                        transform: isActive ? "scale(1)" : "scale(0.8)",
                      }}
                    >
                      <Image
                        src={slide.src}
                        alt={slide.alt}
                        width={800}
                        height={1067}
                        className="w-full max-h-[40vh] rounded-2xl object-cover"
                        style={{ aspectRatio: "3 / 4" }}
                        draggable={false}
                      />
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-4">
        {/* Prev arrow – desktop only */}
        <button
          onClick={scrollPrev}
          aria-label="Previous slide"
          className="hidden lg:flex items-center justify-center w-9 h-9 rounded-full border border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        {/* Dots – always visible */}
        <div className="flex items-center gap-2">
          {images && images.length
            ? images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    index === selectedIndex
                      ? "w-2.5 h-2.5 bg-neutral-800 dark:bg-neutral-100"
                      : "w-2 h-2 bg-neutral-300 dark:bg-neutral-600"
                  }`}
                />
              ))
            : null}
        </div>

        {/* Next arrow – desktop only */}
        <button
          onClick={scrollNext}
          aria-label="Next slide"
          className="hidden lg:flex items-center justify-center w-9 h-9 rounded-full border border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
