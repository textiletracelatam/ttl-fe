import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n";
import CompositionContent from "./CompositionContent";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function CompositionPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return <CompositionContent />;
}
