"use client";

import DetailPageLayout from "@/app/components/DetailPageLayout";
import ImageCarousel from "@/app/components/ImageCarousel";
import { useGarmentCare } from "@/app/hooks/useGarmentCare";

export default function GarmentCarePage() {
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
