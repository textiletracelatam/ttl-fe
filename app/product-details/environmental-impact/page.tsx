"use client";

import { useRouter } from "next/navigation";
import { useProductId } from "@/app/hooks/useProductId";
import DetailPageLayout from "@/app/components/DetailPageLayout";
import { useEnvironmentalImpact } from "@/app/hooks/useEnvironmentalImpact";
import { useState } from "react";

// Adjust this type to match your actual indicator shape
type Indicator = {
  name: string;
  value: string;
  description?: string;
};

function IndicatorModal({
  indicator,
  onClose,
}: {
  indicator: Indicator;
  onClose: () => void;
}) {
  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* Panel — stops click propagation so clicks inside don't close */}
      <div
        className="w-full sm:max-w-md rounded-3xl bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white leading-snug">
            {indicator.name}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 size-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Value badge */}
        <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 capitalize mb-4">
          {indicator.value}
        </span>

        {/* Description — falls back gracefully if not present */}
        {indicator.description ? (
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {indicator.description}
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-neutral-400 dark:text-neutral-500 italic">
            No additional details available.
          </p>
        )}
      </div>
    </div>
  );
}

export default function EnvironmentalImpactPage() {
  const data = useEnvironmentalImpact();
  const router = useRouter();
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
            <a
              href={data.postConsumptionPlanUrl}
              rel="noopener noreferrer"
              className="block w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-5 sm:p-6 text-center cursor-pointer hover:bg-neutral-200/70 dark:hover:bg-neutral-700/70 transition-colors"
            >
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                Post consumption plan
              </h3>
            </a>

            <button
              onClick={() =>
                router.push(
                  `/product-details/certifications?id=${encodeURIComponent(id)}`,
                )
              }
              className="block w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-5 sm:p-6 text-center cursor-pointer hover:bg-neutral-200/70 dark:hover:bg-neutral-700/70 transition-colors"
            >
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                Certifications
              </h3>
            </button>
          </div>

          <a
            href={data.learnMoreUrl}
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-8 text-sm font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            Learn more &rarr;
          </a>
        </>
      )}

      {/* Modal — rendered outside the grid so it overlays everything */}
      {selectedIndicator && (
        <IndicatorModal
          indicator={selectedIndicator}
          onClose={() => setSelectedIndicator(null)}
        />
      )}
    </DetailPageLayout>
  );
}
