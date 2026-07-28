"use client";

import { useRouter } from "next/navigation";
import { useProduct } from "@/app/context/ProductContext";
import { useProductId } from "@/app/hooks/useProductId";
import Link from "next/link";
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

export default function ProductDetailsContent() {
  const translation = useTranslations("details");
  const locale = useLocale();
  const product = useProduct();
  const router = useRouter();
  const id = useProductId();

  if (!product) return null;

  const gridCards = product.details?.filter((d) => d.image) ?? [];
  const fullWidthCards = product.details?.filter((d) => !d.image) ?? [];

  function navigate(route: string) {
    router.push(
      `/${locale}/product-details/${route}?id=${encodeURIComponent(id)}`,
    );
  }

  return (
    // Assumes ~64px nav. Adjust the offset to match your actual nav height.
    <div className="flex flex-col overflow-hidden h-full">
      <div className="flex flex-col h-full min-h-0 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        <a
          href="https://thesakeproject.com/product/yakuruna-bag/"
          target="_blank"
        >
          <Image
            src="https://cdndev.textiletracelatam.com/sake/the-sake-project.jpg"
            alt="Product's post-consumption plan"
            width={320}
            height={22}
            className="w-full md:w-1/2 max-h-[40vh] rounded-2l object-cover p-3 m-auto"
            draggable={false}
          />
        </a>

        <h2 className="flex-none text-center font-serif text-xl sm:text-3xl text-neutral-900 dark:text-neutral-50 mb-4">
          {translation("allAbout")} {product.name}
        </h2>

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
          ← {translation("swipe")}
        </p>
        <Link href={`/${locale}/?id=${encodeURIComponent(id)}`}>
          <p className="flex-none hidden lg:block pb-4 pt-4 text-center text-lg tracking-widest uppercase text-neutral-400 dark:text-neutral-500">
            {translation("click")}
          </p>
        </Link>
      </div>
    </div>
  );
}
