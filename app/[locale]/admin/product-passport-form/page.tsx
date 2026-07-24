import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n";
import ProductPassportFormContent from "@/app/[locale]/admin/product-passport-form/ProductPassportFormContent";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function ProductPassportFormPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return <ProductPassportFormContent />;
}
