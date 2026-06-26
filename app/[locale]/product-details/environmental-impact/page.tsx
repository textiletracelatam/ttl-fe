import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n";
import EnvironmentalImpactContent from "@/app/[locale]/product-details/environmental-impact/EnvironmentalImpactContent";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function EnvironmentalImpactPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return <EnvironmentalImpactContent />;
}
