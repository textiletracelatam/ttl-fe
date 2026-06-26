"use client";

import DetailPageLayout from "@/app/components/DetailPageLayout";
import ImageCarousel from "@/app/components/ImageCarousel";
import { useMaterialInnovation } from "@/app/hooks/useMaterialInnovation";
import { useProductId } from "@/app/hooks/useProductId";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function MaterialInnovationContent() {
  const locale = useLocale();
  const id = useProductId();
  const data = useMaterialInnovation();

  return (
    <DetailPageLayout title="Material Innovation">
      {data && (
        <>
          <ImageCarousel images={data.images} />

          <p className="mt-6 text-sm sm:text-base leading-7 text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
            {data.text}
          </p>

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
