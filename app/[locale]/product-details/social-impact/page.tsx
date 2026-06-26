import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n";
import SocialImpactContent from "@/app/[locale]/product-details/social-impact/SocialImpactContent";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function SocialImpactPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return <SocialImpactContent />;
}
