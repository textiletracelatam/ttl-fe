"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useProduct } from "@/app/context/ProductContext";
import { useProductId } from "@/app/hooks/useProductId";

export default function ProductDetailsContent() {
  const product = useProduct();
  const router = useRouter();
  const id = useProductId();

  if (!product) return null;

  // Split: cards with images go in the grid, cards without go below
  const gridCards = product.details?.filter((d) => d.image) ?? [];
  const fullWidthCards = product.details?.filter((d) => !d.image) ?? [];

  function navigate(route: string) {
    router.push(`/product-details/${route}?id=${encodeURIComponent(id)}`);
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto w-full">
        {/* Title */}
        <h2 className="text-center font-serif text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-6">
          All about {product.name}
        </h2>

        {/* 2-column grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {gridCards.map((detail) => (
            <button
              key={detail.title}
              onClick={() => navigate(detail.route)}
              className="relative flex flex-col items-start rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-4 sm:p-5 text-left cursor-pointer hover:bg-neutral-200/70 dark:hover:bg-neutral-700/70 transition-colors overflow-hidden"
            >
              {/* Impact gradient overlay: green (0%) to red (100%) */}
              {detail.impact != null && (
                <div
                  className="absolute inset-0 opacity-20 dark:opacity-15"
                  style={{
                    background: `linear-gradient(to right, var(--color-green-400) ${100 - detail.impact}%, var(--color-red-400) 100%)`,
                  }}
                />
              )}

              {/* Fill overlay for completion — gradient left to right, blending into bg */}
              {detail.completion != null && (
                <div
                  className="absolute inset-0 opacity-20 dark:opacity-15"
                  style={{
                    background: `linear-gradient(to right, var(--color-green-400) ${detail.completion}%, transparent ${detail.completion + 20}%)`,
                  }}
                />
              )}

              <div className="relative z-10 flex flex-col items-start w-full">
                <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                  {detail.title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {detail.description}
                </p>
                {detail.image && (
                  <Image
                    src={detail.image}
                    alt={detail.title}
                    width={200}
                    height={200}
                    className="mt-3 self-center size-24 sm:size-28 rounded-2xl object-cover"
                  />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Full-width cards (no image) */}
        {fullWidthCards.map((detail) => (
          <button
            key={detail.title}
            onClick={() => navigate(detail.route)}
            className="mt-4 w-full flex flex-col items-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-5 sm:p-6 text-center cursor-pointer hover:bg-neutral-200/70 dark:hover:bg-neutral-700/70 transition-colors"
          >
            <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
              {detail.title}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-md">
              {detail.description}
            </p>
          </button>
        ))}
      </div>

      <div className="flex-1" />

      <p className="sticky bottom-0 pb-6 pt-10 text-center text-xs tracking-widest uppercase text-neutral-400 dark:text-neutral-500 bg-linear-to-t from-background from-60% to-transparent">
        ← Swipe for home
      </p>
    </div>
  );
}
