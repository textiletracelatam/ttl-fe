import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n";
import PostConsumptionPlanContent from "@/app/[locale]/product-details/post-consumption-plan/PostConsumptionPlanContent";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function PostConsumptionPlanPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return <PostConsumptionPlanContent />;
}
