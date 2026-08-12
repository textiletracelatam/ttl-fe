import PageSwiper from "@/app/components/PageSwiper";
import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function SupplyChainPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  return <PageSwiper initialSlide={1} />;
}
