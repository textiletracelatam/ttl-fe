"use client";

import DetailPageLayout from "@/app/components/DetailPageLayout";
import ImageCarousel from "@/app/components/ImageCarousel";
import { useGarmentCare } from "@/app/hooks/useGarmentCare";
import { useProductId } from "@/app/hooks/useProductId";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function GarmentCareContent() {
  const locale = useLocale();
  const id = useProductId();
  const data = useGarmentCare();

  return (
    <DetailPageLayout title="Garment Care">
      {data && (
        <>
          <ImageCarousel images={data.images} />

          <div className="mt-6 space-y-8">
            {data.sections.map((section) => (
              <div key={section.title}>
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white mb-2">
                  {section.title}
                </h3>
                <p className="text-sm sm:text-base leading-7 text-neutral-700 dark:text-neutral-300">
                  {section.text}
                </p>
              </div>
            ))}
          </div>

          <Link
            href={`/${locale}/product-details?id=${encodeURIComponent(id)}`}
            className="inline-flex items-center gap-1 mt-8 text-sm font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            {data.linkLabel} &rarr;
          </Link>
        </>
      )}
    </DetailPageLayout>
  );
}
