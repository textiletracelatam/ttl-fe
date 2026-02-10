"use client";

import DetailPageLayout from "@/app/components/DetailPageLayout";
import ImageCarousel from "@/app/components/ImageCarousel";
import { useMaterialInnovation } from "@/app/hooks/useMaterialInnovation";

export default function MaterialInnovationPage() {
  const data = useMaterialInnovation();

  return (
    <DetailPageLayout title="Material Innovation">
      {data && (
        <>
          <ImageCarousel images={data.images} />

          <p className="mt-6 text-sm sm:text-base leading-7 text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
            {data.text}
          </p>

          <a
            href={data.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-8 text-sm font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            {data.linkLabel} &rarr;
          </a>
        </>
      )}
    </DetailPageLayout>
  );
}
