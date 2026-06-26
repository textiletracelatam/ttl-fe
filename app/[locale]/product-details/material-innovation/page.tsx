import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n";
import MaterialInnovationContent from "@/app/[locale]/product-details/material-innovation/MaterialInnovationContent";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function MaterialInnovationPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return <MaterialInnovationContent />;
}
