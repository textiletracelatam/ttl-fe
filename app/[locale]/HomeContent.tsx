"use client";

import { useState } from "react";
import ImageCarousel from "@/app/components/ImageCarousel";
import AppDialog from "@/app/components/AppDialog";
import { useProduct } from "@/app/context/ProductContext";
import Link from "next/link";
import { useProductId } from "../hooks/useProductId";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

export default function HomeContent() {
  const translation = useTranslations("home");
  const locale = useLocale();
  const id = useProductId();
  const product = useProduct();
  const [descriptionOpen, setDescriptionOpen] = useState(false);

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

      <p className="lg:hidden sticky bottom-0 pb-6 pt-10 text-center text-lg tracking-widest uppercase text-neutral-400 dark:text-neutral-500 bg-linear-to-t from-background from-60% to-transparent">
        {translation("swipe")} →
      </p>

      <Link href={`/${locale}/product-details?id=${encodeURIComponent(id)}`}>
        <p className="hidden lg:block sticky bottom-0 pb-6 pt-10 text-center text-lg tracking-widest uppercase text-neutral-400 dark:text-neutral-500 bg-linear-to-t from-background from-60% to-transparent">
          {translation("click")}
        </p>
      </Link>

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
