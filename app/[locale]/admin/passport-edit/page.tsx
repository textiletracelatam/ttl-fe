import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n";
import PassportEditContent from "@/app/[locale]/admin/passport-edit/PassportEditContent";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function PassportEditPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return <PassportEditContent />;
}
