"use client";

import DetailPageLayout from "@/app/components/DetailPageLayout";
import { usePostConsumptionPlan } from "@/app/hooks/usePostConsumptionPlan";
import { useProductId } from "@/app/hooks/useProductId";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function PostConsumptionPlanContent() {
  const locale = useLocale();
  const id = useProductId();
  const data = usePostConsumptionPlan();

  return (
    <DetailPageLayout title="Post-consumption plan">
      {data && (
        <>
          <Image
            src={data.image}
            alt="Product's post-consumption plan"
            width={800}
            height={1067}
            className="w-full max-h-[40vh] rounded-2xl object-cover"
            style={{ aspectRatio: "3 / 4" }}
            draggable={false}
          />

          <p className="mt-6 text-sm sm:text-base leading-7 text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
            {data.description}
          </p>

          <Link
            href={`/${locale}/product-details?id=${encodeURIComponent(id)}`}
            className="inline-flex items-center gap-1 mt-8 text-sm font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            Learn more about the product &rarr;
          </Link>
        </>
      )}
    </DetailPageLayout>
  );
}
