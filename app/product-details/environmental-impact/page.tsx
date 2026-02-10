"use client";

import { useRouter } from "next/navigation";
import { useProductId } from "@/app/hooks/useProductId";
import DetailPageLayout from "@/app/components/DetailPageLayout";
import { useEnvironmentalImpact } from "@/app/hooks/useEnvironmentalImpact";

export default function EnvironmentalImpactPage() {
  const data = useEnvironmentalImpact();
  const router = useRouter();
  const id = useProductId();

  return (
    <DetailPageLayout title="Environmental Impact">
      {data && (
        <>
          {/* Indicator grid — 2 columns, matching the design */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {data.indicators.map((indicator) => (
              <div
                key={indicator.name}
                className="rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-5 sm:p-6"
              >
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                  {indicator.name}
                </h3>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 capitalize">
                  {indicator.value}
                </p>
              </div>
            ))}
          </div>

          {/* Full-width action cards */}
          <div className="mt-4 space-y-3 sm:space-y-4">
            <a
              href={data.postConsumptionPlanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-5 sm:p-6 text-center cursor-pointer hover:bg-neutral-200/70 dark:hover:bg-neutral-700/70 transition-colors"
            >
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                Post consumption plan
              </h3>
            </a>

            <button
              onClick={() => router.push(`/product-details/certifications?id=${encodeURIComponent(id)}`)}
              className="block w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-5 sm:p-6 text-center cursor-pointer hover:bg-neutral-200/70 dark:hover:bg-neutral-700/70 transition-colors"
            >
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                Certifications
              </h3>
            </button>
          </div>

          <a
            href={data.learnMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-8 text-sm font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            Learn more &rarr;
          </a>
        </>
      )}
    </DetailPageLayout>
  );
}
