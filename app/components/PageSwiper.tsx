"use client";

import { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { usePathname, useRouter } from "@/navigation";
import { useLocale } from "next-intl"; // ← add this
import { useProductId } from "../hooks/useProductId";
import { pages, pagePath, slugFromPathname } from "../pages";

export default function PageSwiper({
  initialSlide = 0,
}: {
  initialSlide?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale(); // ← get current locale
  const id = useProductId();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: initialSlide,
    watchDrag: (_emblaApi, event) => {
      const target = event.target as HTMLElement;
      return !target.closest("[data-nested-carousel]");
    },
  });

  const syncRoute = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    const page = pages[index] ?? pages[0];
    const currentSlug = slugFromPathname(pathname); // no locale arg needed

    if (currentSlug !== page.slug) {
      router.push(pagePath(id, page)); // no locale arg needed
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
      style={{ height: initialSlide === 0 ? "100%" : "calc(100dvh - 64px)" }}
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
