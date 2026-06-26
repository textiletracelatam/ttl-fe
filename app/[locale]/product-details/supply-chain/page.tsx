import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n";
import SupplyChainContent from "@/app/[locale]/product-details/supply-chain/SupplyChainContent";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function SupplyChainPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return <SupplyChainContent />;
}
