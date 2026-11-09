import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n";
import PassportsListContent from "@/app/[locale]/admin/passports/PassportsListContent";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function PassportsListPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return <PassportsListContent />;
}
