"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ImageCarousel from "@/app/components/ImageCarousel";
import AppDialog from "@/app/components/AppDialog";
import { useProduct } from "@/app/context/ProductContext";
import Link from "next/link";
import { useProductId } from "../hooks/useProductId";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

function getImpactBgColor(impact: number) {
  const colorMilestones: Record<string, number> = {
    "bg-secondary-500": 0,
    "bg-blue-400": 1,
    "bg-yellow-400": 15,
    "bg-primary-400": 40,
    "bg-red-500": 60,
    "bg-red-900": 80,
  };

  let bgColor = "";
  for (const key of Object.keys(colorMilestones)) {
    if (impact >= colorMilestones[key]) {
      bgColor = key;
    }
  }
  return bgColor;
}

export default function HomeContent() {
  const translation = useTranslations("home");
  const locale = useLocale();
  const router = useRouter();
  const id = useProductId();
  const product = useProduct();
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  if (!product) return null;

  const gridCards = product.details?.filter((d) => d.image) ?? [];
  const fullWidthCards = product.details?.filter((d) => !d.image) ?? [];

  function navigate(route: string) {
    router.push(
      `/${locale}/product-details/${route}?id=${encodeURIComponent(id)}`,
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <a
        href="https://thesakeproject.com/product/yakuruna-bag/"
        target="_blank"
      >
        <Image
          src="https://cdndev.textiletracelatam.com/sake/the-sake-project.jpg"
          alt="Product's post-consumption plan"
          width={320}
          height={22}
          className="w-full md:w-1/4 max-h-[40vh] rounded-2l object-cover p-3 m-auto"
          draggable={false}
        />
      </a>

      {/* Name — small uppercase label */}
      {product?.name && (
        <p className="text-center text-xs font-medium tracking-[0.25em] uppercase text-neutral-400 dark:text-neutral-500 pt-6 pb-1">
          {product.name}
        </p>
      )}

      <ImageCarousel images={product?.images ?? []} />

      {/* Content below carousel */}
      {product && (
        <div className="px-8 sm:px-12 max-w-xl mx-auto w-full mt-4 space-y-5">
          {/* Title */}
          <h2 className="text-center font-serif text-2xl sm:text-3xl font-medium leading-tight text-neutral-900 dark:text-neutral-50 whitespace-pre-line">
            {product.title}
          </h2>

          {/* Description — truncated with read more */}
          <div>
            <p className="text-justify text-sm sm:text-base leading-7 text-neutral-700 dark:text-neutral-300 line-clamp-3">
              {product.description}
            </p>
            <button
              onClick={() => setDescriptionOpen(true)}
              className="mt-2 text-sm font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 cursor-pointer"
            >
              Read more
            </button>
          </div>

          {/* Divider */}
          <hr className="border-neutral-200 dark:border-neutral-700" />

          {/* Details */}
          <div className="grid grid-cols-2 gap-y-8 gap-x-4 pb-10">
            <DetailItem label="BRAND" value={product.brand} />
            <DetailItem label="Made in" value={product.madeIn} />
            {product.reference ?? (
              <DetailItem label="ID" value={product.reference} />
            )}
            {product.sku ?? <DetailItem label="SKU" value={product.sku} />}
          </div>
        </div>
      )}

      <div className="flex-1" />

      {/* Description dialog */}
      {product && (
        <AppDialog
          open={descriptionOpen}
          onClose={setDescriptionOpen}
          title={product.title}
        >
          <p className="overflow-y-auto p-3 h-60 text-justify text-sm sm:text-base leading-7 text-neutral-700 dark:text-neutral-300">
            {product.description}
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setDescriptionOpen(false)}
              className="inline-flex w-full justify-center rounded-md bg-primary-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:bg-primary-600 dark:shadow-none dark:hover:bg-primary-500 cursor-pointer"
            >
              {translation("close")}
            </button>
          </div>
        </AppDialog>
      )}

      <div className="flex flex-col h-full min-h-0 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        <h2 className="flex-none text-center font-serif text-xl sm:text-3xl text-neutral-900 dark:text-neutral-50 mb-4">
          {translation("allAbout")} {product.name}
        </h2>

        {/* TODO: Add subtitle to indicate the user about product details */}

        {/* Grid — fills remaining height */}
        <div className="grid grid-cols-2 grid-rows-3 md:grid-flow-col md:grid-cols-3 md:grid-rows-2 gap-3 md:gap-4 flex-1 min-h-0">
          {gridCards.map((detail) => (
            <button
              key={detail.title}
              onClick={() => navigate(detail.route)}
              className="relative flex flex-col items-start rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-4 text-left cursor-pointer hover:bg-neutral-200/70 dark:hover:bg-neutral-700/70 transition-colors overflow-hidden min-h-0"
            >
              {!!detail.impact && (
                <div
                  className={`absolute inset-0 opacity-75 dark:opacity-50 ${getImpactBgColor(detail.impact)}`}
                />
              )}
              {!!detail.completion && (
                <div className="absolute inset-0 opacity-75 dark:opacity-50 bg-secondary-500" />
              )}
              <div className="z-10 flex flex-col items-start w-full min-h-0 overflow-hidden">
                <h3 className="flex-none text-sm font-bold text-neutral-900 dark:text-white">
                  {detail.title}
                </h3>
                <p className="flex-none mt-1 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
                  {detail.description}
                </p>
                {/* TODO: See how to use detail images in the future based on UX/UI work */}
                {/* {detail.image && (
                  <div className="flex-1 min-h-0 flex items-center justify-center w-full mt-2 overflow-hidden">
                    <Image
                      src={detail.image}
                      alt={detail.title}
                      width={200}
                      height={200}
                      className="rounded-2xl object-contain hidden md:block"
                      style={{ maxHeight: "100%", width: "auto" }}
                    />
                  </div>
                )} */}
              </div>
            </button>
          ))}
        </div>

        {/* Full-width cards */}
        {fullWidthCards.map((detail) => (
          <button
            key={detail.title}
            onClick={() => navigate(detail.route)}
            className="relative flex-none mt-3 w-full flex flex-col items-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-4 text-center cursor-pointer hover:bg-neutral-200/70 dark:hover:bg-neutral-700/70 transition-colors"
          >
            {/* {detail.postConsumptionPlanExists === true && (
              <div className="absolute inset-0 opacity-75 dark:opacity-50 bg-secondary-500 rounded-2xl" />
            )}
            {detail.postConsumptionPlanExists === false && (
              <div className="absolute inset-0 opacity-80 dark:opacity-50 bg-red-500 rounded-2xl" />
            )} */}
            <div className="z-10 flex flex-col items-center w-full">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                {detail.title}
              </h3>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-md line-clamp-2">
                {detail.description}
              </p>
            </div>
          </button>
        ))}

        {/* Footer */}
        <p className="flex-none lg:hidden pb-4 pt-4 text-center text-lg tracking-widest uppercase text-neutral-400 dark:text-neutral-500">
          {translation("swipe")} →
        </p>
        <Link
          href={`/${locale}/product-details/supply-chain?id=${encodeURIComponent(id)}`}
        >
          <p className="flex-none hidden lg:block pb-4 pt-4 text-center text-lg tracking-widest uppercase text-neutral-400 dark:text-neutral-500">
            {translation("click")} →
          </p>
        </Link>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center space-y-1.5">
      <p className="text-xs font-semibold tracking-widest uppercase text-neutral-900 dark:text-neutral-100">
        {label}
      </p>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">{value}</p>
    </div>
  );
}
