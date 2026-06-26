"use client";

import { useProductId } from "@/app/hooks/useProductId";
import DetailPageLayout from "@/app/components/DetailPageLayout";
import { useEnvironmentalImpact } from "@/app/hooks/useEnvironmentalImpact";
import { useState } from "react";
import Link from "next/link";
import AppDialog from "@/app/components/AppDialog";
import { useLocale } from "next-intl";

// Adjust this type to match your actual indicator shape
type Indicator = {
  name: string;
  value: string;
};

export default function EnvironmentalImpactContent() {
  const locale = useLocale();
  const data = useEnvironmentalImpact();
  const id = useProductId();
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(
    null,
  );

  return (
    <DetailPageLayout title="Environmental Impact">
      {data && (
        <>
          {/* Indicator grid — 2 columns, matching the design */}
          {/* Indicator grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {data.indicators.map((indicator) => (
              <div
                key={indicator.name}
                onClick={() => setSelectedIndicator(indicator)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && setSelectedIndicator(indicator)
                }
                className="rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-5 sm:p-6 cursor-pointer hover:bg-neutral-200/70 dark:hover:bg-neutral-700/70 transition-colors"
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
            <Link
              href={`/product-details/post-consumption-plan?id=${encodeURIComponent(id)}`}
              className="block w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-5 sm:p-6 text-center cursor-pointer hover:bg-neutral-200/70 dark:hover:bg-neutral-700/70 transition-colors"
            >
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                Post consumption plan
              </h3>
            </Link>

            <Link
              href={`/product-details/certifications?id=${encodeURIComponent(id)}`}
              className="block w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-5 sm:p-6 text-center cursor-pointer hover:bg-neutral-200/70 dark:hover:bg-neutral-700/70 transition-colors"
            >
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                Certifications
              </h3>
            </Link>
          </div>

          <Link
            href={`/${locale}/product-details?id=${encodeURIComponent(id)}`}
            className="inline-flex items-center gap-1 mt-8 text-sm font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            Learn more &rarr;
          </Link>
        </>
      )}

      {/* Modal — rendered outside the grid so it overlays everything */}
      {selectedIndicator && (
        <AppDialog
          open={!!selectedIndicator}
          onClose={() => setSelectedIndicator(null)}
          title={selectedIndicator.name}
        >
          <p className="overflow-y-auto p-3 h-60 text-justify text-sm sm:text-base leading-7 text-neutral-700 dark:text-neutral-300">
            {selectedIndicator.value}
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setSelectedIndicator(null)}
              className="inline-flex w-full justify-center rounded-md bg-primary-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:bg-primary-600 dark:shadow-none dark:hover:bg-primary-500 cursor-pointer"
            >
              Close
            </button>
          </div>
        </AppDialog>
      )}
    </DetailPageLayout>
  );
}
