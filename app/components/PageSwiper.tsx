"use client";

import { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { usePathname, useRouter } from "next/navigation";
import { useProductId } from "../hooks/useProductId";
import { pages, pagePath } from "../pages";

export default function PageSwiper({
  initialSlide = 0,
}: {
  initialSlide?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const id = useProductId();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: initialSlide,
    // breakpoints: {
    //   // Disable carousel when screen width is 768px or greater
    //   "(min-width: 1024px)": { active: false },
    // },
    watchDrag: (_emblaApi, event) => {
      const target = event.target as HTMLElement;
      // Ignore drags from inside nested carousels
      return !target.closest("[data-nested-carousel]");
    },
  });

  const syncRoute = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    const page = pages[index] ?? pages[0];
    if (pathname !== page.path) {
      router.push(pagePath(id, page), { scroll: false });
    }
  }, [emblaApi, pathname, router, id]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", syncRoute);
    return () => {
      emblaApi.off("select", syncRoute);
    };
  }, [emblaApi, syncRoute]);

  return (
    <div
      ref={emblaRef}
      className="overflow-hidden"
      style={{
        height: initialSlide === 0 ? "100%" : "calc(100dvh - 64px)",
      }}
    >
      <div className="flex h-full">
        {pages.map((page) => (
          <div key={page.slug} className="min-w-0 flex-[0_0_100%]">
            <page.content />
          </div>
        ))}
      </div>
    </div>
  );
}
