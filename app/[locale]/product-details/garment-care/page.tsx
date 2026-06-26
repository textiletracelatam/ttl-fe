import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n";
import GarmentCareContent from "@/app/[locale]/product-details/garment-care/GarmentCareContent";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function GarmentCarePage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return <GarmentCareContent />;
}
